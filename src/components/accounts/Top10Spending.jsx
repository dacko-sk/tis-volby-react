import {
    chartKeys,
    columnVariants,
    getMunicipalityTickText,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { sortBySpending } from '../../helpers/helpers';
import { getActiveSubsite } from '../../helpers/languages';
import { routes } from '../../helpers/routes';

import useData from '../../hooks/AccountsData';

import TisBarChart from '../charts/TisBarChart';

function Top10Spending() {
    const { csvData } = useData();

    // parse data
    const people = {};
    if (csvData?.data) {
        csvData.data.forEach((row) => {
            if (row.url && !row.isParty) {
                const unqKey = row.url || row.name;
                // add each candidate only once and prioritize regional campaign over local
                if (people[unqKey] === undefined || row.isRegional) {
                    people[unqKey] = {
                        name: getMunicipalityTickText(row, true) || row.name,
                        [chartKeys.INCOMING]: row.sum_incoming,
                        [chartKeys.OUTGOING]: row.sum_outgoing,
                    };
                }
            }
        });
    }

    return (
        <TisBarChart
            bars={columnVariants.inOut}
            buttonLink={
                getActiveSubsite() === 'samosprava2026'
                    ? routes.candidates()
                    : routes.charts()
            }
            currency
            data={Object.values(people).sort(sortBySpending).slice(0, 10)}
            title={t(labels.charts.Top10SpendingTitle)}
            vertical
        />
    );
}

export default Top10Spending;
