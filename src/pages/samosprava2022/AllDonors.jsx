import { chartKeys, getMunicipalityTickText } from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { setTitle, sortByDonors } from '../../helpers/helpers';

import useData, {
    municipalTypes,
    s22AggregatedKeys,
} from '../../hooks/AccountsData';

import TisBarChart, {
    columnVariants,
} from '../../components/charts/TisBarChart';
import PartyCandidatesTable from '../../components/general/PartyCandidatesTable';
import Title from '../../components/structure/Title';

export const title = 'Počet unikátnych darcov na kandidáta';

function AllDonors() {
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
    }

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
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
        </section>
    );
}

export default AllDonors;
