import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import { routes } from '../../helpers/routes';

function AssetDeclarationCard({ oData }) {
    const { official_id, name, declarations } = oData;

    // Extract unique years from declaration objects
    const years = declarations.map((d) => d.year).sort((a, b) => a - b);

    return (
        <Button
            as={Link}
            to={routes.assetDeclaration(official_id)}
            variant="link"
            className="donor-card d-block bg-light text-dark text-decoration-none p-3 mb-2"
        >
            <Stack className="flex-wrap" direction="horizontal">
                <span>{name}</span>
                <div>
                    {years.map((year) => (
                        <Badge key={year} bg="secondary" className="mx-1">
                            {year}
                        </Badge>
                    ))}
                </div>
            </Stack>
        </Button>
    );
}

export default AssetDeclarationCard;
