import { useOutletContext } from 'react-router';

import { labels, t } from '../../../helpers/dictionary';
import { setTitle } from '../../../helpers/helpers';

import { useCandidateAnalyses } from '../../../hooks/CmsQueries';

import AnalysisDetail from '../../../components/analyses/AnalysisDetail';
import AlertWithIcon from '../../../components/general/AlertWithIcon';
import Loading from '../../../components/general/Loading';

function CandidateAnalysis() {
    const { cmsCandidate } = useOutletContext();
    const {
        data: analyses,
        isLoading,
        error,
    } = useCandidateAnalyses(cmsCandidate?.uid);

    setTitle(`${cmsCandidate?.person?.name} : ${t(labels.analysis.navTitle)}`);

    let content = (
        <AlertWithIcon className="my-4" variant="danger">
            {t(labels.analysis.noData)}
        </AlertWithIcon>
    );
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else if (analyses?.length) {
        content = (
            <AnalysisDetail analyses={analyses} cmsCandidate={cmsCandidate} />
        );
    }

    return (
        <div className="subpage">
            <section className="article-detail mt-4">{content}</section>
        </div>
    );
}

export default CandidateAnalysis;
