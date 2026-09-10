import { partyChartLabel } from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { yearUpdated } from '../../helpers/dontaions';
import { sortByNumericProp } from '../../helpers/helpers';

import { pdKeys, usePartiesDonationsData } from '../../hooks/Queries';

import TisBarChart, { columnVariants } from './TisBarChart';
import Loading from '../general/Loading';

function PartiesUniqueChart() {
    const { data, isLoading, error } = usePartiesDonationsData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const parties = {};
    Object.entries(data).forEach(([partyName, partyData]) => {
        parties[partyName] = {
            name: partyChartLabel(partyName),
            unique: partyData[pdKeys.UNIQUE],
        };
    });
    const totals = Object.values(parties).sort(sortByNumericProp('unique'));

    return (
        <TisBarChart
            bars={columnVariants.uniqueDonors}
            data={totals}
            lastUpdate={false}
            subtitle={t(labels.donations.uniqueDonorsDisclaimer, [yearUpdated])}
            vertical
        />
    );
}

export default PartiesUniqueChart;
