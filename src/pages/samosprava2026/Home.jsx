import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dates, elections } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { nl2r, setTitle } from '../../helpers/helpers';
import { segments } from '../../helpers/routes';

import { newsCategories } from './News';
import Top10Spending from '../../components/municipal/Top10Spending';
import TotalTransfers from '../../components/accounts/TotalTransfers';
import { aggregatedKeys } from '../../hooks/AccountsData';
import ElectionsCountdown from '../../components/general/ElectionsCountdown';
import Map from '../../components/map/Map';
import SiteNavigator from '../../components/structure/SiteNavigator';
import Title from '../../components/structure/Title';
import Posts, { templates } from '../../components/wp/Posts';

function Home() {
    setTitle(t(labels.home.navTitle));

    return (
        <section>
            <Title uppercase secondary="2026">
                {nl2r(t(labels.elections[elections.s26]).replace(' 2026', ''))}
            </Title>

            <div id="search-container">
                <SiteNavigator site={elections.s26} />
            </div>

            <Row className="mb-4 text-center">
                <Col>
                    <ElectionsCountdown
                        start={dates.electionsStart}
                        end={dates.electionsEnd}
                    />
                </Col>
            </Row>

            <Row className="gy-3 gy-lg-0 text-center mb-4">
                <Col lg={6}>
                    <TotalTransfers direction={aggregatedKeys.incoming} />
                </Col>
                <Col lg={6}>
                    <TotalTransfers direction={aggregatedKeys.outgoing} />
                </Col>
            </Row>

            <Map />

            <Top10Spending />

            <h2 className="mt-4">{t(labels.news.latest)}</h2>
            <Posts
                categories={newsCategories}
                limit={2}
                section={segments.NEWS}
                template={templates.condensed}
            />
        </section>
    );
}

export default Home;
