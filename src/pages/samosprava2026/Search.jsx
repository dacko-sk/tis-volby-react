import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../helpers/dictionary';
import { contains, regionalCity, setTitle } from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

import { municipalTypes } from '../../hooks/AccountsData';
import {
    useElectionData,
    getMunicipalities,
    getSearchTags,
    getMunicipalityShortname,
    isRegionalFunction,
} from '../../hooks/CmsQueries';

import { newsCategories } from './News';
import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';
import Posts from '../../components/wp/Posts';

function Search() {
    const params = useParams();
    const query = params?.query ?? null;
    const navigate = useNavigate();

    const { data: cmsData } = useElectionData();

    // parse data
    const municipalities = [];
    const candidates = [];
    const parties = [];

    if (cmsData?.candidates) {
        getMunicipalities(cmsData).forEach((mun) => {
            const city = mun.municipality;
            const shortName = getMunicipalityShortname(city);
            const munMatch =
                city &&
                (contains(city, query) ||
                    contains(regionalCity(city), query) ||
                    contains(shortName, query));

            if (munMatch) {
                const key = `${mun.region ?? '_'}-${city}`;
                const link = routes.municipality(shortName, mun.region ?? null);
                municipalities.push(
                    <Col key={key} className="d-flex" sm>
                        <Link
                            to={link}
                            className={`d-flex flex-column justify-content-between w-100 cat-${
                                mun.isRegional ? 'regional' : 'local'
                            }`}
                        >
                            <h3>{city}</h3>
                            <div className="type">
                                {t(
                                    labels.elections.municipalTypes[
                                        mun.isRegional
                                            ? municipalTypes.regional
                                            : municipalTypes.local
                                    ]
                                )}
                            </div>
                        </Link>
                    </Col>
                );
            }
        });

        cmsData.candidates.forEach((candidate) => {
            const city = candidate.municipality;
            const shortName = getMunicipalityShortname(city);

            if (
                contains(candidate.person?.name, query) ||
                (city && contains(city, query)) ||
                (shortName && contains(shortName, query))
            ) {
                const isRegional = isRegionalFunction(candidate.functionType);
                const link = routes.candidateMunicipal(
                    candidate.person?.name,
                    shortName
                );
                candidates.push(
                    <Col
                        key={`${candidate.person?.name}-${city}`}
                        className="d-flex"
                        sm
                    >
                        <Link
                            to={link}
                            className={`d-flex flex-column justify-content-between w-100 cat-${
                                isRegional ? 'regional' : 'local'
                            }`}
                        >
                            <h3>{candidate.person?.name}</h3>
                            {city && (
                                <div className="town my-3">
                                    {candidate.municipality}
                                </div>
                            )}
                            <div className="type">
                                {t(
                                    labels.elections.municipalTypes[
                                        isRegional
                                            ? municipalTypes.regional
                                            : municipalTypes.local
                                    ]
                                )}
                            </div>
                        </Link>
                    </Col>
                );
            }
        });
    }

    if (cmsData?.subjects) {
        cmsData.subjects.forEach((subject) => {
            if (
                contains(subject.name, query) ||
                contains(subject.abbreviation, query)
            ) {
                const link = routes.party(subject.name);
                parties.push(
                    <Col key={subject.name} className="d-flex" sm>
                        <Link
                            to={link}
                            className="d-flex flex-column justify-content-between w-100 cat-regional"
                        >
                            <h3>{subject.name}</h3>
                            {subject.abbreviation && (
                                <div className="town my-3">
                                    {subject.abbreviation}
                                </div>
                            )}
                            <div className="type">
                                {t(labels.search.parties)}
                            </div>
                        </Link>
                    </Col>
                );
            }
        });
    }

    const tags = getSearchTags(cmsData, query);

    useEffect(() => {
        if (!query) {
            // redirect to root page if no query string is provided
            navigate(routes.home);
        }
    }, [query, navigate]);

    if (!cmsData) {
        return <Loading />;
    }

    setTitle(`${t(labels.search.results)} „${query}“`);

    return (
        <section className="search-results">
            <Title secondary={`„${query}“`}>{t(labels.search.results)}</Title>

            <h2 className="mb-4">{t(labels.search.municipalities)}</h2>
            {municipalities.length ? (
                <Row className="tiles gx-4 gy-4">{municipalities}</Row>
            ) : (
                <Alert variant="secondary">
                    {t(labels.search.noMunicipality)}
                </Alert>
            )}

            <h2 className="my-4">{t(labels.search.candidates)}</h2>
            {candidates.length ? (
                <Row className="tiles gx-4 gy-4">{candidates}</Row>
            ) : (
                <Alert variant="secondary">
                    {t(labels.search.noCandidate)}
                </Alert>
            )}

            <h2 className="my-4">{t(labels.search.parties)}</h2>
            {parties.length ? (
                <Row className="tiles gx-4 gy-4">{parties}</Row>
            ) : (
                <Alert variant="secondary">{t(labels.search.noParty)}</Alert>
            )}

            <h2 className="my-4">{t(labels.search.news)}</h2>
            <Posts
                categories={newsCategories}
                noResults={t(labels.search.noNews)}
                section={segments.NEWS}
                search={tags.length > 0 ? undefined : query}
                tags={tags.length > 0 ? tags : undefined}
            />
        </section>
    );
}

export default Search;
