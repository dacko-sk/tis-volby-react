import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Rectangle,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {
    BarsTooltip,
    chartKeys,
    horizontalYaxisWidth,
    prepareAvgDeltaPctData,
    shortChartNames,
    verticalYaxisWidth,
} from '../../helpers/charts';
import { colors } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import {
    currencyFormat,
    humanPctFormat,
    humanPctSignFormat,
    numFormat,
    wholeCurrencyFormat,
    wholeNumFormat,
} from '../../helpers/helpers';
import { separators } from '../../helpers/routes';

import { csvKeys, subsidyColors, subsidyTypes } from '../../hooks/GovData';
import { pdKeys } from '../../hooks/Queries';

import HorizontalTick from './HorizontalTick';
import VerticalTick, { tickFontSize } from './VerticalTick';
import LastUpdateTag from '../general/LastUpdateTag';

import './Charts.scss';

export const columnVariants = {
    donations: [
        {
            key: pdKeys.DONATIONS,
            name: labels.donations.donations,
            color: colors.colorDarkBlue,
            stackId: 'funding',
        },
        {
            key: pdKeys.CREDITS,
            name: labels.donations.credits,
            color: colors.colorLightBlue,
            stackId: 'funding',
        },
    ],
    funding: [
        {
            key: pdKeys.DONATIONS,
            name: labels.donations.donations,
            color: colors.colorDarkBlue,
            stackId: 'funding',
        },
        {
            key: pdKeys.CREDITS,
            name: labels.donations.credits,
            color: colors.colorLightBlue,
            stackId: 'funding',
        },
        {
            key: 'paid',
            name: labels.government.navTitle,
            color: colors.colorOrange,
            stackId: 'funding',
        },
        {
            key: 'est',
            name: labels.government.estimate,
            color: colors.colorOrangeDs,
            stackId: 'funding',
        },
    ],
    subsidies: [
        {
            key: 'incoming',
            name: labels.government.navTitle,
            color: colors.colorDarkBlue,
        },
    ],
    uniqueDonors: [
        {
            key: pdKeys.UNIQUE,
            name: labels.donations.uniqueDonors,
            color: colors.colorOrange,
        },
    ],
    donors: [
        {
            key: chartKeys.UNIQUE,
            name: labels.donations.uniqueDonors,
            color: colors.colorDarkBlue,
        },
    ],
    adsSpending: [
        {
            key: 'total_spend',
            name: 'Výdavky na FB reklamu',
            color: colors.colorOrange,
        },
    ],
    adsAmount: [
        {
            key: 'total_ad_count',
            name: 'Všetky sponzorované príspevky',
            color: colors.colorDarkBlue,
        },
        {
            key: 'total_ads_tagged',
            name: 'Označená politická reklama',
            color: colors.colorLightBlue,
            stackId: 'total',
        },
        {
            key: 'total_ads_missing_attribution',
            name: 'Nesprávne označená politická reklama',
            color: colors.colorOrange,
            stackId: 'total',
        },
    ],
};

export const subsidyBars = (stacked, reversed, data) => {
    const st = reversed ? subsidyTypes.slice().reverse() : subsidyTypes;
    const bars = [
        ...st.map((type) => ({
            key: type,
            name: labels.government[type].short,
            longName: labels.government[type].long,
            color: subsidyColors[type].paid,
            stackId: stacked ? 'govtypes' : null,
        })),
        ...st.map((type) => ({
            key: type + csvKeys.ESTIMATE,
            name: labels.government[type].est,
            longName: labels.government[type].estLong,
            color: subsidyColors[type].est,
            stackId: stacked ? 'govtypes' : null,
        })),
    ];
    // show legend only for bars which have some values in data points
    if (data) {
        return bars.filter((bar) =>
            data.some((dataPoint) => dataPoint[bar.key] ?? false)
        );
    }
    return bars;
};

function TisBarChart({
    barHeight,
    bars = columnVariants.subsidies,
    buttonLink,
    buttonText,
    children,
    className = '',
    currency = false,
    data,
    diffFromAverage = false,
    disclaimer = null,
    lastUpdate = true,
    percent = false,
    scrollable = false,
    showSum = true,
    subtitle,
    timestamp,
    title,
    vertical = false,
}) {
    if (!data || !Array.isArray(data) || !data.length) {
        return null;
        console.log('TisBarChart rendering:', title || subtitle, bars, data);
    }

    const dataKeys = bars.map((bar) => bar.key);
    const parsedData = diffFromAverage
        ? prepareAvgDeltaPctData(data, dataKeys)
        : data;

    const barElements = bars.map((bar) => (
        <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            name={t(bar.name)}
            label={bar.label ?? null}
            stackId={bar.stackId ?? null}
        >
            {parsedData.map((dataObj, index) => (
                <Cell key={`cell-${index}`} fill={dataObj.color ?? bar.color} />
            ))}
            {bar.labelList ?? null}
        </Bar>
    ));

    let labelLines = 1;
    parsedData.forEach((row) => {
        labelLines = Math.max(
            labelLines,
            row.name.split(separators.newline).length
        );
    });

    let axisNumFormat = currency ? wholeCurrencyFormat : wholeNumFormat;
    let tooltipNumFormat = currency ? currencyFormat : numFormat;
    if (diffFromAverage) {
        axisNumFormat = humanPctSignFormat;
        tooltipNumFormat = humanPctSignFormat;
    } else if (percent) {
        axisNumFormat = humanPctFormat;
        tooltipNumFormat = humanPctFormat;
    }
    const axisConfig = {
        fill: '#333',
        fontSize: tickFontSize,
    };
    const hasIncomingAndOutgoing =
        bars.some((bar) => bar.key === chartKeys.INCOMING) &&
        bars.some((bar) => bar.key === chartKeys.OUTGOING);
    const finalShowSum = showSum && !hasIncomingAndOutgoing;
    const tooltipContent = BarsTooltip(bars, finalShowSum, tooltipNumFormat);

    const refLine = diffFromAverage ? (
        <ReferenceLine
            x={vertical ? 0 : null}
            y={vertical ? null : 0}
            stroke="#000"
        />
    ) : null;

    return (
        <div className={`chart-wrapper ${className}`}>
            {title && <h2 className={subtitle ? '' : 'mb-3'}>{title}</h2>}
            {subtitle && <h6>{subtitle}</h6>}
            {lastUpdate && (
                <LastUpdateTag timestamp={timestamp ?? null}>
                    {disclaimer}
                </LastUpdateTag>
            )}
            <div className={`chart-outer${scrollable ? ' scrollable' : ''}`}>
                <div
                    className={`chart${diffFromAverage ? ' avg-diff' : ''}`}
                    style={
                        vertical
                            ? {
                                  height: `${
                                      55 +
                                      data.length *
                                          (barHeight ??
                                              Math.max(2, labelLines) * 20)
                                  }px`,
                              }
                            : {}
                    }
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={parsedData}
                            layout={vertical ? 'vertical' : 'horizontal'}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3"
                                horizontal={!vertical}
                                vertical={vertical}
                            />
                            {vertical ? (
                                <XAxis
                                    domain={percent ? [0, 1] : null}
                                    tickCount={7}
                                    tickFormatter={axisNumFormat}
                                    tick={axisConfig}
                                    type="number"
                                />
                            ) : (
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    height={15 + labelLines * 15}
                                    minTickGap={-10}
                                    tickFormatter={shortChartNames}
                                    tick={
                                        labelLines > 1 ? (
                                            <HorizontalTick />
                                        ) : (
                                            axisConfig
                                        )
                                    }
                                    type="category"
                                />
                            )}
                            {vertical ? (
                                <YAxis
                                    dataKey="name"
                                    interval={0}
                                    minTickGap={-15}
                                    tick={
                                        labelLines > 1 ? (
                                            <VerticalTick />
                                        ) : (
                                            axisConfig
                                        )
                                    }
                                    tickFormatter={shortChartNames}
                                    type="category"
                                    width={verticalYaxisWidth}
                                />
                            ) : (
                                <YAxis
                                    domain={percent ? [0, 1] : null}
                                    tick={axisConfig}
                                    tickCount={7}
                                    tickFormatter={axisNumFormat}
                                    type="number"
                                    width={horizontalYaxisWidth}
                                />
                            )}
                            <Tooltip content={tooltipContent} />
                            <Legend itemSorter={null} />
                            {refLine}
                            {barElements}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {children}
            {buttonLink && (
                <div className="buttons mt-3 text-center">
                    <Button as={Link} to={buttonLink} variant="secondary">
                        {buttonText ?? t(labels.showMore)}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default TisBarChart;
