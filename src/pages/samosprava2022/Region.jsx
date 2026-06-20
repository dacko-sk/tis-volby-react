import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

import {
    chartKeys,
    columnVariants,
    getMunicipalityTickText,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import {
    regions,
    setTitle,
    sortByDonors,
    sortBySpending,
} from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

import useData, {
    municipalTypes,
    s22AggregatedKeys,
} from '../../hooks/AccountsData';

import { title as spendingTitle } from './AllCampaigns';
import { title as donorsTitle } from './AllDonors';
import {
    analysesCategories,
    getExcludedCategories,
    title as analysesTitle,
} from './Analyses';
import TisBarChart from '../../components/charts/TisBarChart';
import Loading from '../../components/general/Loading';
import PartyCandidatesTable from '../../components/general/PartyCandidatesTable';
import Title from '../../components/structure/Title';
import Posts from '../../components/wp/Posts';

function Region() {
    const params = useParams();
    const region = params?.region ?? null;
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = {
        [municipalTypes.regional]: [],
        [municipalTypes.local]: [],
    };
    let donors = {};
    const partyCandidates = {
        [municipalTypes.regional]: [],
        [municipalTypes.local]: [],
    };
    if (csvData?.data) {
        csvData.data.forEach((row) => {
            if (
                row?.[s22AggregatedKeys.region] !== undefined &&
                row[s22AggregatedKeys.region] === region
            ) {
                if (row.isTransparent) {
                    const person = {
                        name: getMunicipalityTickText(row),
                        [chartKeys.INCOMING]: row.sum_incoming,
                        [chartKeys.OUTGOING]: row.sum_outgoing,
                        [chartKeys.UNIQUE]: row.num_unique_donors,
                    };
                    candidates[
                        row.isRegional
                            ? municipalTypes.regional
                            : municipalTypes.local
                    ].push(person);
                } else {
                    partyCandidates[
                        row.isRegional
                            ? municipalTypes.regional
                            : municipalTypes.local
                    ].push(row);
                }
            }
        });
        // clone arrays for different sort via unique donors
        donors = {
            [municipalTypes.regional]: [
                ...candidates[municipalTypes.regional],
            ].sort(sortByDonors),
            [municipalTypes.local]: [...candidates[municipalTypes.local]].sort(
                sortByDonors
            ),
        };
    }

    // create accordions for both types of elections
    const elections = [];
    Object.values(municipalTypes)
        .filter(
            (type) =>
                candidates[type].length > 0 || partyCandidates[type].length > 0
        )
        .forEach((type) => {
            const typeId = analysesCategories.types[type];
            const regionId = analysesCategories.regions[region];
            const excludedIds = getExcludedCategories(typeId, regionId);
            elections.push(
                <div key={type}>
                    <h2>{t(labels.elections.municipalTypes[type])}</h2>

                    {csvData?.data ? (
                        <Accordion
                            className="my-3"
                            alwaysOpen
                            defaultActiveKey={[`${type}_s`]}
                        >
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
                                    <PartyCandidatesTable
                                        candidates={partyCandidates[type]}
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

                            <Accordion.Item
                                key={`${type}_a`}
                                eventKey={`${type}_a`}
                            >
                                <Accordion.Header>
                                    {analysesTitle +
                                        (type === municipalTypes.local
                                            ? ' v krajskom meste'
                                            : '')}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Posts
                                        categories={[typeId, regionId]}
                                        categoriesExclude={excludedIds}
                                        noResults="Pre tento typ volieb v tomto kraji doposiaľ nie sú k dispozícii žiadne hodnotenia."
                                        section={segments.ANALYSES}
                                    />
                                </Accordion.Body>
                            </Accordion.Item>
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
