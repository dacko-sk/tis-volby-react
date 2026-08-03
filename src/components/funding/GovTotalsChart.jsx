import Button from 'react-bootstrap/Button';
import { Link } from 'react-router';

import { partyChartLabel } from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { sortByNumericProp, sumOfValues } from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

import useGovData, { csvKeys } from '../../hooks/GovData';

import TisBarChart, { subsidyBars } from '../charts/TisBarChart';

function GovTotalsChart({ limit, period }) {
    const { getPartiesTotals, getExtremes } = useGovData();

    const parties = {};
    Object.entries(getPartiesTotals(period)).forEach(([partyName, stages]) => {
        if (!(parties[partyName] ?? false)) {
            // paid subsidies
            const paid = stages.paid ?? {};
            parties[partyName] = {
                ...paid,
                name: partyChartLabel(partyName, segments.GOVERNMENT),
                total: sumOfValues(paid),
            };
            // future subsidies estimates
            Object.entries(stages.est ?? {}).forEach(([key, amount]) => {
                parties[partyName][key + csvKeys.ESTIMATE] = amount;
                parties[partyName].total += amount;
            });
        }
    });
    const totals = Object.values(parties).sort(sortByNumericProp('total'));
    const columns = limit ? totals.slice(0, limit) : totals;

    return totals.length ? (
        <>
            <TisBarChart
                className="mt-4"
                bars={subsidyBars(true, false, columns)}
                currency
                data={columns}
                lastUpdate={false}
                subtitle={t(
                    labels.government[
                        `partiesTotal${period ? 'Period' : ''}Disclaimer`
                    ],
                    Object.values(getExtremes())
                )}
                title={t(
                    labels.government[
                        `partiesTotal${!limit && !period ? 'All' : ''}${
                            period ? 'Period' : ''
                        }`
                    ],
                    limit ? [limit] : []
                )}
                vertical
            />
            {limit && (
                <div className="text-center mt-3">
                    <Button
                        as={Link}
                        to={routes.government()}
                        variant="secondary"
                    >
                        {t(labels.government.learnMore)}
                    </Button>
                </div>
            )}
        </>
    ) : null;
}

export default GovTotalsChart;
