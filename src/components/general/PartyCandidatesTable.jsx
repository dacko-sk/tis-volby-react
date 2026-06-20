import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import { s22AggregatedKeys } from '../../hooks/AccountsData';

import './PartyCandidatesTable.scss';

function PartyCandidatesTable({ candidates }) {
    if (!candidates || !Array.isArray(candidates) || !candidates.length) {
        return null;
    }

    const rows = [];
    candidates.forEach((candidate) => {
        rows.push(
            <tr
                key={
                    candidate[s22AggregatedKeys.name] +
                    candidate[s22AggregatedKeys.municipality]
                }
                className={candidate.isElected ? 'row-elected' : ''}
            >
                <td>
                    <Link
                        className="fw-bold"
                        to={routes.candidateMunicipal(
                            candidate[s22AggregatedKeys.name],
                            candidate.municipalityShortName
                        )}
                    >
                        {candidate[s22AggregatedKeys.name]}
                    </Link>
                </td>
                <td>
                    {candidate[s22AggregatedKeys.municipality] && (
                        <Link
                            to={routes.municipality(
                                candidate.municipalityShortName,
                                candidate[s22AggregatedKeys.region] ?? null
                            )}
                        >
                            {candidate[s22AggregatedKeys.municipality]}
                        </Link>
                    )}
                </td>
                {candidate[s22AggregatedKeys.partySupport] && (
                    <td>{candidate[s22AggregatedKeys.partySupport]}</td>
                )}
            </tr>
        );
    });

    return (
        <div className="party-candidates">
            <em className="disclaimer text-start">
                {t(labels.candidate.disclaimerParties)}
            </em>
            <Table striped bordered responsive hover>
                <thead>
                    <tr>
                        <th>{t(labels.candidate.name)}</th>
                        <th>{t(labels.municipality)}</th>
                        <th>{t(labels.party.title)}</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    );
}

export default PartyCandidatesTable;
