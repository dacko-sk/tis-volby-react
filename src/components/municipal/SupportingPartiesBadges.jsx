import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';

import { routes } from '../../helpers/routes';

import {
    findSubjectByPartyUid,
    getSubjectShortname,
    useElectionData,
} from '../../hooks/CmsQueries';

function SupportingPartiesBadges({ candidate }) {
    const { data: cmsData } = useElectionData();

    return (candidate?.supportingParties ?? []).map((party) => {
        const subject = findSubjectByPartyUid(cmsData, party.uid);
        if (!subject) {
            return (
                <Badge
                    key={party.uid}
                    bg={null}
                    className="me-1 border border-secondary text-secondary bg-transparent"
                >
                    {party.abbreviation || party.name}
                </Badge>
            );
        }
        const shortname = getSubjectShortname(subject);
        return (
            <Badge
                as={Link}
                key={shortname}
                bg="secondary"
                className="me-1 text-decoration-none"
                to={routes.party(shortname)}
            >
                {shortname}
            </Badge>
        );
    });
}

export default SupportingPartiesBadges;
