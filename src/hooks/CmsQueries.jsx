import { useQuery } from '@tanstack/react-query';
import { contains } from '../helpers/helpers';
import { getActiveSubsite } from '../helpers/languages';
import { routes } from '../helpers/routes';

export const CMS_BASE_URL = 'https://tiacms.transparency.sk';
export const F_STAROSTA = 1;
export const F_PRIMATOR = 2;
export const F_ZUPAN = 3;
export const F_PREZIDENT = 4;

export const cmsSubsitesMap = {
    samosprava2026: 's-26',
};

export const regionDefs = {
    BA: { name: 'Bratislavský samosprávny kraj', shortname: 'BSK' },
    BB: { name: 'Banskobystrický samosprávny kraj', shortname: 'BBSK' },
    KE: { name: 'Košický samosprávny kraj', shortname: 'KSK' },
    NR: { name: 'Nitriansky samosprávny kraj', shortname: 'NSK' },
    PO: { name: 'Prešovský samosprávny kraj', shortname: 'PSK' },
    TN: { name: 'Trenčiansky samosprávny kraj', shortname: 'TSK' },
    TT: { name: 'Trnavský samosprávny kraj', shortname: 'TTSK' },
    ZA: { name: 'Žilinský samosprávny kraj', shortname: 'ŽSK' },
};

// queries
export const getCmsSubsite = () => {
    const activeSubsite = getActiveSubsite();
    return cmsSubsitesMap[activeSubsite] || activeSubsite;
};

export const useElectionData = () => {
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
        refetchOnMount: false,
    });
};

// helpers

export const isRegionalFunction = (functionType) => functionType === F_ZUPAN;

export const isMunicipalityRegional = (town) =>
    Object.values(regionDefs).some((r) => r.shortname === town);

export const getMunicipalityShortname = (town) =>
    Object.values(regionDefs).find((r) => r.name === town)?.shortname ?? town;

// selectors
export const getCandidateMunicipalityShortname = (candidate) =>
    isRegionalFunction(candidate?.functionType)
        ? (regionDefs[candidate?.region]?.shortname ?? candidate?.municipality)
        : candidate?.municipality;

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
        const key = routes.party(subject.name);
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

export const getMunicipalities = (data) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return [];
    const munSet = new Set();
    const result = [];
    data.candidates.forEach((candidate) => {
        if (!candidate.municipality || !candidate.region) return;
        const isRegional = isRegionalFunction(candidate.functionType);
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
