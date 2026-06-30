import { Col, Row } from 'react-bootstrap';

import { setTitle } from '../../helpers/browser';
import { elections } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';
import { wpCat } from '../../helpers/wp';

import TotalAdsSpending from '../../components/ads/TotalAdsSpending';
import Top10FinalReports from '../../components/accounts/Top10FinalReports';
import Top10Ads from '../../components/ads/Top10Ads';
import ElectionsCountdown from '../../components/general/ElectionsCountdown';
import TotalTransfers from '../../components/accounts/TotalTransfers';
import { aggregatedKeys } from '../../hooks/AccountsData';
import SiteNavigator from '../../components/structure/SiteNavigator';
import Title from '../../components/structure/Title';
import Posts, { templates } from '../../components/wp/Posts';
import DonateButton from '../../components/general/DonateButton';

function Home() {
    setTitle(t(labels.home.pageTitle));

    return (
        <section>
            <Title secondaryWords={1} uppercase>
                {t(labels.home.pageTitle)}
            </Title>

            <div id="search-container">
                <SiteNavigator site={elections.n23} />
            </div>

            <Row className="gy-3 gy-lg-0 text-center mb-4">
                <Col lg={6}>
                    <ElectionsCountdown
                        start="2023-09-30T07:00:00"
                        end="2023-09-30T22:00:00"
                    />
                </Col>
                <Col lg={6}>
                    <TotalTransfers direction={aggregatedKeys.outgoing} />
                </Col>
            </Row>

            <div className="text-center mb-4">
                <DonateButton long xl />
            </div>

            <Top10FinalReports />

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
