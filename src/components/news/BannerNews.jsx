import { useQuery } from '@tanstack/react-query';

import { getCurrentLanguage } from '../../helpers/languages';
import { processCmsArticles } from '../../helpers/news';

import BannerItem from './templates/BannerItem';

function BannerNews() {
    const lang = getCurrentLanguage();

    const { isLoading, error, data } = useQuery({
        queryKey: ['cms_banner_news', lang],
        queryFn: async () => {
            const endpoint = lang === 'en' ? 'news-en' : 'news';
            const params = new URLSearchParams();
            params.append('display', '2');
            params.append('page', '1');
            params.append('blocksize', '10');
            const url = `${process.env.DHC_TYPO3_API_DOMAIN}/elections/${endpoint}?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        },
        select: (resData) => processCmsArticles(resData?.news, 300),
    });

    if (isLoading || error || !data?.length) {
        return null;
    }

    const articles = data.map((article) => (
        <BannerItem key={article.uid} article={article} />
    ));

    return <div className="news-banners">{articles}</div>;
}

export default BannerNews;
