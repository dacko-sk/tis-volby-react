import Table from 'react-bootstrap/Table';
import { useOutletContext } from 'react-router-dom';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { currencyFormat, shortenUrl } from '../../../helpers/helpers';

import { legacyAggregatedKeys } from '../../../hooks/AccountsData';

import AccountTransactions from '../../../components/accounts/AccountTransactions';

import linkIcon from '../../../../public/img/external_link_icon.svg?url';

function PartyTransactions() {
    const party = useOutletContext();

    setTitle(`${party.fullName} : Financovanie`);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">{t(labels.account.info)}</h2>

            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{t(labels.elections.account)}</td>
                        <td>
                            <a
                                href={party[legacyAggregatedKeys.account]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="me-2">
                                    <span className="d-md-none">
                                        {shortenUrl(
                                            party[legacyAggregatedKeys.account]
                                        )}
                                    </span>
                                    <span className="d-none d-md-inline">
                                        {party[legacyAggregatedKeys.account]}
                                    </span>
                                </span>
                                <img className="inline-icon" src={linkIcon} />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.incoming)}</td>
                        <td>
                            {currencyFormat(
                                party[legacyAggregatedKeys.incoming]
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.outgoing)}</td>
                        <td>
                            {currencyFormat(
                                party[legacyAggregatedKeys.outgoing]
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.balance)}</td>
                        <td>{currencyFormat(party.balance)}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.incomesAmount)}</td>
                        <td>{party.num_incoming}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.expensesAmount)}</td>
                        <td>{party.num_outgoing}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.uniqeDonors)}</td>
                        <td>{party.num_unique_donors}</td>
                    </tr>
                </tbody>
            </Table>

            <em className="disclaimer">{t(labels.disclaimerAccount)}</em>

            <AccountTransactions accountData={party} />
        </div>
    );
}

export default PartyTransactions;
