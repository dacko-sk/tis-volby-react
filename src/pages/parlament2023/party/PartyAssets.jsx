import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { wpCat } from '../../../helpers/wp';

import { legacyAggregatedKeys } from '../../../hooks/AccountsData';

import AlertWithIcon from '../../../components/general/AlertWithIcon';
import Loading from '../../../components/general/Loading';
import AssetsDetail from '../../../components/wp/templates/AssetsDetail';

function PartyAssets() {
    const party = useOutletContext();

    let article = {};

    // load article data from API (if needed)
    // isLoading flag will be true if query is enabled and there is no data yet
    const { isLoading, error, data } = useQuery({
        queryKey: [`party_asets_${party[legacyAggregatedKeys.name]}`],
        queryFn: () =>
            fetch(
                `https://cms.transparency.sk/wp-json/wp/v2/posts?categories=${wpCat.assets}&tags=${party.tag}&tax_relation=AND`
            ).then((response) => response.json()),
        // run only if party has WP tag
        enabled: !!(party.tag ?? false),
    });

    if (!isLoading && !error && data && data.length) {
        // article successfully loaded from API - use it!
        article = {
            ...article,
            ...data[0],
        };
    }

    let content = (
        <AlertWithIcon className="my-4" variant="danger">
            {t(labels.analysis.noAssets)}
        </AlertWithIcon>
    );
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else if (article.title ?? false) {
        content = <AssetsDetail article={article} />;
    }

    setTitle(`${party.fullName} : ${t(labels.parties.assets)}`);

    return (
        <div className="subpage">
            <section className="article-detail mt-4">{content}</section>
        </div>
    );
}

export default PartyAssets;
