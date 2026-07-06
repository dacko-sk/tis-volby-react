import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    getMunicipalityCmsTickText,
    chartKeys,
    columnVariants,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';

import { setTitle, sortByDonors, sortBySpending } from '../../helpers/helpers';
import { routes, separators } from '../../helpers/routes';

import useData, {
    aggregatedKeys,
    municipalTypes,
} from '../../hooks/AccountsData';
import { useMunicipalityData } from '../../hooks/CmsQueries';

import { title as spendingTitle } from '../samosprava2022/AllCampaigns';
import { title as donorsTitle } from '../samosprava2022/AllDonors';
import TisBarChart from '../../components/charts/TisBarChart';
import Loading from '../../components/general/Loading';
import PartyCandidatesTable from '../../components/municipal/PartyCandidatesTable';
import Title from '../../components/structure/Title';

function Municipality() {
    const params = useParams();
    const navigate = useNavigate();

    let town = null;
    let region = null;
    if (params?.municipality !== undefined) {
        const municipality = params.municipality.split(separators.value);
        town = municipality[municipality.length > 1 ? 1 : 0].replaceAll(
            separators.space,
            ' '
        );
        region =
            municipality.length > 1
                ? municipality[0].replaceAll(separators.space, ' ')
                : null;
    }

    const { csvData } = useData();
    const { data: municipalData, isLoading } = useMunicipalityData(
        town,
        region
    );

    // parse data
    const fullName = municipalData?.fullName ?? town;
    const candidates = [];
    const partyCandidates = municipalData?.partyCandidates || [];
    if (municipalData?.candidates && csvData?.data) {
        municipalData.candidates.forEach((cmsCandidate) => {
            const row = csvData.data.find(
                (r) =>
                    r[aggregatedKeys.account] === cmsCandidate.account &&
                    r[aggregatedKeys.name] === cmsCandidate.person?.name
            );

            if (row) {
                candidates.push({
                    name: getMunicipalityCmsTickText(cmsCandidate),
                    [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                    [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                    [chartKeys.UNIQUE]: row[aggregatedKeys.num_unique_donors],
                });
            }
        });
    }

    const donors = [...candidates].sort(sortByDonors);

    const content = !isLoading ? (
        <div>
            <TisBarChart
                bars={columnVariants.inOut}
                currency
                data={candidates.sort(sortBySpending)}
                title={spendingTitle}
                vertical
            />
            <TisBarChart
                bars={columnVariants.donors}
                data={donors}
                title={donorsTitle}
                vertical
            />
            {partyCandidates.length > 0 && (
                <>
                    <h2 className="my-4">
                        {t(labels.charts.partyCandidatesTitle)}
                    </h2>
                    <PartyCandidatesTable candidates={partyCandidates} />
                </>
            )}
        </div>
    ) : (
        <Loading />
    );

    useEffect(() => {
        if (!isLoading && !candidates.length && !partyCandidates.length) {
            // redirect to home page in case candidate does not exist
            navigate(routes.home());
        }
    }, [candidates.length, partyCandidates.length, isLoading, navigate]);

    setTitle(fullName);

    return (
        <section className="municipality-page">
            <Title
                secondary={t(
                    labels.elections.municipalTypes[
                        municipalData?.regType ?? municipalTypes.local
                    ]
                )}
            >
                {fullName}
                <br />
            </Title>
            {content}
        </section>
    );
}

export default Municipality;
