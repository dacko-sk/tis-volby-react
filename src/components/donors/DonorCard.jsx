import { Link } from 'react-router';
import Stack from 'react-bootstrap/Stack';

import { DonorFlags, DonorParties, entityIcon } from '../../helpers/dontaions';
import { currencyFormat } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

function DonorCard({ donorData }) {
    const icon = donorData.name ? (
        <span className="me-2">{entityIcon(Number(donorData.company))}</span>
    ) : null;
    return (
        <Link
            to={routes.donor(donorData.id)}
            className="donor-card d-block bg-light text-dark text-decoration-none p-3"
        >
            <Stack className="flex-wrap" direction="horizontal">
                <div>
                    {icon}
                    {donorData.name || '-'}
                </div>
                <div>{donorData.location || '-'}</div>
                <div className="fw-bold">
                    {currencyFormat(donorData.amount)}
                </div>
                <div>
                    <DonorParties compact parties={donorData.parties} />
                </div>
                <div>
                    <DonorFlags compact flags={donorData.flags} />
                </div>
            </Stack>
        </Link>
    );
}

export default DonorCard;
