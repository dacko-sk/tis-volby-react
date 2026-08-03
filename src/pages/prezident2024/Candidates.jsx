import Nav from 'react-bootstrap/Nav';
import { NavLink, Outlet } from 'react-router';

import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { routes, segments } from '../../helpers/routes';

import Title from '../../components/structure/Title';

function Candidates() {
    setTitle(t(labels.candidates.navTitle));

    return (
        <section>
            <Title>{t(labels.candidates.navTitle)}</Title>

            <div className="tabs-scrollable mb-4">
                <Nav variant="tabs">
                    <Nav.Link as={NavLink} to={routes.candidates()} end>
                        {t(labels.account.title)}
                    </Nav.Link>
                    <Nav.Link
                        as={NavLink}
                        to={routes.candidates(segments.REPORTS)}
                    >
                        {t(labels.finalReports)}
                    </Nav.Link>
                </Nav>
            </div>

            <Outlet />
        </section>
    );
}

export default Candidates;
