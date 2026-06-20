import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { labels, t } from '../../../helpers/dictionary';
import { badgePctFormat, fixUrl, substitute } from '../../../helpers/helpers';
import {
    baseData as abd,
    metaData as amd,
    parseWpHtml,
    resources,
    transparencyClass,
    transparencyClasses as atc,
    transparencyIndicators as ati,
} from '../../../helpers/wp';
import { getActiveSubsite } from '../../../helpers/languages';
import { routes } from '../../../helpers/routes';
import {
    s22AggregatedKeys,
    useAccountsData,
} from '../../../hooks/AccountsData';

import AlertWithIcon from '../../general/AlertWithIcon';
import IconTooltip from '../../general/IconTooltip';

function AnalysisDetail({ article }) {
    const { findInCsvData } = useAccountsData();

    const analysis = article.analysis ?? { error: 'no data received' };
    if (analysis.error ?? false) {
        console.log(analysis.error);
        return (
            <div className="article-body">
                {parseWpHtml(article.content.rendered)}
            </div>
        );
    }

    if (analysis.lastColumn < 0) {
        return (
            <div className="article-body">
                {parseWpHtml(article.content.rendered)}
            </div>
        );
    }
    const lastClass = transparencyClass(analysis.lastScore);
    const words = t(labels.analysis.transparency[lastClass]).split(' ');
    const lastLabel = [];
    words.forEach((word, index) => {
        if (index < words.length - 1) {
            lastLabel.push(`${word} `);
            lastLabel.push(<br className="d-none d-sm-block" key={word} />);
        } else {
            lastLabel.push(word);
        }
    });

    let headerRow = null;
    let historyTable = null;
    if (analysis.lastColumn > 0) {
        const headers = [<th key="title">{t(labels.analysis[abd.date])}</th>];
        const ratings = [
            <td key="ratings">{t(labels.analysis[abd.score])}</td>,
        ];
        analysis.base[abd.date].forEach((date, di) => {
            headers.push(<th key={date}>{date}</th>);
            const cls = transparencyClass(analysis.base[abd.score][di]);
            ratings.push(
                <td key={date}>
                    <span className={`badge me-1 score-${cls}`}>
                        {badgePctFormat(analysis.base[abd.score][di])}
                    </span>
                </td>
            );
        });
        headerRow = <tr key="header">{headers}</tr>;
        historyTable = (
            <>
                <h2 className="mt-4 mb-3">{t(labels.analysis.history)}</h2>
                <Table
                    key="scores"
                    className="indicators-table mb-0"
                    striped
                    bordered
                    responsive
                    hover
                >
                    <thead>{headerRow}</thead>
                    <tbody>
                        <tr>{ratings}</tr>
                    </tbody>
                </Table>
            </>
        );
    }

    const groups = {};
    const indicatorsList = analysis.isSamosprava
        ? labels.analysis.indicators22
        : labels.analysis.indicators;
    Object.keys(ati).forEach((group) => {
        groups[group] = [];
        if (analysis[group]) {
            analysis[group].forEach((valuesArray, index) => {
                const key = group + index;
                const cols = [
                    <td key={key}>
                        <span className="d-flex align-items-center">
                            {t(indicatorsList[group][index].name)}
                            <IconTooltip
                                id={key}
                                tooltip={t(indicatorsList[group][index].desc)}
                            />
                        </span>
                    </td>,
                ];
                valuesArray.forEach((value, vi) => {
                    let color = '';
                    switch (value) {
                        case 1:
                            color = atc.good;
                            break;
                        case 2:
                            color = atc.average;
                            break;
                        case 3:
                            color = atc.bad;
                            break;
                        default:
                            break;
                    }
                    const vk = `${vi}_${value}`;
                    cols.push(
                        <td key={vk}>
                            {Number(value) > -1 && (
                                <span className="d-flex align-items-center">
                                    <span
                                        className={`badge${
                                            color ? ` score-${color}` : ''
                                        }`}
                                    >
                                        {t(labels.analysis.badges)[value]}
                                    </span>
                                </span>
                            )}
                        </td>
                    );
                });
                groups[group].push(<tr key={key}>{cols}</tr>);
            });
        }
    });

    const tables = [];
    Object.keys(groups).forEach((group) => {
        if (groups[group].length > 0) {
            tables.push(
                <h2 key={`${group}title`} className="mt-4 mb-3">
                    {t(labels.analysis.indicatorTitles[group])}
                </h2>
            );
            tables.push(
                <Table
                    key={group}
                    className="indicators-table mb-0"
                    striped
                    bordered
                    responsive
                    hover
                >
                    {headerRow && <thead>{headerRow}</thead>}
                    <tbody>{groups[group]}</tbody>
                </Table>
            );
        }
    });

    let municipalityPage = null;
    if (analysis.isSamosprava) {
        const csvRow = findInCsvData(
            article.title.rendered,
            analysis.municipality?.[0]
        );
        if (csvRow) {
            municipalityPage = routes.municipality(
                csvRow.municipalityShortName,
                csvRow[s22AggregatedKeys.region] ?? null
            );
        }
    }

    return (
        <div className="analysis">
            <div className="row gy-3 gy-lg-0">
                <div className="col-lg-6">
                    <h2 className="text-lg-center">
                        {analysis.isSamosprava
                            ? analysis.type[0]
                            : t(labels.analysis.meta)}
                    </h2>
                    <Table responsive>
                        <tbody>
                            {analysis.isSamosprava && analysis.municipality && (
                                <tr>
                                    <th>{t(labels.municipality)}</th>
                                    <td className="text-end">
                                        {municipalityPage ? (
                                            <Link to={municipalityPage}>
                                                {analysis.municipality[0]}
                                            </Link>
                                        ) : (
                                            analysis.municipality[0]
                                        )}
                                    </td>
                                </tr>
                            )}
                            {analysis.isSamosprava && analysis.support && (
                                <tr>
                                    <th>{t(labels.party.title)}</th>
                                    <td className="text-end">
                                        {analysis.support[0]}
                                    </td>
                                </tr>
                            )}
                            {analysis.meta?.[amd.coalition] && (
                                <tr>
                                    <th>{t(labels.analysis[amd.coalition])}</th>
                                    <td className="text-end">
                                        {analysis.meta?.[amd.coalition]}
                                    </td>
                                </tr>
                            )}
                            {analysis.meta?.[amd.leader] && (
                                <tr>
                                    <th>{t(labels.analysis[amd.leader])}</th>
                                    <td className="text-end">
                                        {analysis.meta?.[amd.leader]}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th>{t(labels.analysis[abd.date])}</th>
                                <td className="text-end">
                                    {
                                        analysis.base[abd.date][
                                            analysis.lastColumn
                                        ]
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className="col-lg-6">
                    <h2 className="text-lg-center">
                        {t(labels.analysis[abd.score])}
                    </h2>
                    <Row className="hero-number justify-content-lg-center align-items-center mt-4 gx-2">
                        <Col xs="auto">
                            <span className={`badge me-1 score-${lastClass}`}>
                                {badgePctFormat(
                                    analysis.base[abd.score][
                                        analysis.lastColumn
                                    ]
                                )}
                            </span>
                        </Col>
                        <Col xs="auto">
                            <h5>{lastLabel}</h5>
                        </Col>
                    </Row>
                </div>
            </div>

            {getActiveSubsite() === 'prezident2024' && (
                <AlertWithIcon className="my-4" variant="primary">
                    {t(labels.analysis.disclaimer)}
                </AlertWithIcon>
            )}

            {historyTable}

            {tables}

            <h2 className="mt-4 mb-3">{t(labels.analysis.references)}</h2>
            <Row className="mb-4">
                {analysis.isSamosprava && analysis.municipality?.[0] && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <Link
                                    to={routes.candidate(
                                        article.title.rendered,
                                        substitute(analysis.municipality[0])
                                    )}
                                >
                                    {t(labels.elections.account)}
                                </Link>
                            </li>
                        </ul>
                    </Col>
                )}
                {analysis.meta?.[amd.fb] && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <a
                                    href={fixUrl(analysis.meta?.[amd.fb])}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t(labels.analysis[amd.fb])}
                                </a>
                            </li>
                        </ul>
                    </Col>
                )}
                {analysis.meta?.[amd.web] && (
                    <Col sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <a
                                    href={fixUrl(analysis.meta?.[amd.web])}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t(labels.analysis[amd.web])}
                                </a>
                            </li>
                        </ul>
                    </Col>
                )}
                <Col sm={12} md="auto">
                    <ul className="arrows">
                        <li>
                            <Link to={resources.methodology}>
                                {t(labels.analysis.methodology)}
                            </Link>
                        </li>
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default AnalysisDetail;
