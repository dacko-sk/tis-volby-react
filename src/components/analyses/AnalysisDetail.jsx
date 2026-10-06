import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import {
    analysisClass,
    analysisScoreBadgeIndex,
    analysisScoreClass,
    analysisScoreFormat,
    getCriterionDescription,
    getCriterionTitle,
    groupAnalysisCriteria,
} from '../../helpers/cms';
import { labels, t } from '../../helpers/dictionary';
import {
    dateFormat,
    fixUrl,
    shortenUrl,
    substitute,
} from '../../helpers/helpers';
import { routes } from '../../helpers/routes';
import { resources } from '../../helpers/wp';

import { municipalTypes } from '../../hooks/AccountsData';

import IconTooltip from '../general/IconTooltip';
import SupportingPartiesBadges from '../municipal/SupportingPartiesBadges';

import '../wp/News.scss';

const socialNetworks = {
    'facebook.com': 'Facebook',
    'fb.com': 'Facebook',
    'instagram.com': 'Instagram',
    'x.com': 'X',
    'twitter.com': 'X',
    'tiktok.com': 'TikTok',
    'youtube.com': 'YouTube',
    'linkedin.com': 'LinkedIn',
};

const socialLabel = (url) => {
    try {
        const host = new URL(fixUrl(url)).hostname.replace(/^(www|m)\./, '');
        return socialNetworks[host] ?? shortenUrl(url);
    } catch {
        return t(labels.analysis.socialProfile);
    }
};

// break the label into lines on larger screens, as in the WP version
const multilineLabel = (label) => {
    const words = label.split(' ');
    return words.map((word, index) =>
        index < words.length - 1 ? (
            <span key={word + index}>
                {`${word} `}
                <br className="d-none d-sm-block" />
            </span>
        ) : (
            word
        )
    );
};

const scoreBadge = (score) => {
    if (score === null || score === undefined) return null;
    const cls = analysisScoreClass(score);
    return (
        <span className="d-flex align-items-center">
            <span className={`badge score-${cls}`}>
                {t(labels.analysis.badges)[analysisScoreBadgeIndex(score)]}
            </span>
        </span>
    );
};

// analyses = all evaluations of the candidate, oldest set first
function AnalysisDetail({ analyses, cmsCandidate }) {
    const latest = analyses[analyses.length - 1];
    const { evaluation, set } = latest;
    const lastClass = analysisClass(evaluation);
    const hasHistory = analyses.length > 1;

    const headerRow = hasHistory ? (
        <tr>
            <th>{t(labels.analysis.date)}</th>
            {analyses.map((a) => (
                <th key={a.set.uid} title={a.set.name}>
                    {dateFormat(a.set.date)}
                </th>
            ))}
        </tr>
    ) : null;

    const historyTable = hasHistory && (
        <>
            <h2 className="mt-4 mb-3">{t(labels.analysis.history)}</h2>
            <Table
                className="indicators-table mb-0"
                striped
                bordered
                responsive
                hover
            >
                <thead>{headerRow}</thead>
                <tbody>
                    <tr>
                        <td>{t(labels.analysis.score)}</td>
                        {analyses.map((a) => (
                            <td key={a.set.uid}>
                                <span
                                    className={`badge me-1 score-${analysisClass(a.evaluation)}`}
                                >
                                    {analysisScoreFormat(a.evaluation.score)}
                                </span>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </>
    );

    const tables = groupAnalysisCriteria(analyses.map((a) => a.set)).map(
        ({ group, criteria: groupCriteria }) => (
            <div key={group}>
                <h2 className="mt-4 mb-3">
                    {t(labels.analysis.indicatorTitles[group])}
                </h2>
                <Table
                    className="indicators-table mb-0"
                    striped
                    bordered
                    responsive
                    hover
                >
                    {headerRow && <thead>{headerRow}</thead>}
                    <tbody>
                        {groupCriteria.map((criterion) => {
                            const key = `${group}${criterion.uid}`;
                            const description =
                                getCriterionDescription(criterion);
                            return (
                                <tr key={key}>
                                    <td>
                                        <span className="d-flex align-items-center">
                                            {getCriterionTitle(criterion)}
                                            {description && (
                                                <IconTooltip
                                                    id={key}
                                                    tooltip={description}
                                                />
                                            )}
                                        </span>
                                    </td>
                                    {analyses.map((a) => (
                                        <td key={a.set.uid}>
                                            {scoreBadge(
                                                a.evaluation.criteriaScores?.[
                                                    criterion.uid
                                                ]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        )
    );

    const references = [
        ...(evaluation.web
            ? [{ url: evaluation.web, label: t(labels.analysis.web) }]
            : []),
        ...(evaluation.social ?? [])
            .filter(Boolean)
            .map((url) => ({ url, label: socialLabel(url) })),
    ];

    return (
        <div className="analysis">
            <Row className="gy-3 gy-lg-0">
                <Col lg={6}>
                    <h2 className="text-lg-center">
                        {t(labels.analysis.meta)}
                    </h2>
                    <Table responsive>
                        <tbody>
                            {cmsCandidate && (
                                <tr>
                                    <th>{t(labels.type)}</th>
                                    <td className="text-end">
                                        {t(
                                            labels.elections.municipalTypes[
                                                cmsCandidate.isRegionalFunction
                                                    ? municipalTypes.regional
                                                    : municipalTypes.local
                                            ]
                                        )}
                                    </td>
                                </tr>
                            )}
                            {cmsCandidate?.region && (
                                <tr>
                                    <th>{t(labels.candidate.region)}</th>
                                    <td className="text-end">
                                        <Link
                                            to={routes.region(
                                                cmsCandidate.region
                                            )}
                                        >
                                            {substitute(cmsCandidate.region)}
                                        </Link>
                                    </td>
                                </tr>
                            )}
                            {cmsCandidate?.municipality && (
                                <tr>
                                    <th>{t(labels.municipality)}</th>
                                    <td className="text-end">
                                        <Link
                                            to={routes.municipality(
                                                cmsCandidate.municipality,
                                                cmsCandidate.region ?? null
                                            )}
                                        >
                                            {cmsCandidate.municipality}
                                        </Link>
                                    </td>
                                </tr>
                            )}
                            {cmsCandidate && (
                                <tr>
                                    <th>
                                        {t(labels.candidate.supportingParties)}
                                    </th>
                                    <td className="text-end">
                                        <SupportingPartiesBadges
                                            candidate={cmsCandidate}
                                        />
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th>{t(labels.analysis.date)}</th>
                                <td className="text-end">
                                    {dateFormat(set.date)}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col lg={6}>
                    <h2 className="text-lg-center">
                        {t(labels.analysis.score)}
                    </h2>
                    <Row className="hero-number justify-content-lg-center align-items-center mt-4 gx-2">
                        <Col xs="auto">
                            <span className={`badge me-1 score-${lastClass}`}>
                                {analysisScoreFormat(evaluation.score)}
                            </span>
                        </Col>
                        <Col xs="auto">
                            <h5>
                                {multilineLabel(
                                    t(labels.analysis.transparency[lastClass])
                                )}
                            </h5>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {historyTable}

            {tables}

            <h2 className="mt-4 mb-3">{t(labels.analysis.references)}</h2>
            <Row className="mb-4">
                {references.map(({ url, label }) => (
                    <Col key={url} sm={12} md="auto">
                        <ul className="arrows">
                            <li>
                                <a
                                    href={fixUrl(url)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {label}
                                </a>
                            </li>
                        </ul>
                    </Col>
                ))}
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
