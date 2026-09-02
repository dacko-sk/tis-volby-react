import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../helpers/dictionary';
import { getActiveSubsite } from '../../helpers/languages';
import { routes, segments } from '../../helpers/routes';
import { getAnalysedData, processArticles, wpCat } from '../../helpers/wp';

import AnalysisFeatured from './templates/AnalysisFeatured';
import AnalysisList from './templates/AnalysisList';
import NewsCondensed from './templates/NewsCondensed';
import NewsList from './templates/NewsList';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';
import PaginationWithGaps from '../general/PaginationWithGaps';

import './News.scss';

export const templates = {
    condensed: 'condensed',
    featured: 'featured',
    list: 'list',
};

function Posts({
    categories = [],
    categoriesExclude = [],
    limit = false,
    noResults,
    search = '',
    section = null,
    showMore = null,
    showMoreRoute = null,
    tags = [],
    template = templates.list,
}) {
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const activePage = location.state?.page ?? 1;

    const subsite = getActiveSubsite();
    const isAnalysis =
        section === segments.ANALYSES ||
        categories.includes(wpCat.analyses) ||
        categories.includes(wpCat.featured);

    const blocksize = limit || (isAnalysis ? 40 : 10);
    const catParam = categories.length
        ? `&categories=${categories.join()}`
        : '';
    const catExParam = categoriesExclude.length
        ? `&categories_exclude=${categoriesExclude.join()}`
        : '';
    const tagParam = tags.length ? `&tags=${tags.join()}&tax_relation=AND` : '';
    const searchParam = search ? `&search=${search}` : '';

    const { isLoading, error, data } = useQuery({
        queryKey: [
            `all_posts_${catParam}_${tagParam}_${search}_${blocksize}_${activePage}`,
        ],
        queryFn: () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?per_page=${blocksize}&page=${activePage}${catParam}${catExParam}${tagParam}${searchParam}`
            ).then((response) => {
                if (response.headers) {
                    const wptp = Number(
                        response.headers.get('X-WP-TotalPages')
                    );
                    setTotalPages(wptp);
                }
                // must return promise
                return response.json();
            }),
    });

    const getClickHandler = (article) => () => {
        if (subsite === 'samosprava2022') {
            navigate(`/samosprava2022/hodnotenia/${article.slug}`, {
                state: { article },
            });
        }
    };

    const getKeyUpHandler = (article) => (event) => {
        if (event.key === 'Enter') {
            if (subsite === 'samosprava2022') {
                navigate(`/samosprava2022/hodnotenia/${article.slug}`, {
                    state: { article },
                });
            }
        }
    };

    const articles = [];
    let content = null;

    if (isLoading || error) {
        content = <Loading error={error} />;
    } else {
        if (isAnalysis) {
            getAnalysedData(data).forEach((article) => {
                articles.push(
                    template === templates.featured ? (
                        <AnalysisFeatured
                            key={article.slug}
                            article={article}
                            clickHandler={getClickHandler(article)}
                            keyUpHandler={getKeyUpHandler(article)}
                        />
                    ) : (
                        <AnalysisList
                            key={article.slug}
                            article={article}
                            clickHandler={getClickHandler(article)}
                            keyUpHandler={getKeyUpHandler(article)}
                        />
                    )
                );
            });
        } else {
            processArticles(data).forEach((article) => {
                articles.push(
                    template === templates.condensed ? (
                        <NewsCondensed key={article.slug} article={article} />
                    ) : (
                        <NewsList key={article.slug} article={article} />
                    )
                );
            });
        }

        content = articles.length ? (
            <Row
                className={`articles ${template}${
                    template === templates.featured ? ' gy-4' : (template === templates.condensed ? ' my-3' : '')
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

    const titleText = subsite === 'samosprava2022'
        ? `Top ${articles.length} kampaní`
        : t(labels.analyses.top, [articles.length]);

    const title =
        template === templates.featured && articles.length ? (
            <h2 className={subsite === 'samosprava2022' ? 'mb-3' : 'my-4'}>
                {titleText}
            </h2>
        ) : null;

    let nav = null;
    if (showMore || showMoreRoute || limit) {
        nav = (
            <div className="buttons mt-3 text-center">
                <Button
                    as={Link}
                    to={showMoreRoute ?? routes.news()}
                    variant="secondary"
                >
                    {showMore || t(labels.showMore)}
                </Button>
            </div>
        );
    } else if (totalPages > 1 && template !== templates.featured) {
        nav = (
            <PaginationWithGaps
                className="justify-content-center mt-4"
                activePage={activePage}
                pageRouteCallback={(page) => ({
                    pathname: location.pathname,
                    // navigate to the same page, just pass the current page via state object to preserve history
                    state: { page },
                })}
                totalPages={totalPages}
                scrollTop
            />
        );
    }

    return (
        <div>
            {title}
            {content}
            {nav}
        </div>
    );
}

export default Posts;
