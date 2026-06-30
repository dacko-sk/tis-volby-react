import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import TisBarChart from '../../components/charts/TisBarChart';
import Title from '../../components/structure/Title';
import Loading from '../../components/general/Loading';
import TotalIncomes from '../../components/accounts/TotalIncomes';
import TotalSpending from '../../components/accounts/TotalSpending';

import {
    chartKeys,
    columnVariants,
    getPartyChartLabel,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { setTitle, sortBySpending } from '../../helpers/helpers';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import { getSubjectShortname, useElectionData } from '../../hooks/CmsQueries';

function Parties() {
    const { csvData } = useData();
    const { data: cmsData, isLoading } = useElectionData();

    // parse data
    const parties = [];
    const subjectAccounts = [];
    if (cmsData?.subjects) {
        cmsData.subjects.forEach((subject) => {
            if (subject.account) {
                subjectAccounts.push(subject.account);

                if (csvData?.data) {
                    const row = csvData.data.find(
                        (r) =>
                            r[aggregatedKeys.name] === subject.name &&
                            r[aggregatedKeys.account] === subject.account
                    );
                    if (row) {
                        parties.push({
                            name: getPartyChartLabel(getSubjectShortname(subject)),
                            [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                            [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                        });
                    }
                }
            }
        });
        parties.sort(sortBySpending);
    }

    const title = t(labels.parties.navTitle);
    setTitle(title);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <section>
            <Title>{title}</Title>

            <Row className="gy-3 gy-lg-0 text-center mt-4">
                <Col lg={6}>
                    <TotalIncomes
                        accountsFilter={subjectAccounts}
                        title={t(labels.account.totalIncomesParties)}
                    />
                </Col>
                <Col lg={6}>
                    <TotalSpending
                        accountsFilter={subjectAccounts}
                        title={t(labels.account.totalSpendingParties)}
                    />
                </Col>
            </Row>

            <TisBarChart
                className="my-4"
                title={t(labels.charts.partiesTitle)}
                subtitle={t(labels.charts.regionsSubtitle)}
                bars={columnVariants.inOut}
                data={parties}
                namesLength={30}
                currency
                vertical
            />
        </section>
    );
}

export default Parties;
