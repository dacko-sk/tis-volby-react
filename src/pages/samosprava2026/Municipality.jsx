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
import {
    findCandidate,
    isMunicipalityRegional,
    isRegionalFunction,
    regionDefs,
    useElectionData,
} from '../../hooks/CmsQueries';

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
    let regType = municipalTypes.local;
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
        if (isMunicipalityRegional(town)) {
            regType = municipalTypes.regional;
            town = (regionDefs[region]?.name ?? town) || town;
        }
    }

    const navigate = useNavigate();

    const { csvData } = useData();
    const { data: cmsData } = useElectionData();

    // parse data
    const candidates = [];
    let donors = [];
    const partyCandidates = [];
    if (town && csvData?.data) {
        csvData.data.forEach((row) => {
            const cmsCandidate = findCandidate(
                cmsData,
                row[aggregatedKeys.name],
                row[aggregatedKeys.account]
            );
            // TODO: municipality short name support
            if (
                (!region || region === cmsCandidate?.region) &&
                (cmsCandidate?.municipality === town ||
                    (regType === municipalTypes.regional &&
                        isRegionalFunction(cmsCandidate?.functionType)))
            ) {
                // has own account => is transparent
                if (cmsCandidate?.account) {
                    const person = {
                        name: getMunicipalityCmsTickText(cmsCandidate),
                        [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                        [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                        [chartKeys.UNIQUE]:
                            row[aggregatedKeys.num_unique_donors],
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
            <Title secondary={t(labels.elections.municipalTypes[regType])}>
                {town}
                <br />
            </Title>
            {content}
        </section>
    );
}

export default Municipality;
