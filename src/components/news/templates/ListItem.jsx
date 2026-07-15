import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { dateTimeFormat } from '../../../helpers/helpers';
import { routes } from '../../../helpers/routes';
import { getCurrentLanguage } from '../../../helpers/languages';

import PartyTags from '../PartyTags';

function ListItem({ article }) {
    const lang = getCurrentLanguage();

    return (
        <Col className="" md={12}>
            <Link
                id={article.slug}
                className="article hover-bg"
                state={{ article }}
                to={routes.article(article.slug, lang)}
            >
                <Row className="align-items-center">
                    <Col md={5} lg={3}>
                        <div className="thumb mb-2 mb-md-0">
                            <figure className="text-center text-xxl-start">
                                <img
                                    alt={article.title}
                                    src={article.image}
                                    className="img-fluid figure-img"
                                />
                            </figure>
                        </div>
                    </Col>
                    <Col>
                        <h2>{article.title}</h2>
                        <div className="article-date my-2">
                            {dateTimeFormat(article.date)}
                        </div>
                        {article.relations && (
                            <PartyTags
                                className="article-tags my-2"
                                relations={article.relations}
                            />
                        )}
                        <div className="article-excerpt">{article.excerpt}</div>
                    </Col>
                </Row>
            </Link>
        </Col>
    );
}

export default ListItem;
