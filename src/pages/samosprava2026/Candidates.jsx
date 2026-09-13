import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router';

import { routes } from '../../helpers/routes';

import Map from '../../components/map/Map';
import Regions from '../../components/municipal/Regions';
import Top10Spending from '../../components/municipal/Top10Spending';
import Title from '../../components/structure/Title';
import TotalTransfers from '../../components/accounts/TotalTransfers';
import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';

import { aggregatedKeys } from '../../hooks/AccountsData';
import { useCandidatesData } from '../../hooks/CmsQueries';

function Candidates() {
    const title = t(labels.search.candidates);
    setTitle(title);

    const { data: candidatesData } = useCandidatesData();
    const candidateAccounts = candidatesData?.candidateAccounts || [];

    return (
        <section>
            <Title>{title}</Title>

            <Row className="gy-3 gy-lg-0 text-center my-4">
                <Col lg={6}>
                    <TotalTransfers
                        accountsFilter={candidateAccounts}
                        direction={aggregatedKeys.incoming}
                        title={t(labels.account.totalIncomesCandidates)}
                    />
                </Col>
                <Col lg={6}>
                    <TotalTransfers
                        accountsFilter={candidateAccounts}
                        direction={aggregatedKeys.outgoing}
                        title={t(labels.account.totalSpendingCandidates)}
                    />
                </Col>
            </Row>

            <Top10Spending />

            <Map />

            <Regions />

            <div className="text-center mt-4 mb-4">
                <Button as={Link} to={routes.campaigns()} variant="secondary">
                    {t(labels.charts.showAllCandidates)}
                </Button>
            </div>
        </section>
    );
}

export default Candidates;
