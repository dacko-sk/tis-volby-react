import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    getMunicipalityTickText,
    chartKeys,
    columnVariants,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';

import { setTitle, sortByDonors, sortBySpending } from '../../helpers/helpers';
import { routes, separators } from '../../helpers/routes';

import useData, {
    municipalTypes,
    s22AggregatedKeys,
} from '../../hooks/AccountsData';

import { title as spendingTitle } from '../samosprava2022/AllCampaigns';
import { title as donorsTitle } from '../samosprava2022/AllDonors';
import TisBarChart from '../../components/charts/TisBarChart';
import Loading from '../../components/general/Loading';
import PartyCandidatesTable from '../../components/general/PartyCandidatesTable';
import Title from '../../components/structure/Title';

function Municipality() {
    const params = useParams();
    let town = null;
    let region = null;
    let type = municipalTypes.local;
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

    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = [];
    let donors = [];
    const partyCandidates = [];
    if (town && csvData?.data) {
        csvData.data.forEach((row) => {
            if (
                (row[s22AggregatedKeys.municipality] === town ||
                    row.municipalityShortName === town) &&
                (!region || region === row[s22AggregatedKeys.region])
            ) {
                town = row[s22AggregatedKeys.municipality];
                type = row.isRegional
                    ? municipalTypes.regional
                    : municipalTypes.local;
                if (row.isTransparent) {
                    const person = {
                        name: getMunicipalityTickText(row),
                        [chartKeys.INCOMING]: row.sum_incoming,
                        [chartKeys.OUTGOING]: row.sum_outgoing,
                        [chartKeys.UNIQUE]: row.num_unique_donors,
                    };
                    candidates.push(person);
                } else {
                    partyCandidates.push(row);
                }
            }
        });
        // clone arrays for different sort via unique donors
        donors = [...candidates].sort(sortByDonors);
    }

    const content = csvData?.data ? (
        <div>
            <TisBarChart
                bars={columnVariants.inOut}
                currency
                data={candidates.sort(sortBySpending)}
                title={spendingTitle}
                vertical
            />
            <PartyCandidatesTable candidates={partyCandidates} />
            <TisBarChart
                bars={columnVariants.donors}
                data={donors}
                title={donorsTitle}
                vertical
            />
        </div>
    ) : (
        <Loading />
    );

    useEffect(() => {
        if (!candidates.length && !partyCandidates.length && csvData?.data) {
            // redirect to home page in case candidate does not exist
            navigate(routes.home);
        }
    }, [candidates.length, partyCandidates.length, csvData, navigate]);

    setTitle(town);

    return (
        <section className="municipality-page">
            <Title secondary={t(labels.elections.municipalTypes[type])}>
                {town}
                <br />
            </Title>
            {content}
        </section>
    );
}

export default Municipality;
