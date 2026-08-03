import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useNavigate, useOutletContext } from 'react-router';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { currencyFormat, shortenUrl } from '../../../helpers/helpers';
import { routes } from '../../../helpers/routes';

import { aggregatedKeys as agk } from '../../../hooks/AccountsData';

import AccountTransactions from '../../../components/accounts/AccountTransactions';

import linkIcon from '../../../../public/img/external_link_icon.svg?url';

function CandidateTransactions() {
    const candidate = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (candidate.account === false) {
            // redirect to candidate overview in case of no transparent account
            navigate(routes.candidate(candidate.name));
        }
    }, [candidate, navigate]);

    if (candidate.account === false) {
        // stop rendering & let useEffect hook to redirect
        return null;
    }

    setTitle(`${candidate.name} : ${t(labels.candidates.funding)}`);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">{t(labels.account.info)}</h2>

            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{t(labels.elections.account)}</td>
                        <td>
                            <a
                                href={candidate.account?.[agk.account]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="me-2">
                                    <span className="d-md-none">
                                        {shortenUrl(
                                            candidate.account?.[agk.account]
                                        )}
                                    </span>
                                    <span className="d-none d-md-inline">
                                        {candidate.account?.[agk.account]}
                                    </span>
                                </span>
                                <img className="inline-icon" src={linkIcon} />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.incoming)}</td>
                        <td>
                            {currencyFormat(candidate.account?.[agk.incoming])}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.outgoing)}</td>
                        <td>
                            {currencyFormat(candidate.account?.[agk.outgoing])}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.balance)}</td>
                        <td>
                            {currencyFormat(candidate.account?.[agk.balance])}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.incomesAmount)}</td>
                        <td>{candidate.account?.[agk.num_incoming]}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.account.expensesAmount)}</td>
                        <td>{candidate.account?.[agk.num_outgoing]}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.uniqueDonors)}</td>
                        <td>{candidate.account?.[agk.num_unique_donors]}</td>
                    </tr>
                </tbody>
            </Table>

            <em className="disclaimer">{t(labels.disclaimerAccount)}</em>

            <AccountTransactions accountData={candidate.account} />
        </div>
    );
}

export default CandidateTransactions;
