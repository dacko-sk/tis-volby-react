import { Link, useOutletContext } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';

import { labels, t } from '../../../helpers/dictionary';
import {
    currencyFormat,
    shortenUrl,
    substitute,
} from '../../../helpers/helpers';
import { routes } from '../../../helpers/routes';

import { aggregatedKeys, municipalTypes } from '../../../hooks/AccountsData';
import {
    findSubjectByAccount,
    getCandidateMunicipalityShortname,
    isRegionalFunction,
    useElectionData,
} from '../../../hooks/CmsQueries';

import AccountTransactions from '../../../components/accounts/AccountTransactions';
import FinalReport from '../../../components/general/FinalReport';

function CandidateOverview() {
    const { cmsCandidate, accountData } = useOutletContext();
    const { data: cmsData } = useElectionData();

    const partyAccounts = (cmsCandidate?.partyAccounts ?? []).map((account) => {
        const s = findSubjectByAccount(cmsData, account.trim());
        return s ? (
            <Link key={s.name} className="d-block" to={routes.party(s.name)}>
                {s.name}
            </Link>
        ) : (
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

    const supportingParties = (cmsCandidate?.supportingParties ?? []).map(
        (party) => (
            <Badge
                as={Link}
                key={party.name}
                bg="secondary"
                className="me-1 text-decoration-none"
                to={routes.party(party.name)}
            >
                {party.abbreviation || party.name}
            </Badge>
        )
    );

    return (
        <div className="candidate-overview">
            <Table striped bordered responsive hover>
                <tbody>
                    <tr>
                        <td>{t(labels.type)}</td>
                        <td>
                            {t(
                                labels.elections.municipalTypes[
                                    isRegionalFunction(
                                        cmsCandidate?.functionType
                                    )
                                        ? municipalTypes.regional
                                        : municipalTypes.local
                                ]
                            )}
                        </td>
                    </tr>
                    {cmsCandidate?.region && (
                        <tr>
                            <td>{t(labels.candidate.region)}</td>
                            <td>
                                <Link to={routes.region(cmsCandidate?.region)}>
                                    {substitute(cmsCandidate?.region)}
                                </Link>
                            </td>
                        </tr>
                    )}
                    {cmsCandidate?.municipality && (
                        <tr>
                            <td>{t(labels.municipality)}</td>
                            <td>
                                <Link
                                    to={routes.municipality(
                                        getCandidateMunicipalityShortname(
                                            cmsCandidate
                                        ),
                                        cmsCandidate?.region ?? null
                                    )}
                                >
                                    {cmsCandidate?.municipality}
                                </Link>
                            </td>
                        </tr>
                    )}
                    {cmsCandidate?.account && accountData && (
                        <>
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
                                <td>
                                    {accountData[aggregatedKeys.num_incoming]}
                                </td>
                            </tr>
                            <tr>
                                <td>{t(labels.candidate.numOutgoing)}</td>
                                <td>
                                    {accountData[aggregatedKeys.num_outgoing]}
                                </td>
                            </tr>
                            <tr>
                                <td>{t(labels.charts.uniqueDonors)}</td>
                                <td>
                                    {
                                        accountData[
                                            aggregatedKeys.num_unique_donors
                                        ]
                                    }
                                </td>
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
                    {supportingParties.length > 0 && (
                        <tr>
                            <td>{t(labels.candidate.supportingParties)}</td>
                            <td>{supportingParties}</td>
                        </tr>
                    )}
                    <FinalReport candidate={accountData} tableRow />
                </tbody>
            </Table>

            <em className="disclaimer">
                {cmsCandidate?.account
                    ? t(labels.candidate.disclaimerAccount)
                    : t(labels.candidate.disclaimerCandidate)}
            </em>

            <AccountTransactions candidate={accountData} />
        </div>
    );
}

export default CandidateOverview;
