import {
    chartKeys,
    columnVariants,
    getMunicipalityTickText,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { setTitle, sortBySpending } from '../../helpers/helpers';

import useData, {
    municipalTypes,
    s22AggregatedKeys,
} from '../../hooks/AccountsData';

import TisBarChart from '../../components/charts/TisBarChart';
import PartyCandidatesTableLegacy from '../../components/municipal/PartyCandidatesTableLegacy';
import Title from '../../components/structure/Title';

export const title = 'Výdavky a príjmy všetkých kandidátov';

function AllCampaigns() {
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
    if (csvData?.data) {
        csvData.data.forEach((row) => {
            if (row?.[s22AggregatedKeys.region] !== undefined && !row.isParty) {
                if (row.isTransparent) {
                    const person = {
                        name: getMunicipalityTickText(row),
                        [chartKeys.INCOMING]: row.sum_incoming,
                        [chartKeys.OUTGOING]: row.sum_outgoing,
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
    }

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <TisBarChart
                bars={columnVariants.inOut}
                currency
                data={candidates[municipalTypes.regional].sort(sortBySpending)}
                title={t(labels.elections.municipalTypes.regional)}
                vertical
            />
            <PartyCandidatesTableLegacy
                candidates={partyCandidates[municipalTypes.regional]}
            />
            <TisBarChart
                bars={columnVariants.inOut}
                currency
                data={candidates[municipalTypes.local].sort(sortBySpending)}
                title={t(labels.elections.municipalTypes.local)}
                vertical
            />
            <PartyCandidatesTableLegacy
                candidates={partyCandidates[municipalTypes.local]}
            />
        </section>
    );
}

export default AllCampaigns;
