import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import {
    analysisClass,
    analysisScoreFormat,
    getAnalysisRoute,
} from '../../helpers/cms';
import { labels, t } from '../../helpers/dictionary';
import { dateFormat } from '../../helpers/helpers';
import { segments } from '../../helpers/routes';

import defaultImg from '../../../public/img/user_grey.png';

import '../wp/News.scss';

function AnalysisList({ item }) {
    const { cmsCandidate, evaluation, set } = item;
    const name = cmsCandidate.person?.name;
    const cls = analysisClass(evaluation);
    const image = cmsCandidate.photo || defaultImg;
    // plain text, the whole card is a link already
    const parties = (cmsCandidate.supportingParties ?? [])
        .map((party) => party.abbreviation || party.name)
        .join(', ');

    return (
        <Col md={12}>
            <Link
                className={`article hover-bg analysis-preview score-${cls}`}
                to={getAnalysisRoute(item, segments.ANALYSIS)}
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
                                <img src={image} alt={name} />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{name}</h2>
                        <Table responsive>
                            <tbody>
                                {cmsCandidate.municipality && (
                                    <tr>
                                        <th>{t(labels.municipality)}</th>
                                        <td>{cmsCandidate.municipality}</td>
                                    </tr>
                                )}
                                <tr>
                                    <th>
                                        {t(labels.candidate.supportingParties)}
                                    </th>
                                    <td>
                                        {parties ||
                                            t(
                                                labels.candidate
                                                    .independentCandidate
                                            )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t(labels.analysis.score)}</th>
                                    <td className="score">
                                        <span
                                            className={`badge me-1 score-${cls}`}
                                        >
                                            {analysisScoreFormat(
                                                evaluation.score
                                            )}
                                        </span>
                                        {t(labels.analysis.transparency[cls])}
                                    </td>
                                </tr>
                                <tr className="d-none d-sm-table-row">
                                    <th>{t(labels.analysis.date)}</th>
                                    <td>{dateFormat(set.date)}</td>
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
