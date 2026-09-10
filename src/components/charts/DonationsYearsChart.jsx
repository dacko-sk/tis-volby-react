import { labels, t } from '../../helpers/dictionary';
import { sortByName } from '../../helpers/helpers';

import { pdKeys, useDonationsStatsData } from '../../hooks/Queries';

import TisBarChart, { columnVariants } from './TisBarChart';
import Loading from '../general/Loading';

function DonationsYearsChart() {
    const { data, isLoading, error } = useDonationsStatsData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const years = Object.entries(data.years ?? {})
        .map(([year, yearData]) => ({
            name: year,
            [pdKeys.DONATIONS]: yearData[pdKeys.DONATIONS],
            [pdKeys.CREDITS]: yearData[pdKeys.CREDITS],
        }))
        .sort(sortByName);

    return (
        <TisBarChart
            bars={columnVariants.donations}
            currency
            data={years}
            lastUpdate={false}
            subtitle={t(labels.charts.yearsDisclaimer)}
        />
    );
}

export default DonationsYearsChart;
