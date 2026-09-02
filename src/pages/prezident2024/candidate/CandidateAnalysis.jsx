import { useLocation, useOutletContext } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { getAnalysedData, wpCat } from '../../../helpers/wp';

import { csvConfig } from '../../../hooks/AdsData';

import AlertWithIcon from '../../../components/general/AlertWithIcon';
import Loading from '../../../components/general/Loading';
import AnalysisDetail from '../../../components/wp/templates/AnalysisDetail';

function CandidateAnalysis() {
    const candidate = useOutletContext();

    // try to set article data object from location.state
    const location = useLocation();
    let article =
        location.state && (location.state.article ?? false)
            ? location.state.article
            : {};

    // load article data from API (if needed)
    // isLoading flag will be true if query is enabled and there is no data yet
    const { isLoading, error, data } = useQuery({
        queryKey: [`candidate_analysis_${candidate.name}`],
        queryFn: () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?categories=${
                    wpCat.analyses
                }&tags=${
                    candidate[csvConfig.ACCOUNTS.columns.WP]
                }&tax_relation=AND`
            ).then((response) => response.json()),
        // run only if article data were not delivered via location.state
        // and only if candidate has WP tag
        enabled: !(article.title ?? false) && !!candidate.hasWp,
    });

    if (!isLoading && !error && data && data.length) {
        // article successfully loaded from API - use it!
        article = {
            ...article,
            ...getAnalysedData(data)[0],
        };
    }

    let content = (
        <AlertWithIcon className="my-4" variant="danger">
            {t(labels.analysis.noData)}
        </AlertWithIcon>
    );
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else if (article.title ?? false) {
        content = <AnalysisDetail article={article} />;
    }

    setTitle(`${candidate.name} : Hodnotenie`);

    return (
        <div className="subpage">
            <section className="article-detail mt-4">{content}</section>
        </div>
    );
}

export default CandidateAnalysis;
