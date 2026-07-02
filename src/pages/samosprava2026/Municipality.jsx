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
    isMunicipalityRegional,
    regionDefs,
    useElectionData,
} from '../../hooks/CmsQueries';

import { title as spendingTitle } from '../samosprava2022/AllCampaigns';
import { title as donorsTitle } from '../samosprava2022/AllDonors';
import TisBarChart from '../../components/charts/TisBarChart';
import Loading from '../../components/general/Loading';
import PartyCandidatesTable from '../../components/municipal/PartyCandidatesTable';
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
    if (town && cmsData?.candidates) {
        cmsData.candidates.forEach((cmsCandidate) => {
            if (
                (!region || region === cmsCandidate.region) &&
                (cmsCandidate.municipality === town ||
                    (regType === municipalTypes.regional &&
                        cmsCandidate.isRegionalFunction))
            ) {
                // has own account => is transparent
                if (cmsCandidate.account) {
                    const row = csvData?.data?.find(
                        (r) =>
                            r[aggregatedKeys.account] ===
                                cmsCandidate.account &&
                            r[aggregatedKeys.name] === cmsCandidate.person?.name
                    );

                    if (row) {
                        const person = {
                            name: getMunicipalityCmsTickText(cmsCandidate),
                            [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                            [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                            [chartKeys.UNIQUE]:
                                row[aggregatedKeys.num_unique_donors],
                        };
                        candidates.push(person);
                    }
                } else {
                    partyCandidates.push(cmsCandidate);
                }
            }
        });
        // clone arrays for different sort via unique donors
        donors = [...candidates].sort(sortByDonors);
    }

    const content = cmsData?.candidates ? (
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
        if (
            !candidates.length &&
            !partyCandidates.length &&
            cmsData?.candidates
        ) {
            // redirect to home page in case candidate does not exist
            navigate(routes.home());
        }
    }, [candidates.length, partyCandidates.length, cmsData, navigate]);

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
