import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../helpers/dictionary';
import {
    compareStr,
    contains,
    regionalCity,
    setTitle,
    sortByNumericProp,
} from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

import useData, {
    municipalTypes,
    s22AggregatedKeys,
} from '../../hooks/AccountsData';

import { analysesCategories } from './Analyses';
import { newsCategories } from './News';
import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';
import Posts from '../../components/wp/Posts';

function Search() {
    const params = useParams();
    const query = params?.query ?? null;
    const navigate = useNavigate();

    const { csvData } = useData();

    // parse data
    const candidates = [];
    const mun = {};
    if (csvData?.data) {
        csvData.data.sort(sortByNumericProp('sum_outgoing')).forEach((row) => {
            if (!row.isParty) {
                const city = row[s22AggregatedKeys.municipality] ?? '';
                // if candidate's municipality name or regional city name matches search query
                const munMatch =
                    city &&
                    (contains(city, query) ||
                        contains(regionalCity(city), query));

                // municipality matches - list municipality
                if (munMatch) {
                    const key = `${row[s22AggregatedKeys.region] ?? '_'}-${
                        row.municipalityShortName
                    }`;
                    const link = routes.municipality(
                        row.municipalityShortName,
                        row[s22AggregatedKeys.region] ?? null
                    );
                    mun[key] = (
                        <Col key={key} className="d-flex" sm>
                            <Link
                                to={link}
                                className={`d-flex flex-column justify-content-between w-100 cat-${
                                    row.isRegional ? 'regional' : 'local'
                                }`}
                            >
                                <h3>{row[s22AggregatedKeys.municipality]}</h3>
                                <div className="type">
                                    {t(
                                        labels.elections.municipalTypes[
                                            row.isRegional
                                                ? municipalTypes.regional
                                                : municipalTypes.local
                                        ]
                                    )}
                                </div>
                            </Link>
                        </Col>
                    );
                }

                // candidate name or municipalities matches - list candidate
                if (contains(row[s22AggregatedKeys.name], query) || munMatch) {
                    const link = routes.candidateMunicipal(
                        row[s22AggregatedKeys.name],
                        row.municipalityShortName
                    );
                    candidates.push(
                        <Col
                            key={
                                row[s22AggregatedKeys.name] +
                                row[s22AggregatedKeys.municipality]
                            }
                            className="d-flex"
                            sm
                        >
                            <Link
                                to={link}
                                className={`d-flex flex-column justify-content-between w-100 cat-${
                                    row.isRegional ? 'regional' : 'local'
                                }`}
                            >
                                <h3>{row[s22AggregatedKeys.name]}</h3>
                                {row[s22AggregatedKeys.municipality] && (
                                    <div className="town my-3">
                                        {row.municipalityShortName}
                                    </div>
                                )}
                                <div className="type">
                                    {t(
                                        labels.elections.municipalTypes[
                                            row.isRegional
                                                ? municipalTypes.regional
                                                : municipalTypes.local
                                        ]
                                    )}
                                </div>
                            </Link>
                        </Col>
                    );
                }
            }
        });
    }
    const municipalities = Object.values(mun);

    // check if search keyword is one of the regional cities
    let analysesCat = null;
    Object.entries(analysesCategories.regions).some(([region, regionCat]) => {
        if (compareStr(query, regionalCity(region))) {
            analysesCat = regionCat;
            return true;
        }
        return false;
    });

    useEffect(() => {
        if (!query) {
            // redirect to root page if no query string is provided
            navigate(routes.home);
        }
    }, [query]);

    if (!csvData?.data) {
        return <Loading />;
    }

    setTitle(`Výsledky vyhľadávania výrazu „${query}“`);

    return (
        <section className="search-results">
            <Title secondary={`„${query}“`}>Výsledky vyhľadávania výrazu</Title>

            <h2 className="mb-4">Samosprávy</h2>
            {municipalities.length ? (
                <Row className="tiles gx-4 gy-4">{municipalities}</Row>
            ) : (
                <Alert variant="secondary">
                    Hľadanému výrazu nezodpovedá žiadna samospráva.
                </Alert>
            )}

            <h2 className="my-4">Kandidáti</h2>
            {candidates.length ? (
                <Row className="tiles gx-4 gy-4">{candidates}</Row>
            ) : (
                <Alert variant="secondary">
                    Hľadanému výrazu nezodpovedá žiaden kandidát.
                </Alert>
            )}

            <h2 className="my-4">Hodnotenia</h2>
            <Posts
                categories={[analysesCat ?? analysesCategories.main]}
                noResults="Hľadaný výraz nebol nájdený v žiadnom hodnotení."
                section={segments.ANALYSES}
                search={analysesCat ? '' : query}
            />

            <h2 className="my-4">Aktuality</h2>
            <Posts
                categories={newsCategories}
                noResults="Hľadaný výraz nebol nájdený v žiadnej z aktualít."
                section={segments.NEWS}
                search={query}
            />
        </section>
    );
}

export default Search;
