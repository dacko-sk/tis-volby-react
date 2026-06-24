import { useLocation } from 'react-router-dom';
import { wpTagsMap } from '../../helpers/parties';
import { getActiveSubsite } from '../../helpers/languages';

import useAdsData from '../../hooks/AdsData';
import {
    findCandidateByTag,
    findSubjectByTag,
    useElectionData,
} from '../../hooks/CmsQueries';

import PartyTag from './PartyTag';
import { getLastWord } from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

function PartyTags({ tags, className, asLink }) {
    const { findPartyByWpTags, findCandidateByWpTags } = useAdsData();
    const location = useLocation();
    const subsite = getActiveSubsite(location.pathname);

    const { data: cmsData } = useElectionData();

    if (subsite === 'samosprava2022') {
        return null;
    }

    const matchedTags = tags
        .flatMap((tag) => {
            // new candidate tags mapping via CMS since 2026
            if (subsite === 'samosprava2026') {
                const c = findCandidateByTag(cmsData, tag);
                if (c) {
                    return [
                        [
                            getLastWord(c.person?.name ?? ''),
                            routes.candidateMunicipal(
                                c.person?.name ?? '',
                                c.municipality
                            ),
                        ],
                    ];
                }
                const p = findSubjectByTag(cmsData, tag);
                if (p) {
                    return [
                        [
                            p.abbreviation || p.name,
                            routes.party(p.name, segments.NEWS),
                        ],
                    ];
                }
                // otherwise skip
                return [];
            }

            let name = wpTagsMap[tag];
            if (!name) {
                name = findPartyByWpTags([tag]);
            }
            // this subsite does not have party detail page - skip party tags
            if (name && subsite !== 'prezident2024') {
                return [[name, routes.party(name, segments.NEWS)]];
            }

            name = findCandidateByWpTags([tag]);
            if (name) {
                return [
                    [getLastWord(name), routes.candidate(name, segments.NEWS)],
                ];
            }

            return [];
        })
        .map(([name, route]) => (
            <PartyTag key={name} name={name} route={asLink ? route : null} />
        ));

    return matchedTags.length ? (
        <div className={className}>{matchedTags}</div>
    ) : null;
}

export default PartyTags;
