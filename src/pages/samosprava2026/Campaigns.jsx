import Accordion from 'react-bootstrap/Accordion';
import {
    chartKeys,
    columnVariants,
    getMunicipalityCmsTickText,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { setTitle, sortByDonors, sortBySpending } from '../../helpers/helpers';
import useData, {
    municipalTypes,
    aggregatedKeys,
} from '../../hooks/AccountsData';
import {
    findCandidate,
    isRegionalFunction,
    useElectionData,
} from '../../hooks/CmsQueries';

import TisBarChart from '../../components/charts/TisBarChart';
import PartyCandidatesTable from '../../components/general/PartyCandidatesTable';
import Title from '../../components/structure/Title';

function Campaigns() {
    const title = t(labels.charts.campaignsPageTitle);
    const { csvData } = useData();
    const { data: cmsData } = useElectionData();

    // parse data
    const candidates = {
        [municipalTypes.regional]: [],
        [municipalTypes.local]: [],
    };
    const partyCandidates = {
        [municipalTypes.regional]: [],
        [municipalTypes.local]: [],
    };
    const regions = {};

    if (csvData?.data) {
        csvData.data.forEach((row) => {
            const cmsCandidate = findCandidate(
                cmsData,
                row[aggregatedKeys.name],
                row[aggregatedKeys.account]
            );
            if (cmsCandidate?.region) {
                const regType = isRegionalFunction(cmsCandidate?.functionType)
                    ? municipalTypes.regional
                    : municipalTypes.local;
                // has own account => is transparent
                if (cmsCandidate?.account) {
                    const person = {
                        name: getMunicipalityCmsTickText(cmsCandidate),
                        [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                        [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                        [chartKeys.UNIQUE]:
                            row[aggregatedKeys.num_unique_donors],
                    };

                    candidates[regType].push(person);

                    const regionName = cmsCandidate?.region;
                    if (regionName) {
                        if (!(regions[regionName] ?? false)) {
                            regions[regionName] = {
                                name: regionName,
                                [chartKeys.INCOMING]: 0,
                                [chartKeys.OUTGOING]: 0,
                            };
                        }
                        regions[regionName][chartKeys.INCOMING] +=
                            row[aggregatedKeys.incoming];
                        regions[regionName][chartKeys.OUTGOING] +=
                            row[aggregatedKeys.outgoing];
                    }
                } else {
                    partyCandidates[regType].push(row);
                }
            }
        });
    }

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>

            <Accordion defaultActiveKey="0" className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        {t(labels.charts.regionsTitle)}
                    </Accordion.Header>
                    <Accordion.Body>
                        <TisBarChart
                            bars={columnVariants.inOut}
                            data={Object.values(regions).sort(sortBySpending)}
                            currency
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        {t(labels.charts.allCampaignsTitle)}
                    </Accordion.Header>
                    <Accordion.Body>
                        <TisBarChart
                            bars={columnVariants.inOut}
                            currency
                            data={[...candidates[municipalTypes.regional]].sort(
                                sortBySpending
                            )}
                            title={t(labels.elections.municipalTypes.regional)}
                            vertical
                        />
                        <PartyCandidatesTable
                            candidates={
                                partyCandidates[municipalTypes.regional]
                            }
                        />
                        <TisBarChart
                            bars={columnVariants.inOut}
                            currency
                            data={[...candidates[municipalTypes.local]].sort(
                                sortBySpending
                            )}
                            title={t(labels.elections.municipalTypes.local)}
                            vertical
                        />
                        <PartyCandidatesTable
                            candidates={partyCandidates[municipalTypes.local]}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        {t(labels.charts.allDonorsTitle)}
                    </Accordion.Header>
                    <Accordion.Body>
                        <TisBarChart
                            bars={columnVariants.donors}
                            data={[...candidates[municipalTypes.regional]].sort(
                                sortByDonors
                            )}
                            title={t(labels.elections.municipalTypes.regional)}
                            vertical
                        />
                        <PartyCandidatesTable
                            candidates={
                                partyCandidates[municipalTypes.regional]
                            }
                        />
                        <TisBarChart
                            bars={columnVariants.donors}
                            data={[...candidates[municipalTypes.local]].sort(
                                sortByDonors
                            )}
                            title={t(labels.elections.municipalTypes.local)}
                            vertical
                        />
                        <PartyCandidatesTable
                            candidates={partyCandidates[municipalTypes.local]}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </section>
    );
}

export default Campaigns;
