import {
    chartKeys,
    columnVariants,
    getMunicipalityCmsTickText,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { sortBySpending } from '../../helpers/helpers';
import { getActiveSubsite } from '../../helpers/languages';
import { routes } from '../../helpers/routes';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import {
    findCandidate,
    useElectionData,
} from '../../hooks/CmsQueries';

import TisBarChart from '../charts/TisBarChart';

function Top10Spending() {
    const { csvData } = useData();
    const { data: cmsData } = useElectionData();

    // parse data
    const people = {};
    if (csvData?.data) {
        csvData.data.forEach((row) => {
            const cmsCandidate = findCandidate(
                cmsData,
                row[aggregatedKeys.name],
                row[aggregatedKeys.account]
            );
            if (cmsCandidate && row[aggregatedKeys.account]) {
                const unqKey =
                    row[aggregatedKeys.account] || row[aggregatedKeys.name];
                // add each candidate only once and prioritize regional campaign over local
                const isRegional = cmsCandidate?.isRegionalFunction;
                if (people[unqKey] === undefined || isRegional) {
                    people[unqKey] = {
                        name: getMunicipalityCmsTickText(cmsCandidate, true),
                        [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                        [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
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
