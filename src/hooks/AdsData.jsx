import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router';

import { getActiveSubsite } from '../helpers/languages';
import { parties as partyConfig } from '../helpers/parties';
import {
    fixNumber,
    isNumeric,
    sortAlphabetically,
} from '../helpers/helpers';

// 1. Static CSV file imports for all subsites
import euro24Accounts from '../../public/euro2024/csv/online/accounts.csv';
import euro24Google from '../../public/euro2024/csv/online/Google.csv';
import euro24Meta from '../../public/euro2024/csv/online/Meta.csv';

import prezident24Accounts from '../../public/prezident2024/csv/online/accounts.csv';
import prezident24Google from '../../public/prezident2024/csv/online/Google.csv';
import prezident24Meta from '../../public/prezident2024/csv/online/Meta.csv';

import parlament23Accounts from '../../public/parlament2023/csv/online/accounts.csv';
import parlament23Google from '../../public/parlament2023/csv/online/Google.csv';
import parlament23Meta from '../../public/parlament2023/csv/online/Meta.csv';

export const csvConfig = {
    ACCOUNTS: {
        columns: {
            CANDIDATE: 'Kandidát',
            SHORT_NAME: 'Skratka',
            FULL_NAME: 'Plný názov strany',
            FB: 'FB Účty',
            GOOGLE: 'Google účty',
            TA_NAME: 'Transparentný účet',
            WP: 'WP tag',
            CL: 'Kandidátne listiny',
            ASSETS: 'Majetkové priznania',
            REPORTS: 'Záverečné správy',
            REPORT: 'Záverečná správa',
            INFO: 'Info',
            CAMPAIGN: 'Kampaň',
            PRECAMPAIGN: 'Predkampaň',
        }
    },
    GOOGLE: {
        columns: {
            ID: 'ID',
            PAGE_NAME: 'Inzerent',
            SPENDING: 'Výdavky na reklamu',
            AMOUNT: 'Počet reklám',
            VIDEO: 'Video',
            IMAGE: 'Obrázková',
            TEXT: 'Textová',
            UPDATED: 'Aktualizácia',
        }
    },
    META: {
        columns: {
            PAGE_ID: 'Page ID',
            PAGE_NAME: 'Page name',
            SPENDING: 'Amount spent (EUR)',
        }
    }
};

export const csvFiles = {
    PARTY_ACCOUNTS: 'ACCOUNTS',
    GOOGLE: 'GOOGLE',
    META: 'META',
};

export const VAT = 1.2;

const getMetaApiUrl = (subsite) => {
    if (subsite === 'euro2024') return 'https://volby.transparency.sk/api/meta/euro24/ads_json.php';
    if (subsite === 'prezident2024') return 'https://volby.transparency.sk/api/meta/prezident24/ads_json.php';
    if (subsite === 'parlament2023') return 'https://volby.transparency.sk/api/meta/ads_json.php';
    return null;
};

const getTimestampFromIsoDate = (isoString) => {
    const t = new Date(isoString).getTime();
    return Number.isNaN(t) ? 0 : t / 1000;
};

const getEodTimestampFromDate = (dateString) => {
    if (dateString) {
        const parts = dateString.split('.');
        if (parts.length === 3) {
            const t = new Date(
                parts[2],
                parts[1] - 1,
                parts[0],
                23,
                59,
                59
            ).getTime();
            return Number.isNaN(t) ? 0 : t / 1000;
        }
    }
    return 0;
};

const getTimestampFromDate = (dateString) => {
    if (dateString) {
        const parts = dateString.split('.');
        if (parts.length === 3) {
            const t = new Date(
                parts[2],
                parts[1] - 1,
                parts[0]
            ).getTime();
            return Number.isNaN(t) ? 0 : t / 1000;
        }
    }
    return 0;
};

const initialSheetsData = {
    error: null,
    googleAds: [],
    metaAds: {},
    lastUpdateFb: 0,
    lastUpdateGgl: 0,
    loaded: false,
    parties: {},
    candidates: {},
    partiesFb: {},
    partiesGgl: {},
    candidatesLists: {},
    assets: {},
    precampaign: {},
    campaign: {},
    reports: {},
};

const initialMetaApiData = {
    error: null,
    pages: {},
    lastUpdate: 0,
    loaded: false,
};

const filterPoliticAccountsEuro24 = (parties) => (account) => {
    const pageId = account['Page ID'];
    if (pageId ?? false) {
        return !!Object.values(parties).find((party) =>
            party['FB Účty']?.includes(pageId)
        );
    }
    return false;
};

const filterPoliticAccountsPrezident24 = (candidates) => (account) => {
    const pageId = account['Page ID'];
    if (pageId ?? false) {
        return !!Object.values(candidates).find((candidate) =>
            candidate['FB Účty']?.includes(pageId)
        );
    }
    return false;
};

const filterPoliticAccountsParlament23 = (partiesFb) => (pageData) => {
    let isPolitic = false;
    const pageId = pageData['Page ID'];
    if (pageId ?? false) {
        Object.values(partiesFb).some((partyAccounts) => {
            if (partyAccounts.includes(pageId)) {
                isPolitic = true;
                return true;
            }
            return false;
        });
    }
    return isPolitic;
};

const parseAccountsSheet = (allData, sheetData, subsite) => {
    if (subsite === 'euro2024') {
        const parties = {};
        sheetData.forEach((row) => {
            parties[row['Skratka']] = {
                'Plný názov strany': row['Plný názov strany'] ?? null,
                'FB Účty': row['FB Účty'] ?? false
                    ? row['FB Účty'].replaceAll(' ', '').split(',')
                    : [],
                'Google účty': row['Google účty'] ?? false
                    ? row['Google účty'].replaceAll(' ', '').split(',')
                    : [],
                'Transparentný účet': row['Transparentný účet'] ?? null,
                'WP tag': row['WP tag'] ?? false
                    ? fixNumber(row['WP tag'])
                    : null,
                'Kandidátne listiny': row['Kandidátne listiny'] ?? null,
                'Majetkové priznania': row['Majetkové priznania'] ?? null,
                'Záverečné správy': (row['Záverečné správy'] ?? '')
                    .split(';')
                    .map((item) => item.trim()),
                'Kampaň': row['Kampaň'] ?? false
                    ? fixNumber(row['Kampaň'])
                    : 0,
                'Predkampaň': row['Predkampaň'] ?? false
                    ? fixNumber(row['Predkampaň'])
                    : 0,
            };
        });
        return { ...allData, parties };
    }
    
    if (subsite === 'prezident2024') {
        const candidates = {};
        sheetData.forEach((row) => {
            candidates[row['Kandidát']] = {
                'FB Účty': row['FB Účty'] ?? false
                    ? row['FB Účty'].replaceAll(' ', '').split(',')
                    : [],
                'Google účty': row['Google účty'] ?? false
                    ? row['Google účty'].replaceAll(' ', '').split(',')
                    : [],
                'WP tag': row['WP tag'] ?? false
                    ? fixNumber(row['WP tag'])
                    : null,
                'Info': row['Info']?.length
                    ? fixNumber(row['Info'])
                    : null,
                'Záverečná správa': row['Záverečná správa'] ?? null,
                'Kampaň': row['Kampaň'] ?? false
                    ? fixNumber(row['Kampaň'])
                    : 0,
                'Predkampaň': row['Predkampaň'] ?? false
                    ? fixNumber(row['Predkampaň'])
                    : 0,
            };
        });
        return { ...allData, candidates };
    }

    if (subsite === 'parlament2023') {
        const partiesFb = {};
        const partiesGgl = {};
        const candidatesLists = {};
        const assets = {};
        const reports = {};
        const campaign = {};
        const precampaign = {};

        sheetData.forEach((row) => {
            const party = row['Strana'];
            if (row['FB Účty'] ?? false) {
                partiesFb[party] = row['FB Účty'].replaceAll(' ', '').split(',');
            }
            if (row['Google účty'] ?? false) {
                partiesGgl[party] = row['Google účty'].replaceAll(' ', '').split(',');
            }
            if (row['Kandidátne listiny'] ?? false) {
                candidatesLists[party] = row['Kandidátne listiny'];
            }
            if (row['Majetkové priznania'] ?? false) {
                assets[party] = row['Majetkové priznania'];
            }
            if (row['Záverečné správy'] ?? false) {
                reports[party] = row['Záverečné správy'];
            }
            if (row['Kampaň'] ?? false) {
                campaign[party] = fixNumber(row['Kampaň']);
            }
            if (row['Predkampaň'] ?? false) {
                precampaign[party] = fixNumber(row['Predkampaň']);
            }
        });

        return {
            ...allData,
            partiesFb,
            partiesGgl,
            candidatesLists,
            assets,
            reports,
            campaign,
            precampaign,
        };
    }

    return allData;
};

const parseGoogleSheetData = (allData, sheetData, subsite) => {
    if (subsite === 'prezident2024') {
        return {
            ...allData,
            googleAds: sheetData.map((pageData) => ({
                ...pageData,
                'Počet reklám': fixNumber(pageData['Počet reklám']),
                'Výdavky na reklamu': fixNumber(pageData['Výdavky na reklamu']) * VAT,
                'Textová': fixNumber(pageData['Textová']) * VAT,
                'Obrázková': fixNumber(pageData['Obrázková']) * VAT,
                'Video': fixNumber(pageData['Video']) * VAT,
            })),
            lastUpdateGgl: sheetData.length > 0 ? Math.max(
                ...sheetData.map((pageData) =>
                    getEodTimestampFromDate(pageData['Aktualizácia'])
                )
            ) : 0,
        };
    }
    
    // euro2024 and parlament2023
    return {
        ...allData,
        googleAds: sheetData,
        lastUpdateGgl: sheetData.length > 0 ? Math.max(
            ...sheetData.map((pageData) =>
                getEodTimestampFromDate(pageData['Aktualizácia'])
            )
        ) : 0,
    };
};

const parseMetaSheetData = (allData, sheetData, subsite) => {
    if (subsite === 'euro2024') {
        const monitoringEnd = '2024-07-25T07:00:00';
        const date = getTimestampFromIsoDate(monitoringEnd);
        return {
            ...allData,
            metaAds: {
                ...allData.metaAds,
                [date]: sheetData.filter(filterPoliticAccountsEuro24(allData.parties)),
            },
            lastUpdateFb: date,
        };
    }
    
    if (subsite === 'prezident2024') {
        const monitoringEnd = '2024-07-25T07:00:00';
        const date = getTimestampFromIsoDate(monitoringEnd);
        return {
            ...allData,
            metaAds: {
                ...allData.metaAds,
                [date]: sheetData.filter(filterPoliticAccountsPrezident24(allData.candidates)),
            },
            lastUpdateFb: date,
        };
    }

    if (subsite === 'parlament2023') {
        const endDate = '27.9.2023';
        return {
            ...allData,
            metaAds: sheetData.filter(filterPoliticAccountsParlament23(allData.partiesFb)),
            lastUpdateFb: getTimestampFromDate(endDate),
        };
    }

    return allData;
};

const processDataCsv = (filesData, subsite) => {
    let pd = { ...initialSheetsData, loaded: true };
    
    if (filesData.ACCOUNTS?.data) {
        pd = parseAccountsSheet(pd, filesData.ACCOUNTS.data, subsite);
    }
    if (filesData.GOOGLE?.data) {
        pd = parseGoogleSheetData(pd, filesData.GOOGLE.data, subsite);
    }
    if (filesData.META?.data) {
        pd = parseMetaSheetData(pd, filesData.META.data, subsite);
    }
    
    return pd;
};

const processDataMetaApi = (data, subsite) => {
    if (data.pages ?? false) {
        const pd = { ...initialMetaApiData, ...data, loaded: true };
        
        if (subsite === 'euro2024' || subsite === 'prezident2024') {
            Object.entries(data.pages).forEach(([pageId, pageProps]) => {
                pd.lastUpdate = Math.max(pd.lastUpdate, pageProps.updated ?? 0);
                pd.pages[pageId].spend.min = pageProps.spend.min * VAT;
                pd.pages[pageId].spend.max = pageProps.spend.max * VAT;
                pd.pages[pageId].spend.est = pageProps.spend.est * VAT;
            });
        } else {
            Object.values(data.pages).forEach((pageData) => {
                pd.lastUpdate = Math.max(pd.lastUpdate, pageData.updated ?? 0);
            });
        }
        
        return pd;
    }
    return data;
};

const AdsDataContext = createContext({
    sheetsData: initialSheetsData,
    metaApiData: initialMetaApiData,
});

export const AdsDataProvider = function ({ children }) {
    const [sheetsData, setSheetsData] = useState(initialSheetsData);
    const [metaApiData, setMetaApiData] = useState(initialMetaApiData);
    const { readRemoteFile } = usePapaParse();
    const location = useLocation();

    const activeSubsite = getActiveSubsite(location.pathname);

    // Load static files when activeSubsite changes
    useEffect(() => {
        let accountsFile = null;
        let googleFile = null;
        let metaFile = null;

        if (activeSubsite === 'euro2024') {
            accountsFile = euro24Accounts;
            googleFile = euro24Google;
            metaFile = euro24Meta;
        } else if (activeSubsite === 'prezident2024') {
            accountsFile = prezident24Accounts;
            googleFile = prezident24Google;
            metaFile = prezident24Meta;
        } else if (activeSubsite === 'parlament2023') {
            accountsFile = parlament23Accounts;
            googleFile = parlament23Google;
            metaFile = parlament23Meta;
        }

        if (accountsFile && googleFile && metaFile) {
            const filesData = {};
            const files = [
                { key: 'ACCOUNTS', file: accountsFile },
                { key: 'GOOGLE', file: googleFile },
                { key: 'META', file: metaFile },
            ];

            Promise.all(
                files.map(
                    ({ key, file }) =>
                        new Promise((resolve, reject) => {
                            readRemoteFile(file, {
                                worker: false,
                                header: true,
                                dynamicTyping: false,
                                skipEmptyLines: true,
                                complete: (csv) => {
                                    filesData[key] = csv;
                                    return resolve(key);
                                },
                                error: reject,
                            });
                        })
                )
            )
                .then(() => {
                    const pd = processDataCsv(filesData, activeSubsite);
                    setSheetsData(pd);
                })
                .catch((error) => {
                    setSheetsData({ ...initialSheetsData, error, loaded: true });
                });
        } else {
            setSheetsData(initialSheetsData);
        }
    }, [activeSubsite]);

    // Load Meta API data
    const d = new Date();
    const reloadKey = `${d.getMonth() + 1}${d.getDate()}${Math.floor(d.getHours() / 12)}`;
    const apiUrl = getMetaApiUrl(activeSubsite);

    const {
        isLoading: maLoading,
        error: maError,
        data: maData,
    } = useQuery({
        queryKey: [`meta_api_all_${activeSubsite}_${reloadKey}`],
        queryFn: () => {
            if (!apiUrl) return Promise.resolve(null);
            return fetch(`${apiUrl}?${reloadKey}`).then((response) => response.json());
        },
        enabled: !!apiUrl,
    });

    useEffect(() => {
        if (maError) {
            setMetaApiData((prev) => ({ ...prev, error: maError, loaded: true }));
        } else if (!maLoading && maData) {
            const parsed = processDataMetaApi(maData, activeSubsite);
            setMetaApiData(parsed);
        }
    }, [maData, maLoading, maError, activeSubsite]);

    // Selectors
    const getAllFbAccounts = () => {
        const all = [];
        if (activeSubsite === 'euro2024' && sheetsData.parties) {
            Object.values(sheetsData.parties).forEach((party) => {
                all.push(...(party['FB Účty'] ?? []));
            });
        } else if (activeSubsite === 'prezident2024' && sheetsData.candidates) {
            Object.values(sheetsData.candidates).forEach((candidate) => {
                all.push(...(candidate['FB Účty'] ?? []));
            });
        } else if (activeSubsite === 'parlament2023' && sheetsData.partiesFb) {
            Object.values(sheetsData.partiesFb).forEach((partyAccounts) => {
                all.push(...partyAccounts);
            });
        }
        return all;
    };

    const getPartyFbAccounts = (fbName) => sheetsData.partiesFb?.[fbName] ?? [];

    const mergedWeeksData = () => {
        const profiles = {};
        const vatFactor = activeSubsite === 'parlament2023' ? 1.0 : 1.2;

        if (Array.isArray(sheetsData.metaAds)) {
            // parlament2023
            sheetsData.metaAds.forEach((profile) => {
                if (isNumeric(profile['Amount spent (EUR)'])) {
                    const pageId = profile['Page ID'];
                    if (!(profiles[pageId] ?? false)) {
                        profiles[pageId] = {
                            name: profile['Page name'],
                            outgoing: 0,
                            amount: 0,
                        };
                    }
                    profiles[pageId].outgoing += Number(profile['Amount spent (EUR)']) * vatFactor;
                    if (isNumeric(profile['Number of ads in Library'])) {
                        profiles[pageId].amount += Number(profile['Number of ads in Library']);
                    }
                }
            });
        } else if (sheetsData.metaAds) {
            // euro2024 & prezident2024
            Object.values(sheetsData.metaAds).forEach((week) => {
                if (Array.isArray(week)) {
                    week.forEach((profile) => {
                        if (isNumeric(profile['Amount spent (EUR)'])) {
                            const pageId = profile['Page ID'];
                            if (!(profiles[pageId] ?? false)) {
                                profiles[pageId] = {
                                    name: profile['Page name'],
                                    outgoing: 0,
                                    amount: 0,
                                };
                            }
                            profiles[pageId].outgoing += Number(profile['Amount spent (EUR)']) * vatFactor;
                            if (isNumeric(profile['Number of ads in Library'])) {
                                profiles[pageId].amount += Number(profile['Number of ads in Library']);
                            }
                        }
                    });
                }
            });
        }
        return profiles;
    };

    const getPartyAdsData = (name) => {
        if (activeSubsite === 'parlament2023') {
            // Reconstruct party config structure for 2023 subsite
            if (
                sheetsData.partiesFb?.[name] ||
                sheetsData.partiesGgl?.[name] ||
                sheetsData.campaign?.[name] !== undefined ||
                sheetsData.precampaign?.[name] !== undefined ||
                sheetsData.reports?.[name] !== undefined ||
                sheetsData.candidatesLists?.[name] !== undefined
            ) {
                return {
                    'FB Účty': sheetsData.partiesFb?.[name] ?? [],
                    'Google účty': sheetsData.partiesGgl?.[name] ?? [],
                    'Kandidátne listiny': sheetsData.candidatesLists?.[name] ?? null,
                    'Majetkové priznania': sheetsData.assets?.[name] ?? null,
                    'Záverečné správy': sheetsData.reports?.[name] ? sheetsData.reports[name].split(';') : [],
                    'Kampaň': sheetsData.campaign?.[name] ?? 0,
                    'Predkampaň': sheetsData.precampaign?.[name] ?? 0,
                };
            }
            return false;
        }
        return sheetsData.loaded ? sheetsData.parties?.[name] ?? false : null;
    };

    const candidateAdsData = (name) =>
        sheetsData.loaded ? sheetsData.candidates?.[name] ?? false : null;

    const allCandidatesNames = () =>
        sheetsData.loaded ? Object.keys(sheetsData.candidates) : null;

    const findPartyForMetaAccount = (accountId) => {
        if (!sheetsData.parties) return null;
        const found = Object.entries(sheetsData.parties).find(([, party]) =>
            party['FB Účty']?.includes(accountId)
        );
        return found ? found[0] : null;
    };

    const findPartyForFbAccount = (accountId) => {
        if (sheetsData.partiesFb) {
            const found = Object.entries(sheetsData.partiesFb).find(([, partyAccounts]) =>
                partyAccounts.includes(accountId)
            );
            if (found) return found[0];
        }
        if (sheetsData.parties) {
            const found = Object.entries(sheetsData.parties).find(([, party]) =>
                party['FB Účty']?.includes(accountId)
            );
            if (found) return found[0];
        }
        return null;
    };

    const findPartyForGoogleAccount = (accountId) => {
        if (sheetsData.partiesGgl) {
            const found = Object.entries(sheetsData.partiesGgl).find(([, partyAccounts]) =>
                partyAccounts.includes(accountId)
            );
            if (found) return found[0];
        }
        if (sheetsData.parties) {
            const found = Object.entries(sheetsData.parties).find(([, party]) =>
                party['Google účty']?.includes(accountId)
            );
            if (found) return found[0];
        }
        return null;
    };

    const findCandidateForGoogleAccount = (accountId) => {
        if (!sheetsData.candidates) return null;
        const found = Object.entries(sheetsData.candidates).find(([, candidate]) =>
            candidate['Google účty']?.includes(accountId)
        );
        return found ? found[0] : null;
    };

    const findCandidateForMetaAccount = (accountId) => {
        if (!sheetsData.candidates) return null;
        const found = Object.entries(sheetsData.candidates).find(([, candidate]) =>
            candidate['FB Účty']?.includes(accountId)
        );
        return found ? found[0] : null;
    };

    const findCandidateByWpTags = (tags) => {
        if (!sheetsData.candidates) return null;
        const found = Object.entries(sheetsData.candidates).find(([, candidate]) =>
            tags.includes(candidate['WP tag'])
        );
        return found ? found[0] : null;
    };

    const findPartyByName = (name) => {
        if (activeSubsite === 'parlament2023') {
            return name ? [name, {}] : null;
        }

        if (!sheetsData.parties) return null;
        return Object.entries(sheetsData.parties).find(([shortName, party]) =>
            [
                shortName,
                party['Plný názov strany'],
                party['Transparentný účet'],
            ].includes(name)
        );
    };

    const findPartyByWpTags = (tags) => {
        if (activeSubsite === 'parlament2023') {
            const found = Object.entries(partyConfig).find(([, party]) =>
                tags.includes(party.wp)
            );
            return found ? found[0] : null;
        }

        if (!sheetsData.parties) return null;
        const found = Object.entries(sheetsData.parties).find(([, party]) =>
            tags.includes(party['WP tag'])
        );
        return found ? found[0] : null;
    };

    const getPartyShortName = (name) => {
        const found = findPartyByName(name);
        return found ? found[0] : name;
    };

    const getPartyFullName = (name) => {
        const found = findPartyByName(name);
        if (found) {
            return found[1]['Plný názov strany'] || found[0];
        }
        return '';
    };

    const getPartyAccountName = (name) => {
        const found = findPartyByName(name);
        if (found) {
            return found[1]['Transparentný účet'] || found[0];
        }
        return name;
    };

    const getAllPartiesNames = () => {
        if (!sheetsData.loaded) return null;
        if (activeSubsite === 'parlament2023') {
            const allKeys = new Set([
                ...Object.keys(sheetsData.partiesFb || {}),
                ...Object.keys(sheetsData.partiesGgl || {}),
                ...Object.keys(sheetsData.campaign || {}),
                ...Object.keys(sheetsData.precampaign || {}),
                ...Object.keys(sheetsData.reports || {}),
                ...Object.keys(sheetsData.candidatesLists || {})
            ]);
            return Array.from(allKeys).sort(sortAlphabetically(true));
        }
        return Object.keys(sheetsData.parties).sort(sortAlphabetically(true));
    };

    const value = useMemo(
        () => ({
            sheetsData,
            setSheetsData,
            metaApiData,
            setMetaApiData,
            allFbAccounts: getAllFbAccounts(),
            getPartyFbAccounts,
            mergedWeeksData: mergedWeeksData(),
            getPartyAdsData,
            candidateAdsData,
            allCandidatesNames,
            findPartyForMetaAccount,
            findPartyForFbAccount,
            findPartyForGoogleAccount,
            findCandidateForGoogleAccount,
            findCandidateForMetaAccount,
            findCandidateByWpTags,
            findPartyByName,
            findPartyByWpTags,
            getPartyShortName,
            getPartyFullName,
            getPartyAccountName,
            getAllPartiesNames,
        }),
        [sheetsData, metaApiData, activeSubsite]
    );

    return (
        <AdsDataContext.Provider value={value}>
            {children}
        </AdsDataContext.Provider>
    );
};

export const useAdsData = () => {
    const context = useContext(AdsDataContext);
    if (context === undefined) {
        throw new Error('useAdsData must be used within an AdsDataProvider');
    }
    return context;
};

export default useAdsData;
