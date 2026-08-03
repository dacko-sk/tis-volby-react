import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { hiddenColumnsAccount } from '../../helpers/accounts';
import { setTitle } from '../../helpers/browser';
import { transactionsColumns as tc } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { routes, separators } from '../../helpers/routes';

import TransactionsSearch from '../../components/accounts/TransactionsSearch';
import Title from '../../components/structure/Title';
import AccountOverview from '../../components/accounts/AccountOverview';

function Account() {
    const params = useParams();
    const navigate = useNavigate();
    const slugParts = (params.slug ?? '').split(separators.value);

    useEffect(() => {
        if (slugParts.length < 2) {
            // redirect to accounts page in case of no invalid page arguments
            navigate(routes.accounts());
        }
    }, [slugParts, navigate]);

    if (slugParts.length < 2) {
        return null;
    }

    const accName = slugParts[0].replaceAll(separators.space, ' ');
    const [, accId] = slugParts;

    setTitle(t(labels.accounts.pageTitle));

    return (
        <section>
            <Title secondary={accName}>
                {t(labels.accounts.columns[tc.ta])}
                <br />
            </Title>

            <AccountOverview accName={accName} accId={accId} />

            <TransactionsSearch
                hiddenColumns={hiddenColumnsAccount}
                parties={[]}
                route={routes.account(params.slug ?? '')}
                routeOptions={{ i: accId }}
            />
        </section>
    );
}

export default Account;
