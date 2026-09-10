import { colors } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { yearUpdated } from '../../helpers/dontaions';

import { pdKeys, useDonationsStatsData } from '../../hooks/Queries';

import TisPieChart from './TisPieChart';
import Loading from '../general/Loading';

const genderColors = {
    F: [colors.colorOrange, colors.colorOrangeDs],
    M: [colors.colorDarkBlue, colors.colorDarkBlueDs],
    firma: [colors.colorLightBlue, colors.colorLightBlueDs],
};

function DonationsGendersChart() {
    const { data, isLoading, error } = useDonationsStatsData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const gendersPie = {
        data: Object.entries(data.genders ?? {}).flatMap(([g, gData]) =>
            labels.genders[g] ?? false
                ? [
                      {
                          name: `${t(labels.genders[g])} (${t(labels.donations.donations)})`,
                          value: gData[pdKeys.DONATIONS],
                          color: genderColors[g][0],
                      },
                      {
                          name: `${t(labels.genders[g])} (${t(labels.donations.credits)})`,
                          value: gData[pdKeys.CREDITS],
                          color: genderColors[g][1],
                      },
                  ]
                : []
        ),
        color: colors.colorLightBlue,
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.charts.amount),
    };

    return (
        <TisPieChart
            currency
            lastUpdate={false}
            percent={false}
            pie={gendersPie}
            subtitle={t(labels.donations.totalDisclaimer, [yearUpdated])}
            title={t(labels.charts.gendersTitle)}
        />
    );
}

export default DonationsGendersChart;
