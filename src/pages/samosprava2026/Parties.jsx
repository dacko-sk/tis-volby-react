import { getPartyChartLabel } from '../../helpers/charts';
import { setTitle, sortBySpending } from '../../helpers/helpers';
import useData, { tempExtraAccountKeys } from '../../hooks/AccountsData';
import TisBarChart from '../../components/charts/TisBarChart';
import { chartKeys, columnVariants } from '../../helpers/charts';
import Title from '../../components/structure/Title';
import { labels, t } from '../../helpers/dictionary';

function Parties() {
    const { csvData } = useData();

    // parse data
    const parties = [];
    if (csvData?.data) {
        csvData.data.forEach((row) => {
            if (
                row?.[tempExtraAccountKeys.region] !== undefined &&
                row.isTransparent &&
                row.isParty
            ) {
                parties.push({
                    name: getPartyChartLabel(row[tempExtraAccountKeys.name]),
                    [chartKeys.INCOMING]: row.sum_incoming,
                    [chartKeys.OUTGOING]: row.sum_outgoing,
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
