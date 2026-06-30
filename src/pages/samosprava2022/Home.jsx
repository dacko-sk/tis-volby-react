import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dates, elections } from '../../helpers/constants';
import { setTitle } from '../../helpers/helpers';
import { segments } from '../../helpers/routes';

import { analysesCategories, newAnalysesAlert, winnersAlert } from './Analyses';
import { newsCategories } from './News';
import Top15 from '../../components/charts/Top15';
import TotalTransfers from '../../components/accounts/TotalTransfers';
import { aggregatedKeys } from '../../hooks/AccountsData';
import ElectionsCountdown from '../../components/general/ElectionsCountdown';
import Map from '../../components/map/Map';
import SiteNavigator from '../../components/structure/SiteNavigator';
import Title from '../../components/structure/Title';
import Posts, { templates } from '../../components/wp/Posts';

function Home() {
    setTitle('Úvod');

    return (
        <section>
            <Title uppercase secondary="2022">
                Samosprávne
                <br />
                voľby
            </Title>

            <div id="search-container">
                <SiteNavigator site={elections.s22} />
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

            <Map />

            <Top15 />

            {newAnalysesAlert}
            {winnersAlert}

            <Posts
                categories={[analysesCategories.top]}
                noResults="Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne."
                section={segments.ANALYSES}
                showMore="Zobraziť všetky hodnotenia"
                template={templates.featured}
            />

            <h2 className="mt-4">Najnovšie aktuality</h2>
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
