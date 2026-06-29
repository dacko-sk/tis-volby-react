import { useOutletContext } from 'react-router-dom';

import { labels, t } from '../../../helpers/dictionary';
import { segments } from '../../../helpers/routes';

import Posts from '../../../components/wp/Posts';
import { newsCategories } from '../News';

function CandidateNews() {
    const { cmsCandidate } = useOutletContext();
    const wpTag = cmsCandidate?.person?.wpTag;

    if (!wpTag) return null;

    return (
        <div className="candidate-news mt-4">
            <Posts
                categories={newsCategories}
                noResults={t(labels.search.noNews)}
                section={segments.NEWS}
                tags={[wpTag]}
            />
        </div>
    );
}

export default CandidateNews;
