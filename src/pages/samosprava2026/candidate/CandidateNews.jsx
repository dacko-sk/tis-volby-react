import { useOutletContext } from 'react-router-dom';

import { labels, t } from '../../../helpers/dictionary';
import { cmsSubsitesMap } from '../../../hooks/CmsQueries';

import CombinedNews from '../../../components/news/CombinedNews';
import { newsCategories } from '../News';

function CandidateNews() {
    const { cmsCandidate } = useOutletContext();
    const wpTag = cmsCandidate?.person?.wpTag;

    if (!wpTag) return null;

    return (
        <div className="candidate-news mt-4">
            <CombinedNews
                election={cmsSubsitesMap.samosprava2026}
                categories={newsCategories}
                noResults={t(labels.search.noNews)}
                tags={[wpTag]}
                person={cmsCandidate?.person?.uid}
            />
        </div>
    );
}

export default CandidateNews;
