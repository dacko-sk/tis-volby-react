import { useOutletContext } from 'react-router';

import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { partyFullName, partyWpTag } from '../../helpers/parties';
import { newsCategories } from '../../helpers/wp';

import AlertWithIcon from '../../components/general/AlertWithIcon';
import Posts, { templates } from '../../components/wp/Posts';

function PartyNews() {
    const partyName = useOutletContext();
    const wpTag = partyWpTag(partyName);

    const content = wpTag ? (
        <Posts
            categories={newsCategories}
            tags={[wpTag]}
            template={templates.list}
        />
    ) : (
        <AlertWithIcon className="my-4" variant="danger">
            {t(labels.news.noData)}
        </AlertWithIcon>
    );

    setTitle(`${partyFullName(partyName)} : ${t(labels.news.pageTitle)}`);

    return <div className="subpage">{content}</div>;
}

export default PartyNews;
