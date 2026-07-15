import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { setTitle } from '../helpers/browser';
import { labels, t } from '../helpers/dictionary';

import QuickSearch from '../components/datatables/QuickSearch';
import Top10Donors from '../components/donors/Top10Donors';
import PartiesFundingChart from '../components/charts/PartiesFundingChart';
import SiteNavigator from '../components/structure/SiteNavigator';
import Title from '../components/structure/Title';
import BannerNews from '../components/wp/BannerNews';
import CmsNews, { templates } from '../components/news/CmsNews';

function Home() {
    setTitle(t(labels.home.pageTitle));

    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('redirectedTo2026')) {
            sessionStorage.setItem('redirectedTo2026', 'true');
            // Redirect if we are still within the 2026 election period (e.g. before Nov 1, 2026)
            if (new Date() < new Date('2026-11-01T00:00:00')) {
                navigate('/samosprava2026', { replace: true });
            }
        }
    }, [navigate]);

    return (
        <section>
            <Title secondaryWords={2} uppercase>
                {t(labels.home.pageTitle)}
            </Title>

            <div id="search-container">
                <SiteNavigator />
                <QuickSearch />
            </div>

            <BannerNews />

            <h2 className="mt-4 text-center">{t(labels.news.latest)}</h2>
            <CmsNews limit={2} template={templates.featured} election={null} />

            <PartiesFundingChart
                className="mt-4"
                limit={10}
                title={t(labels.funding.partiesTotal, [10])}
            />

            <Top10Donors
                className="mt-4"
                // https://volby.transparency.sk/api/donors/donors.php?c=0&b=10
                file="top10individual"
                title={labels.donations.top10sponsors}
                disclaimer={labels.donations.disclaimer}
            />

            <Top10Donors
                className="mt-4"
                // https://volby.transparency.sk/api/donors/donors.php?c=0&b=10&t=1-2-3-4
                file="top10donors"
                title={labels.donations.top10donors}
                disclaimer={labels.donations.disclaimerNoCredits}
            />
        </section>
    );
}

export default Home;
