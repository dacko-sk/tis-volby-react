import { Link } from 'react-router';

import {
    analysisClass,
    analysisScoreFormat,
    getAnalysisRoute,
} from '../../helpers/cms';
import { labels, t } from '../../helpers/dictionary';
import { segments } from '../../helpers/routes';

import { useCandidateAnalyses, useHasAnalyses } from '../../hooks/CmsQueries';

import './CampaignRating.scss';

// campaign transparency evaluation of a candidate: score badge linked to the
// evaluation detail, with the verbal rating next to it
function CampaignRating({ cmsCandidate }) {
    const hasAnalyses = useHasAnalyses();
    const { data: analyses, isLoading } = useCandidateAnalyses(
        cmsCandidate?.uid
    );
    // analyses are sorted from the oldest set, the latest evaluation counts
    const evaluation = analyses?.length
        ? analyses[analyses.length - 1].evaluation
        : null;

    if (isLoading) {
        return null;
    }

    if (!evaluation) {
        return (
            <span className="text-muted">
                {hasAnalyses
                    ? t(labels.regionRaces.notRated)
                    : t(labels.regionRaces.comingSoon)}
            </span>
        );
    }

    const cls = analysisClass(evaluation);

    return (
        <div className="campaign-rating">
            <Link
                className={`campaign-score score-${cls}`}
                to={getAnalysisRoute({ cmsCandidate }, segments.ANALYSIS)}
                title={t(labels.regionRaces.evaluationLink)}
            >
                {analysisScoreFormat(evaluation.score)}
            </Link>
            <span>{t(labels.analysis.transparency[cls])}</span>
        </div>
    );
}

export default CampaignRating;
