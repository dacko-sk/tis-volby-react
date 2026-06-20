import { useLocation, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { getAnalysedData, wpCat } from '../../../helpers/wp';

import { legacyAggregatedKeys } from '../../../hooks/AccountsData';

import AlertWithIcon from '../../../components/general/AlertWithIcon';
import Loading from '../../../components/general/Loading';
import AnalysisDetail from '../../../components/wp/templates/AnalysisDetail';

function PartyAnalysis() {
    const party = useOutletContext();
    const wpTag = party.wp ?? party.tag ?? false;

    // try to set article data object from location.state
    const location = useLocation();
    let article =
        location.state && (location.state.article ?? false)
            ? location.state.article
            : {};

    // load article data from API (if needed)
    // isLoading flag will be true if query is enabled and there is no data yet
    const { isLoading, error, data } = useQuery({
        queryKey: [`party_analysis_${party[legacyAggregatedKeys.name]}`],
        queryFn: () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?categories=${wpCat.analyses}&tags=${wpTag}&tax_relation=AND`
            ).then((response) => response.json()),
        // run only if article data were not delivered via location.state
        // and only if party has WP tag
        enabled: !(article.title ?? false) && !!wpTag,
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

    setTitle(`${party.fullName} : Hodnotenie`);

    return (
        <div className="subpage">
            <section className="article-detail mt-4">{content}</section>
        </div>
    );
}

export default PartyAnalysis;
