import { colors } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { yearUpdated } from '../../helpers/dontaions';

import { pdKeys, useDonationsStatsData } from '../../hooks/Queries';

import TisPieChart from './TisPieChart';
import Loading from '../general/Loading';

const genderColors = {
    F: colors.colorOrange,
    M: colors.colorDarkBlue,
    firma: colors.colorLightBlue,
};

function DonationsGendersUniqueChart() {
    const { data, isLoading, error } = useDonationsStatsData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const gendersPie = {
        data: Object.entries(data.genders ?? {}).flatMap(([g, gData]) =>
            labels.genders[g] ?? false
                ? [
                      {
                          name: t(labels.genders[g]),
                          value: gData[pdKeys.UNIQUE],
                          color: genderColors[g],
                      },
                  ]
                : []
        ),
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.donations.uniqueDonors),
    };

    return (
        <TisPieChart
            lastUpdate={false}
            percent={false}
            pie={gendersPie}
            subtitle={t(labels.donations.uniqueDonorsDisclaimer, [yearUpdated])}
            title={t(labels.charts.gendersUniqueTitle)}
        />
    );
}

export default DonationsGendersUniqueChart;
