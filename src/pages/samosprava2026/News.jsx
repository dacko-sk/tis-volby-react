import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';
import { segments } from '../../helpers/routes';
import { categories } from '../../helpers/wp';

import Title from '../../components/structure/Title';
import Posts from '../../components/wp/Posts';

export const newsCategories = [categories.news26];

function News() {
    setTitle(t(labels.news.title));

    return (
        <section>
            <Title>{t(labels.news.title)}</Title>
            <Posts categories={newsCategories} section={segments.NEWS} />
        </section>
    );
}

export default News;
