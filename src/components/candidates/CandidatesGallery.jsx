import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { candidateData } from '../../helpers/candidates';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import useAccountsData from '../../hooks/AccountsData';
import useAdsData from '../../hooks/AdsData';

import Loading from '../general/Loading';
import { sortBySurname } from '../../helpers/helpers';

function CandidatesGallery() {
    const { allTransparentCandidatesNames, candidateAccountData } =
        useAccountsData();
    const { allCandidatesNames, candidateAdsData } = useAdsData();

    const transparentCandidates = allTransparentCandidatesNames();
    const gsCandidates = allCandidatesNames();

    return (
        <div className="my-4">
            <h2 className="mb-4">{t(labels.candidates.monitoring)}</h2>
            {transparentCandidates === null || gsCandidates === null ? (
                <Loading />
            ) : (
                <Row className="gy-4">
                    {Array.from(
                        new Set([...transparentCandidates, ...gsCandidates])
                    )
                        .sort(sortBySurname)
                        .map((name) => {
                            const accountData = candidateAccountData(name);
                            const adsData = candidateAdsData(name);
                            const candidate = candidateData(
                                name,
                                accountData,
                                adsData
                            );
                            return (
                                <Col xs={6} md={3} key={candidate.name}>
                                    <Link
                                        className="article analysis-preview"
                                        to={routes.candidate(candidate.name)}
                                    >
                                        <div className="thumb">
                                            <figure className="text-center">
                                                <img
                                                    src={candidate.image}
                                                    alt={candidate.name}
                                                />
                                            </figure>

                                            <div className="cover text-center">
                                                {candidate.hasInfo && (
                                                    <span className="info text-white">
                                                        {
                                                            t(
                                                                labels
                                                                    .candidates
                                                                    .info
                                                            )[candidate.infoKey]
                                                        }
                                                    </span>
                                                )}
                                                <span className="text-white fw-bold">
                                                    {candidate.name}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            );
                        })}
                </Row>
            )}
        </div>
    );
}

export default CandidatesGallery;
