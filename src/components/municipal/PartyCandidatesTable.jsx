import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';

import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import { getCandidateMunicipalityShortname } from '../../hooks/CmsQueries';

import './PartyCandidatesTable.scss';

function PartyCandidatesTable({ candidates }) {
    if (!candidates || !Array.isArray(candidates) || !candidates.length) {
        return null;
    }

    const rows = [];
    candidates.forEach((candidate) => {
        const municipality = getCandidateMunicipalityShortname(candidate);
        const name = candidate.person?.name || candidate.person?.fullName;
        const partySupport = candidate.supportingParties?.map((p, index) => (
            <Badge
                as={Link}
                to={routes.party(p.name)}
                key={index}
                bg="secondary"
                className="me-1 text-decoration-none"
            >
                {p.abbreviation || p.name}
            </Badge>
        ));

        rows.push(
            <tr
                key={name + candidate.municipality}
                className={candidate.isElected ? 'row-elected' : ''}
            >
                <td>
                    <Link
                        className="fw-bold text-black"
                        to={routes.candidateMunicipal(name, municipality, null)}
                    >
                        {name}
                    </Link>
                </td>
                <td>
                    {candidate.municipality && (
                        <Link
                            className="me-2"
                            to={routes.municipality(
                                municipality,
                                candidate.region ?? null
                            )}
                        >
                            {candidate.municipality}
                        </Link>
                    )}
                </td>
                <td>{partySupport}</td>
            </tr>
        );
    });

    return (
        <div className="party-candidates">
            <em className="disclaimer text-start">
                {t(labels.candidate.disclaimerParties)}
            </em>
            <Table striped bordered responsive hover className="mb-0">
                <thead>
                    <tr>
                        <th>{t(labels.candidate.name)}</th>
                        <th>{t(labels.municipality)}</th>
                        <th>{t(labels.candidate.supportingParties)}</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    );
}

export default PartyCandidatesTable;
