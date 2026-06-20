import { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';

import {
    parties,
    partyAlias,
    partyImage,
    partySvg,
} from '../../helpers/parties';
import { labels, t } from '../../helpers/dictionary';
import { decodeSlug, routes, segments } from '../../helpers/routes';

import useData, { legacyAggregatedKeys } from '../../hooks/AccountsData';

import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';

function Party() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse aggregated data
    let party = null;
    let accountKey = decodeSlug(slug);
    if (csvData.data ?? false) {
        // find CSV account key if slug is not identical as config key
        if (!(parties[accountKey] ?? false)) {
            Object.entries(parties).some(([partyKey, partyProps]) => {
                if (
                    (partyProps.slug ?? false) &&
                    accountKey === partyProps.slug
                ) {
                    accountKey = partyKey;
                    return true;
                }
                return false;
            });
        }
        // find aggregated data for the account
        csvData.data.some((row) => {
            if (
                accountKey === row[legacyAggregatedKeys.name] ||
                accountKey === partyAlias(row[legacyAggregatedKeys.name]) ||
                (row.slug &&
                    accountKey.toLowerCase() === row.slug.toLowerCase()) ||
                accountKey.toLowerCase() ===
                    row[legacyAggregatedKeys.name].toLowerCase()
            ) {
                party = row;
                return true;
            }
            return false;
        });
    }

    useEffect(() => {
        if (!party && (csvData.data ?? false)) {
            // redirect to home page in case party does not have transparent account
            navigate(routes.home());
        }
    }, [party, csvData, navigate]);

    if (!party || !(csvData.data ?? false)) {
        return <Loading />;
    }

    const logoComponent = partySvg(party.name) ?? partyImage(party.name);

    return (
        <section className="party-page">
            <Title>
                {logoComponent && (
                    <div className="logo mb-2 mx-auto">
                        <div className="img-aspect">
                            <figure>{logoComponent}</figure>
                        </div>
                    </div>
                )}
                {party.fullName}
            </Title>
            <div className="tabs-scrollable">
                <Nav variant="tabs">
                    <Nav.Link as={NavLink} to={routes.party(party.slug)} end>
                        {t(labels.party.overview)}
                    </Nav.Link>
                    <Nav.Link
                        as={NavLink}
                        to={routes.party(party.slug, segments.TRANSACTIONS)}
                    >
                        {t(labels.party.funding)}
                    </Nav.Link>
                    {(party.wp ?? party.tag ?? false) && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.party(party.slug, segments.ANALYSIS)}
                        >
                            {t(labels.analysis.navTitle)}
                        </Nav.Link>
                    )}
                    <Nav.Link
                        as={NavLink}
                        to={routes.party(party.slug, segments.ONLINE)}
                    >
                        {t(labels.online.navTitle)}
                    </Nav.Link>
                    {(party.wp ?? party.tag ?? false) && (
                        <Nav.Link
                            as={NavLink}
                            to={routes.party(party.slug, segments.NEWS)}
                        >
                            {t(labels.news.navTitle)}
                        </Nav.Link>
                    )}
                </Nav>
            </div>

            <Outlet context={party} />
        </section>
    );
}

export default Party;
