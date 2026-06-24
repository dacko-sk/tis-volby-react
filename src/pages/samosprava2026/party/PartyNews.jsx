import { useLocation, useOutletContext } from 'react-router-dom';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { wpCat } from '../../../helpers/wp';

import { findSubjectByPathname } from '../../../hooks/CmsQueries';

import AlertWithIcon from '../../../components/general/AlertWithIcon';
import Posts, { templates } from '../../../components/wp/Posts';

function PartyNews() {
    const { pathname } = useLocation();
    const { cmsData } = useOutletContext();

    const cmsSubject = findSubjectByPathname(cmsData, pathname);

    const content = cmsSubject?.primaryParty?.wpTag ? (
        <Posts
            categories={[wpCat.news]}
            tags={[cmsSubject?.primaryParty?.wpTag]}
            template={templates.list}
        />
    ) : (
        <AlertWithIcon className="my-4" variant="danger">
            {t(labels.news.noData)}
        </AlertWithIcon>
    );

    setTitle(`${cmsSubject?.name} : ${t(labels.news.pageTitle)}`);

    return <div className="subpage">{content}</div>;
}

export default PartyNews;
