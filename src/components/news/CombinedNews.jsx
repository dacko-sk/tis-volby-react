import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../helpers/dictionary';
import { getCurrentLanguage } from '../../helpers/languages';
import { processArticles } from '../../helpers/wp';
import { processCmsArticles } from '../../helpers/news';

import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';
import PaginationWithGaps from '../general/PaginationWithGaps';

import ListItem from './templates/ListItem';
import NewsList from '../wp/templates/NewsList';

import '../wp/News.scss'; // Reuses general news styles (.articles, .article, .article-date)

function CombinedNews({
    election = null,
    categories = [],
    tags = [],
    party = null,
    person = null,
    search = '',
    noResults,
}) {
    const location = useLocation();
    const activePage = location.state?.page ?? 1;
    const lang = getCurrentLanguage();
    const B = 10; // Blocksize / items per page

    // 1. Fetch CMS news count
    const {
        data: cmsHeaderData,
        isLoading: isCmsHeaderLoading,
        error: cmsHeaderError,
    } = useQuery({
        queryKey: ['cms_news_count', lang, election, party, person, search],
        queryFn: async () => {
            const endpoint = lang === 'en' ? 'news-en' : 'news';
            const params = new URLSearchParams();
            params.append('page', '1');
            params.append('blocksize', '1');
            if (election) params.append('e', election);
            if (party) params.append('party', party.toString());
            if (person) params.append('person', person.toString());
            if (search) params.append('q', search);
            const url = `${process.env.DHC_TYPO3_API_DOMAIN}/elections/${endpoint}?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) {
                return { total: 0 };
            }
            return res.json();
        },
    });

    const totalCms = cmsHeaderData?.total || 0;

    // 2. Fetch WordPress news count
    const {
        data: wpHeaderData,
        isLoading: isWpHeaderLoading,
        error: wpHeaderError,
    } = useQuery({
        queryKey: ['wp_news_count', categories, tags, search],
        queryFn: async () => {
            const catParam = categories.length
                ? `&categories=${categories.join()}`
                : '';
            const tagParam = tags.length
                ? `&tags=${tags.join()}&tax_relation=AND`
                : '';
            const searchParam = search ? `&search=${search}` : '';
            const url = `https://cms.transparency.sk/wp-json/wp/v2/posts?per_page=1${catParam}${tagParam}${searchParam}`;
            const res = await fetch(url);
            if (!res.ok) {
                return { total: 0 };
            }
            const total = Number(res.headers.get('X-WP-Total')) || 0;
            return { total };
        },
    });

    const totalWp = wpHeaderData?.total || 0;

    // 3. Compute pagination splits
    const totalItems = totalCms + totalWp;
    const totalPages = Math.ceil(totalItems / B);

    const P = activePage;
    const P_cms_full = Math.floor(totalCms / B);
    const R_cms = totalCms % B;

    let P_cms_transition = P_cms_full;
    if (R_cms > 0) {
        P_cms_transition = P_cms_full + 1;
    }

    // Determine what to query for CMS on page P
    let cmsPage = 0;
    let cmsBlocksize = 0;
    if (totalCms > 0 && P <= P_cms_transition) {
        cmsPage = P;
        cmsBlocksize = B;
    }

    // Determine what to query for WP on page P
    let wpNeeded = 0;
    let wpOffset = 0;

    if (R_cms === 0) {
        if (P > P_cms_full) {
            wpNeeded = B;
            wpOffset = (P - P_cms_full - 1) * B;
        }
    } else {
        if (P === P_cms_transition) {
            wpNeeded = B - R_cms;
            wpOffset = 0;
        } else if (P > P_cms_transition) {
            wpNeeded = B;
            wpOffset = B - R_cms + (P - P_cms_transition - 1) * B;
        }
    }

    // 4. Fetch page-specific CMS items
    const {
        data: cmsPageData,
        isLoading: isCmsPageLoading,
        error: cmsPageError,
    } = useQuery({
        queryKey: [
            'cms_news_page',
            lang,
            election,
            cmsPage,
            cmsBlocksize,
            party,
            person,
            search,
        ],
        queryFn: async () => {
            const endpoint = lang === 'en' ? 'news-en' : 'news';
            const params = new URLSearchParams();
            params.append('page', cmsPage.toString());
            params.append('blocksize', cmsBlocksize.toString());
            if (election) params.append('e', election);
            if (party) params.append('party', party.toString());
            if (person) params.append('person', person.toString());
            if (search) params.append('q', search);
            const url = `${process.env.DHC_TYPO3_API_DOMAIN}/elections/${endpoint}?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) {
                return { news: [] };
            }
            return res.json();
        },
        enabled: cmsBlocksize > 0,
        select: (resData) => {
            if (resData?.news) {
                return {
                    ...resData,
                    news: processCmsArticles(resData.news, 200),
                };
            }
            return resData;
        },
    });

    // 5. Fetch page-specific WP items
    const {
        data: wpPageData,
        isLoading: isWpPageLoading,
        error: wpPageError,
    } = useQuery({
        queryKey: [
            'wp_news_page',
            categories,
            wpNeeded,
            wpOffset,
            tags,
            search,
        ],
        queryFn: async () => {
            const catParam = categories.length
                ? `&categories=${categories.join()}`
                : '';
            const tagParam = tags.length
                ? `&tags=${tags.join()}&tax_relation=AND`
                : '';
            const searchParam = search ? `&search=${search}` : '';
            const url = `https://cms.transparency.sk/wp-json/wp/v2/posts?per_page=${wpNeeded}&offset=${wpOffset}${catParam}${tagParam}${searchParam}`;
            const res = await fetch(url);
            if (!res.ok) {
                return [];
            }
            return res.json();
        },
        enabled: wpNeeded > 0,
    });

    const isLoading =
        isCmsHeaderLoading ||
        isWpHeaderLoading ||
        (cmsBlocksize > 0 && isCmsPageLoading) ||
        (wpNeeded > 0 && isWpPageLoading);

    const error =
        cmsHeaderError ||
        wpHeaderError ||
        (cmsBlocksize > 0 && cmsPageError) ||
        (wpNeeded > 0 && wpPageError);

    let content = null;

    if (isLoading || error) {
        content = <Loading error={error} />;
    } else {
        const cmsItems = cmsBlocksize > 0 ? cmsPageData?.news || [] : [];
        const wpItems = wpNeeded > 0 ? processArticles(wpPageData || []) : [];

        const cmsArticles = cmsItems.map((article) => {
            return <ListItem key={article.uid} article={article} />;
        });

        const wpArticles = wpItems.map((article) => (
            <NewsList key={article.slug} article={article} />
        ));

        const allArticles = [...cmsArticles, ...wpArticles];

        content = allArticles.length ? (
            <Row className="articles list">{allArticles}</Row>
        ) : (
            <AlertWithIcon className="my-4" variant="danger">
                {noResults ?? t(labels.news.noData)}
            </AlertWithIcon>
        );
    }

    let nav = null;
    if (!isLoading && totalPages > 1) {
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

export default CombinedNews;
