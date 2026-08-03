import { Link } from 'react-router';
import Table from 'react-bootstrap/Table';
import { useQuery } from '@tanstack/react-query';

import { donationsColumns as dc } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import {
    DonorParties,
    apiEndpoints,
    columnLabel,
    typeLabel,
} from '../../helpers/dontaions';
import { currencyFormat } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import Loading from '../general/Loading';

function Top10Donors({ className, disclaimer, file, title }) {
    const { isLoading, error, data } = useQuery({
        queryKey: [`donors_${file}`],
        queryFn: () =>
            fetch(`${apiEndpoints.file}?f=${file}`).then((response) =>
                response.json()
            ),
    });

    const companies = file === 'top10companies';
    let content;
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else {
        content = (
            <Table responsive bordered hover striped>
                <thead>
                    <tr className="align-middle">
                        <th>
                            {companies
                                ? t(labels.donations.columns.companyName)
                                : t(labels.donor.pageTitle)}
                        </th>
                        <th>
                            {companies
                                ? t(labels.donations.columns.companyLocation)
                                : columnLabel(dc.address)}
                        </th>
                        <th>{t(labels.donor.amount)}</th>
                        <th>{t(labels.donor.parties)}</th>
                        <th>{columnLabel(dc.type)}</th>
                    </tr>
                </thead>
                <tbody>
                    {(data.rows ?? []).map((donorData) => (
                        <tr key={donorData.name}>
                            <td>
                                <Link to={routes.donor(donorData.id)}>
                                    {donorData.name}
                                </Link>
                            </td>
                            <td>{donorData.location}</td>
                            <td>{currencyFormat(donorData.amount)}</td>
                            <td aria-label={t(labels.donor.parties)}>
                                <DonorParties parties={donorData.parties} />
                            </td>
                            <td>
                                {Object.entries(donorData.types)
                                    .map(([type, count]) =>
                                        typeLabel(type, count > 1)
                                    )
                                    .join(', ')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }

    return (
        <div className={className}>
            <h2 className="mb-4">{t(title)}</h2>
            {content}
            <em className="disclaimer">{t(disclaimer)}</em>
        </div>
    );
}

export default Top10Donors;
