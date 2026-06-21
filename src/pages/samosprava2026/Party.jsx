import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import { labels, t } from '../../helpers/dictionary';
import { currencyFormat, setTitle } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import {
    findSubjectByPathname,
    findSubjectSupportedCandidates,
    useElectionData,
} from '../../hooks/CmsQueries';

import AccountTransactions from '../../components/accounts/AccountTransactions';
import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';

function Party() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { csvData } = useData();
    const { data: cmsData, isLoading } = useElectionData();

    const cmsSubject = findSubjectByPathname(cmsData, pathname);
    // parse aggregated data
    const accountData = cmsSubject
        ? csvData?.data?.find((row) => {
              return (
                  row[aggregatedKeys.name] === cmsSubject.name &&
                  row[aggregatedKeys.account] === cmsSubject.account
              );
          })
        : null;

    useEffect(() => {
        if (!isLoading && !cmsSubject) {
            navigate(routes.home());
        }
    }, [cmsSubject, isLoading, navigate]);

    if (isLoading) {
        return <Loading />;
    }

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

    setTitle(cmsSubject.name);

    return (
        <section className="candidate-page">
            <Title>{cmsSubject.name}</Title>
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
                        <td>{accountData[[aggregatedKeys.num_outgoing]]}</td>
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
        </section>
    );
}

export default Party;
