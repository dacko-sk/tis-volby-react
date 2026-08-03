import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router';

import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import useGovData from '../../hooks/GovData';

function PartiesTiles({ parties, compact = true }) {
    const { isCoalition } = useGovData();

    if (!Array.isArray(parties) || !parties.length) {
        return null;
    }

    return (
        <Row className={`tiles${compact ? ' compact' : ''} gx-4 gy-4`}>
            {parties.map((partyName) => {
                const coalition = isCoalition(partyName);
                return (
                    <Col key={partyName} className="d-flex" sm>
                        <Link
                            to={routes.party(partyName)}
                            className={`d-flex flex-column justify-content-center w-100 cat-${
                                coalition ? 'regional' : 'local'
                            }`}
                        >
                            <div className="type">
                                {t(coalition ? labels.parties.coalition : '')}
                            </div>
                            <h3 className="m-0">{partyName}</h3>
                        </Link>
                    </Col>
                );
            })}
        </Row>
    );
}
export default PartiesTiles;
