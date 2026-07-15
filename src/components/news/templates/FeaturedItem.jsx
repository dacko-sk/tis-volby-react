import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dateTimeFormat } from '../../../helpers/helpers';
import { routes } from '../../../helpers/routes';
import { getCurrentLanguage } from '../../../helpers/languages';

import PartyTags from '../PartyTags';

function FeaturedItem({ article }) {
    const lang = getCurrentLanguage();

    return (
        <Col className="d-flex" md={6}>
            <Link
                id={article.slug}
                className="article hover-bg"
                state={{ article }}
                to={routes.article(article.slug, lang)}
            >
                <h3 className="d-none d-xxl-block">{article.title}</h3>

                <Row className="align-items-center align-items-xxl-start">
                    <Col xxl="auto" className="align-self-xxl-start">
                        <div className="thumb mb-2 mb-xxl-0 mt-xxl-2">
                            <figure className="text-center text-xxl-start">
                                <img
                                    alt={article.title}
                                    src={article.image}
                                    className="img-fluid featured-img"
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h3 className="d-block d-xxl-none">{article.title}</h3>
                        <div className="article-date my-3 text-muted">
                            {dateTimeFormat(article.date)}
                        </div>
                        {article.relations && (
                            <PartyTags
                                className="article-tags my-3"
                                relations={article.relations}
                            />
                        )}
                        <p className="article-excerpt">{article.excerpt}</p>
                    </Col>
                </Row>
            </Link>
        </Col>
    );
}

export default FeaturedItem;
