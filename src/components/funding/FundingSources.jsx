import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { colors, links } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { yearUpdated } from '../../helpers/dontaions';
import { routes, segments } from '../../helpers/routes';

import useGovData from '../../hooks/GovData';
import { pdKeys, usePartiesDonationsData } from '../../hooks/Queries';

import TisPieChart from '../charts/TisPieChart';
import HeroNumber from '../general/HeroNumber';
import Loading from '../general/Loading';
import PartiesTiles from '../parties/PartiesTiles';

function FundingSources({ party }) {
    const { data, isLoading, error } = usePartiesDonationsData();
    const { getAggTotals, getCoalitionMembers, getExtremes, isCoalition } =
        useGovData();

    if (isLoading || error) {
        return <Loading error={error} />;
    }

    const coalition = isCoalition(party);
    const { paid, est } = getAggTotals(null, null, party);
    const govSum = paid + est;

    const sum = {
        [pdKeys.DONATIONS]: 0,
        [pdKeys.CREDITS]: 0,
    };
    Object.entries(data).forEach(([partyName, partyData]) => {
        if (!party || party === partyName) {
            sum[pdKeys.DONATIONS] += partyData[pdKeys.DONATIONS];
            sum[pdKeys.CREDITS] += partyData[pdKeys.CREDITS];
        }
    });

    let chart;
    if (coalition) {
        chart = Object.entries(getCoalitionMembers(party)).map(
            ([period, members]) => {
                return (
                    <div key={period}>
                        <h2 className="mb-3">
                            {t(labels.parties.coalitionMembers, [period])}
                        </h2>
                        <PartiesTiles
                            parties={Object.keys(members)}
                            compact={false}
                        />
                    </div>
                );
            }
        );
    } else if (sum[pdKeys.DONATIONS] || sum[pdKeys.CREDITS]) {
        const sourcesPie = {
            data: [
                {
                    name: t(labels.donations.donations),
                    value: sum[pdKeys.DONATIONS],
                    color: colors.colorDarkBlue,
                },
                {
                    name: t(labels.donations.credits),
                    value: sum[pdKeys.CREDITS],
                    color: colors.colorLightBlue,
                },
                {
                    name: t(labels.government.navTitle),
                    value: paid,
                    color: colors.colorOrange,
                },
                {
                    name: t(labels.government.estimate),
                    value: est,
                    color: colors.colorOrangeDs,
                },
            ].filter(
                // show only non-zero segments
                (segment) => segment.value
            ),
            nameKey: 'name',
            dataKey: 'value',
            label: t(labels.charts.amount),
        };

        chart = (
            <TisPieChart
                currency
                lastUpdate={false}
                pie={sourcesPie}
                percent={false}
                subtitle={t(
                    labels.funding[`sourcesDisclaimer${party ? 'Party' : ''}`],
                    Object.values(getExtremes())
                )}
                title={t(labels.funding.sourcesTitle)}
            />
        );
    } else {
        chart = (
            <HeroNumber
                button={t(labels.donate.buttonLong)}
                disclaimer={t(labels.donations.noData)}
                link={links.donateUrl}
                number="N/A"
                title={t(labels.donations.dac)}
            />
        );
    }

    return (
        <Row>
            <Col xl={6}>{chart}</Col>
            <Col xl={6} className="mt-4 mt-xl-0">
                {!coalition && sum[pdKeys.DONATIONS] > 0 && (
                    <HeroNumber
                        className="mb-4"
                        button={t(labels.donations.learnMore)}
                        disclaimer={t(
                            labels.donations[
                                party
                                    ? 'totalDisclaimerParty'
                                    : 'totalDisclaimer'
                            ],
                            [yearUpdated]
                        )}
                        link={
                            party
                                ? routes.party(party, segments.DONATIONS)
                                : routes.donations()
                        }
                        number={sum[pdKeys.DONATIONS] + sum[pdKeys.CREDITS]}
                        title={t(labels.donations.dac)}
                    />
                )}
                <HeroNumber
                    button={govSum ? t(labels.government.learnMore) : null}
                    disclaimer={t(
                        labels.government[
                            party ? 'totalDisclaimerParty' : 'totalDisclaimer'
                        ],
                        Object.values(getExtremes())
                    )}
                    link={
                        party
                            ? routes.party(party, segments.GOVERNMENT)
                            : routes.government()
                    }
                    number={govSum}
                    title={t(labels.government.navTitle)}
                />
            </Col>
        </Row>
    );
}

export default FundingSources;
