import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';

import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';
import { endpoints } from '../../helpers/assetDeclarations';

import FundingNav from '../../components/structure/FundingNav';
import Title from '../../components/structure/Title';
import Loading from '../../components/general/Loading';
import AssetDeclarationData from '../../components/assets/AssetDeclarationData';

function AssetDeclaration() {
    const params = useParams();
    const slug = params.slug ?? null;
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery({
        queryKey: [`asset_declaration_${slug}`],
        queryFn: () =>
            fetch(endpoints.official(slug)).then((response) => response.json()),
        queryOptions: {
            enabled: !!slug,
        },
    });

    useEffect(() => {
        if (
            !isLoading &&
            !error &&
            (!data ||
                !Array.isArray(data.declarations) ||
                data.declarations.length === 0)
        ) {
            // Redirect to list page if no data was found or invalid slug
            navigate(routes.assetDeclarations());
        }
    }, [isLoading, error, data, navigate]);

    if (isLoading || error) {
        return (
            <section>
                <Title>{t(labels.assetDeclarations.pageTitle)}</Title>
                <FundingNav />
                <Loading error={error} />
            </section>
        );
    }

    const declarations = data?.declarations ?? [];
    if (declarations.length === 0) {
        return null;
    }

    const name = data?.name;
    setTitle(`${t(labels.assetDeclarations.pageTitle)} | ${name}`);

    return (
        <section className="asset-declaration-detail">
            <Title secondary={name}>
                {t(labels.assetDeclarations.pageTitle)}
                <br />
            </Title>

            <FundingNav />

            <div className="mb-4">
                <Button
                    as={Link}
                    to={routes.assetDeclarations()}
                    variant="outline-primary"
                    className="py-2"
                >
                    &larr; {t(labels.assetDeclarations.back)}
                </Button>
            </div>

            <AssetDeclarationData
                declarations={declarations}
                extended={data?.extended}
            />
        </section>
    );
}

export default AssetDeclaration;
