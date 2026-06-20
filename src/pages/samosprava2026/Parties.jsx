import TisBarChart from '../../components/charts/TisBarChart';
import Title from '../../components/structure/Title';

import {
    chartKeys,
    columnVariants,
    getPartyChartLabel,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { setTitle, sortBySpending } from '../../helpers/helpers';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import { findSubject, useElectionData } from '../../hooks/CmsQueries';

function Parties() {
    const { csvData } = useData();
    const { data: cmsData } = useElectionData();

    // parse data
    const parties = [];
    if (csvData?.data) {
        csvData.data.forEach((row) => {
            if (
                findSubject(
                    cmsData,
                    row[aggregatedKeys.name],
                    row[aggregatedKeys.account]
                )
            ) {
                parties.push({
                    name: getPartyChartLabel(row[aggregatedKeys.name]),
                    [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                    [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                });
            }
        });
        parties.sort(sortBySpending);
    }

    const title = t(labels.parties.navTitle);
    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>

            <TisBarChart
                className="my-4"
                title={t(labels.charts.partiesTitle)}
                subtitle={t(labels.charts.regionsSubtitle)}
                bars={columnVariants.inOut}
                data={parties}
                namesLength={30}
                currency
                vertical
            />
        </section>
    );
}

export default Parties;
