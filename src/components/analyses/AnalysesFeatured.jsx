import { Link } from 'react-router';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import { candidateStatus, isFeaturedAnalysis } from '../../helpers/cms';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import { useAnalysesList } from '../../hooks/CmsQueries';

import AnalysisFeatured from './AnalysisFeatured';

import './Analyses.scss';

// featured analyses grid, renders nothing until there is something to feature
function AnalysesFeatured({ title, showAll = false }) {
    const { data } = useAnalysesList();

    const featured = data.filter((item) => isFeaturedAnalysis(item.evaluation));
    if (!featured.length) {
        return null;
    }
    const hasElected = featured.some(
        (item) => item.cmsCandidate.status === candidateStatus.ELECTED
    );

    return (
        <div className="my-4">
            <h2 className="mb-4">
                {title ?? t(labels.analyses.top, [featured.length])}
            </h2>
            <Row
                className="articles featured analyses-featured gy-4"
                xs={1}
                sm={2}
                md={3}
                lg={4}
                xxl={5}
            >
                {featured.map((item) => (
                    <AnalysisFeatured key={item.key} item={item} />
                ))}
            </Row>
            {hasElected && (
                <em className="disclaimer text-start mt-3">
                    ^ {t(labels.regionRaces.electedDisclaimer)}
                </em>
            )}
            {showAll && (
                <div className="buttons mt-4 text-center">
                    <Button
                        as={Link}
                        to={routes.analyses()}
                        variant="secondary"
                    >
                        {t(labels.analyses.showAll)}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default AnalysesFeatured;
