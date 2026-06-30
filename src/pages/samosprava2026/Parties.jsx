import TisBarChart from '../../components/charts/TisBarChart';
import Title from '../../components/structure/Title';
import Loading from '../../components/general/Loading';

import {
    chartKeys,
    columnVariants,
    getPartyChartLabel,
} from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { setTitle, sortBySpending } from '../../helpers/helpers';

import useData, { aggregatedKeys } from '../../hooks/AccountsData';
import { getSubjectShortname, useElectionData } from '../../hooks/CmsQueries';

function Parties() {
    const { csvData } = useData();
    const { data: cmsData, isLoading } = useElectionData();

    // parse data
    const parties = [];
    if (cmsData?.subjects) {
        cmsData.subjects.forEach((subject) => {
            if (subject.account && csvData?.data) {
                const row = csvData.data.find(
                    (r) =>
                        r[aggregatedKeys.name] === subject.name &&
                        r[aggregatedKeys.account] === subject.account
                );
                if (row) {
                    parties.push({
                        name: getPartyChartLabel(getSubjectShortname(subject)),
                        [chartKeys.INCOMING]: row[aggregatedKeys.incoming],
                        [chartKeys.OUTGOING]: row[aggregatedKeys.outgoing],
                    });
                }
            }
        });
        parties.sort(sortBySpending);
    }

    const title = t(labels.parties.navTitle);
    setTitle(title);

    if (isLoading) {
        return <Loading />;
    }

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
