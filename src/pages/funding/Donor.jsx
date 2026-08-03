import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { setTitle } from '../../helpers/browser';
import { donationsColumns as dc } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import {
    DonorFlags,
    DonorParties,
    apiEndpoints,
    columnLabel,
    entityLabel,
    hiddenDonorColumns,
} from '../../helpers/dontaions';
import { currencyFormat } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import DonationsSearch from '../../components/donors/DonationsSearch';
import Title from '../../components/structure/Title';
import Loading from '../../components/general/Loading';

function Donor() {
    const params = useParams();
    const id = params.id ?? null;
    const navigate = useNavigate();

    const aq = useQuery({
        queryKey: [`donor_${id}`],
        queryFn: () =>
            fetch(`${apiEndpoints.donors}?i=${id}`).then((response) =>
                response.json()
            ),
    });

    useEffect(() => {
        if (!aq.isLoading && !aq.error && aq.data && !(aq.data.rows ?? false)) {
            // redirect to donations page in case of no data or invalid ID
            navigate(routes.donations());
        }
    }, [aq.isLoading, aq.error, aq.data, navigate]);

    const name = aq.data?.rows[0].name ?? '';
    let content;
    if (aq.isLoading || aq.error) {
        content = <Loading error={aq.error} />;
    } else {
        const donorData = aq.data.rows[0];
        content = (
            <Row>
                <Col lg={6}>
                    <h2 className="text-lg-center">
                        {t(labels.donations.donorInfo)}
                    </h2>
                    <Table responsive>
                        <tbody>
                            <tr>
                                <th>{columnLabel(dc.entity)}</th>
                                <td className="text-end">
                                    {entityLabel(Number(donorData.company))}
                                </td>
                            </tr>
                            <tr>
                                <th>{columnLabel(dc.address)}</th>
                                <td className="text-end">
                                    {donorData.location}
                                </td>
                            </tr>
                            <tr>
                                <th>{t(labels.donor.parties)}</th>
                                <td aria-label={t(labels.donor.parties)}>
                                    <DonorParties
                                        className="justify-content-end"
                                        parties={donorData.parties}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>{t(labels.donor.amount)}</th>
                                <td className="fw-bold text-end">
                                    {currencyFormat(donorData.amount)}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col lg={6}>
                    <h2 className="text-lg-center">{t(labels.donor.flags)}</h2>
                    <DonorFlags flags={donorData.flags} />
                </Col>
            </Row>
        );
    }

    setTitle(`${t(labels.donor.pageTitle)} ${name}`);

    return (
        <section>
            <Title secondary={name}>
                {t(labels.donor.pageTitle)}
                <br />
            </Title>
            {content}
            <h2 className="my-4">{t(labels.donations.allDonations)}</h2>
            <DonationsSearch
                hiddenColumns={hiddenDonorColumns}
                parties={Object.keys(aq.data?.rows[0].parties ?? {})}
                route={routes.donor(id)}
                routeOptions={{ i: id }}
            />
        </section>
    );
}

export default Donor;
