import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';

import { endpoints } from '../../helpers/assetDeclarations';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';
import { contains } from '../../helpers/helpers';

import AssetDeclarationCard from './AssetDeclarationCard';
import AlertWithIcon from '../general/AlertWithIcon';
import Loading from '../general/Loading';

function AssetDeclarationsQuickResults({ maxResults = 3, q }) {
    const queryKey = q
        ? ['asset_declarations_search', q]
        : ['asset_declarations'];
    const { isLoading, error, data } = useQuery({
        queryKey,
        queryFn: () => fetch(endpoints.search).then((res) => res.json()),
        enabled: true,
    });

    if (!q) {
        return null;
    }

    if (isLoading) {
        return <Loading className="my-5" error={error} />;
    }

    const officials = data?.officials ?? [];
    const filtered = officials
        .filter((o) => contains(o.name, q))
        .slice(0, maxResults);

    if (filtered.length === 0) {
        return (
            <AlertWithIcon variant="danger">
                {t(labels.assetDeclarations.noOfficialFound)}
            </AlertWithIcon>
        );
    }

    return (
        <>
            {filtered.map((official) => (
                <AssetDeclarationCard
                    key={official.official_id}
                    oData={official}
                />
            ))}
            <Button
                as={Link}
                to={routes.assetDeclarations()}
                variant="secondary"
                className="mt-3"
            >
                {t(labels.assetDeclarations.advancedSearch)}
            </Button>
        </>
    );
}

export default AssetDeclarationsQuickResults;
