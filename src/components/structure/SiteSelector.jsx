import { NavLink } from 'react-router';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { elections as el, links } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { languageRoot, routes } from '../../helpers/routes';

// List of elections hosted inside this single react app
const localElections = [el.s26, el.s22, el.n23, el.e24, el.p24];

function SiteSelector({ site }) {
    const isLocalElection = (key) => localElections.includes(key);

    return (
        <NavDropdown
            title={t(labels.home.navTitle)}
            id="elections-menu"
            className={
                languageRoot() === document.location.pathname ? 'show' : ''
            }
        >
            {site ? (
                <NavDropdown.Item as={NavLink} to="/">
                    {t(labels.root)}
                </NavDropdown.Item>
            ) : (
                <NavDropdown.Item as={NavLink} to={routes.home()}>
                    {t(labels.root)}
                </NavDropdown.Item>
            )}
            {Object.keys(el)
                .filter((e) => links[e] !== undefined)
                .map((e) => {
                    const labelText = t(labels.elections[e]);
                    if (site === e) {
                        return (
                            <NavDropdown.Item
                                key={e}
                                as={NavLink}
                                to={routes.home()}
                            >
                                {labelText}
                            </NavDropdown.Item>
                        );
                    }
                    if (isLocalElection(e)) {
                        return (
                            <NavDropdown.Item
                                key={e}
                                as={NavLink}
                                to={links[e]}
                            >
                                {labelText}
                            </NavDropdown.Item>
                        );
                    }
                    return (
                        <NavDropdown.Item key={e} href={links[e]}>
                            {labelText}
                        </NavDropdown.Item>
                    );
                })}
        </NavDropdown>
    );
}

export default SiteSelector;
