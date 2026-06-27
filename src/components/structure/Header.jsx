import { NavLink, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


import { elections } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { getActiveSubsite, getCurrentLanguage, languages } from '../../helpers/languages';
import { localizePath, routes } from '../../helpers/routes';

import SiteSelector from './SiteSelector';
import DonateButton from '../general/DonateButton';
import SearchField from '../general/SearchField';

import logo from '../../../public/img/tis-logo-blue.png';

function Header() {
    const { pathname } = useLocation();
    const subsite = getActiveSubsite(pathname);

    const renderNavigationLinks = () => {
        if (subsite === 'samosprava2022') {
            return (
                <>
                    <SiteSelector site={elections.s22} />
                    <Nav.Link as={NavLink} to={routes.charts()}>
                        Grafy
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.news()}>
                        Aktuality
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.analyses()}>
                        Hodnotenia
                    </Nav.Link>
                </>
            );
        }

        if (subsite === 'samosprava2026') {
            return (
                <>
                    <SiteSelector site={elections.s26} />
                    <Nav.Link as={NavLink} to={routes.candidates()}>
                        {t(labels.candidates.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.parties()}>
                        {t(labels.parties.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.news()}>
                        {t(labels.news.navTitle)}
                    </Nav.Link>
                </>
            );
        }

        if (subsite === 'prezident2024') {
            return (
                <>
                    <SiteSelector site={elections.p24} />
                    <Nav.Link as={NavLink} to={routes.candidates()}>
                        {t(labels.candidates.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.online()}>
                        {t(labels.online.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.news()}>
                        {t(labels.news.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.analyses()}>
                        {t(labels.analyses.navTitle)}
                    </Nav.Link>
                </>
            );
        }

        if (subsite === 'euro2024') {
            return (
                <>
                    <SiteSelector site={elections.e24} />
                    <Nav.Link as={NavLink} to={routes.parties()}>
                        {t(labels.parties.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.online()}>
                        {t(labels.online.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.news()}>
                        {t(labels.news.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.analyses()}>
                        {t(labels.analyses.navTitle)}
                    </Nav.Link>
                </>
            );
        }

        if (subsite === 'parlament2023') {
            return (
                <>
                    <SiteSelector site={elections.n23} />
                    <Nav.Link as={NavLink} to={routes.parties()}>
                        {t(labels.parties.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.online()}>
                        {t(labels.online.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.news()}>
                        {t(labels.news.navTitle)}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={routes.analyses()}>
                        {t(labels.analyses.navTitle)}
                    </Nav.Link>
                </>
            );
        }

        // Landing / Default Page Navigation
        return (
            <>
                <SiteSelector />
                <NavDropdown
                    title={t(labels.funding.navTitle)}
                    className={
                        pathname.startsWith(routes.funding()) &&
                        ![routes.donations(), routes.donor()].some(
                            (excl) => pathname.startsWith(excl)
                        )
                            ? 'show'
                            : ''
                    }
                >
                    <NavDropdown.Item as={NavLink} to={routes.donations()}>
                        <span className="d-md-none">
                            {t(labels.donations.navTitleShort)}
                        </span>
                        <span className="d-none d-md-inline">
                            {t(labels.donations.navTitle)}
                        </span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={routes.government()}>
                        {t(labels.government.navTitle)}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={routes.accounts()}>
                        <span className="d-md-none">
                            {t(labels.accounts.navTitleShort)}
                        </span>
                        <span className="d-none d-md-inline">
                            {t(labels.accounts.navTitle)}
                        </span>
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={routes.assetDeclarations()}>
                        {t(labels.assetDeclarations.navTitle)}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={routes.charts()}>
                        {t(labels.charts.pageTitle)}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to={routes.fundingNews()}>
                        {t(labels.news.fundingTitle)}
                    </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={NavLink} to={routes.donations()}>
                    <span className="d-none d-lg-inline d-xl-none">
                        {t(labels.donations.navTitleShort)}
                    </span>
                    <span className="d-lg-none d-md-inline d-xl-inline">
                        {t(labels.donations.navTitle)}
                    </span>
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.parties()}>
                    {t(labels.parties.navTitle)}
                </Nav.Link>
                <Nav.Link as={NavLink} to={routes.news()}>
                    {t(labels.news.navTitle)}
                </Nav.Link>
            </>
        );
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container className={subsite ? 'z-1' : ''}>
                <Navbar.Brand as={NavLink} to="/">
                    <img src={logo} alt={t(labels.tis)} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-menu" />
                <Navbar.Collapse id="main-menu">
                    <Nav
                        defaultActiveKey={routes.home()}
                        variant="pills"
                        className="me-auto"
                    >
                        {renderNavigationLinks()}
                    </Nav>
                    <SearchField />
                    {/* Hide language menu for SK-only Samosprava 2022 subsite */}
                    {subsite !== 'samosprava2022' && (
                        <Nav variant="pills" className="me-2">
                            <NavDropdown
                                title={getCurrentLanguage()}
                                id="language-menu"
                                align="end"
                                className="text-uppercase"
                            >
                                {Object.keys(languages).map((lang) => (
                                    <NavDropdown.Item
                                        key={lang}
                                        as={NavLink}
                                        to={localizePath(lang)}
                                        end
                                    >
                                        {lang}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>
                    )}
                    <DonateButton xl />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
