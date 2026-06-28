import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';

import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { currencyFormat, nl2r } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';
import { colors } from '../../helpers/constants';
import { endpoints } from '../../helpers/assetDeclarations';

import FundingNav from '../../components/structure/FundingNav';
import Title from '../../components/structure/Title';
import DownloadLink from '../../components/general/DownloadLink';
import Loading from '../../components/general/Loading';
import TisBarChart from '../../components/charts/TisBarChart';

function AssetDeclaration() {
    const params = useParams();
    const slug = params.slug ?? null;
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery({
        queryKey: [`asset_declaration_${slug}`],
        queryFn: () =>
            fetch(endpoints.official(slug)).then((response) => response.json()),
        queryOptions: {
            enabled: !!slug,
        },
    });

    useEffect(() => {
        if (
            !isLoading &&
            !error &&
            (!data ||
                !Array.isArray(data.declarations) ||
                data.declarations.length === 0)
        ) {
            // Redirect to list page if no data was found or invalid slug
            navigate(routes.assetDeclarations());
        }
    }, [isLoading, error, data, navigate]);

    if (isLoading || error) {
        return (
            <section>
                <Title>{t(labels.assetDeclarations.pageTitle)}</Title>
                <FundingNav />
                <Loading error={error} />
            </section>
        );
    }

    const declarations = data?.declarations ?? [];
    if (declarations.length === 0) {
        return null;
    }

    const name = data?.name;
    setTitle(`${t(labels.assetDeclarations.pageTitle)} | ${name}`);

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
    const latestYear = sortedForTabs[0]?.year.toString();

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
        <section className="asset-declaration-detail">
            <Title secondary={name}>
                {t(labels.assetDeclarations.pageTitle)}
                <br />
            </Title>

            <FundingNav />

            <div className="mb-4">
                <Button
                    as={Link}
                    to={routes.assetDeclarations()}
                    variant="outline-primary"
                    className="py-2"
                >
                    &larr; {t(labels.assetDeclarations.back)}
                </Button>
            </div>

            {/* Income stacked bar chart */}
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

            {/* Extended Asset Declarations */}
            {data?.extended && data.extended.length > 0 && (
                <Row className="mb-5">
                    <Col lg={12}>
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-secondary text-white fw-bold py-3">
                                📄 {t(labels.assetDeclarations.extendedReports)}
                            </Card.Header>
                            <div>
                                {data.extended.map((ext, i) => (
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
                            const reportedOnStartLabel = decl.reported_on_start
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
                                                    ℹ️ {t(labels.usefulInfo)}
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
                                                    {t(labels.charts.incoming)}
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
                                                <Card.Header className="bg-primary text-white fw-bold py-3">
                                                    🏠{' '}
                                                    {t(
                                                        labels.assetDeclarations
                                                            .assets
                                                    )}
                                                </Card.Header>
                                                <Table
                                                    responsive
                                                    bordered
                                                    className="mb-0 align-middle"
                                                >
                                                    <tbody>
                                                        <tr>
                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                {t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .real_estates
                                                                )}
                                                            </th>
                                                            <td className="ps-3 py-3 text-dark">
                                                                {nl2r(
                                                                    decl.real_estates
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                {t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .movable
                                                                )}
                                                            </th>
                                                            <td className="ps-3 py-3 text-dark">
                                                                {nl2r(
                                                                    decl.movable
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                {t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .property_rights
                                                                )}
                                                            </th>
                                                            <td className="ps-3 py-3 text-dark">
                                                                {nl2r(
                                                                    decl.property_rights
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                {t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .credits
                                                                )}
                                                            </th>
                                                            <td className="ps-3 py-3 text-dark">
                                                                {nl2r(
                                                                    decl.credits
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                {t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .use_real_estates
                                                                )}
                                                            </th>
                                                            <td className="ps-3 py-3 text-dark">
                                                                {nl2r(
                                                                    decl.use_real_estates
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                {t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .use_movable
                                                                )}
                                                            </th>
                                                            <td className="ps-3 py-3 text-dark">
                                                                {nl2r(
                                                                    decl.use_movable
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className="ps-3 py-3 w-25 bg-light">
                                                                {t(
                                                                    labels
                                                                        .assetDeclarations
                                                                        .donations
                                                                )}
                                                            </th>
                                                            <td className="ps-3 py-3 text-dark">
                                                                {nl2r(
                                                                    decl.donations
                                                                )}
                                                            </td>
                                                        </tr>
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
        </section>
    );
}

export default AssetDeclaration;
