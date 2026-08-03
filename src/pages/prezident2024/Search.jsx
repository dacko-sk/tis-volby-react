import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { contains } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';
import { wpCat } from '../../helpers/wp';

import useAccountsData, {
    aggregatedKeys as agk,
} from '../../hooks/AccountsData';
import useAdsData, { csvConfig } from '../../hooks/AdsData';

import AlertWithIcon from '../../components/general/AlertWithIcon';
import Title from '../../components/structure/Title';
import Posts from '../../components/wp/Posts';

import linkIcon from '../../../public/img/external_link_icon.svg?url';
import pdfIcon from '../../../public/img/PDF_icon.svg?url';

function Search() {
    const params = useParams();
    const query = params.query ?? null;
    const navigate = useNavigate();

    const { candidateAccountData } = useAccountsData();
    const { allCandidatesNames, candidateAdsData } = useAdsData();

    const foundCandidateNames = (allCandidatesNames() ?? []).filter((name) =>
        contains(name, query)
    );

    const candidates = foundCandidateNames.map((name) => {
        const link = routes.candidate(name);
        return (
            <Col key={name} className="d-flex" sm>
                <Link
                    to={link}
                    className="d-flex flex-column justify-content-between w-100 cat-local"
                >
                    <h3 className="text-capitalize">{name}</h3>
                </Link>
            </Col>
        );
    });
    const accounts = foundCandidateNames.flatMap((name) => {
        const accountData = candidateAccountData(name);
        return accountData
            ? [
                  <Col key={name} className="d-flex" sm>
                      <a
                          className="d-flex flex-column justify-content-between w-100 cat-local"
                          href={accountData[agk.account]}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="download"
                      >
                          <h3 className="text-capitalize">
                              <span className="me-2">{name}</span>
                              <img className="inline-icon" src={linkIcon} />
                          </h3>
                      </a>
                  </Col>,
              ]
            : [];
    });
    const reports = foundCandidateNames.map((name) => {
        const adsData = candidateAdsData(name);
        return adsData && adsData[csvConfig.ACCOUNTS.columns.REPORT] ? (
            <Col key={name} className="d-flex" sm>
                <a
                    className="d-flex flex-column justify-content-between w-100 cat-local"
                    href={adsData[csvConfig.ACCOUNTS.columns.REPORT]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="download"
                >
                    <h3 className="text-capitalize">
                        <span className="me-2">{name}</span>
                        <img className="inline-icon" src={pdfIcon} />
                    </h3>
                </a>
            </Col>
        ) : null;
    });

    useEffect(() => {
        if (!query) {
            // redirect to root page if no query string is provided
            navigate(routes.home());
        }
    }, [query]);

    setTitle(`${t(labels.search.results)} „${query}“`);

    return (
        <section className="search-results">
            <Title secondary={`„${query}“`}>
                {t(labels.search.results)}
                <br />
            </Title>

            <h2 className="my-4">{t(labels.candidates.navTitle)}</h2>
            {candidates.length ? (
                <Row className="tiles gx-4 gy-4">{candidates}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.candidates.noResults)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.account.title)}</h2>
            {accounts.length ? (
                <Row className="tiles gx-4 gy-4">{accounts}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.candidates.noResults)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.finalReports)}</h2>
            {reports.length ? (
                <Row className="tiles gx-4 gy-4">{reports}</Row>
            ) : (
                <AlertWithIcon className="my-4" variant="danger">
                    {t(labels.candidates.noResults)}
                </AlertWithIcon>
            )}

            <h2 className="my-4">{t(labels.news.pageTitle)}</h2>
            <Posts
                categories={[wpCat.news]}
                noResults={t(labels.news.noData)}
                search={query}
            />
        </section>
    );
}

export default Search;
