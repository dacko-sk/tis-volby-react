import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';

import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import {
    findSubjectByPartyUid,
    getSubjectShortname,
    useElectionData,
} from '../../hooks/CmsQueries';

function SupportingPartiesBadges({ candidate }) {
    const { data: cmsData } = useElectionData();
    const outlineBadge = (key, label) => (
        <Badge
            key={key}
            bg={null}
            className="me-1 border border-secondary text-secondary bg-transparent"
        >
            {label}
        </Badge>
    );

    const parties = candidate?.supportingParties ?? [];
    // if no parties, show independent badge
    if (!parties.length) {
        return outlineBadge(
            'independent',
            t(labels.candidate.independentCandidate)
        );
    }

    return parties.map((party) => {
        const subject = findSubjectByPartyUid(cmsData, party.uid);
        if (!subject) {
            return outlineBadge(party.uid, party.abbreviation || party.name);
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
