import { useQuery } from '@tanstack/react-query';
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
    BA: { name: 'Bratislavský samosprávny kraj', shortcut: 'BSK' },
    BB: { name: 'Banskobystrický samosprávny kraj', shortcut: 'BBSK' },
    KE: { name: 'Košický samosprávny kraj', shortcut: 'KSK' },
    NR: { name: 'Nitriansky samosprávny kraj', shortcut: 'NSK' },
    PO: { name: 'Prešovský samosprávny kraj', shortcut: 'PSK' },
    TN: { name: 'Trenčiansky samosprávny kraj', shortcut: 'TSK' },
    TT: { name: 'Trnavský samosprávny kraj', shortcut: 'TTSK' },
    ZA: { name: 'Žilinský samosprávny kraj', shortcut: 'ŽSK' },
};

export const isRegionalFunction = (functionType) => functionType === F_ZUPAN;

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
            candidate.municipality
        );
        return pathname === key;
    });
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
        return pathname === key;
    });
};

export const findSubjectSupportedCandidates = (data, primaryPartyUid) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return [];
    return data.candidates.filter((candidate) =>
        (candidate.supportingParties ?? []).some(
            (party) => party.uid === primaryPartyUid
        )
    );
};

export const getCandidateMunicipalityShortname = (candidate) =>
    isRegionalFunction(candidate?.functionType)
        ? (regionDefs[candidate?.region]?.shortcut ?? candidate?.municipality)
        : candidate?.municipality;
