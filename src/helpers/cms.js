import { contains, pctFormat, shortenUrl } from './helpers';
import { getActiveSubsite, getCurrentLanguage, languages } from './languages';
import { routes } from './routes';
import {
    transparencyClass,
    transparencyClasses,
    transparencyIndicators,
} from './wp';

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

// criteria score values in the CMS evaluations (analyses) endpoint
export const analysisScores = {
    GOOD: 1,
    AVERAGE: 2,
    BAD: 3,
    NA: 4,
};

const analysisScoreClasses = {
    [analysisScores.GOOD]: transparencyClasses.good,
    [analysisScores.AVERAGE]: transparencyClasses.average,
    [analysisScores.BAD]: transparencyClasses.bad,
};

export const analysisScoreClass = (score) =>
    analysisScoreClasses[score] ?? transparencyClasses.unknown;

// index into labels.analysis.badges (0 = N/A, 1 = yes, 2 = partially, 3 = no)
export const analysisScoreBadgeIndex = (score) =>
    score === analysisScores.NA ? 0 : score;

// total score class, null score means not evaluated (yet)
export const analysisClass = (evaluation) =>
    evaluation?.score === null || evaluation?.score === undefined
        ? transparencyClasses.unknown
        : transparencyClass(evaluation.score);

export const isFeaturedAnalysis = (evaluation) => !!evaluation?.featured;

const localized = (sk, en) =>
    getCurrentLanguage() === languages.en && en ? en : sk;

export const getCriterionTitle = (criterion) =>
    localized(criterion?.title, criterion?.titleEn);

export const getCriterionDescription = (criterion) =>
    localized(criterion?.description, criterion?.descriptionEn);

// all evaluations of a candidate (by uid), one per set, oldest set first
export const findCandidateAnalyses = (analysesData, candidateUid) => {
    if (!analysesData?.sets || !Array.isArray(analysesData.sets)) return [];
    const result = [];
    analysesData.sets.forEach((set) => {
        const evaluation = (set.evaluations ?? []).find(
            (e) => !!candidateUid && e.candidate === candidateUid
        );
        if (evaluation) {
            result.push({ set, evaluation });
        }
    });
    return result.sort((a, b) => a.set.date - b.set.date);
};

// criteria of the given sets (oldest first) grouped into
// [{ group, criteria }], keeping the API order: the first occurrence
// of a group sets the position of the whole group;
// the latest set wins, criteria found only in older sets are appended
export const groupAnalysisCriteria = (sets) => {
    const groups = [];
    const seen = new Set();
    [...sets].reverse().forEach((set) => {
        (set.criteria ?? []).forEach((criterion) => {
            if (
                seen.has(criterion.uid) ||
                !transparencyIndicators[criterion.group]
            ) {
                return;
            }
            seen.add(criterion.uid);
            let group = groups.find((g) => g.group === criterion.group);
            if (!group) {
                group = { group: criterion.group, criteria: [] };
                groups.push(group);
            }
            group.criteria.push(criterion);
        });
    });
    return groups;
};

export const analysisScoreFormat = (score) =>
    score === null || score === undefined ? 'N/A' : pctFormat(score);

// latest evaluation of every evaluated candidate,
// joined with their election data and sorted by score
// (subject evaluations are not used at the moment)
export const getAnalysesList = (analysesData, cmsData) => {
    if (!analysesData?.sets || !Array.isArray(analysesData.sets)) return [];
    const latest = {};
    [...analysesData.sets]
        .sort((a, b) => a.date - b.date)
        .forEach((set) => {
            (set.evaluations ?? [])
                .filter((evaluation) => evaluation.candidate)
                .forEach((evaluation) => {
                    latest[evaluation.candidate] = {
                        key: evaluation.candidate,
                        set,
                        evaluation,
                    };
                });
        });

    return Object.values(latest)
        .map((item) => ({
            ...item,
            cmsCandidate: (cmsData?.candidates ?? []).find(
                (c) => c.uid === item.evaluation.candidate
            ),
        }))
        .filter((item) => item.cmsCandidate)
        .sort((a, b) => {
            const scoreA = a.evaluation.score;
            const scoreB = b.evaluation.score;
            if (scoreA !== null && scoreB !== null) return scoreB - scoreA;
            if (scoreA !== null) return -1;
            if (scoreB !== null) return 1;
            return 0;
        });
};

export const getAnalysisRoute = (item, subpage) =>
    routes.candidateMunicipal(
        item.cmsCandidate.person?.name,
        item.cmsCandidate.municipality,
        subpage
    );

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
