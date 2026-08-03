import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { setTitle } from '../helpers/browser';
import { labels, t } from '../helpers/dictionary';
import { routes, segments } from '../helpers/routes';
import { newsCategories } from '../helpers/wp';

import Title from '../components/structure/Title';
import Posts from '../components/wp/Posts';

function Search() {
    const params = useParams();
    const query = params.query ?? null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!query) {
            // redirect to root page if no query string is provided
            navigate(routes.home);
        }
    }, [query]);

    setTitle(`${t(labels.search.results)} „${query}“`);

    return (
        <section className="search-results">
            <Title secondary={`„${query}“`}>
                {t(labels.search.results)}
                <br />
            </Title>

            <h2 className="my-4">{t(labels.news.navTitle)}</h2>
            <Posts
                categories={newsCategories}
                noResults={t(labels.news.noData)}
                section={segments.NEWS}
                search={query}
            />
        </section>
    );
}

export default Search;
