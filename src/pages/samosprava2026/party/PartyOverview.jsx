import Table from 'react-bootstrap/Table';
import { Link, useLocation, useOutletContext } from 'react-router-dom';

import { labels, t } from '../../../helpers/dictionary';
import { currencyFormat } from '../../../helpers/helpers';
import { routes } from '../../../helpers/routes';

import { aggregatedKeys } from '../../../hooks/AccountsData';
import {
    findSubjectByPathname,
    findSubjectSupportedCandidates,
} from '../../../hooks/CmsQueries';

import AccountTransactions from '../../../components/accounts/AccountTransactions';

function PartyOverview() {
    const { pathname } = useLocation();
    const { cmsData, accountData } = useOutletContext();

    const cmsSubject = findSubjectByPathname(cmsData, pathname);

    const supportedCandidates = findSubjectSupportedCandidates(
        cmsData,
        cmsSubject?.primaryParty?.uid
    ).map((candidate) => (
        <Link
            key={candidate.uid}
            className="d-block"
            to={routes.candidateMunicipal(
                candidate.person?.name,
                candidate.municipality
            )}
        >
            {candidate.person?.name}
        </Link>
    ));

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">{t(labels.account.info)}</h2>

            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{t(labels.charts.incoming)}</td>
                        <td>
                            {currencyFormat(
                                accountData[aggregatedKeys.incoming]
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.outgoing)}</td>
                        <td>
                            {currencyFormat(
                                accountData[aggregatedKeys.outgoing]
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.candidate.balance)}</td>
                        <td>
                            {currencyFormat(
                                accountData[aggregatedKeys.balance]
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>{t(labels.candidate.numIncoming)}</td>
                        <td>{accountData[aggregatedKeys.num_incoming]}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.candidate.numOutgoing)}</td>
                        <td>{accountData[aggregatedKeys.num_outgoing]}</td>
                    </tr>
                    <tr>
                        <td>{t(labels.charts.uniqueDonors)}</td>
                        <td>{accountData[aggregatedKeys.num_unique_donors]}</td>
                    </tr>

                    {supportedCandidates.length > 0 && (
                        <tr>
                            <td>{t(labels.party.supportedCandidates)}</td>
                            <td>{supportedCandidates}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <AccountTransactions candidate={accountData} />
        </div>
    );
}

export default PartyOverview;
