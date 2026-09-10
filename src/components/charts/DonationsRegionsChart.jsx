import { labels, t } from '../../helpers/dictionary';
import { yearUpdated } from '../../helpers/dontaions';
import { sortByNumericProp } from '../../helpers/helpers';

import { pdKeys, useDonationsStatsData } from '../../hooks/Queries';

import TisBarChart, { columnVariants } from './TisBarChart';
import Loading from '../general/Loading';

function DonationsRegionsChart() {
    const { data, isLoading, error } = useDonationsStatsData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const regions = Object.entries(data.regions ?? {})
        .flatMap(([region, regData]) => {
            const regionLabel = labels.regions[region];
            return regionLabel
                ? [
                      {
                          name: t(regionLabel),
                          [pdKeys.DONATIONS]: regData[pdKeys.DONATIONS],
                          [pdKeys.CREDITS]: regData[pdKeys.CREDITS],
                          total:
                              regData[pdKeys.DONATIONS] +
                              regData[pdKeys.CREDITS],
                      },
                  ]
                : [];
        })
        .sort(sortByNumericProp('total'));

    return (
        <TisBarChart
            bars={columnVariants.donations}
            currency
            data={regions}
            lastUpdate={false}
            subtitle={t(labels.charts.regionsDisclaimer, [yearUpdated])}
            vertical
        />
    );
}

export default DonationsRegionsChart;
