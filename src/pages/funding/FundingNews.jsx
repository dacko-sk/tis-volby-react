import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { categories } from '../../helpers/wp';

import Title from '../../components/structure/Title';
import CombinedNews from '../../components/news/CombinedNews';

export const fundingNewsCategories = [categories.funding];

function FundingNews() {
    setTitle(t(labels.news.fundingTitle));

    return (
        <section>
            <Title>{t(labels.news.fundingTitle)}</Title>
            <CombinedNews display={1} categories={fundingNewsCategories} />
        </section>
    );
}

export default FundingNews;
