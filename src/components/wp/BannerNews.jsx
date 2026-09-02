import { useQuery } from '@tanstack/react-query';

import { categories, processArticles } from '../../helpers/wp';

import BannerItem from './templates/BannerItem';
import { getCurrentLanguage, languages } from '../../helpers/languages';

function BannerNews() {
    const bannerCat =
        getCurrentLanguage() === languages.sk
            ? categories.bannerNews
            : categories.bannerNewsEn;
    const { isLoading, error, data } = useQuery({
        queryKey: [`banner_news_${bannerCat}`],
        queryFn: () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?per_page=10&page=1&categories=${bannerCat}`
            ).then((response) => response.json()),
    });

    const articles = processArticles(data ?? []).map((article) => (
        <BannerItem key={article.slug} article={article} />
    ));

    if (isLoading || error || !articles.length) {
        return null;
    }

    return <div className="news-banners">{articles}</div>;
}

export default BannerNews;
