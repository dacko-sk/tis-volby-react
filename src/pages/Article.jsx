import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { setTitle } from '../helpers/browser';
import { getCurrentLanguage } from '../helpers/languages';
import { processArticles } from '../helpers/wp';

import Loading from '../components/general/Loading';
import Title from '../components/structure/Title';
import NewsDetail from '../components/wp/templates/NewsDetail';
import DetailItem from '../components/news/templates/DetailItem';

function Article() {
    const params = useParams();
    const slug = params.slug ?? null;
    const navigate = useNavigate();
    const location = useLocation();
    const lang = getCurrentLanguage();

    // try to set article data object from location.state
    const article =
        location.state && (location.state.article ?? false)
            ? location.state.article
            : {};

    const isCmsFromState = !!(article.bodytext || article.uid);
    const isWpFromState = !!(
        article.title?.rendered || article.content?.rendered
    );
    const hasArticleFromState = isCmsFromState || isWpFromState;

    // 1. Try to fetch from TYPO3 CMS
    const {
        isLoading: isCmsLoading,
        error: cmsError,
        data: cmsData,
    } = useQuery({
        queryKey: [`cms_article_${slug}`, lang],
        queryFn: async () => {
            const endpoint = lang === 'en' ? 'news-en' : 'news';
            const url = `${process.env.DHC_TYPO3_API_DOMAIN}/elections/${endpoint}/${slug}`;
            const response = await fetch(url);
            if (!response.ok) {
                return null;
            }
            return response.json();
        },
        enabled: !hasArticleFromState,
        retry: false,
    });

    const cmsArticleLoaded =
        !hasArticleFromState &&
        !isCmsLoading &&
        !cmsError &&
        cmsData &&
        (cmsData.title ?? false);

    // 2. Try to fetch from WordPress if CMS fetch completed without an article
    const {
        isLoading: isWpLoading,
        error: wpError,
        data: wpData,
    } = useQuery({
        queryKey: [`article_${slug}`],
        queryFn: () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?slug=${slug}`
            ).then((response) => {
                if (!response.ok) return null;
                return response.json();
            }),
        enabled: !hasArticleFromState && !isCmsLoading && !cmsArticleLoaded,
    });

    let finalArticle = null;
    let isCms = false;

    if (isCmsFromState) {
        finalArticle = article;
        isCms = true;
    } else if (isWpFromState) {
        finalArticle = article;
        isCms = false;
    } else if (cmsArticleLoaded) {
        finalArticle = cmsData;
        isCms = true;
    } else if (!isWpLoading && !wpError && wpData && wpData.length) {
        finalArticle = processArticles(wpData)[0];
        isCms = false;
    }

    const isLoaderActive =
        !hasArticleFromState &&
        (isCmsLoading || (!cmsArticleLoaded && isWpLoading));

    // Redirect if loading is finished, and no article could be found in either source
    useEffect(() => {
        const noArticleFound =
            !hasArticleFromState &&
            !isCmsLoading &&
            !cmsArticleLoaded &&
            !isWpLoading &&
            !(wpData && wpData.length);

        if (noArticleFound) {
            navigate(location.pathname.replace(`/${slug}`, ''));
        }
    }, [
        hasArticleFromState,
        isCmsLoading,
        cmsArticleLoaded,
        isWpLoading,
        wpData,
        navigate,
        location.pathname,
        slug,
    ]);

    if (isLoaderActive || !finalArticle || !(finalArticle.title ?? false)) {
        return <Loading error={cmsError || wpError} />;
    }

    const titleText =
        typeof finalArticle.title === 'object'
            ? finalArticle.title.rendered
            : finalArticle.title;

    setTitle(titleText);

    return (
        <section className="article-detail">
            <Title>{titleText}</Title>
            {isCms ? (
                <DetailItem article={finalArticle} />
            ) : (
                <NewsDetail article={finalArticle} />
            )}
        </section>
    );
}

export default Article;
