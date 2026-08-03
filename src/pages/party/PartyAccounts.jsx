import { useOutletContext } from 'react-router';

import { hiddenColumnsParty } from '../../helpers/accounts';
import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { partyAccounts, partyFullName } from '../../helpers/parties';
import { routes, segments } from '../../helpers/routes';

import TransactionsSearch from '../../components/accounts/TransactionsSearch';

function PartyAccounts() {
    const partyName = useOutletContext();

    setTitle(`${partyFullName(partyName)} : ${t(labels.accounts.navTitle)}`);

    return (
        <TransactionsSearch
            hiddenColumns={hiddenColumnsParty}
            parties={[]}
            route={routes.party(partyName, segments.ACCOUNTS)}
            routeOptions={{ i: partyAccounts(partyName) }}
        />
    );
}

export default PartyAccounts;
