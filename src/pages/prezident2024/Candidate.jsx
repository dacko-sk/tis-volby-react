import { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router';

import { candidateData } from '../../helpers/candidates';
import { labels, t } from '../../helpers/dictionary';
import { decodeSlug, routes, segments } from '../../helpers/routes';

import useAccountsData from '../../hooks/AccountsData';
import useAdsData from '../../hooks/AdsData';

import AlertWithIcon from '../../components/general/AlertWithIcon';
import Title from '../../components/structure/Title';

function Candidate() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { candidateAccountData } = useAccountsData();
    const { candidateAdsData } = useAdsData();

    const name = decodeSlug(slug);
    const accountData = candidateAccountData(name);
    const adsData = candidateAdsData(name);
    const candidate = candidateData(name, accountData, adsData);

    useEffect(() => {
        if (!candidate.isValid) {
            // redirect to home page in case candidate is unknown
            navigate(routes.home());
        }
    }, [candidate, navigate]);

    if (!candidate.isValid) {
        // stop rendering & let useEffect hook to redirect
        return null;
    }

    return (
        <section className="party-page">
            <Title secondaryWords={1}>{name}</Title>
            {candidate.hasInfo && (
                <AlertWithIcon className="my-4" variant="primary">
                    {t(labels.candidates.info)[candidate.infoKey]}
                </AlertWithIcon>
            )}
            <div className="tabs-scrollable">
                <Nav variant="tabs">
                    <Nav.Link as={NavLink} to={routes.candidate(name)} end>
                        {t(labels.candidates.overview)}
                    </Nav.Link>
                    {candidate.hasAccount !== false && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.candidate(name, segments.TRANSACTIONS)}
                        >
                            {t(labels.candidates.funding)}
                        </Nav.Link>
                    )}
                    {candidate.hasWp && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.candidate(name, segments.ANALYSIS)}
                        >
                            {t(labels.analysis.navTitle)}
                        </Nav.Link>
                    )}
                    <Nav.Link
                        as={NavLink}
                        to={routes.candidate(name, segments.ONLINE)}
                    >
                        {t(labels.online.navTitle)}
                    </Nav.Link>
                    {candidate.hasWp && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.candidate(name, segments.NEWS)}
                        >
                            {t(labels.news.navTitle)}
                        </Nav.Link>
                    )}
                </Nav>
            </div>

            <Outlet context={candidate} />
        </section>
    );
}

export default Candidate;
