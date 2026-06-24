import { useEffect } from 'react';
import {
    NavLink,
    Link,
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/browser';
import { routes, segments } from '../../helpers/routes';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import {
    findSubjectByPathname,
    findSubjectSupportedCandidates,
    useElectionData,
} from '../../hooks/CmsQueries';

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

    setTitle(cmsSubject?.name);

    return (
        <section className="party-page">
            <Title>{cmsSubject?.name}</Title>

            <div className="tabs-scrollable">
                <Nav variant="tabs">
                    <Nav.Link
                        as={NavLink}
                        to={routes.party(cmsSubject?.name)}
                        end
                    >
                        {t(labels.parties.overview)}
                    </Nav.Link>
                    <Nav.Link
                        as={NavLink}
                        to={routes.party(cmsSubject?.name, segments.NEWS)}
                    >
                        {t(labels.news.navTitle)}
                    </Nav.Link>
                </Nav>
            </div>

            <Outlet
                context={{ cmsData, accountData }}
            />
        </section>
    );
}

export default Party;
