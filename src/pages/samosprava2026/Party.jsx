import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import { labels, t } from '../../helpers/dictionary';
import { currencyFormat, setTitle, shortenUrl } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import useData, { s22AggregatedKeys } from '../../hooks/AccountsData';

import AccountTransactions from '../../components/accounts/AccountTransactions';
import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';

function Party() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse aggregated data
    let candidate = null;
    if (csvData?.data) {
        csvData.data.some((row) => {
            const key = routes.party(row[s22AggregatedKeys.name]);
            if (pathname === key) {
                candidate = row;
                return true;
            }
            return false;
        });
    }

    useEffect(() => {
        if (!candidate && csvData?.data) {
            navigate(routes.home());
        }
    }, [candidate, csvData, navigate]);

    if (!candidate || !csvData?.data) {
        return <Loading />;
    }

    const partyAccounts = [];
    if (candidate[s22AggregatedKeys.partyAccount] ?? false) {
        candidate[s22AggregatedKeys.partyAccount]
            .split(';')
            .forEach((account) => {
                partyAccounts.push(
                    <a
                        key={account}
                        className="d-block"
                        href={account}
                        rel="noreferrer"
                        target="_blank"
                    >
                        {shortenUrl(account)}
                    </a>
                );
            });
    }

    setTitle(candidate[s22AggregatedKeys.name]);

    return (
        <section className="candidate-page">
            <Title>{candidate[s22AggregatedKeys.name]}</Title>
            <Table striped bordered responsive hover>
                <tbody>
                    {candidate.isTransparent && (
                        <>
                            <tr>
                                <td>{t(labels.charts.incoming)}</td>
                                <td>
                                    {currencyFormat(candidate.sum_incoming)}
                                </td>
                            </tr>
                            <tr>
                                <td>{t(labels.charts.outgoing)}</td>
                                <td>
                                    {currencyFormat(candidate.sum_outgoing)}
                                </td>
                            </tr>
                            <tr>
                                <td>{t(labels.candidate.balance)}</td>
                                <td>{currencyFormat(candidate.balance)}</td>
                            </tr>
                            <tr>
                                <td>{t(labels.candidate.numIncoming)}</td>
                                <td>{candidate.num_incoming}</td>
                            </tr>
                            <tr>
                                <td>{t(labels.candidate.numOutgoing)}</td>
                                <td>{candidate.num_outgoing}</td>
                            </tr>
                            <tr>
                                <td>{t(labels.charts.uniqueDonors)}</td>
                                <td>{candidate.num_unique_donors}</td>
                            </tr>
                        </>
                    )}
                    {partyAccounts.length > 0 && (
                        <tr>
                            <td>
                                {partyAccounts.length > 1
                                    ? t(labels.candidate.partyAccounts)
                                    : t(labels.candidate.partyAccount)}
                            </td>
                            <td>{partyAccounts}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <em className="disclaimer">
                {candidate.isTransparent
                    ? t(labels.candidate.disclaimerAccount)
                    : t(labels.candidate.disclaimerCandidate)}
            </em>

            <AccountTransactions candidate={candidate} />
        </section>
    );
}

export default Party;
