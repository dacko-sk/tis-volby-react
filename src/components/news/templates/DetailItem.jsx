import { dateTimeFormat } from '../../../helpers/helpers';
import { parseCmsHtml } from '../../../helpers/news';

import PartyTags from '../PartyTags';

function DetailItem({ article }) {
    if (!article) return null;

    return (
        <div className="article-body">
            <div className="d-md-flex align-items-center">
                <div className="article-date my-4 me-auto">
                    {dateTimeFormat(article.date)}
                </div>
                {article.relations && (
                    <PartyTags
                        asLink
                        className="article-tags my-4"
                        relations={article.relations}
                    />
                )}
            </div>
            {parseCmsHtml(article.bodytext)}
            {article.author && (
                <p className="text-end mt-3">{article.author}</p>
            )}
        </div>
    );
}

export default DetailItem;
