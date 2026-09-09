import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { parseCmsHtml } from '../../../helpers/news';

import ReadMore from '../../general/ReadMore';

function BannerItem({ article }) {
    return (
        <Alert variant="primary" className="my-4">
            <Row className="article">
                <Col sm={5} lg={3} xxl={2} className="d-none d-sm-block">
                    <div className="thumb mb-2 mb-md-0">
                        <figure className="text-center">
                            <img
                                alt={article.title}
                                src={article.image}
                                className="img-fluid figure-img"
                            />
                        </figure>
                    </div>
                </Col>
                <Col>
                    <div className="article-body">
                        <h2 className="mb-3">{article.title}</h2>
                        <ReadMore lines={4} id={`banner-${article.uid}`}>
                            {parseCmsHtml(article.bodytext)}
                        </ReadMore>
                    </div>
                </Col>
            </Row>
        </Alert>
    );
}

export default BannerItem;
