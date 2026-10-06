import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';

import {
    analysisClass,
    analysisScoreFormat,
    getAnalysisRoute,
} from '../../helpers/cms';
import { segments } from '../../helpers/routes';

import defaultImg from '../../../public/img/user_grey.png';

import '../wp/News.scss';

function AnalysisFeatured({ item }) {
    const { cmsCandidate } = item;
    const name = cmsCandidate.person?.name;
    const image = cmsCandidate.photo || defaultImg;

    return (
        <Col md={4}>
            <Link
                className={`article analysis-preview score-${analysisClass(item.evaluation)}`}
                to={getAnalysisRoute(item, segments.ANALYSIS)}
            >
                <div
                    className="thumb"
                    data-label={analysisScoreFormat(item.evaluation.score)}
                >
                    <figure className="text-center">
                        <img src={image} alt={name} />
                    </figure>
                    <div className="cover text-center">
                        {cmsCandidate.municipality && (
                            <span className="info text-white">
                                {cmsCandidate.municipality}
                            </span>
                        )}
                        <span className="text-white fw-bold">{name}</span>
                    </div>
                </div>
            </Link>
        </Col>
    );
}

export default AnalysisFeatured;
