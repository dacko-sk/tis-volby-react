import { contains, shortenUrl } from './helpers';
import { getActiveSubsite } from './languages';
import { routes } from './routes';

import { aggregatedKeys } from '../hooks/AccountsData';

export const F_STAROSTA = 1;
export const F_PRIMATOR = 2;
export const F_ZUPAN = 3;
export const F_PREZIDENT = 4;

export const cmsSubsitesMap = {
    samosprava2026: 's-26',
};

export const cmsChartPlacements = {
    landing: 'landing',
    charts: 'charts',
};

export const getCmsSubsite = () => {
    const activeSubsite = getActiveSubsite();
    return cmsSubsitesMap[activeSubsite] || activeSubsite;
};

// candidate status in the CMS elections endpoint
export const candidateStatus = {
    NOT_RUNNING: 0,
    RUNNING: 1,
    WITHDRAWN: 2,
    ADVANCED: 3,
    ELECTED: 4,
};

// candidates without status are considered running
export const isRunning = (cmsCandidate) =>
    cmsCandidate?.status !== candidateStatus.NOT_RUNNING;

const findAccountRow = (csvData, account, name) =>
    csvData?.data?.find(
        (row) =>
            row[aggregatedKeys.account] === account &&
            (!name || row[aggregatedKeys.name] === name)
    ) ?? null;

// campaign spending from candidate's own account and supporting party accounts
export const getCandidateSpending = (cmsCandidate, csvData, cmsData) => {
    const ownRow = cmsCandidate?.account
        ? findAccountRow(
              csvData,
              cmsCandidate.account.trim(),
              cmsCandidate.person?.name
          )
        : null;
    const own = ownRow?.[aggregatedKeys.outgoing] ?? 0;

    const parties = (cmsCandidate?.partyAccounts ?? [])
        .map((account) => account.trim())
        .filter(Boolean)
        .map((account) => {
            const row = findAccountRow(csvData, account);
            const subject = findSubjectByAccount(cmsData, account);
            return {
                account,
                subject,
                name: subject
                    ? getSubjectShortname(subject)
                    : (row?.[aggregatedKeys.name] ?? shortenUrl(account)),
                amount: row?.[aggregatedKeys.outgoing] ?? 0,
            };
        })
        .sort((a, b) => b.amount - a.amount);
    const partiesTotal = parties.reduce((sum, p) => sum + p.amount, 0);

    return {
        hasAccount: !!cmsCandidate?.account,
        hasParties: parties.length > 0,
        own,
        parties,
        partiesTotal,
        total: own + partiesTotal,
    };
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

export const findCandidateByPersonUid = (data, personUid) => {
    if (!data?.candidates || !Array.isArray(data.candidates)) return null;
    return data.candidates.find(
        (candidate) => candidate.person?.uid === personUid
    );
};

export const findSubjectByPartyUid = (data, partyUid) => {
    if (!data?.subjects || !Array.isArray(data.subjects)) return null;
    return data.subjects.find(
        (subject) => subject.primaryParty?.uid === partyUid
    );
};
