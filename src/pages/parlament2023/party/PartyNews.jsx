import { useOutletContext } from 'react-router';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { wpCat } from '../../../helpers/wp';

import AlertWithIcon from '../../../components/general/AlertWithIcon';
import Posts, { templates } from '../../../components/wp/Posts';

function PartyNews() {
    const party = useOutletContext();
    const wpTag = party.wp ?? party.tag ?? false;

    const content =
        wpTag ? (
            <Posts
                categories={[wpCat.news]}
                tags={[wpTag]}
                template={templates.list}
            />
        ) : (
            <AlertWithIcon className="my-4" variant="danger">
                {t(labels.news.noData)}
            </AlertWithIcon>
        );

    setTitle(`${party.fullName} : Aktuality`);

    return <div className="subpage">{content}</div>;
}

export default PartyNews;
