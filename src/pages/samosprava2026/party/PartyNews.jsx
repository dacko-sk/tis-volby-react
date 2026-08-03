import { useLocation, useOutletContext } from 'react-router';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { wpCat } from '../../../helpers/wp';
import {
    findSubjectByPathname,
    cmsSubsitesMap,
} from '../../../hooks/CmsQueries';

import AlertWithIcon from '../../../components/general/AlertWithIcon';
import CombinedNews from '../../../components/news/CombinedNews';

function PartyNews() {
    const { pathname } = useLocation();
    const { cmsData } = useOutletContext();

    const cmsSubject = findSubjectByPathname(cmsData, pathname);

    const content =
        cmsSubject?.primaryParty?.wpTag || cmsSubject?.primaryParty?.uid ? (
            <CombinedNews
                election={cmsSubsitesMap.samosprava2026}
                categories={[wpCat.news]}
                tags={[cmsSubject?.primaryParty?.wpTag ?? 'dummy-tag']}
                party={cmsSubject?.primaryParty?.uid}
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
