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
import { useElectionData } from '../../hooks/CmsQueries';

import TisBarChart from '../../components/charts/TisBarChart';
import PartyCandidatesTable from '../../components/municipal/PartyCandidatesTable';
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

    if (cmsData?.candidates) {
        cmsData.candidates.forEach((cmsCandidate) => {
            if (!cmsCandidate.region) return;

            const regType = cmsCandidate.isRegionalFunction
                ? municipalTypes.regional
                : municipalTypes.local;

            if (cmsCandidate.account) {
                // Find csvData row
                const row = csvData?.data?.find(
                    (r) =>
                        r[aggregatedKeys.account] === cmsCandidate.account &&
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

                    candidates[regType].push(person);

                    const regionName = cmsCandidate.region;
                    if (regionName) {
                        if (!regions[regionName]) {
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
                }
            } else {
                partyCandidates[regType].push(cmsCandidate);
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
                        <TisBarChart
                            bars={columnVariants.inOut}
                            currency
                            data={[...candidates[municipalTypes.local]].sort(
                                sortBySpending
                            )}
                            title={t(labels.elections.municipalTypes.local)}
                            vertical
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
                        <TisBarChart
                            bars={columnVariants.donors}
                            data={[...candidates[municipalTypes.local]].sort(
                                sortByDonors
                            )}
                            title={t(labels.elections.municipalTypes.local)}
                            vertical
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        {t(labels.charts.partyCandidatesTitle)}
                    </Accordion.Header>
                    <Accordion.Body>
                        <h2 className="mb-4">
                            {t(labels.elections.municipalTypes.regional)}
                        </h2>
                        <PartyCandidatesTable
                            candidates={
                                partyCandidates[municipalTypes.regional]
                            }
                        />
                        <h2 className="my-4">
                            {t(labels.elections.municipalTypes.local)}
                        </h2>
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
