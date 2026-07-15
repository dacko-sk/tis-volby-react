import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../helpers/dictionary';
import { getCurrentLanguage } from '../../helpers/languages';
import { processCmsArticles } from '../../helpers/news';
import { routes } from '../../helpers/routes';

import { cmsSubsitesMap } from '../../hooks/CmsQueries';

import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';
import PaginationWithGaps from '../general/PaginationWithGaps';

import ListItem from './templates/ListItem';
import FeaturedItem from './templates/FeaturedItem';

import '../wp/News.scss'; // Reuses general news styles (.articles, .article, .article-date)

export const templates = {
    featured: 'condensed',
    list: 'list',
};

function CmsNews({
    limit = false,
    noResults,
    search = '',
    showMore = null,
    showMoreRoute = null,
    party = null,
    person = null,
    election = cmsSubsitesMap.samosprava2026, // Default for 2026 municipal
    template = templates.list,
}) {
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const activePage = location.state?.page ?? 1;

    const blocksize = limit || 10;
    const lang = getCurrentLanguage();

    const queryKey = [
        'cms_news_list',
        lang,
        election,
        party,
        person,
        search,
        blocksize,
        activePage,
    ];

    const { isLoading, error, data } = useQuery({
        queryKey,
        queryFn: async () => {
            const endpoint = lang === 'en' ? 'news-en' : 'news';

            const params = new URLSearchParams();
            params.append('page', activePage.toString());
            params.append('blocksize', blocksize.toString());
            if (election) params.append('e', election);
            if (party) params.append('party', party.toString());
            if (person) params.append('person', person.toString());
            if (search) params.append('q', search);

            const url = `${process.env.DHC_TYPO3_API_DOMAIN}/elections/${endpoint}?${params.toString()}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const resData = await response.json();

            // Calculate total pages
            const total = resData.total || 0;
            const computedTotalPages = Math.ceil(total / blocksize);
            setTotalPages(computedTotalPages);

            return resData;
        },
        select: (resData) => {
            if (resData?.news) {
                return {
                    ...resData,
                    news: processCmsArticles(
                        resData.news,
                        template === templates.featured ? 300 : 200
                    ),
                };
            }
            return resData;
        },
    });

    let content = null;

    if (isLoading || error) {
        content = <Loading error={error} />;
    } else {
        const articles = (data?.news || []).map((article) => {
            return template === templates.featured ? (
                <FeaturedItem key={article.uid} article={article} />
            ) : (
                <ListItem key={article.uid} article={article} />
            );
        });

        content = articles.length ? (
            <Row
                className={`articles ${template}${
                    template === templates.featured ? ' my-3' : ''
                }`}
            >
                {articles}
            </Row>
        ) : (
            <AlertWithIcon className="my-4" variant="danger">
                {noResults ?? t(labels.news.noData)}
            </AlertWithIcon>
        );
    }

    let nav = null;
    if (showMore || showMoreRoute || limit) {
        nav = (
            <div className="buttons mt-3 text-center">
                <Button
                    as={Link}
                    to={showMoreRoute ?? routes.news(lang)}
                    variant="secondary"
                >
                    {showMore || t(labels.showMore)}
                </Button>
            </div>
        );
    } else if (totalPages > 1) {
        nav = (
            <PaginationWithGaps
                className="justify-content-center mt-4"
                activePage={activePage}
                pageRouteCallback={(page) => ({
                    pathname: location.pathname,
                    state: { page },
                })}
                totalPages={totalPages}
                scrollTop
            />
        );
    }

    return (
        <div>
            {content}
            {nav}
        </div>
    );
}

export default CmsNews;
