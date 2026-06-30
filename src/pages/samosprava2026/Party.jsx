import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/browser';
import { routes, segments } from '../../helpers/routes';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import {
    findSubjectByPathname,
    getSubjectShortname,
    useElectionData,
} from '../../hooks/CmsQueries';

import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';

function Party() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { csvData } = useData();
    const { data: cmsData, isLoading } = useElectionData();

    const subject = findSubjectByPathname(cmsData, pathname);

    useEffect(() => {
        if (!isLoading && !subject) {
            navigate(routes.home());
        }
    }, [subject, isLoading, navigate]);

    if (isLoading || !subject) {
        return <Loading />;
    }

    const shortname = getSubjectShortname(subject);
    // parse aggregated data
    const accountData = subject
        ? csvData?.data?.find((row) => {
              return (
                  row[aggregatedKeys.name] === subject.name &&
                  row[aggregatedKeys.account] === subject.account
              );
          })
        : null;

    setTitle(subject?.name);

    return (
        <section className="party-page">
            <Title>{subject?.name}</Title>

            <div className="tabs-scrollable">
                <Nav variant="tabs">
                    <Nav.Link as={NavLink} to={routes.party(shortname)} end>
                        {t(labels.parties.overview)}
                    </Nav.Link>
                    <Nav.Link
                        as={NavLink}
                        to={routes.party(shortname, segments.NEWS)}
                    >
                        {t(labels.news.navTitle)}
                    </Nav.Link>
                </Nav>
            </div>

            <Outlet context={{ cmsData, accountData }} />
        </section>
    );
}

export default Party;
