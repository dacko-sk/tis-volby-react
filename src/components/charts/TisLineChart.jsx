import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { horizontalYaxisWidth, LinesTooltip } from '../../helpers/charts';
import { t } from '../../helpers/dictionary';
import {
    currencyFormat,
    dateNumericFormat,
    dateShortFormat,
    numFormat,
    wholeCurrencyFormat,
    wholeNumFormat,
} from '../../helpers/helpers';

import { tickFontSize } from './VerticalTick';
import LastUpdateTag from '../general/LastUpdateTag';

import './Charts.scss';

function TisLineChart({
    className = '',
    currency = false,
    data,
    dataKey = 'date',
    disclaimer = null,
    labelFormatter = dateNumericFormat,
    lastUpdate = true,
    lines,
    referenceLine,
    subtitle,
    tickFormatter = dateShortFormat,
    timestamp,
    title,
}) {
    if (!data || !Array.isArray(data) || !data.length) {
        return null;
    }

    const axisNumFormat = currency ? wholeCurrencyFormat : wholeNumFormat;
    const tooltipNumFormat = currency ? currencyFormat : numFormat;
    const axisConfig = {
        fill: '#333',
        fontSize: tickFontSize,
    };
    // extend the axis domain to fit the reference line, otherwise recharts
    // scales the axis to the line data only and the reference line (and the
    // point of comparing against it) stays off-chart
    const maxDataValue = Math.max(
        ...data.flatMap((row) => lines.map((line) => row[line.key] ?? 0))
    );
    const yDomain = referenceLine
        ? [0, Math.max(maxDataValue, referenceLine.y) * 1.05]
        : [0, 'auto'];
    const tooltipContent = LinesTooltip(
        lines,
        tooltipNumFormat,
        labelFormatter
    );

    return (
        <div className={`chart-wrapper ${className}`}>
            {title && <h2 className={subtitle ? '' : 'mb-3'}>{title}</h2>}
            {subtitle && <h6>{subtitle}</h6>}
            {lastUpdate && (
                <LastUpdateTag timestamp={timestamp ?? null}>
                    {disclaimer}
                </LastUpdateTag>
            )}
            <div className="chart-outer">
                <div className="chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3" />
                            <XAxis
                                dataKey={dataKey}
                                tick={axisConfig}
                                tickFormatter={tickFormatter}
                                type="category"
                            />
                            <YAxis
                                domain={yDomain}
                                tick={axisConfig}
                                tickCount={7}
                                tickFormatter={axisNumFormat}
                                type="number"
                                width={horizontalYaxisWidth}
                            />
                            <Tooltip content={tooltipContent} />
                            {referenceLine && (
                                <ReferenceLine
                                    y={referenceLine.y}
                                    stroke={referenceLine.color ?? '#000'}
                                    strokeDasharray="6 4"
                                    label={{
                                        value: referenceLine.label,
                                        position: 'insideBottomRight',
                                        fill: referenceLine.color ?? '#000',
                                        fontSize: tickFontSize,
                                    }}
                                />
                            )}
                            {lines.map((line) => (
                                <Line
                                    key={line.key}
                                    dataKey={line.key}
                                    dot={{
                                        r: 8,
                                        fill: line.dotColor ?? line.color,
                                        stroke: '#fff',
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 8,
                                        fill: line.dotColor ?? line.color,
                                        stroke: line.dotColor ?? line.color,
                                        strokeWidth: 2,
                                    }}
                                    name={t(line.name)}
                                    stroke={line.color}
                                    strokeWidth={2}
                                    type="monotone"
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default TisLineChart;
