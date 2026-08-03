import Button from 'react-bootstrap/Button';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { labels, t } from '../../helpers/dictionary';
import { apiEndpoints, apiParams } from '../../helpers/dontaions';
import { buildApiQuery, routes, rwq } from '../../helpers/routes';

import DonorCard from './DonorCard';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';

function DonorsQuickResults({ maxResults = 3, q }) {
    const queryParams = buildApiQuery(apiParams, { b: maxResults, q });
    const aq = useQuery({
        queryKey: [`donor_search_${queryParams}`],
        queryFn: () =>
            fetch(`${apiEndpoints.donors}?${queryParams}`).then((response) =>
                response.json()
            ),
        queryOptions: {
            // run only if q is not empty
            enabled: !!q,
        },
    });

    if (q) {
        // isInitialLoading flag will be true if query is enabled, there are no data yet (isLoading) and isFetching
        if (aq.isInitialLoading || aq.error) {
            return <Loading className="my-5" error={aq.error} />;
        }
        const cards = (aq.data?.rows ?? []).map((donorData) => (
            <DonorCard key={donorData.id} donorData={donorData} />
        ));
        return (
            <>
                <h4 className="my-4">{t(labels.donations.navTitleShort)}</h4>
                {cards.length ? (
                    cards
                ) : (
                    <AlertWithIcon variant="danger">
                        {t(labels.donations.search.noDonors)}
                    </AlertWithIcon>
                )}
                <Button
                    as={Link}
                    to={rwq.searchAndFilter(routes.donations(), { q })}
                    variant="secondary"
                    className="mt-4"
                >
                    {t(labels.donations.search.advanced)}
                </Button>
            </>
        );
    }

    return null;
}

export default DonorsQuickResults;
