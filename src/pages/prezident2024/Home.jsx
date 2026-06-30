import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { setTitle } from '../../helpers/browser';
import { dates, elections } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';
import { wpCat } from '../../helpers/wp';

import Top10FinalReports from '../../components/accounts/Top10FinalReports';
import TotalTransfers from '../../components/accounts/TotalTransfers';
import { aggregatedKeys } from '../../hooks/AccountsData';
import Top10Ads from '../../components/ads/Top10Ads';
import TotalAdsSpending from '../../components/ads/TotalAdsSpending';
import DonateButton from '../../components/general/DonateButton';
import ElectionsCountdown from '../../components/general/ElectionsCountdown';
import SiteNavigator from '../../components/structure/SiteNavigator';
import Title from '../../components/structure/Title';
import Posts, { templates } from '../../components/wp/Posts';

function Home() {
    setTitle(t(labels.home.pageTitle));

    return (
        <section>
            <Title secondaryWords={1} uppercase>
                {t(labels.home.pageTitle)}
            </Title>

            <div id="search-container">
                <SiteNavigator site={elections.p24} />
            </div>

            <Row className="gy-3 gy-lg-0 text-center mb-4">
                <Col lg={6}>
                    <ElectionsCountdown
                        start={dates.electionsStart}
                        end={dates.electionsEnd}
                    />
                </Col>
                <Col lg={6}>
                    <TotalTransfers direction={aggregatedKeys.outgoing} />
                </Col>
            </Row>

            <Top10FinalReports />

            <div className="text-center mb-4">
                <DonateButton long xl />
            </div>

            <Posts
                categories={[wpCat.featured]}
                showMore={t(labels.analyses.showAll)}
                showMoreLink={routes.analyses()}
                template={templates.featured}
            />

            <TotalAdsSpending />
            <Top10Ads />

            <h2 className="mt-4 mb-3">{t(labels.news.latest)}</h2>
            <Posts
                categories={[wpCat.news]}
                limit={2}
                template={templates.condensed}
            />
        </section>
    );
}

export default Home;
