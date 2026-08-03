import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import { scrollToTop } from './helpers/browser';
import { labels, t } from './helpers/dictionary';
import { getActiveSubsite } from './helpers/languages';

import useGovData from './hooks/GovData';

import Header from './components/structure/Header';
import Footer from './components/structure/Footer';
import DonateBanner from './components/general/DonateBanner';
// import DonateModal from './components/general/DonateModal';

function Layout() {
    const { pathname } = useLocation();
    const { loadAllElections } = useGovData();

    // load gov. funding data on first load
    useEffect(() => {
        loadAllElections();
    }, []);

    // send pageview to analytics on route change
    useEffect(() => {
        if (!window.location.href.includes('localhost')) {
            window.dataLayer.push({
                event: 'pageview',
                page: {
                    path: pathname,
                    title: document.title,
                },
            });
        }
    }, [pathname]);

    // scroll to top when route changes
    useEffect(() => {
        scrollToTop();
    }, [pathname]);

    const activeSubsite = getActiveSubsite(pathname);
    let subsiteClass = 'subsite-landing';
    if (activeSubsite === 'euro2024') subsiteClass = 'subsite-euro-24';
    else if (activeSubsite === 'prezident2024') subsiteClass = 'subsite-prezident-24';
    else if (activeSubsite === 'parlament2023') subsiteClass = 'subsite-23';
    else if (activeSubsite === 'samosprava2022') subsiteClass = 'subsite-22';
    else if (activeSubsite === 'samosprava2026') subsiteClass = 'subsite-26';

    return (
        <div className={`layout-default ${subsiteClass}`}>
            <Header />

            <main className="container mb-4">
                <ErrorBoundary
                    fallback={
                        <div className="mt-4">
                            {t(labels.errors.processing)}
                        </div>
                    }
                >
                    <Outlet />
                </ErrorBoundary>
            </main>

            <DonateBanner />

            <Footer />
            {/* <DonateModal /> */}
        </div>
    );
}

export default Layout;
