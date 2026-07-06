import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

import {
    chartKeys,
    columnVariants,
    getMunicipalityCmsTickText,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import {
    regions,
    setTitle,
    sortByDonors,
    sortBySpending,
} from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import useData, {
    aggregatedKeys,
    municipalTypes,
} from '../../hooks/AccountsData';
import { useRegionData } from '../../hooks/CmsQueries';

import { title as spendingTitle } from '../samosprava2022/AllCampaigns';
import { title as donorsTitle } from '../samosprava2022/AllDonors';
import TisBarChart from '../../components/charts/TisBarChart';
import Loading from '../../components/general/Loading';
import PartyCandidatesTable from '../../components/municipal/PartyCandidatesTable';
import Title from '../../components/structure/Title';

function Region() {
    const params = useParams();
    const region = params?.region ?? null;
    const navigate = useNavigate();

    const { csvData } = useData();
    const { data: regionData, isLoading } = useRegionData(region);

    // parse data
    const candidates = {
        [municipalTypes.regional]: [],
        [municipalTypes.local]: [],
    };
    let donors = {
        [municipalTypes.regional]: [],
        [municipalTypes.local]: [],
    };
    const partyCandidates = regionData?.partyCandidates || {
        [municipalTypes.regional]: [],
        [municipalTypes.local]: [],
    };

    if (regionData?.candidates && csvData?.data) {
        Object.values(municipalTypes).forEach((type) => {
            regionData.candidates[type].forEach((cmsCandidate) => {
                const row = csvData.data.find(
                    (r) =>
                        r[aggregatedKeys.account] === cmsCandidate.account &&
                        r[aggregatedKeys.name] === cmsCandidate.person?.name
                );
                if (row) {
                    candidates[type].push({
                        name: getMunicipalityCmsTickText(cmsCandidate),
                        [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                        [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                        [chartKeys.UNIQUE]: row[aggregatedKeys.num_unique_donors],
                    });
                }
            });

            donors[type] = [...candidates[type]].sort(sortByDonors);
        });
    }

    // create accordions for both types of elections
    const elections = [];
    Object.values(municipalTypes)
        .filter(
            (type) =>
                candidates[type].length > 0 || partyCandidates[type].length > 0
        )
        .forEach((type) => {
            elections.push(
                <div key={type}>
                    <h2>{t(labels.elections.municipalTypes[type])}</h2>

                    {!isLoading ? (
                        <Accordion
                            className="my-3"
                            alwaysOpen
                            defaultActiveKey={[`${type}_s`]}
                        >
                            {candidates[type].length > 0 && (
                                <>
                                    <Accordion.Item
                                        key={`${type}_s`}
                                        eventKey={`${type}_s`}
                                    >
                                        <Accordion.Header>
                                            {spendingTitle}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <TisBarChart
                                                bars={columnVariants.inOut}
                                                currency
                                                data={candidates[type].sort(
                                                    sortBySpending
                                                )}
                                                vertical
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item
                                        key={`${type}_d`}
                                        eventKey={`${type}_d`}
                                    >
                                        <Accordion.Header>
                                            {donorsTitle}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <TisBarChart
                                                bars={columnVariants.donors}
                                                data={donors[type]}
                                                vertical
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </>
                            )}
                            {partyCandidates[type].length > 0 && (
                                <Accordion.Item
                                    key={`${type}_p`}
                                    eventKey={`${type}_p`}
                                >
                                    <Accordion.Header>
                                        {t(labels.charts.partyCandidatesTitle)}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <PartyCandidatesTable
                                            candidates={partyCandidates[type]}
                                        />
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}
                        </Accordion>
                    ) : (
                        <Loading />
                    )}
                </div>
            );
        });
    useEffect(() => {
        if (regions[region] === undefined) {
            // redirect to home page in case region does not exist
            navigate(routes.home);
        }
    }, [region, navigate]);

    setTitle(regions[region]);

    return (
        <section className="region-page">
            <Title>{regions[region]}</Title>
            {elections}
        </section>
    );
}

export default Region;
