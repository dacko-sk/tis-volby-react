import { getMunicipalityCmsTickText } from '../../helpers/charts';
import { colors } from '../../helpers/constants';
import { labels } from '../../helpers/dictionary';
import { getCurrentLanguage, languages } from '../../helpers/languages';

import { useCmsCharts } from '../../hooks/CmsQueries';

import TisBarChart from './TisBarChart';

const AMOUNT_KEY = 'amount';

const localized = (sk, en) =>
    getCurrentLanguage() === languages.en && en ? en : sk;

function CmsCharts({ election, placement = null }) {
    const { data: charts } = useCmsCharts(election, placement);

    if (!charts || !charts.length) {
        return null;
    }

    return (
        <>
            {charts.map((chart) => (
                <TisBarChart
                    key={chart.uid}
                    bars={[
                        {
                            key: AMOUNT_KEY,
                            name: labels.charts.outgoing,
                            color: chart.color || colors.colorOrange,
                        },
                    ]}
                    className="my-4"
                    currency
                    data={(chart.chartItems || []).map((item) => ({
                        name: getMunicipalityCmsTickText(item.candidate, true),
                        [AMOUNT_KEY]: item.amount,
                    }))}
                    disclaimer={localized(chart.disclaimer, chart.disclaimerEn)}
                    subtitle={localized(chart.subtitle, chart.subtitleEn)}
                    timestamp={chart.updated}
                    title={localized(chart.title, chart.titleEn)}
                    vertical
                />
            ))}
        </>
    );
}

export default CmsCharts;
