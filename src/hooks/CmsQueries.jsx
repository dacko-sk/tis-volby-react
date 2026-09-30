import { useQuery } from '@tanstack/react-query';

import {
    findCandidateByPathname,
    findSubjectByPathname,
    findSubjectSupportedCandidates,
    getCmsSubsite,
    getMunicipalities,
    getMunicipalityNameByRegionCode,
    isMunicipalityRegional,
    isRunning,
} from '../helpers/cms';
import { contains } from '../helpers/helpers';

import { municipalTypes } from './AccountsData';

export const CMS_BASE_URL = process.env.DHC_TYPO3_API_DOMAIN;
// queries

// election data without candidates who are not running (status 0),
// cached per response so consumers get stable references
const runningDataCache = new WeakMap();
const onlyRunning = (data) => {
    if (!data?.candidates) return data;
    if (!runningDataCache.has(data)) {
        runningDataCache.set(data, {
            ...data,
            candidates: data.candidates.filter(isRunning),
        });
    }
    return runningDataCache.get(data);
};

export const useElectionData = (
    selectFn,
    { excludeNotRunning = true } = {}
) => {
    const subsite = getCmsSubsite();

    return useQuery({
        queryKey: ['cms_election', subsite],
        queryFn: async () => {
            if (!subsite) throw new Error('No subsite mapped for CMS');
            const response = await fetch(
                `${CMS_BASE_URL}/elections/election/${subsite}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        select: (data) => {
            const filtered = excludeNotRunning ? onlyRunning(data) : data;
            return selectFn ? selectFn(filtered) : filtered;
        },
        refetchOnMount: false,
    });
};

export const useCmsCharts = (election, placement) => {
    return useQuery({
        queryKey: ['cms_charts', election],
        queryFn: async () => {
            if (!election)
                throw new Error('No election provided for CMS charts');
            const response = await fetch(
                `${CMS_BASE_URL}/elections/charts/${election}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        select: (charts) =>
            placement
                ? (charts || []).filter(
                      (chart) => chart.placement === placement
                  )
                : charts,
        enabled: !!election,
    });
};

export const useCandidateByPathname = (pathname) => {
    return useElectionData((data) => findCandidateByPathname(data, pathname));
};

export const useSubjectByPathname = (pathname) => {
    return useElectionData((data) => findSubjectByPathname(data, pathname));
};

export const useSubjectSupportedCandidates = (primaryPartyUid) => {
    return useElectionData((data) =>
        findSubjectSupportedCandidates(data, primaryPartyUid)
    );
};

export const useMunicipalityData = (town, region) => {
    return useElectionData((data) => {
        const candidates = [];
        const partyCandidates = [];
        let fullName = town;
        let regType = municipalTypes.local;
        if (town && data?.candidates) {
            if (isMunicipalityRegional(data, town)) {
                regType = municipalTypes.regional;
                fullName = getMunicipalityNameByRegionCode(data, region);
            }
            data.candidates.forEach((cmsCandidate) => {
                if (
                    (!region || region === cmsCandidate.region) &&
                    cmsCandidate.municipality === town
                ) {
                    if (cmsCandidate.account) {
                        candidates.push(cmsCandidate);
                    } else {
                        partyCandidates.push(cmsCandidate);
                    }
                }
            });
        }
        return { candidates, partyCandidates, fullName, regType };
    });
};

export const useSearchData = (query) => {
    return useElectionData((data) => {
        const municipalities = getMunicipalities(data).filter((mun) => {
            const city = mun.municipality;
            const longName = getMunicipalityNameByRegionCode(data, city);
            return city && (contains(city, query) || contains(longName, query));
        });

        const candidates = (data?.candidates || []).filter(
            (candidate) =>
                contains(candidate.person?.name, query) ||
                contains(candidate.municipality, query)
        );

        const subjects = (data?.subjects || []).filter(
            (subject) =>
                contains(subject.name, query) ||
                contains(subject.abbreviation, query)
        );

        const tagsSet = new Set();
        const personUidsSet = new Set();
        const partyUidsSet = new Set();
        candidates.forEach((c) => {
            if (c.person?.wpTag) tagsSet.add(c.person.wpTag);
            if (c.person?.uid) personUidsSet.add(c.person.uid);
        });
        subjects.forEach((s) => {
            if (s.primaryParty?.wpTag) tagsSet.add(s.primaryParty.wpTag);
            if (s.primaryParty?.uid) partyUidsSet.add(s.primaryParty.uid);
        });

        return {
            municipalities,
            candidates,
            subjects,
            tags: Array.from(tagsSet),
            personUids: Array.from(personUidsSet),
            partyUids: Array.from(partyUidsSet),
        };
    });
};

export const useCampaignsData = () => {
    return useElectionData((data) => {
        const candidates = {
            [municipalTypes.regional]: [],
            [municipalTypes.local]: [],
        };
        const partyCandidates = {
            [municipalTypes.regional]: [],
            [municipalTypes.local]: [],
        };
        if (data?.candidates) {
            data.candidates.forEach((cmsCandidate) => {
                const regType = cmsCandidate.isRegionalFunction
                    ? municipalTypes.regional
                    : municipalTypes.local;
                if (cmsCandidate.account) {
                    candidates[regType].push(cmsCandidate);
                } else {
                    partyCandidates[regType].push(cmsCandidate);
                }
            });
        }
        return { candidates, partyCandidates };
    });
};

export const usePartiesData = () => {
    return useElectionData((data) => {
        const subjects = (data?.subjects || []).filter((s) => !!s.account);
        const subjectAccounts = subjects.map((s) => s.account);
        return { subjects, subjectAccounts };
    });
};

export const useCandidatesData = () => {
    return useElectionData((data) => {
        const candidates = (data?.candidates || []).filter((c) => !!c.account);
        const candidateAccounts = candidates.map((c) => c.account);
        return { candidates, candidateAccounts };
    });
};

// includes incumbents who are not running, to be shown in their race
export const useRegionRacesData = (region) => {
    return useElectionData(
        (data) => {
            const regionInfo =
                (data?.regions ?? []).find((r) => r.code === region) ?? null;
            const regional = [];
            const city = [];
            const byMunicipality = {};
            (data?.candidates ?? []).forEach((cmsCandidate) => {
                if (
                    cmsCandidate.region !== region ||
                    !cmsCandidate.municipality ||
                    !cmsCandidate.person?.name ||
                    (!isRunning(cmsCandidate) && !cmsCandidate.current)
                ) {
                    return;
                }
                if (cmsCandidate.isRegionalFunction) {
                    regional.push(cmsCandidate);
                } else if (cmsCandidate.municipality === regionInfo?.city) {
                    city.push(cmsCandidate);
                } else {
                    if (!byMunicipality[cmsCandidate.municipality]) {
                        byMunicipality[cmsCandidate.municipality] = [];
                    }
                    byMunicipality[cmsCandidate.municipality].push(
                        cmsCandidate
                    );
                }
            });
            // races with nobody actually running are left out
            const hasRunning = (candidates) => candidates.some(isRunning);
            const municipalities = Object.keys(byMunicipality)
                .sort((a, b) => a.localeCompare(b, 'sk'))
                .map((name) => ({ name, candidates: byMunicipality[name] }))
                .filter((m) => hasRunning(m.candidates));

            return {
                regionInfo,
                regional: hasRunning(regional) ? regional : [],
                city: hasRunning(city) ? city : [],
                municipalities,
            };
        },
        { excludeNotRunning: false }
    );
};
