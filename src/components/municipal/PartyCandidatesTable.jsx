import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';

import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import {
    findCandidateSupportingSubjects,
    getSubjectShortname,
    useElectionData,
} from '../../hooks/CmsQueries';

import './PartyCandidatesTable.scss';

function PartyCandidatesTable({ candidates }) {
    const { data: cmsData } = useElectionData();

    if (!candidates || !Array.isArray(candidates) || !candidates.length) {
        return null;
    }

    const rows = [];
    candidates.forEach((candidate) => {
        const name = candidate.person?.name || candidate.person?.fullName;
        const partySupport = findCandidateSupportingSubjects(cmsData, candidate)
            .map((subject) => getSubjectShortname(subject))
            .map((shortname) => (
                <Badge
                    as={Link}
                    to={routes.party(shortname)}
                    key={shortname}
                    bg="secondary"
                    className="me-1 text-decoration-none"
                >
                    {shortname}
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
                        to={routes.candidateMunicipal(
                            name,
                            candidate?.municipality,
                            null
                        )}
                    >
                        {name}
                    </Link>
                </td>
                <td>
                    {candidate.municipality && (
                        <Link
                            className="me-2"
                            to={routes.municipality(
                                candidate?.municipality,
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
