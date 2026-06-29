import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { endpoints } from '../../../helpers/assetDeclarations';

import Loading from '../../../components/general/Loading';
import AssetDeclarationData from '../../../components/assets/AssetDeclarationData';

function CandidateAssets() {
    const { cmsCandidate } = useOutletContext();
    const assetId = cmsCandidate?.person?.assetDeclarationsId;
    const extended = cmsCandidate?.person?.assetDeclarationsExtended ?? [];

    const { isLoading, error, data } = useQuery({
        queryKey: [`asset_declaration_${assetId}`],
        queryFn: () =>
            fetch(endpoints.official(assetId)).then((response) =>
                response.json()
            ),
        queryOptions: {
            enabled: !!assetId,
        },
    });

    if (assetId && (isLoading || error)) {
        return <Loading error={error} />;
    }

    // Merge data: if we fetched data, use it, else use the extended array directly.
    const resolvedData = assetId
        ? data
        : { extended: extended, declarations: [] };

    const declarations = resolvedData?.declarations ?? [];
    const extendedData = resolvedData?.extended ?? [];

    return (
        <div className="candidate-assets mt-4">
            <AssetDeclarationData
                declarations={declarations}
                extended={extendedData}
            />
        </div>
    );
}

export default CandidateAssets;
