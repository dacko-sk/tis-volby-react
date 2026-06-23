import { dateFormat } from '../../../helpers/helpers';
import { parseWpHtml } from '../../../helpers/wp';

import PartyTags from '../PartyTags';

function NewsDetail({ article }) {
    return (
        <div className="article-body">
            <div className="d-md-flex">
                <div className="article-date my-4 me-auto">
                    {dateFormat(article.date)}
                </div>
                <PartyTags
                    asLink
                    className="article-tags my-4"
                    tags={article.tags}
                />
            </div>
            {parseWpHtml(article.content.rendered)}
        </div>
    );
}

export default NewsDetail;
