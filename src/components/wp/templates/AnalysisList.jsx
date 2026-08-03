import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { badgePctFormat } from '../../../helpers/helpers';
import { getActiveSubsite } from '../../../helpers/languages';
import { routes, segments } from '../../../helpers/routes';
import { baseData as abd, transparencyClass } from '../../../helpers/wp';
import useAdsData from '../../../hooks/AdsData';
import { useAccountsData } from '../../../hooks/AccountsData';
import { partyData } from '../../../helpers/parties';
import { candidateData } from '../../../helpers/candidates';
import { labels, t } from '../../../helpers/dictionary';
import Loading from '../../general/Loading';

import defaultImg from '../../../../public/img/user_grey.png';

function AnalysisList({ article, clickHandler, keyUpHandler }) {
    const subsite = getActiveSubsite();
    const { analysis } = article;

    if (analysis?.error !== undefined) {
        console.log(analysis.error);
        return null;
    }

    const lastColumn = analysis.lastColumn ?? -1;
    if (lastColumn < 0) {
        return null;
    }

    const cls = transparencyClass(analysis.lastScore);

    // 1. Samosprava 2022 Logic
    if (subsite === 'samosprava2022') {
        const { findInCsvData } = useAccountsData();
        const csvRow = findInCsvData(
            article.title.rendered,
            analysis.municipality?.[0]
        );
        const isElected = csvRow?.isElected ?? false;

        return (
            <Col className="px-0" md={12}>
                <Link
                    id={article.slug}
                    className={`article analysis-preview score-${cls}${
                        isElected ? ' analysis-elected' : ''
                    } p-3`}
                    to={`/samosprava2022/hodnotenia/${article.slug}`}
                    state={{ article }}
                >
                    <Row className="align-items-center">
                        <Col sm={4} md={5} lg={3}>
                            <div
                                className="thumb mb-2 mb-md-0"
                                data-label={
                                    labels.analysis.transparencyShort[cls]
                                }
                            >
                                <figure className="text-center">
                                    <img
                                        alt={labels.analysis.transparency[cls]}
                                        className="p-3"
                                        src={defaultImg}
                                    />
                                </figure>
                            </div>
                        </Col>
                        <Col>
                            <h2>{article.title.rendered}</h2>
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <th>{t(labels.municipality)}</th>
                                        <td>{analysis.municipality?.[0]}</td>
                                    </tr>
                                    <tr>
                                        <th>{t(labels.party.title)}</th>
                                        <td>{analysis.support?.[0]}</td>
                                    </tr>
                                    <tr>
                                        <th>{t(labels.analysis[abd.score])}</th>
                                        <td className="score">
                                            <span
                                                className={`badge me-1 score-${cls}`}
                                            >
                                                {badgePctFormat(
                                                    analysis.lastScore
                                                )}
                                            </span>
                                            {t(
                                                labels.analysis.transparency[
                                                    cls
                                                ]
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="d-none d-md-table-row">
                                        <th>{t(labels.analysis[abd.date])}</th>
                                        <td>
                                            {
                                                analysis.date?.[
                                                    analysis.lastColumn
                                                ]
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Link>
            </Col>
        );
    }

    // 2. Prezident 2024 Logic
    if (subsite === 'prezident2024') {
        const { candidateAdsData, findCandidateByWpTags } = useAdsData();
        const name =
            findCandidateByWpTags(article.tags) ?? article.title.rendered;
        const adsData = candidateAdsData(name);
        const candidate = candidateData(name, null, adsData);

        return (
            <Col md={12}>
                <Link
                    id={article.slug}
                    className={`article hover-bg analysis-preview score-${cls}`}
                    to={routes.candidate(name, segments.ANALYSIS)}
                >
                    <Row className="align-items-center">
                        <Col sm={4} md={3} lg={2}>
                            <div
                                className="thumb mb-2 mb-md-0"
                                data-label={t(
                                    labels.analysis.transparencyShort[cls]
                                )}
                            >
                                <figure className="text-center">
                                    <img src={candidate.image} alt={name} />
                                </figure>
                                <div className="cover text-center">
                                    {candidate.hasInfo && (
                                        <span className="info text-white">
                                            {
                                                t(labels.candidates.info)[
                                                    candidate.infoKey
                                                ]
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <h2>{name}</h2>
                            <Table responsive>
                                <tbody>
                                    {analysis.meta.coalition && (
                                        <tr>
                                            <th>
                                                {t(labels.analysis.coalition)}
                                            </th>
                                            <td>{analysis.meta.coalition}</td>
                                        </tr>
                                    )}
                                    {analysis.meta.leader && (
                                        <tr>
                                            <th>{t(labels.analysis.leader)}</th>
                                            <td>{analysis.meta.leader}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <th>{t(labels.analysis.score)}</th>
                                        <td className="score">
                                            <span
                                                className={`badge me-1 score-${cls}`}
                                            >
                                                {badgePctFormat(
                                                    analysis.lastScore
                                                )}
                                            </span>
                                            {t(
                                                labels.analysis.transparency[
                                                    cls
                                                ]
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="d-none d-sm-table-row">
                                        <th>{t(labels.analysis.date)}</th>
                                        <td>
                                            {
                                                analysis.base.date?.[
                                                    analysis.lastColumn
                                                ]
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Link>
            </Col>
        );
    }

    // 3. Euro 2024 and Parlament 2023 Logic
    const { getPartyAdsData, findPartyByWpTags, sheetsData } = useAdsData();

    if (!sheetsData?.loaded) {
        return <Loading small />;
    }

    const name = findPartyByWpTags(article.tags) ?? article.title.rendered;
    const adsData = getPartyAdsData(name);
    const party = partyData(name, null, adsData);

    return (
        <Col md={12}>
            <Link
                id={article.slug}
                className={`article hover-bg analysis-preview score-${cls}`}
                to={routes.party(name, segments.ANALYSIS)}
            >
                <Row className="align-items-center">
                    <Col sm={4} md={3} lg={2}>
                        <div
                            className="thumb mb-2 mb-md-0"
                            data-label={t(
                                labels.analysis.transparencyShort[cls]
                            )}
                        >
                            {party?.image ? (
                                <figure className="text-center">
                                    {party.image}
                                </figure>
                            ) : (
                                <div className="cover text-center">
                                    <span className="text-white fw-bold">
                                        {name}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col>
                        <h2>{name}</h2>
                        <Table responsive>
                            <tbody>
                                {analysis.meta.leader && (
                                    <tr>
                                        <th>{t(labels.analysis.leader)}</th>
                                        <td>{analysis.meta.leader}</td>
                                    </tr>
                                )}
                                <tr>
                                    <th>{t(labels.analysis.score)}</th>
                                    <td className="score">
                                        <span
                                            className={`badge me-1 score-${cls}`}
                                        >
                                            {badgePctFormat(analysis.lastScore)}
                                        </span>
                                        {t(labels.analysis.transparency[cls])}
                                    </td>
                                </tr>
                                <tr className="d-none d-sm-table-row">
                                    <th>{t(labels.analysis.date)}</th>
                                    <td>
                                        {
                                            analysis.base.date?.[
                                                analysis.lastColumn
                                            ]
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Link>
        </Col>
    );
}

export default AnalysisList;
