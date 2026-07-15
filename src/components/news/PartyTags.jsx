import { wpTagsMap } from '../../helpers/parties';
import {
    findCandidateByPersonUid,
    findSubjectByPartyUid,
    getSubjectShortname,
    useElectionData,
} from '../../hooks/CmsQueries';

import PartyTag from '../wp/PartyTag';
import { getLastWord } from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

function PartyTags({ relations, className, asLink }) {
    const { data: cmsData } = useElectionData();

    if (!relations || !cmsData) {
        return null;
    }

    const matchedTags = [];

    (relations.persons || []).forEach((personUid) => {
        const c = findCandidateByPersonUid(cmsData, personUid);
        if (c) {
            matchedTags.push([
                getLastWord(c.person?.name ?? ''),
                routes.candidateMunicipal(
                    c.person?.name ?? '',
                    c.municipality,
                    null
                ),
            ]);
        }
    });

    (relations.parties || []).forEach((partyUid) => {
        const s = findSubjectByPartyUid(cmsData, partyUid);
        if (s) {
            const shortname = getSubjectShortname(s);
            if (shortname) {
                matchedTags.push([
                    shortname,
                    routes.party(shortname, segments.NEWS),
                ]);
            }
        }
    });

    const renderedTags = matchedTags.map(([name, route]) => (
        <PartyTag key={name} name={name} route={asLink ? route : null} />
    ));

    return renderedTags.length ? (
        <div className={className}>{renderedTags}</div>
    ) : null;
}

export default PartyTags;
