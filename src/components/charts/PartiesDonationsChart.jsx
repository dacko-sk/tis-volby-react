import { partyChartLabel } from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { yearUpdated } from '../../helpers/dontaions';
import { sortByNumericProp } from '../../helpers/helpers';

import { pdKeys, usePartiesDonationsData } from '../../hooks/Queries';

import TisBarChart, { columnVariants } from './TisBarChart';
import Loading from '../general/Loading';

function PartiesDonationsChart() {
    const { data, isLoading, error } = usePartiesDonationsData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const parties = {};
    Object.entries(data).forEach(([partyName, partyData]) => {
        parties[partyName] = {
            name: partyChartLabel(partyName),
            [pdKeys.DONATIONS]: partyData[pdKeys.DONATIONS],
            [pdKeys.CREDITS]: partyData[pdKeys.CREDITS],
            total: partyData[pdKeys.DONATIONS] + partyData[pdKeys.CREDITS],
        };
    });
    const totals = Object.values(parties).sort(sortByNumericProp('total'));

    return (
        <TisBarChart
            bars={columnVariants.donations}
            currency
            data={totals}
            lastUpdate={false}
            subtitle={t(labels.donations.topPartiesDisclaimer, [yearUpdated])}
            vertical
        />
    );
}

export default PartiesDonationsChart;
