import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { routes } from '../../helpers/routes';

import Map from '../../components/map/Map';
import Regions from '../../components/municipal/Regions';
import Title from '../../components/structure/Title';
import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';

function Candidates() {
    const title = t(labels.search.candidates);
    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>

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
