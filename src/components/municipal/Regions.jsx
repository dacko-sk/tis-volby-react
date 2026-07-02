import { useState } from 'react';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

import {
    chartKeys,
    columnVariants,
    getMunicipalityCmsTickText,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { sortBySpending, substitute } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import useData, {
    aggregatedKeys,
    municipalTypes,
} from '../../hooks/AccountsData';
import { useElectionData } from '../../hooks/CmsQueries';

import TisBarChart from '../charts/TisBarChart';
import Loading from '../general/Loading';
import PartyCandidatesTable from './PartyCandidatesTable';

function Regions() {
    const [activeKey, setActiveKey] = useState(null);

    const { csvData } = useData();
    const { data: cmsData } = useElectionData();

    const charts = {};
    const candidates = {};
    const partyCandidates = {};

    if (cmsData?.candidates) {
        cmsData.candidates.forEach((cmsCandidate) => {
            const region = cmsCandidate.region;
            if (region) {
                if (charts[region] === undefined) {
                    candidates[region] = {
                        [municipalTypes.regional]: [],
                        [municipalTypes.local]: [],
                    };
                    partyCandidates[region] = {
                        [municipalTypes.regional]: [],
                        [municipalTypes.local]: [],
                    };
                    charts[region] = false;
                }

                const regType = cmsCandidate.isRegionalFunction
                    ? municipalTypes.regional
                    : municipalTypes.local;

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
                        };
                        candidates[region][regType].push(person);
                    }
                } else {
                    partyCandidates[region][regType].push(cmsCandidate);
                }
            }
        });
    }

    // initially all charts are NOT loaded
    const [loadedRegions, setLoadedRegions] = useState(charts);

    // create accordion component
    const accordions = [];
    Object.keys(charts)
        .sort()
        .forEach((region) => {
            const chart = loadedRegions[region] ? (
                <div>
                    <h2 className="mb-4">
                        {t(
                            labels.elections.municipalTypes[
                                municipalTypes.regional
                            ]
                        )}
                    </h2>
                    <TisBarChart
                        bars={columnVariants.inOut}
                        currency
                        data={candidates[region][municipalTypes.regional]
                            .sort(sortBySpending)
                            .slice(0, 10)}
                        vertical
                    />
                    <PartyCandidatesTable
                        candidates={
                            partyCandidates[region][municipalTypes.regional]
                        }
                    />
                    <h2 className="my-4">
                        {t(
                            labels.elections.municipalTypes[
                                municipalTypes.local
                            ]
                        )}
                    </h2>
                    <TisBarChart
                        bars={columnVariants.inOut}
                        currency
                        data={candidates[region][municipalTypes.local]
                            .sort(sortBySpending)
                            .slice(0, 10)}
                        vertical
                    />
                    <PartyCandidatesTable
                        candidates={
                            partyCandidates[region][municipalTypes.local]
                        }
                    />
                    <div className="buttons mt-3 text-center">
                        <Button
                            as={Link}
                            to={routes.region(region)}
                            variant="secondary"
                        >
                            {t(labels.charts.showMoreCandidatesRegion)}
                        </Button>
                    </div>
                </div>
            ) : (
                <Loading />
            );
            accordions.push(
                <Accordion.Item key={region} eventKey={region}>
                    <Accordion.Header>{substitute(region)}</Accordion.Header>
                    <Accordion.Body>{chart}</Accordion.Body>
                </Accordion.Item>
            );
        });

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKey(ak);
        // start chart loading (if needed)
        if (ak && !loadedRegions[ak]) {
            setLoadedRegions((prevState) => {
                return {
                    ...prevState,
                    [ak]: true,
                };
            });
        }
    };

    return (
        <div className="my-4">
            <h2>Top 10 kampaní v jednotlivých krajoch</h2>
            <Accordion
                className="mt-3"
                activeKey={activeKey}
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </div>
    );
}

export default Regions;
