import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';
import { categories } from '../../helpers/wp';
import { cmsSubsitesMap } from '../../hooks/CmsQueries';

import Title from '../../components/structure/Title';
import CombinedNews from '../../components/news/CombinedNews';

export const newsCategories = [categories.news26];

function News() {
    setTitle(t(labels.news.title));

    return (
        <section>
            <Title>{t(labels.news.title)}</Title>
            <CombinedNews
                election={cmsSubsitesMap.samosprava2026}
                categories={newsCategories}
            />
        </section>
    );
}

export default News;
