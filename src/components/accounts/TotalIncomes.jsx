import { labels, t } from '../../helpers/dictionary';
import useAccountsData, {
    aggregatedKeys as agk,
} from '../../hooks/AccountsData';
import HeroNumber from '../general/HeroNumber';

function TotalIncomes() {
    const { accountsData } = useAccountsData();

    let total = 0;
    const uniqueAccounts = {};
    if (accountsData.data) {
        accountsData.data.forEach((row) => {
            // sum of incoming amounts from all transparent accounts
            if (row[agk.incoming] > 0) {
                // add each account number only once
                const accountKey = row[agk.account];
                // For valid urls, group them. For invalid/empty urls, treat them independently
                if (accountKey && accountKey !== '') {
                    if (uniqueAccounts[accountKey] !== undefined) {
                        uniqueAccounts[accountKey] += 1;
                    } else {
                        uniqueAccounts[accountKey] = 1;
                        total += row[agk.incoming];
                    }
                } else {
                    total += row[agk.incoming];
                }
            }
        });
    }

    return (
        <HeroNumber
            disclaimer={t(labels.account.totalDisclaimer)}
            lastUpdate={accountsData.lastUpdate ?? null}
            loading={!(accountsData.data ?? false)}
            number={total}
            title={t(labels.account.totalIncomes)}
        />
    );
}

export default TotalIncomes;
