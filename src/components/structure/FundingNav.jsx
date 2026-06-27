import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';


import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

function FundingNav() {
    return (
        <div className="tabs-scrollable mb-4">
            <Nav variant="tabs">
                <Nav.Link as={NavLink} to={routes.donations()}>
                    <span className="d-md-none">
                        {t(labels.donations.navTitleShort)}
                    </span>
                    <span className="d-none d-md-inline">
                        {t(labels.donations.navTitle)}
                    </span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.government()}>
                    <span className="d-md-none">
                        {t(labels.government.navTitleShort)}
                    </span>
                    <span className="d-none d-md-inline">
                        {t(labels.government.navTitle)}
                    </span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.accounts()}>
                    <span className="d-md-none">
                        {t(labels.accounts.navTitleShort)}
                    </span>
                    <span className="d-none d-md-inline">
                        {t(labels.accounts.navTitle)}
                    </span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.assetDeclarations()}>
                    {t(labels.assetDeclarations.navTitle)}
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.charts()}>
                    <span className="d-md-none">
                        {t(labels.charts.navTitle)}
                    </span>
                    <span className="d-none d-md-inline">
                        {t(labels.charts.pageTitle)}
                    </span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.fundingNews()}>
                    {t(labels.news.navTitle)}
                </Nav.Link>
            </Nav>
        </div>
    );
}

export default FundingNav;
