import { useState } from 'react';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import Tooltip from 'react-bootstrap/Tooltip';

import { labels, t } from '../../helpers/dictionary';
import { currencyFormat, nl2r } from '../../helpers/helpers';
import { colors } from '../../helpers/constants';
import { useDemoMode } from '../../helpers/demoMode';
import {
    diffAssetField,
    extractLoanDate,
    extractLvId,
    findPreviousDeclaration,
} from '../../helpers/assetDeclarations';

import DownloadLink from '../general/DownloadLink';
import TisBarChart from '../charts/TisBarChart';

import flagChangedIcon from '../../../public/img/asset-flag-changed.svg?url';
import flagUnchangedIcon from '../../../public/img/asset-flag-unchanged.svg?url';

// Row config for the Majetky (assets) table - shared between the cell
// rendering and the year-over-year diff lookup below.
const assetRows = [
    {
        key: 'real_estates',
        label: labels.assetDeclarations.real_estates,
        groupBy: extractLvId,
    },
    { key: 'movable', label: labels.assetDeclarations.movable },
    {
        key: 'property_rights',
        label: labels.assetDeclarations.property_rights,
    },
    {
        key: 'credits',
        label: labels.assetDeclarations.credits,
        groupBy: extractLoanDate,
    },
    {
        key: 'use_real_estates',
        label: labels.assetDeclarations.use_real_estates,
    },
    { key: 'use_movable', label: labels.assetDeclarations.use_movable },
    { key: 'donations', label: labels.assetDeclarations.donations },
];

// Renders a field's lines with <br/> between them, optionally highlighting
// the ones that differ from the previous year's declaration.
function renderAssetFieldLines(lines, highlightDiff) {
    if (!lines.length) return null;
    return lines.map((line, index) => (
        <span key={index}>
            {index > 0 && <br />}
            <span
                className={
                    highlightDiff && line.changed
                        ? 'bg-warning-subtle'
                        : undefined
                }
            >
                {line.text}
            </span>
        </span>
    ));
}

function AssetDeclarationData({ declarations = [], extended = [] }) {
    const [showDiff, setShowDiff] = useState(false);
    const isDemo = useDemoMode();

    // Chronologically sorted declarations for chart (ascending years)
    const sortedForChart = [...declarations]
        .sort((a, b) => a.year - b.year)
        .map((decl) => ({
            name: decl.year.toString(),
            income_function: decl.income_function,
            income_other: decl.income_other,
            total: decl.income_function + decl.income_other,
        }));

    // Reverse sorted declarations for tabs (descending years - latest first)
    const sortedForTabs = [...declarations].sort((a, b) => b.year - a.year);
    const latestYear = sortedForTabs[0]?.year?.toString();

    const barsConfig = [
        {
            key: 'income_function',
            name: labels.assetDeclarations.income_function,
            color: colors.colorDarkBlue,
        },
        {
            key: 'income_other',
            name: labels.assetDeclarations.income_other,
            color: colors.colorLightBlue,
        },
    ];

    return (
        <div className="asset-declaration-data">
            {/* Income stacked bar chart */}
            {sortedForChart.length > 0 && (
                <Row className="mb-5">
                    <Col lg={12}>
                        <Card className="shadow-sm border-0 p-4">
                            <Card.Body>
                                <TisBarChart
                                    bars={barsConfig}
                                    currency
                                    data={sortedForChart}
                                    lastUpdate={false}
                                    subtitle={t(
                                        labels.assetDeclarations.yearsDisclaimer
                                    )}
                                    showSum
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Extended Asset Declarations */}
            {extended && extended.length > 0 && (
                <Row className="mb-5">
                    <Col lg={12}>
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-secondary text-white fw-bold py-3">
                                📄 {t(labels.assetDeclarations.extendedReports)}
                            </Card.Header>
                            <div>
                                {extended.map((ext, i) => (
                                    <DownloadLink key={i} to={ext.url}>
                                        {ext.title ||
                                            t(
                                                labels.assetDeclarations
                                                    .extendedReport
                                            )}
                                    </DownloadLink>
                                ))}
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Tabbed declarations per year */}
            {sortedForTabs.length > 0 && (
                <Row>
                    <Col lg={12}>
                        <h3 className="mb-4 text-center fw-bold">
                            {t(labels.assetDeclarations.declarationsByYear)}
                        </h3>
                        <Tabs
                            defaultActiveKey={latestYear}
                            id="declaration-years-tabs"
                            className="mb-4 justify-content-center custom-tabs"
                        >
                            {sortedForTabs.map((decl) => {
                                const reportedOnStartLabel =
                                    decl.reported_on_start
                                        ? t(
                                              labels.assetDeclarations
                                                  .reported_on_start_true
                                          )
                                        : t(
                                              labels.assetDeclarations
                                                  .reported_on_start_false
                                          );

                                const functionConditionLabel =
                                    decl.function_condition
                                        ? t(
                                              labels.assetDeclarations
                                                  .function_condition_true
                                          )
                                        : t(
                                              labels.assetDeclarations
                                                  .function_condition_false
                                          );

                                const prevDecl = findPreviousDeclaration(
                                    decl,
                                    declarations
                                );

                                return (
                                    <Tab
                                        key={decl.year}
                                        eventKey={decl.year.toString()}
                                        title={decl.year.toString()}
                                    >
                                        <Row className="g-4">
                                            <Col md={6}>
                                                {/* Table 1: Basic Info Cards */}
                                                <Card className="shadow-sm border-0">
                                                    <Card.Header className="bg-primary text-white fw-bold py-3">
                                                        ℹ️{' '}
                                                        {t(labels.usefulInfo)}
                                                    </Card.Header>
                                                    <Table
                                                        responsive
                                                        className="mb-0 align-middle"
                                                    >
                                                        <tbody>
                                                            <tr>
                                                                <th className="ps-3 py-3 w-40">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .reported_on_start
                                                                    )}
                                                                </th>
                                                                <td className="pe-3 py-3 text-end fw-semibold">
                                                                    {
                                                                        reportedOnStartLabel
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className="ps-3 py-3">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .public_function
                                                                    )}
                                                                </th>
                                                                <td className="pe-3 py-3 text-end">
                                                                    {nl2r(
                                                                        decl.public_function
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className="ps-3 py-3">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .employee
                                                                    )}
                                                                </th>
                                                                <td className="pe-3 py-3 text-end text-break">
                                                                    {nl2r(
                                                                        decl.employee
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className="ps-3 py-3">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .business
                                                                    )}
                                                                </th>
                                                                <td className="pe-3 py-3 text-end">
                                                                    {nl2r(
                                                                        decl.business
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className="ps-3 py-3">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .other_functions
                                                                    )}
                                                                </th>
                                                                <td className="pe-3 py-3 text-end">
                                                                    {nl2r(
                                                                        decl.other_functions
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Card>
                                            </Col>

                                            <Col md={6}>
                                                {/* Table 2: Incomes info */}
                                                <Card className="shadow-sm border-0">
                                                    <Card.Header className="bg-primary text-white fw-bold py-3">
                                                        💰{' '}
                                                        {t(
                                                            labels.charts
                                                                .incoming
                                                        )}
                                                    </Card.Header>
                                                    <Table
                                                        responsive
                                                        className="mb-0 align-middle"
                                                    >
                                                        <tbody>
                                                            <tr>
                                                                <th className="ps-3 py-3">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .income_function
                                                                    )}
                                                                </th>
                                                                <td
                                                                    className="pe-3 py-3 text-end fw-bold text-primary"
                                                                    style={{
                                                                        fontSize:
                                                                            '1.1rem',
                                                                    }}
                                                                >
                                                                    {currencyFormat(
                                                                        decl.income_function
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className="ps-3 py-3">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .income_other
                                                                    )}
                                                                </th>
                                                                <td
                                                                    className="pe-3 py-3 text-end fw-bold text-secondary"
                                                                    style={{
                                                                        fontSize:
                                                                            '1.1rem',
                                                                    }}
                                                                >
                                                                    {currencyFormat(
                                                                        decl.income_other
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr className="bg-light">
                                                                <th className="ps-3 py-3 fw-bold">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .income_total
                                                                    )}
                                                                </th>
                                                                <td
                                                                    className="pe-3 py-3 text-end fw-bold text-dark"
                                                                    style={{
                                                                        fontSize:
                                                                            '1.25rem',
                                                                    }}
                                                                >
                                                                    {currencyFormat(
                                                                        decl.income_function +
                                                                            decl.income_other
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className="ps-3 py-3">
                                                                    {t(
                                                                        labels
                                                                            .assetDeclarations
                                                                            .function_condition
                                                                    )}
                                                                </th>
                                                                <td
                                                                    className={`pe-3 py-3 text-end fw-bold ${decl.function_condition ? 'text-success' : 'text-danger'}`}
                                                                >
                                                                    {
                                                                        functionConditionLabel
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Card>
                                            </Col>

                                            <Col xs={12}>
                                                {/* Table 3: Asset Details Card (full-width) */}
                                                <Card className="shadow-sm border-0">
                                                    <Card.Header className="bg-primary text-white fw-bold py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                        <span>
                                                            🏠{' '}
                                                            {t(
                                                                labels
                                                                    .assetDeclarations
                                                                    .assets
                                                            )}
                                                        </span>
                                                        {prevDecl && isDemo && (
                                                            <Form.Check
                                                                type="switch"
                                                                id={`show-asset-diff-${decl.year}`}
                                                                label={t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .redFlags
                                                                        .switchLabel
                                                                )}
                                                                checked={
                                                                    showDiff
                                                                }
                                                                onChange={(e) =>
                                                                    setShowDiff(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                                className="text-white small mb-0 fw-normal"
                                                            />
                                                        )}
                                                    </Card.Header>
                                                    <Table
                                                        responsive
                                                        bordered
                                                        className="mb-0 align-middle"
                                                    >
                                                        <tbody>
                                                            {assetRows.map(
                                                                ({
                                                                    key,
                                                                    label,
                                                                    groupBy,
                                                                }) => {
                                                                    const diff =
                                                                        prevDecl
                                                                            ? diffAssetField(
                                                                                  decl[
                                                                                      key
                                                                                  ],
                                                                                  prevDecl[
                                                                                      key
                                                                                  ],
                                                                                  groupBy
                                                                              )
                                                                            : null;

                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                key
                                                                            }
                                                                        >
                                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                                {t(
                                                                                    label
                                                                                )}
                                                                            </th>
                                                                            <td className="ps-3 py-3 text-dark">
                                                                                {diff
                                                                                    ? renderAssetFieldLines(
                                                                                          diff.lines,
                                                                                          showDiff
                                                                                      )
                                                                                    : nl2r(
                                                                                          decl[
                                                                                              key
                                                                                          ]
                                                                                      )}
                                                                            </td>
                                                                            {prevDecl &&
                                                                                isDemo && (
                                                                                    <td
                                                                                        className="text-center"
                                                                                        style={{
                                                                                            width: '3rem',
                                                                                        }}
                                                                                    >
                                                                                        <OverlayTrigger
                                                                                            placement="left"
                                                                                            overlay={
                                                                                                <Tooltip>
                                                                                                    {t(
                                                                                                        diff.changed
                                                                                                            ? labels
                                                                                                                  .assetDeclarations
                                                                                                                  .redFlags
                                                                                                                  .tooltipChanged
                                                                                                            : labels
                                                                                                                  .assetDeclarations
                                                                                                                  .redFlags
                                                                                                                  .tooltipUnchanged
                                                                                                    )}
                                                                                                </Tooltip>
                                                                                            }
                                                                                        >
                                                                                            <img
                                                                                                src={
                                                                                                    diff.changed
                                                                                                        ? flagChangedIcon
                                                                                                        : flagUnchangedIcon
                                                                                                }
                                                                                                alt={t(
                                                                                                    diff.changed
                                                                                                        ? labels
                                                                                                              .assetDeclarations
                                                                                                              .redFlags
                                                                                                              .tooltipChanged
                                                                                                        : labels
                                                                                                              .assetDeclarations
                                                                                                              .redFlags
                                                                                                              .tooltipUnchanged
                                                                                                )}
                                                                                                width={
                                                                                                    24
                                                                                                }
                                                                                                height={
                                                                                                    24
                                                                                                }
                                                                                            />
                                                                                        </OverlayTrigger>
                                                                                    </td>
                                                                                )}
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab>
                                );
                            })}
                        </Tabs>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default AssetDeclarationData;
