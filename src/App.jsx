import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { languages, setSubsiteOverride } from './helpers/languages';
import {
    homepage,
    languageRoot,
    queries,
    routes,
    segments,
    urlSegment,
} from './helpers/routes';

import ContextProviders from './ContextProviders';
import Layout from './Layout';

// Base / Landing Page Pages
import Account from './pages/funding/Account';
import Accounts from './pages/funding/Accounts';
import Article from './pages/Article';
import Charts from './pages/funding/Charts';
import Donations from './pages/funding/Donations';
import Donor from './pages/funding/Donor';
import FundingNews from './pages/funding/FundingNews';
import AssetDeclarations from './pages/funding/AssetDeclarations';
import AssetDeclarationsDataDictionary from './pages/funding/AssetDeclarationsDataDictionary';
import AssetDeclaration from './pages/funding/AssetDeclaration';
import Government from './pages/Government';
import Home from './pages/Home';
import News from './pages/News';
import Parties from './pages/Parties';
import Party from './pages/Party';
import PartyAccounts from './pages/party/PartyAccounts';
import PartyDonations from './pages/party/PartyDonations';
import PartyGovernment from './pages/party/PartyGovernment';
import PartyNews from './pages/party/PartyNews';
import PartyOverview from './pages/party/PartyOverview';

// Samosprava 2026 Pages
import S26Home from './pages/samosprava2026/Home';
import S26Municipality from './pages/samosprava2026/Municipality';
import S26Region from './pages/samosprava2026/Region';
import S26News from './pages/samosprava2026/News';
import S26Party from './pages/samosprava2026/Party';
import S26PartyOverview from './pages/samosprava2026/party/PartyOverview';
import S26PartyNews from './pages/samosprava2026/party/PartyNews';
import S26Search from './pages/samosprava2026/Search';
import S26Candidates from './pages/samosprava2026/Candidates';
import S26Parties from './pages/samosprava2026/Parties';
import S26Campaigns from './pages/samosprava2026/Campaigns';
import S26Candidate from './pages/samosprava2026/Candidate';

// Euro 2024 Pages
import Euro24Home from './pages/euro2024/Home';
import Euro24Analyses from './pages/euro2024/Analyses';
import Euro24Article from './pages/euro2024/Article';
import Euro24News from './pages/euro2024/News';
import Euro24Online from './pages/euro2024/Online';
import Euro24Parties from './pages/euro2024/Parties';
import Euro24PartiesList from './pages/euro2024/parties/PartiesList';
import Euro24PartiesCandidates from './pages/euro2024/parties/PartiesCandidates';
import Euro24PartiesAssets from './pages/euro2024/parties/PartiesAssets';
import Euro24PartiesReports from './pages/euro2024/parties/PartiesReports';
import Euro24Party from './pages/euro2024/Party';
import Euro24PartyOverview from './pages/euro2024/party/PartyOverview';
import Euro24PartyAnalysis from './pages/euro2024/party/PartyAnalysis';
import Euro24PartyNews from './pages/euro2024/party/PartyNews';
import Euro24PartyOnline from './pages/euro2024/party/PartyOnline';
import Euro24PartyTransactions from './pages/euro2024/party/PartyTransactions';
import Euro24Search from './pages/euro2024/Search';

// Prezident 2024 Pages
import PrezidentHome from './pages/prezident2024/Home';
import PrezidentAnalyses from './pages/prezident2024/Analyses';
import PrezidentArticle from './pages/prezident2024/Article';
import PrezidentNews from './pages/prezident2024/News';
import PrezidentOnline from './pages/prezident2024/Online';
import PrezidentCandidates from './pages/prezident2024/Candidates';
import PrezidentCandidatesList from './pages/prezident2024/candidates/CandidatesList';
import PrezidentCandidatesReports from './pages/prezident2024/candidates/CandidatesReports';
import PrezidentCandidate from './pages/prezident2024/Candidate';
import PrezidentCandidateOverview from './pages/prezident2024/candidate/CandidateOverview';
import PrezidentCandidateAnalysis from './pages/prezident2024/candidate/CandidateAnalysis';
import PrezidentCandidateNews from './pages/prezident2024/candidate/CandidateNews';
import PrezidentCandidateOnline from './pages/prezident2024/candidate/CandidateOnline';
import PrezidentCandidateTransactions from './pages/prezident2024/candidate/CandidateTransactions';
import PrezidentSearch from './pages/prezident2024/Search';

// Parlament 2023 Pages
import ParlamentHome from './pages/parlament2023/Home';
import ParlamentAnalyses from './pages/parlament2023/Analyses';
import ParlamentArticle from './pages/parlament2023/Article';
import ParlamentNews from './pages/parlament2023/News';
import ParlamentOnline from './pages/parlament2023/Online';
import ParlamentParties from './pages/parlament2023/Parties';
import ParlamentPartiesList from './pages/parlament2023/parties/PartiesList';
import ParlamentPartiesCandidates from './pages/parlament2023/parties/PartiesCandidates';
import ParlamentPartiesAssets from './pages/parlament2023/parties/PartiesAssets';
import ParlamentPartiesReports from './pages/parlament2023/parties/PartiesReports';
import ParlamentParty from './pages/parlament2023/Party';
import ParlamentPartyOverview from './pages/parlament2023/party/PartyOverview';
import ParlamentPartyAnalysis from './pages/parlament2023/party/PartyAnalysis';
import ParlamentPartyNews from './pages/parlament2023/party/PartyNews';
import ParlamentPartyOnline from './pages/parlament2023/party/PartyOnline';
import ParlamentPartyTransactions from './pages/parlament2023/party/PartyTransactions';
import ParlamentSearch from './pages/parlament2023/Search';

// Samosprava 2022 Pages
import SamospravaHome from './pages/samosprava2022/Home';
import SamospravaCharts from './pages/samosprava2022/Charts';
import SamospravaAllCampaigns from './pages/samosprava2022/AllCampaigns';
import SamospravaAllDonors from './pages/samosprava2022/AllDonors';
import SamospravaMunicipality from './pages/samosprava2022/Municipality';
import SamospravaNews from './pages/samosprava2022/News';
import SamospravaArticle from './pages/samosprava2022/Article';
import SamospravaAnalyses from './pages/samosprava2022/Analyses';
import SamospravaCandidate from './pages/samosprava2022/Candidate';
import SamospravaRegion from './pages/samosprava2022/Region';
import SamospravaSearch from './pages/samosprava2022/Search';

import './scss/volby-landing.scss';

function App() {
    return (
        <BrowserRouter>
            <ContextProviders>
                <Routes>
                    <Route path={homepage} element={<Layout />}>
                        {/* 1. Base / Landing Page Routes */}
                        <Route index element={<Home />} />

                        {Object.keys(languages).map((lang) => {
                            setSubsiteOverride('landing');
                            const landingRoutes = [
                                [routes.home(lang), Home],
                                [routes.donations(lang), Donations],
                                [
                                    routes.donations(lang) +
                                        queries.searchAndFilter(true),
                                    Donations,
                                ],
                                [routes.donor(true, lang), Donor],
                                [
                                    routes.donor(true, lang) +
                                        queries.searchAndFilter(true),
                                    Donor,
                                ],
                                [routes.government(lang), Government],
                                [routes.charts(lang), Charts],
                                [routes.fundingNews(lang), FundingNews],
                                [
                                    routes.assetDeclarations(lang),
                                    AssetDeclarations,
                                ],
                                [
                                    routes.assetDeclarations(lang) +
                                        queries.searchAndFilter(true),
                                    AssetDeclarations,
                                ],
                                [
                                    routes.assetDeclarationsDataDictionary(
                                        lang
                                    ),
                                    AssetDeclarationsDataDictionary,
                                ],
                                [
                                    routes.assetDeclaration(true, lang),
                                    AssetDeclaration,
                                ],
                                [routes.accounts(lang), Accounts],
                                [
                                    routes.accounts(lang) +
                                        queries.searchAndFilter(true),
                                    Accounts,
                                ],
                                [routes.account(true, lang), Account],
                                [
                                    routes.account(true, lang) +
                                        queries.searchAndFilter(true),
                                    Account,
                                ],
                                [routes.parties(lang), Parties],
                                [
                                    routes.party(true, '', lang),
                                    Party,
                                    [
                                        ['', PartyOverview],
                                        [segments.DONATIONS, PartyDonations],
                                        [
                                            segments.DONATIONS,
                                            PartyDonations,
                                            queries.searchAndFilter(true),
                                        ],
                                        [segments.GOVERNMENT, PartyGovernment],
                                        [segments.ACCOUNTS, PartyAccounts],
                                        [
                                            segments.ACCOUNTS,
                                            PartyAccounts,
                                            queries.searchAndFilter(true),
                                        ],
                                        [segments.NEWS, PartyNews],
                                    ],
                                ],
                                [routes.news(lang), News],
                                [routes.article(true, lang), Article],
                            ];
                            setSubsiteOverride(null);
                            return landingRoutes.map(
                                ([path, Page, subpages]) => (
                                    <Route
                                        key={'base_' + lang + path}
                                        path={path}
                                        element={<Page />}
                                    >
                                        {(subpages ?? []).map(
                                            ([subSegment, SubPage, suffix]) => {
                                                if (subSegment) {
                                                    const subPath =
                                                        urlSegment(
                                                            subSegment,
                                                            lang
                                                        ) + (suffix ?? '');
                                                    return (
                                                        <Route
                                                            key={path + subPath}
                                                            path={subPath}
                                                            element={
                                                                <SubPage />
                                                            }
                                                        />
                                                    );
                                                }
                                                return (
                                                    <Route
                                                        key={`${path}index`}
                                                        index
                                                        element={<SubPage />}
                                                    />
                                                );
                                            }
                                        )}
                                    </Route>
                                )
                            );
                        })}

                        {/* 2. Municipal 2026 Routes */}
                        {Object.keys(languages).map((lang) => {
                            setSubsiteOverride('samosprava2026');
                            const s26Routes = [
                                [routes.home(lang), S26Home],
                                [routes.candidates('', lang), S26Candidates],
                                [routes.parties('', lang), S26Parties],
                                [
                                    routes.party(true, '', lang),
                                    S26Party,
                                    [
                                        ['', S26PartyOverview],
                                        [segments.NEWS, S26PartyNews],
                                    ],
                                ],
                                [routes.article(true, lang), SamospravaArticle],
                                [routes.news(lang), S26News],
                                [routes.campaigns(lang), S26Campaigns],
                                [
                                    routes.candidateMunicipal(true, '', lang),
                                    S26Candidate,
                                ],
                                [
                                    routes.municipality(true, '', lang),
                                    S26Municipality,
                                ],
                                [routes.region(true, lang), S26Region],
                                [routes.search(true, lang), S26Search],
                            ];
                            setSubsiteOverride(null);
                            return s26Routes.map(([path, Page, subpages]) => {
                                // Only process if the path is mapped to Municipal 2026
                                if (!path.startsWith('/samosprava2026'))
                                    return null;
                                return (
                                    <Route
                                        key={'s26_' + lang + path}
                                        path={path}
                                        element={<Page />}
                                    >
                                        {(subpages ?? []).map(
                                            ([subSegment, SubPage]) => (
                                                <Route
                                                    key={path + subSegment}
                                                    index={
                                                        subSegment ? null : true
                                                    }
                                                    path={
                                                        subSegment
                                                            ? urlSegment(
                                                                  subSegment,
                                                                  lang
                                                              )
                                                            : null
                                                    }
                                                    element={<SubPage />}
                                                />
                                            )
                                        )}
                                    </Route>
                                );
                            });
                        })}

                        {/* 3. Euro 2024 Routes */}
                        {Object.keys(languages).map((lang) => {
                            setSubsiteOverride('euro2024');
                            const euroRoutes = [
                                [routes.home(lang), Euro24Home],
                                [routes.analyses(lang), Euro24Analyses],
                                [routes.article(true, lang), Euro24Article],
                                [routes.news(lang), Euro24News],
                                [routes.online(lang), Euro24Online],
                                [
                                    routes.parties('', lang),
                                    Euro24Parties,
                                    [
                                        ['', Euro24PartiesList],
                                        [
                                            segments.CANDIDATES,
                                            Euro24PartiesCandidates,
                                        ],
                                        [segments.ASSETS, Euro24PartiesAssets],
                                        [
                                            segments.REPORTS,
                                            Euro24PartiesReports,
                                        ],
                                    ],
                                ],
                                [
                                    routes.party(true, '', lang),
                                    Euro24Party,
                                    [
                                        ['', Euro24PartyOverview],
                                        [
                                            segments.ANALYSIS,
                                            Euro24PartyAnalysis,
                                        ],
                                        [segments.NEWS, Euro24PartyNews],
                                        [segments.ONLINE, Euro24PartyOnline],
                                        [
                                            segments.TRANSACTIONS,
                                            Euro24PartyTransactions,
                                        ],
                                    ],
                                ],
                                [routes.search(true, lang), Euro24Search],
                            ];
                            setSubsiteOverride(null);
                            return euroRoutes.map(([path, Page, subpages]) => {
                                // Only process if the path is mapped to Euro 2024
                                if (!path.startsWith('/euro2024')) return null;
                                return (
                                    <Route
                                        key={'euro_' + lang + path}
                                        path={path}
                                        element={<Page />}
                                    >
                                        {(subpages ?? []).map(
                                            ([subSegment, SubPage]) => (
                                                <Route
                                                    key={path + subSegment}
                                                    index={
                                                        subSegment ? null : true
                                                    }
                                                    path={
                                                        subSegment
                                                            ? urlSegment(
                                                                  subSegment,
                                                                  lang
                                                              )
                                                            : null
                                                    }
                                                    element={<SubPage />}
                                                />
                                            )
                                        )}
                                    </Route>
                                );
                            });
                        })}

                        {/* 4. Prezident 2024 Routes */}
                        {Object.keys(languages).map((lang) => {
                            setSubsiteOverride('prezident2024');
                            const prezidentRoutes = [
                                [routes.home(lang), PrezidentHome],
                                [routes.analyses(lang), PrezidentAnalyses],
                                [routes.article(true, lang), PrezidentArticle],
                                [routes.news(lang), PrezidentNews],
                                [routes.online(lang), PrezidentOnline],
                                [
                                    routes.candidates('', lang),
                                    PrezidentCandidates,
                                    [
                                        ['', PrezidentCandidatesList],
                                        [
                                            segments.REPORTS,
                                            PrezidentCandidatesReports,
                                        ],
                                    ],
                                ],
                                [
                                    routes.candidate(true, '', lang),
                                    PrezidentCandidate,
                                    [
                                        ['', PrezidentCandidateOverview],
                                        [
                                            segments.ANALYSIS,
                                            PrezidentCandidateAnalysis,
                                        ],
                                        [segments.NEWS, PrezidentCandidateNews],
                                        [
                                            segments.ONLINE,
                                            PrezidentCandidateOnline,
                                        ],
                                        [
                                            segments.TRANSACTIONS,
                                            PrezidentCandidateTransactions,
                                        ],
                                    ],
                                ],
                                [routes.search(true, lang), PrezidentSearch],
                            ];
                            setSubsiteOverride(null);
                            return prezidentRoutes.map(
                                ([path, Page, subpages]) => {
                                    if (!path.startsWith('/prezident2024'))
                                        return null;
                                    return (
                                        <Route
                                            key={'prezident_' + lang + path}
                                            path={path}
                                            element={<Page />}
                                        >
                                            {(subpages ?? []).map(
                                                ([subSegment, SubPage]) => (
                                                    <Route
                                                        key={path + subSegment}
                                                        index={
                                                            subSegment
                                                                ? null
                                                                : true
                                                        }
                                                        path={
                                                            subSegment
                                                                ? urlSegment(
                                                                      subSegment,
                                                                      lang
                                                                  )
                                                                : null
                                                        }
                                                        element={<SubPage />}
                                                    />
                                                )
                                            )}
                                        </Route>
                                    );
                                }
                            );
                        })}

                        {/* 5. Parlament 2023 Routes */}
                        {Object.keys(languages).map((lang) => {
                            setSubsiteOverride('parlament2023');
                            const parlamentRoutes = [
                                [routes.home(lang), ParlamentHome],
                                [routes.analyses(lang), ParlamentAnalyses],
                                [routes.article(true, lang), ParlamentArticle],
                                [routes.news(lang), ParlamentNews],
                                [routes.online(lang), ParlamentOnline],
                                [
                                    routes.parties('', lang),
                                    ParlamentParties,
                                    [
                                        ['', ParlamentPartiesList],
                                        [
                                            segments.CANDIDATES,
                                            ParlamentPartiesCandidates,
                                        ],
                                        [
                                            segments.ASSETS,
                                            ParlamentPartiesAssets,
                                        ],
                                        [
                                            segments.REPORTS,
                                            ParlamentPartiesReports,
                                        ],
                                    ],
                                ],
                                [
                                    routes.party(true, '', lang),
                                    ParlamentParty,
                                    [
                                        ['', ParlamentPartyOverview],
                                        [
                                            segments.ANALYSIS,
                                            ParlamentPartyAnalysis,
                                        ],
                                        [segments.ONLINE, ParlamentPartyOnline],
                                        [segments.NEWS, ParlamentPartyNews],
                                        [
                                            segments.TRANSACTIONS,
                                            ParlamentPartyTransactions,
                                        ],
                                    ],
                                ],
                                [routes.search(true, lang), ParlamentSearch],
                            ];
                            setSubsiteOverride(null);
                            return parlamentRoutes.map(
                                ([path, Page, subpages]) => {
                                    if (!path.startsWith('/parlament2023'))
                                        return null;
                                    return (
                                        <Route
                                            key={'parlament_' + lang + path}
                                            path={path}
                                            element={<Page />}
                                        >
                                            {(subpages ?? []).map(
                                                ([subSegment, SubPage]) => (
                                                    <Route
                                                        key={path + subSegment}
                                                        index={
                                                            subSegment
                                                                ? null
                                                                : true
                                                        }
                                                        path={
                                                            subSegment
                                                                ? urlSegment(
                                                                      subSegment,
                                                                      lang
                                                                  )
                                                                : null
                                                        }
                                                        element={<SubPage />}
                                                    />
                                                )
                                            )}
                                        </Route>
                                    );
                                }
                            );
                        })}

                        {/* 6. Samosprava 2022 Routes (Slovak only!) */}
                        <Route path="samosprava2022">
                            <Route index element={<SamospravaHome />} />
                            <Route
                                path="grafy"
                                element={<SamospravaCharts />}
                            />
                            <Route
                                path="grafy/kampane"
                                element={<SamospravaAllCampaigns />}
                            />
                            <Route
                                path="grafy/donori"
                                element={<SamospravaAllDonors />}
                            />
                            <Route
                                path="samospravy/:municipality"
                                element={<SamospravaMunicipality />}
                            />
                            <Route
                                path="aktuality"
                                element={<SamospravaNews />}
                            />
                            <Route
                                path="aktuality/:slug"
                                element={<SamospravaArticle />}
                            />
                            <Route
                                path="hodnotenia"
                                element={<SamospravaAnalyses />}
                            />
                            <Route
                                path="hodnotenia/:slug"
                                element={<SamospravaArticle />}
                            />
                            <Route
                                path="kandidati/:slug"
                                element={<SamospravaCandidate />}
                            />
                            <Route
                                path="kraje/:region"
                                element={<SamospravaRegion />}
                            />
                            <Route
                                path="vyhladavanie/:query"
                                element={<SamospravaSearch />}
                            />
                        </Route>

                        {/* Redirect removed funding page */}
                        {Object.keys(languages).map((lang) => (
                            <Route
                                key={lang}
                                path={routes.funding(lang)}
                                element={
                                    <Navigate
                                        replace
                                        to={routes.donations(lang)}
                                    />
                                }
                            />
                        ))}

                        {/* Fallback */}
                        <Route
                            path="*"
                            element={<Navigate to={languageRoot()} />}
                        />
                    </Route>
                </Routes>
            </ContextProviders>
        </BrowserRouter>
    );
}

export default App;
