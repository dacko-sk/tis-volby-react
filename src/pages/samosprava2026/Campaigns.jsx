import Accordion from 'react-bootstrap/Accordion';
import { chartKeys, columnVariants, getMunicipalityTickText } from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { setTitle, sortByDonors, sortBySpending } from '../../helpers/helpers';
import useData, { municipalTypes, tempExtraAccountKeys } from '../../hooks/AccountsData';

import TisBarChart from '../../components/charts/TisBarChart';
import PartyCandidatesTable from '../../components/general/PartyCandidatesTable';
import Title from '../../components/structure/Title';

function Campaigns() {
    const title = t(labels.charts.campaignsPageTitle);
    const { csvData } = useData();

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
            if (
                row?.[tempExtraAccountKeys.region] !== undefined &&
                !row.isParty
            ) {
                if (row.isTransparent) {
                    const person = {
                        name: getMunicipalityTickText(row, true),
                        [chartKeys.INCOMING]: row.sum_incoming,
                        [chartKeys.OUTGOING]: row.sum_outgoing,
                        [chartKeys.UNIQUE]: row.num_unique_donors,
                    };
                    candidates[
                        row.isRegional
                            ? municipalTypes.regional
                            : municipalTypes.local
                    ].push(person);

                    const regionName = row[tempExtraAccountKeys.region] || t(labels.charts.unknownRegion);
                    if (row[tempExtraAccountKeys.region]) {
                        if (regions[regionName] !== undefined) {
                            regions[regionName][chartKeys.INCOMING] += row.sum_incoming;
                            regions[regionName][chartKeys.OUTGOING] += row.sum_outgoing;
                        } else {
                            regions[regionName] = {
                                name: regionName,
                                [chartKeys.INCOMING]: row.sum_incoming,
                                [chartKeys.OUTGOING]: row.sum_outgoing,
                            };
                        }
                    }
                } else {
                    partyCandidates[
                        row.isRegional
                            ? municipalTypes.regional
                            : municipalTypes.local
                    ].push(row);
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
                    <Accordion.Header>{t(labels.charts.regionsTitle)}</Accordion.Header>
                    <Accordion.Body>
                        <TisBarChart
                            bars={columnVariants.inOut}
                            data={Object.values(regions).sort(sortBySpending)}
                            currency
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>{t(labels.charts.allCampaignsTitle)}</Accordion.Header>
                    <Accordion.Body>
                        <TisBarChart
                            bars={columnVariants.inOut}
                            currency
                            data={candidates[municipalTypes.regional].sort(sortBySpending)}
                            title={t(labels.elections.municipalTypes.regional)}
                            vertical
                        />
                        <PartyCandidatesTable
                            candidates={partyCandidates[municipalTypes.regional]}
                        />
                        <TisBarChart
                            bars={columnVariants.inOut}
                            currency
                            data={candidates[municipalTypes.local].sort(sortBySpending)}
                            title={t(labels.elections.municipalTypes.local)}
                            vertical
                        />
                        <PartyCandidatesTable
                            candidates={partyCandidates[municipalTypes.local]}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>{t(labels.charts.allDonorsTitle)}</Accordion.Header>
                    <Accordion.Body>
                        <TisBarChart
                            bars={columnVariants.donors}
                            data={candidates[municipalTypes.regional].sort(sortByDonors)}
                            title={t(labels.elections.municipalTypes.regional)}
                            vertical
                        />
                        <PartyCandidatesTable
                            candidates={partyCandidates[municipalTypes.regional]}
                        />
                        <TisBarChart
                            bars={columnVariants.donors}
                            data={candidates[municipalTypes.local].sort(sortByDonors)}
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
