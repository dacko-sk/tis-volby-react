import { useQuery } from '@tanstack/react-query';

import { contains } from '../helpers/helpers';
import { getActiveSubsite } from '../helpers/languages';
import { routes } from '../helpers/routes';

import { municipalTypes } from './AccountsData';

export const CMS_BASE_URL = 'https://tiacms.transparency.sk';
export const F_STAROSTA = 1;
export const F_PRIMATOR = 2;
export const F_ZUPAN = 3;
export const F_PREZIDENT = 4;

export const cmsSubsitesMap = {
    samosprava2026: 's-26',
};

// queries

export const getCmsSubsite = () => {
    const activeSubsite = getActiveSubsite();
    return cmsSubsitesMap[activeSubsite] || activeSubsite;
};

export const useElectionData = (selectFn) => {
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
        select: selectFn,
        refetchOnMount: false,
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

export const useCandidateSupportingSubjects = (candidate) => {
    return useElectionData((data) =>
        findCandidateSupportingSubjects(data, candidate)
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
        candidates.forEach((c) => {
            if (c.person?.wpTag) tagsSet.add(c.person.wpTag);
        });
        subjects.forEach((s) => {
            if (s.primaryParty?.wpTag) tagsSet.add(s.primaryParty.wpTag);
        });

        return {
            municipalities,
            candidates,
            subjects,
            tags: Array.from(tagsSet),
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

export const useRegionData = (region) => {
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
                if (region === cmsCandidate.region) {
                    const regType = cmsCandidate.isRegionalFunction
                        ? municipalTypes.regional
                        : municipalTypes.local;
                    if (cmsCandidate.account) {
                        candidates[regType].push(cmsCandidate);
                    } else {
                        partyCandidates[regType].push(cmsCandidate);
                    }
                }
            });
        }
        return { candidates, partyCandidates };
    });
};

// helpers

export const getSubjectShortname = (subject) =>
    subject
        ? subject.abbreviation ||
          subject.primaryParty?.abbreviation ||
          subject.name
        : null;

// selectors

export const findCandidate = (data, name, account) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return null;
    return data.candidates.find(
        (candidate) =>
            candidate.account === account && candidate.person?.name === name
    );
};

export const findCandidateByPathname = (data, pathname) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return null;
    return data.candidates.find((candidate) => {
        const key = routes.candidateMunicipal(
            candidate.person?.name ?? '',
            candidate.municipality,
            null
        );
        return pathname === key || pathname.startsWith(key + '/');
    });
};

export const findCandidateByTag = (data, tag) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return null;
    return data.candidates.find((candidate) => candidate.person?.wpTag === tag);
};

export const findSubject = (data, name, account) => {
    if (!data?.subjects || !Array.isArray(data.subjects)) return null;
    return data.subjects.find(
        (subject) => subject.account === account && subject.name === name
    );
};

export const findSubjectByPathname = (data, pathname) => {
    if (!data?.subjects || !Array.isArray(data.subjects)) return null;
    return data.subjects.find((subject) => {
        const key = routes.party(getSubjectShortname(subject));
        return pathname === key || pathname.startsWith(key + '/');
    });
};

export const findSubjectByAccount = (data, account) => {
    if (!data?.subjects || !Array.isArray(data.subjects)) return null;
    return data.subjects.find((subject) => {
        return subject.account === account;
    });
};

export const findSubjectByTag = (data, tag) => {
    if (!data?.subjects || !Array.isArray(data.subjects)) return null;
    return data.subjects.find((subject) => subject.primaryParty?.wpTag === tag);
};

export const findSubjectSupportedCandidates = (data, primaryPartyUid) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return [];
    return data.candidates.filter((candidate) =>
        (candidate.supportingParties ?? []).some(
            (party) => party.uid === primaryPartyUid
        )
    );
};

export const findCandidateSupportingSubjects = (data, candidate) => {
    if (
        !data?.subjects ||
        !Array.isArray(data.subjects) ||
        !candidate?.supportingParties
    ) {
        return [];
    }
    const supportingUids = candidate.supportingParties.map(
        (party) => party.uid
    );
    return data.subjects.filter((subject) =>
        supportingUids.includes(subject.primaryParty?.uid)
    );
};

export const getMunicipalities = (data) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return [];
    const munSet = new Set();
    const result = [];
    data.candidates.forEach((candidate) => {
        if (!candidate.municipality || !candidate.region) return;
        const isRegional = candidate.isRegionalFunction;
        const key = `${candidate.region}-${candidate.municipality}-${isRegional}`;
        if (!munSet.has(key)) {
            munSet.add(key);
            result.push({
                region: candidate.region,
                municipality: candidate.municipality,
                isRegional,
            });
        }
    });
    return result;
};

export const getSearchTags = (data, query) => {
    const tags = new Set();

    if (data?.candidates && Array.isArray(data.candidates)) {
        data.candidates.forEach((candidate) => {
            if (contains(candidate.person?.name, query)) {
                if (candidate.person?.wpTag) {
                    tags.add(candidate.person.wpTag);
                }
            }
        });
    }

    if (data?.subjects && Array.isArray(data.subjects)) {
        data.subjects.forEach((subject) => {
            if (
                contains(subject.name, query) ||
                contains(subject.abbreviation, query)
            ) {
                if (subject.primaryParty?.wpTag) {
                    tags.add(subject.primaryParty.wpTag);
                }
            }
        });
    }

    return Array.from(tags);
};

export const isMunicipalityRegional = (data, town) => {
    if (!data?.regions || !Array.isArray(data.regions)) return false;
    return data.regions.some(
        (r) => r.abbreviation === town || r.municipality === town
    );
};

export const getMunicipalityNameByRegionCode = (data, code) => {
    if (!data?.regions || !Array.isArray(data.regions)) return code;
    return data.regions.find((r) => r.code === code)?.municipality ?? code;
};
