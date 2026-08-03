import Button from 'react-bootstrap/Button';
import { Link } from 'react-router';

import { partyChartLabel } from '../../helpers/charts';
import { labels, t } from '../../helpers/dictionary';
import { sortByNumericProp, sumOfValues } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import useGovData from '../../hooks/GovData';
import { pdKeys, usePartiesDonationsData } from '../../hooks/Queries';

import TisBarChart, { columnVariants } from './TisBarChart';
import Loading from '../general/Loading';

function PartiesFundingChart({ className, limit, title }) {
    const { data, isLoading, error } = usePartiesDonationsData();
    const { getPartiesTotals, getExtremes } = useGovData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const parties = {};
    Object.entries(getPartiesTotals()).forEach(([partyName, stages]) => {
        if (!(parties[partyName] ?? false)) {
            parties[partyName] = {
                name: partyChartLabel(partyName),
                total: 0,
            };
        }
        Object.entries(stages).forEach(([stage, subsidyTypes]) => {
            const amount = sumOfValues(subsidyTypes);
            parties[partyName][stage] = amount;
            parties[partyName].total += amount;
        });
    });
    Object.entries(data).forEach(([partyName, partyData]) => {
        if (!(parties[partyName] ?? false)) {
            parties[partyName] = {
                name: partyChartLabel(partyName),
                total: 0,
            };
        }
        parties[partyName][pdKeys.DONATIONS] = partyData[pdKeys.DONATIONS];
        parties[partyName][pdKeys.CREDITS] = partyData[pdKeys.CREDITS];
        parties[partyName].total +=
            partyData[pdKeys.DONATIONS] + partyData[pdKeys.CREDITS];
    });
    const totals = Object.values(parties).sort(sortByNumericProp('total'));

    return totals.length ? (
        <>
            <TisBarChart
                className={className}
                bars={columnVariants.funding}
                currency
                data={limit ? totals.slice(0, limit) : totals}
                lastUpdate={false}
                subtitle={t(
                    labels.funding.partiesTotalDisclaimer,
                    Object.values(getExtremes())
                )}
                title={title}
                vertical
            />
            {limit && (
                <div className="text-center mt-3">
                    <Button
                        as={Link}
                        to={routes.government()}
                        variant="secondary"
                    >
                        {t(labels.funding.learnMore)}
                    </Button>
                </div>
            )}
        </>
    ) : null;
}

export default PartiesFundingChart;
