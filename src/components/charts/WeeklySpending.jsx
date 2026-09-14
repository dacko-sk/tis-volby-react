import { useQuery } from '@tanstack/react-query';

import { apiEndpoints, spending2022 } from '../../helpers/accounts';
import { chartKeys } from '../../helpers/charts';
import { colors } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { currencyFormat } from '../../helpers/helpers';

import TisLineChart from './TisLineChart';

const lines = [
    {
        key: chartKeys.AMOUNT,
        name: labels.charts.weeklySpendingSeries,
        color: colors.colorLightBlue,
        dotColor: colors.colorOrange,
    },
];

function WeeklySpending() {
    const wq = useQuery({
        queryKey: ['weekly_spending'],
        queryFn: () =>
            fetch(apiEndpoints.weeklySpending).then((response) =>
                response.json()
            ),
        refetchOnMount: false,
    });

    const data = (wq.data ?? []).map((row) => ({
        date: row.date,
        [chartKeys.AMOUNT]: row.amount,
    }));

    return (
        <TisLineChart
            className="aspect-11-4 my-4"
            currency
            data={data}
            lastUpdate={false}
            lines={lines}
            referenceLine={{
                y: spending2022,
                label: `${t(
                    labels.charts.weeklySpendingPreviousElections
                )}: ${currencyFormat(spending2022)}`,
                color: colors.colorDarkBlue,
            }}
            title={t(labels.charts.weeklySpendingTitle)}
        />
    );
}

export default WeeklySpending;
