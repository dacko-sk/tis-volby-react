import { colorDarkBlue, colorLightBlue } from './constants';
import { shortenUrl } from './helpers';

import { aggregatedKeys } from '../hooks/AccountsData';
import { findSubjectByAccount, getSubjectShortname } from '../hooks/CmsQueries';

// dark blue for the biggest party supporter, light blue for any other
export const partyStackColor = (index) =>
    index ? colorLightBlue : colorDarkBlue;

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
