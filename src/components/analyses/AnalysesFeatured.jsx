import { Link } from 'react-router';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import { isFeaturedAnalysis } from '../../helpers/cms';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import { useAnalysesList } from '../../hooks/CmsQueries';

import AnalysisFeatured from './AnalysisFeatured';

// featured analyses grid, renders nothing until there is something to feature
function AnalysesFeatured({ title, showAll = false }) {
    const { data } = useAnalysesList();

    const featured = data.filter((item) => isFeaturedAnalysis(item.evaluation));
    if (!featured.length) {
        return null;
    }

    return (
        <div className="my-4">
            <h2 className="mb-4">
                {title ?? t(labels.analyses.top, [featured.length])}
            </h2>
            <Row className="articles featured gy-4">
                {featured.map((item) => (
                    <AnalysisFeatured key={item.key} item={item} />
                ))}
            </Row>
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
