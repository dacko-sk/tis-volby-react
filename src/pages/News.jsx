import { setTitle } from '../helpers/browser';
import { labels, t } from '../helpers/dictionary';
import { newsCategories } from '../helpers/wp';

import Title from '../components/structure/Title';
import CombinedNews from '../components/news/CombinedNews';

function News() {
    setTitle(t(labels.news.navTitle));

    return (
        <section>
            <Title>{t(labels.news.pageTitle)}</Title>
            <CombinedNews categories={newsCategories} />
        </section>
    );
}

export default News;
