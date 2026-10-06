import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import Nav from 'react-bootstrap/Nav';

import { findCandidateByPathname } from '../../helpers/cms';
import { useDemoMode } from '../../helpers/demoMode';
import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import { useElectionData, useCandidateAnalyses } from '../../hooks/CmsQueries';

import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';

function Candidate() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    // TODO: 2026 analyses visible in demo mode only until all are published
    const isDemo = useDemoMode();

    const { csvData } = useData();
    const { data: cmsData, isLoading } = useElectionData();

    const cmsCandidate = findCandidateByPathname(cmsData, pathname);
    const { data: analyses } = useCandidateAnalyses(cmsCandidate?.uid);
    const accountData = cmsCandidate
        ? csvData?.data?.find((row) => {
              return (
                  row[aggregatedKeys.name] === cmsCandidate.person?.name &&
                  row[aggregatedKeys.account] === cmsCandidate.account
              );
          })
        : null;

    useEffect(() => {
        if (!isLoading && !cmsCandidate) {
            navigate(routes.home());
        }
    }, [cmsCandidate, isLoading, navigate]);

    if (isLoading || !cmsCandidate) {
        return <Loading />;
    }

    const hasAnalysis = isDemo && (analyses ?? []).length > 0;
    const hasNews = !!cmsCandidate?.person?.wpTag;
    const hasAssets =
        !!cmsCandidate?.person?.assetDeclarationsId ||
        (cmsCandidate?.person?.assetDeclarationsExtended ?? []).length > 0;

    setTitle(cmsCandidate?.person?.name);

    return (
        <section className="candidate-page">
            <Title secondary={cmsCandidate?.municipality || null}>
                {cmsCandidate?.person?.name}
                <br />
            </Title>

            <div className="tabs-scrollable mt-4">
                <Nav variant="tabs">
                    <Nav.Link
                        as={NavLink}
                        to={routes.candidateMunicipal(
                            cmsCandidate?.person?.name,
                            cmsCandidate?.municipality,
                            null
                        )}
                        end
                    >
                        {t(labels.parties.overview)}
                    </Nav.Link>
                    {hasAnalysis && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.candidateMunicipal(
                                cmsCandidate?.person?.name,
                                cmsCandidate?.municipality,
                                segments.ANALYSIS
                            )}
                        >
                            {t(labels.analysis.navTitle)}
                        </Nav.Link>
                    )}
                    {hasNews && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.candidateMunicipal(
                                cmsCandidate?.person?.name,
                                cmsCandidate?.municipality,
                                segments.NEWS
                            )}
                        >
                            {t(labels.news.navTitle)}
                        </Nav.Link>
                    )}
                    {hasAssets && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.candidateMunicipal(
                                cmsCandidate?.person?.name,
                                cmsCandidate?.municipality,
                                segments.ASSET_DECLARATIONS
                            )}
                        >
                            {t(labels.assetDeclarations.pageTitle)}
                        </Nav.Link>
                    )}
                </Nav>
            </div>

            <div className="mt-4">
                <Outlet context={{ cmsData, cmsCandidate, accountData }} />
            </div>
        </section>
    );
}

export default Candidate;
