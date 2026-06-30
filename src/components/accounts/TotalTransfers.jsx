import { dates } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { getTimestampFromIsoDate } from '../../helpers/helpers';
import { getActiveSubsite } from '../../helpers/languages';

import useAccountsData, {
    aggregatedKeys as agk,
} from '../../hooks/AccountsData';
import useAdsData, { csvConfig } from '../../hooks/AdsData';

import HeroNumber from '../general/HeroNumber';

function TotalTransfers({ direction = agk.outgoing, accountsFilter = null, title = null }) {
    const subsite = getActiveSubsite();
    const finalReports =
        subsite === 'euro2024' ||
        subsite === 'prezident2024' ||
        subsite === 'parlament2023';

    if (finalReports && direction === agk.outgoing) {
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
                title={title || t(labels.account.totalSpending)}
            />
        );
    }
    const { accountsData } = useAccountsData();

    let total = 0;
    const uniqueAccounts = {};
    if (accountsData.data) {
        accountsData.data.forEach((row) => {
            const accountKey = row[agk.account];
            if (accountsFilter && !accountsFilter.includes(accountKey)) {
                return;
            }

            // sum amounts from all transparent accounts
            if (row[direction] >= 0) {
                // add each account number only once
                // For valid urls, group them. For invalid/empty urls, treat them independently
                if (accountKey && accountKey !== '') {
                    if (!(uniqueAccounts[accountKey] ?? false)) {
                        uniqueAccounts[accountKey] = 1;
                        total += row[direction];
                    }
                } else {
                    total += row[direction];
                }
            }
            // remove manually added duplicate expenses
            if (direction === agk.outgoing && row?.duplicateExpenses > 0) {
                total -= row.duplicateExpenses;
            }
        });
    }

    const defaultTitle = direction === agk.outgoing 
        ? t(labels.account.totalSpending) 
        : t(labels.account.totalIncomes);

    return (
        <HeroNumber
            count={Object.keys(uniqueAccounts).length}
            disclaimer={t(labels.account.totalDisclaimer)}
            lastUpdate={accountsData.lastUpdate ?? null}
            loading={!(accountsData.data ?? false)}
            number={total}
            title={title || defaultTitle}
        />
    );
}

export default TotalTransfers;
