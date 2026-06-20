import { dates } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { getTimestampFromIsoDate } from '../../helpers/helpers';
import { getActiveSubsite } from '../../helpers/languages';

import useAccountsData, {
    aggregatedKeys as agk,
} from '../../hooks/AccountsData';
import useAdsData, { csvConfig } from '../../hooks/AdsData';

import HeroNumber from '../general/HeroNumber';

function TotalSpending() {
    const subsite = getActiveSubsite();
    const finalReports =
        subsite === 'euro2024' ||
        subsite === 'prezident2024' ||
        subsite === 'parlament2023';

    if (finalReports) {
        const {
            sheetsData,
            getAllPartiesNames,
            getPartyAdsData,
            allCandidatesNames,
            candidateAdsData,
        } = useAdsData();

        const getNames =
            subsite === 'prezident2024'
                ? allCandidatesNames
                : getAllPartiesNames;
        const getAdsData =
            subsite === 'prezident2024' ? candidateAdsData : getPartyAdsData;

        const total = (getNames() ?? [])
            .map((name) => getAdsData(name))
            .reduce(
                (sum, adsData) =>
                    sum +
                    (adsData[csvConfig.ACCOUNTS.columns.CAMPAIGN] || 0) +
                    (adsData[csvConfig.ACCOUNTS.columns.PRECAMPAIGN] || 0),
                0
            );

        return (
            <HeroNumber
                disclaimer={t(labels.account.finalReportDisclaimer)}
                lastUpdate={getTimestampFromIsoDate(dates.monitoringEnd)}
                loading={!sheetsData.loaded}
                number={total}
                title={t(labels.account.totalSpending)}
            />
        );
    }
    const { accountsData } = useAccountsData();

    let total = 0;
    const uniqueAccounts = {};
    if (accountsData.data) {
        accountsData.data.forEach((row) => {
            // sum of outgoing amounts from all transparent accounts
            if (row[agk.outgoing] > 0) {
                // add each account number only once
                const accountKey = row[agk.account];
                // For valid urls, group them. For invalid/empty urls, treat them independently
                if (accountKey && accountKey !== '') {
                    if (uniqueAccounts[accountKey] !== undefined) {
                        uniqueAccounts[accountKey] += 1;
                    } else {
                        uniqueAccounts[accountKey] = 1;
                        total += row[agk.outgoing];
                    }
                } else {
                    total += row[agk.outgoing];
                }
            }
            // remove manually added duplicate expenses
            if (row?.duplicateExpenses > 0) {
                total -= row.duplicateExpenses;
            }
        });
    }

    return (
        <HeroNumber
            disclaimer={t(labels.account.totalDisclaimer)}
            lastUpdate={accountsData.lastUpdate ?? null}
            loading={!(accountsData.data ?? false)}
            number={total}
            title={t(labels.account.totalSpending)}
        />
    );
}

export default TotalSpending;
