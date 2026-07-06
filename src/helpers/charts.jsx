import { Link } from 'react-router-dom';
import { Curve, DefaultLegendContent, Sector } from 'recharts';

import { isMobile } from './browser';
import { labels, t } from './dictionary';
import { colors } from './constants';
import { isNumeric, shortenValue } from './helpers';
import { routes, separators } from './routes';

import { municipalTypes, s22AggregatedKeys } from '../hooks/AccountsData';

const tooltipSeparator = ' : ';

export const horizontalYaxisWidth = 80;
export const verticalYaxisWidth = isMobile ? 120 : 180;

export const chartKeys = {
    AMOUNT: 'a',
    CAMPAIGN: 'c',
    GOOGLE: 'g',
    INCOMING: 'i',
    META: 'm',
    PRECAMPAIGN: 'p',
    OUTGOING: 'o',
    TOTAL: 't',
    UNIQUE: 'u',
};

export const columnVariants = {
    inOut: [
        {
            key: chartKeys.OUTGOING,
            name: labels.charts.outgoing,
            color: colors.colorOrange,
        },
        {
            key: chartKeys.INCOMING,
            name: labels.charts.incoming,
            color: colors.colorDarkBlue,
        },
    ],
    inOutStacked: [
        {
            key: chartKeys.OUTGOING,
            name: labels.charts.outgoing,
            color: colors.colorOrange,
            stackId: 'finance',
        },
        {
            key: chartKeys.INCOMING,
            name: labels.charts.incoming,
            color: colors.colorDarkBlue,
            stackId: 'finance',
        },
    ],
    finalReport: [
        {
            key: chartKeys.PRECAMPAIGN,
            name: labels.charts.precampaign,
            color: colors.colorDarkBlue,
            stackId: 'FR',
        },
        {
            key: chartKeys.CAMPAIGN,
            name: labels.charts.campaign,
            color: colors.colorOrange,
            stackId: 'FR',
        },
    ],
    spending: [
        {
            key: chartKeys.OUTGOING,
            name: labels.charts.outgoing,
            color: colors.colorLightBlue,
        },
    ],
    amount: [
        {
            key: chartKeys.AMOUNT,
            name: labels.ads.amount.title,
            color: colors.colorOrange,
        },
    ],
    donors: [
        {
            key: chartKeys.UNIQUE,
            name: labels.charts.uniqeDonors,
            color: colors.colorDarkBlue,
        },
    ],
    online: [
        {
            key: chartKeys.META,
            name: 'Meta',
            color: colors.colorDarkBlue,
            stackId: 'online',
        },
        {
            key: chartKeys.GOOGLE,
            name: 'Google',
            color: colors.colorOrange,
            stackId: 'online',
        },
    ],
};

export const tooltipNameFormat = (value) => {
    const parts = value.split(separators.newline);
    const nameStr = parts.length ? parts[0] : value;
    const cleanName = nameStr.split(separators.parts)[0];
    return <strong>{cleanName}</strong>;
};

export const tickLabel = (value, x) => {
    const args = value.split(separators.newline);
    // if tick label consist of name + \n + route name - create link to that route
    if (args.length > 1) {
        // remove 2nd argument (route name) from array, use the rest as arguments for the routing fn
        const route = args.splice(1, 1)[0];
        if (typeof routes[route] === 'function') {
            return <Link to={routes[route](...args)}>{args[0]}</Link>;
        } else if (route.includes(separators.parts)) {
            const nameParts = args[0].split(separators.parts);
            const name = nameParts.length > 1 ? nameParts[0] : args[0];
            const isElected = nameParts.length > 1;
            const parts = route.split(separators.parts);
            let town = parts.length > 1 ? parts[1] : route;
            const multiTown = town.split(' a ');
            let subTown = null;
            if (multiTown.length > 1) {
                [town, subTown] = multiTown;
            }
            const region = parts.length > 1 ? parts[0] : null;
            const dy = '1.2em';

            const nameLink = (
                <Link to={routes.candidateMunicipal(name, town, null)}>
                    {name}
                </Link>
            );
            const numLines = 1 + 1 + (args.length > 1 && args[1] ? 1 : 0);
            const firstDy = `${-((numLines - 1) * 1.2) / 2}em`;

            const firstLine = isElected ? (
                <tspan dy={firstDy} fill={colors.colorLightBlue}>
                    {nameLink}
                </tspan>
            ) : (
                <tspan dy={firstDy}>{nameLink}</tspan>
            );

            return (
                <>
                    {firstLine}
                    {town === '…' ? (
                        <tspan x={x} dy={dy} fontWeight="normal">
                            {town}
                        </tspan>
                    ) : subTown ? (
                        <tspan x={x} dy={dy} fontWeight="normal">
                            <Link to={routes.municipality(town, region)}>
                                {town}
                            </Link>
                            {' a '}
                            <Link to={routes.municipality(subTown, region)}>
                                {subTown}
                            </Link>
                        </tspan>
                    ) : (
                        <tspan x={x} dy={dy} fontWeight="normal">
                            <Link to={routes.municipality(town, region)}>
                                {town}
                            </Link>
                        </tspan>
                    )}
                    {args.length > 1 && args[1] && (
                        <tspan x={x} dy={dy} fontWeight="normal">
                            {args[1]}
                        </tspan>
                    )}
                </>
            );
        }
    }
    return value;
};

export const partyChartLabel = (party, segment) =>
    [party, 'party', ...(segment ? [segment] : [])].join(separators.newline);

export const getPartyChartLabel = partyChartLabel;

export const candidateChartLabel = (candidate, segment) =>
    [candidate, 'candidate', ...(segment ? [segment] : [])].join(
        separators.newline
    );

export const shortChartNames = (name) => shortenValue(name, isMobile ? 30 : 60);

export const preparePctData = (data, keys) => {
    const sums = keys.map(() => 0);
    const pctData = [];
    data.forEach((dataPoint) => {
        keys.forEach((key, index) => {
            sums[index] += dataPoint[key];
        });
    });
    data.forEach((dataPoint) => {
        const pctKeys = {};
        keys.forEach((key, index) => {
            pctKeys[key] = dataPoint[key] / sums[index];
        });
        pctData.push({
            ...dataPoint,
            ...pctKeys,
        });
    });
    return pctData;
};

export const prepareAvgDeltaPctData = (data, keys) => {
    const sums = keys.map(() => 0);
    const avgs = [];
    const pctData = [];
    data.forEach((dataPoint) => {
        keys.forEach((key, index) => {
            sums[index] += dataPoint[key];
        });
    });
    sums.forEach((sum, index) => {
        avgs[index] = sum / data.length;
    });
    data.forEach((dataPoint) => {
        const pctKeys = {};
        keys.forEach((key, index) => {
            pctKeys[key] = dataPoint[key] / avgs[index] - 1;
        });
        pctData.push({
            ...dataPoint,
            ...pctKeys,
        });
    });
    return pctData;
};

export const BarsTooltip = (bars, showSum, valueFormatter) =>
    function ({ active, payload }) {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            let sum = 0;
            return (
                <div className="recharts-default-tooltip">
                    <p className="recharts-tooltip-label fw-bold">
                        {tooltipNameFormat(t(dataPoint.name))}
                    </p>
                    <ul className="recharts-tooltip-item-list">
                        {bars
                            .filter(
                                (bar) =>
                                    isNumeric(dataPoint[bar.key] ?? NaN) &&
                                    dataPoint[bar.key] > 0
                            )
                            .map((bar) => {
                                sum += dataPoint[bar.key];
                                return (
                                    <li
                                        key={bar.key}
                                        className="recharts-tooltip-item"
                                        style={{ color: bar.color }}
                                    >
                                        <span className="recharts-tooltip-item-name">
                                            {t(bar.longName ?? bar.name)}
                                        </span>
                                        <span className="recharts-tooltip-item-separator">
                                            {tooltipSeparator}
                                        </span>
                                        <span className="recharts-tooltip-item-value fw-bold">
                                            {valueFormatter(dataPoint[bar.key])}
                                        </span>
                                    </li>
                                );
                            })}
                        {showSum && bars.length > 1 && (
                            <li
                                key="sum"
                                className="recharts-tooltip-item fw-bold"
                            >
                                <span className="recharts-tooltip-item-name">
                                    {t(labels.charts.sum)}
                                </span>
                                <span className="recharts-tooltip-item-separator">
                                    {tooltipSeparator}
                                </span>
                                <span className="recharts-tooltip-item-value">
                                    {valueFormatter(sum)}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            );
        }

        return null;
    };

export const PieTooltip = (dataKeys, dataLabels, formatter) =>
    function ({ active, payload }) {
        if (active && payload && payload.length) {
            return (
                <div className="recharts-default-tooltip">
                    <p
                        className="recharts-tooltip-label fw-bold"
                        style={{ color: payload[0].payload.color }}
                    >
                        {payload[0].payload.longName ?? payload[0].payload.name}
                    </p>
                    <ul className="recharts-tooltip-item-list">
                        {dataKeys.map((key, index) => (
                            <li className="recharts-tooltip-item" key={key}>
                                <span className="recharts-tooltip-item-name">
                                    {dataLabels[index]}
                                </span>
                                <span className="recharts-tooltip-item-separator">
                                    {tooltipSeparator}
                                </span>
                                <span className="recharts-tooltip-item-value fw-bold">
                                    {formatter(payload[0].payload[key])}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        return null;
    };

export const PieLabel = (showName, formatPercent, formatter) =>
    function (props) {
        const { color, cx, cy, midAngle, outerRadius, name, percent, value } =
            props;
        const RADIAN = Math.PI / 180;

        const radius = outerRadius + 25;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        let label;
        if (showName) {
            label = name;
        } else {
            label = formatter(formatPercent ? percent : value);
        }

        return (
            <text
                x={x}
                y={y}
                fill={color}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {label}
            </text>
        );
    };

export function PieLabelLine(props) {
    const { color, key, ...rest } = props;
    return <Curve key={key} {...rest} stroke={color} />;
}

export function PieSector(props) {
    const { color, innerRadius, isActive, outerRadius, key, ...rest } = props;
    return (
        <Sector
            key={key}
            {...rest}
            className={isActive ? '' : 'sector-inactive'}
            fill={color}
            innerRadius={
                isActive ? Math.round(innerRadius * 0.95) : innerRadius
            }
            outerRadius={
                isActive ? Math.round(outerRadius * 1.05) : outerRadius
            }
        />
    );
}

export function PieLegendContent(props) {
    const { payload } = props;
    // copy color from payload to legend payload
    const newPayload = payload.map((entry) => ({
        ...entry,
        color: entry.payload?.color ?? entry.color,
    }));
    return <DefaultLegendContent {...props} payload={newPayload} />;
}

export const getMunicipalityTickText = (row, showType = false) => {
    const n =
        row[s22AggregatedKeys.name] +
        (row.isElected ? `${separators.parts}*` : '');
    const type =
        showType === true
            ? separators.newline +
              t(
                  labels.elections.municipalTypes[
                      row.isRegional
                          ? municipalTypes.regional
                          : municipalTypes.local
                  ]
              )
            : '';
    return (
        n +
        separators.newline +
        row[s22AggregatedKeys.region] +
        separators.parts +
        row.municipalityShortName +
        type
    );
};

export const getMunicipalityCmsTickText = (candidate, showType = false) => {
    const type =
        showType === true
            ? separators.newline +
              t(
                  labels.elections.municipalTypes[
                      candidate?.isRegionalFunction
                          ? municipalTypes.regional
                          : municipalTypes.local
                  ]
              )
            : '';
    return (
        candidate?.person?.name +
        separators.newline +
        candidate?.region +
        separators.parts +
        candidate?.municipality +
        type
    );
};
