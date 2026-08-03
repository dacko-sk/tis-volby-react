import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { setTitle } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';
import AnalysisDetail from '../../components/wp/templates/AnalysisDetail';
import NewsDetail from '../../components/wp/templates/NewsDetail';

function Article() {
    const params = useParams();
    const slug = params?.slug ?? null;
    const navigate = useNavigate();

    // try to set article data object from location.state
    const location = useLocation();
    const isAnalysis = location.pathname.startsWith(routes.analyses);
    let article = location.state?.article ?? {};

    // load article data from API (if needed)
    const { isLoading, error, data } = useQuery({
        queryKey: [`article_${slug}`],
        queryFn: () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?slug=${slug}`
            ).then((response) => response.json()),
        enabled: article?.title === undefined,
    });

    if (!isLoading && !error && data && data.length) {
        // article successfully loaded from API - show it!
        article = {
            ...article,
            ...data[0],
        };
    }

    // this has to be wrapped in useEffect, otherwise react is bitching about rendering router before unfinished rendering of article :-D
    useEffect(() => {
        if (!isLoading && !error && data && !data.length) {
            // redirect to parent page (all articles) in case article does not exist in API
            navigate(location.pathname.replace(`/${slug}`, ''));
        }
    }, [isLoading, error, data, navigate, location.pathname, slug]);

    if (article?.title === undefined || error) {
        // waiting for data or error in loding
        return <Loading error={error} />;
    }

    const template = isAnalysis ? (
        <AnalysisDetail article={article} />
    ) : (
        <NewsDetail article={article} />
    );

    setTitle(article.title.rendered);

    return (
        <section className="article-detail">
            <Title secondary={isAnalysis ? 'hodnotenie kampane' : null}>
                {article.title.rendered}
                {isAnalysis && <br />}
            </Title>
            {template}
        </section>
    );
}

export default Article;
