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
import {
    findCandidate,
    isRegionalFunction,
    useElectionData,
} from '../../hooks/CmsQueries';

import TisBarChart from '../charts/TisBarChart';
import Loading from '../general/Loading';

function Regions() {
    const [activeKey, setActiveKey] = useState(null);

    const { csvData } = useData();
    const { data: cmsData } = useElectionData();

    const charts = {};
    const candidates = {};

    if (csvData?.data) {
        csvData.data.forEach((row) => {
            const cmsCandidate = findCandidate(
                cmsData,
                row[aggregatedKeys.name],
                row[aggregatedKeys.account]
            );
            const region = cmsCandidate?.region;
            if (region) {
                if (charts[region] === undefined) {
                    candidates[region] = {
                        [municipalTypes.regional]: [],
                        [municipalTypes.local]: [],
                    };
                    charts[region] = false;
                }

                const person = {
                    name: getMunicipalityCmsTickText(cmsCandidate),
                    [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                    [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                };
                candidates[region][
                    isRegionalFunction(cmsCandidate?.functionType)
                        ? municipalTypes.regional
                        : municipalTypes.local
                ].push(person);
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
                    <TisBarChart
                        bars={columnVariants.inOut}
                        currency
                        data={candidates[region][municipalTypes.regional]
                            .sort(sortBySpending)
                            .slice(0, 10)}
                        title={t(
                            labels.elections.municipalTypes[
                                municipalTypes.regional
                            ]
                        )}
                        vertical
                    />
                    <TisBarChart
                        bars={columnVariants.inOut}
                        currency
                        data={candidates[region][municipalTypes.local]
                            .sort(sortBySpending)
                            .slice(0, 10)}
                        title={t(
                            labels.elections.municipalTypes[
                                municipalTypes.local
                            ]
                        )}
                        vertical
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
