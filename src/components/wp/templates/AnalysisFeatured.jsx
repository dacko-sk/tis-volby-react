import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';

import { badgePctFormat } from '../../../helpers/helpers';
import { getActiveSubsite } from '../../../helpers/languages';
import { routes, segments } from '../../../helpers/routes';
import { transparencyClass } from '../../../helpers/wp';
import useAdsData from '../../../hooks/AdsData';
import { useAccountsData } from '../../../hooks/AccountsData';
import { partyData } from '../../../helpers/parties';
import { candidateData } from '../../../helpers/candidates';
import { labels, t } from '../../../helpers/dictionary';
import Media from '../Media';
import Loading from '../../general/Loading';

import defaultImg from '../../../../public/img/user_grey.png';

function AnalysisFeatured({ article, clickHandler, keyUpHandler }) {
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
            <Col md={4}>
                <Link
                    id={article.slug}
                    className={`article analysis-preview score-${cls}${
                        isElected ? ' analysis-elected' : ''
                    }`}
                    to={`/samosprava2022/hodnotenia/${article.slug}`}
                    state={{ article }}
                >
                    <div
                        className="thumb"
                        data-label={badgePctFormat(analysis.lastScore)}
                    >
                        <figure className="text-center">
                            <Media
                                alt={article.title.rendered}
                                id={article.featured_media}
                                fallback={defaultImg}
                            />
                        </figure>
                        <div className="cover text-center">
                            <span className="text-white fw-bold">{article.title.rendered}</span>
                        </div>
                    </div>
                </Link>
            </Col>
        );
    }

    // 2. Prezident 2024 Logic
    if (subsite === 'prezident2024') {
        const { candidateAdsData, findCandidateByWpTags } = useAdsData();
        const name = findCandidateByWpTags(article.tags) ?? article.title.rendered;
        const adsData = candidateAdsData(name);
        const candidate = candidateData(name, null, adsData);

        return (
            <Col md={4}>
                <Link
                    id={article.slug}
                    className={`article analysis-preview score-${cls}`}
                    to={routes.candidate(name, segments.ANALYSIS)}
                >
                    <div
                        className="thumb"
                        data-label={badgePctFormat(analysis.lastScore)}
                    >
                        <figure className="text-center">
                            <img src={candidate.image} alt={name} />
                        </figure>

                        <div className="cover text-center">
                            {candidate.hasInfo && (
                                <span className="info text-white">
                                    {t(labels.candidates.info)[candidate.infoKey]}
                                </span>
                            )}
                            <span className="text-white fw-bold">{name}</span>
                        </div>
                    </div>
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
        <Col md={4}>
            <Link
                id={article.slug}
                className={`article analysis-preview score-${cls}`}
                to={routes.party(name, segments.ANALYSIS)}
            >
                <div
                    className="thumb"
                    data-label={badgePctFormat(analysis.lastScore)}
                >
                    <figure className="text-center">
                        {article.featured_media ? (
                            <Media alt={name} id={article.featured_media} />
                        ) : (
                            party?.image
                        )}
                    </figure>
                    <div className="cover text-center">
                        <span className="text-white fw-bold">{name}</span>
                    </div>
                </div>
            </Link>
        </Col>
    );
}

export default AnalysisFeatured;
