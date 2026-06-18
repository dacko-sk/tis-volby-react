import { useParams } from 'react-router-dom';

import { sortAlphabetically } from './helpers';
import {
    getActiveSubsite,
    getSubsitePrefix,
    getCurrentLanguage,
    languages,
} from './languages';

export { getCurrentLanguage, languages };

import siteConfig from '../../package.json';

export const homepage = siteConfig.homepage ?? '/';

export const separators = {
    array: ';',
    parts: '_',
    newline: '\n',
    numbers: '-',
    space: '.',
    url: '/',
    value: '~',
};

export const segments = {
    // Landing
    ACCOUNT: 'ACCOUNT',
    ACCOUNTS: 'ACCOUNTS',
    ASSET_DECLARATIONS: 'ASSET_DECLARATIONS',
    DATA_DICTIONARY: 'DATA_DICTIONARY',
    CHARTS: 'CHARTS',
    DONOR: 'DONOR',
    DONATIONS: 'DONATIONS',
    FUNDING: 'FUNDING',
    GOVERNMENT: 'GOVERNMENT',
    NEWS: 'NEWS',
    OFFICIAL: 'OFFICIAL',
    PARTIES: 'PARTIES',
    SEARCH: 'SEARCH',

    // Subsites
    ANALYSES: 'ANALYSES',
    ANALYSIS: 'ANALYSIS',
    ASSETS: 'ASSETS',
    CAMPAIGNS: 'CAMPAIGNS',
    CANDIDATES: 'CANDIDATES',
    CANDIDATES_LISTS: 'CANDIDATES_LISTS',
    MUNICIPALITIES: 'MUNICIPALITIES',
    ONLINE: 'ONLINE',
    REGIONS: 'REGIONS',
    REPORTS: 'REPORTS',
    TRANSACTIONS: 'TRANSACTIONS',
};

export const localSegments = {
    [languages.sk]: {
        // Landing
        [segments.ACCOUNT]: 'ucet',
        [segments.ACCOUNTS]: 'ucty',
        [segments.ASSET_DECLARATIONS]: 'majetkove-priznania',
        [segments.DATA_DICTIONARY]: 'datovy-slovnik',
        [segments.CHARTS]: 'grafy',
        [segments.DONOR]: 'darca',
        [segments.DONATIONS]: 'darcovia',
        [segments.FUNDING]: 'financovanie',
        [segments.GOVERNMENT]: 'statne-prispevky',
        [segments.NEWS]: 'aktuality',
        [segments.OFFICIAL]: 'funkcionar',
        [segments.PARTIES]: 'strany',
        [segments.SEARCH]: 'vyhladavanie',

        // Subsites
        [segments.ANALYSES]: 'hodnotenia',
        [segments.ANALYSIS]: 'hodnotenie',
        [segments.ASSETS]: 'majetkove-priznania',
        [segments.CANDIDATES]: 'kandidati',
        [segments.CANDIDATES_LISTS]: 'kandidatne-listiny',
        [segments.CAMPAIGNS]: 'kampane',
        [segments.MUNICIPALITIES]: 'samospravy',
        [segments.ONLINE]: 'online',
        [segments.REGIONS]: 'kraje',
        [segments.REPORTS]: 'zaverecne-spravy',
        [segments.TRANSACTIONS]: 'ucet',
    },
    [languages.en]: {
        // Landing
        [segments.ACCOUNT]: 'account',
        [segments.ACCOUNTS]: 'accounts',
        [segments.ASSET_DECLARATIONS]: 'asset-declarations',
        [segments.DATA_DICTIONARY]: 'data-dictionary',
        [segments.CHARTS]: 'charts',
        [segments.DONOR]: 'donor',
        [segments.DONATIONS]: 'donations',
        [segments.FUNDING]: 'funding',
        [segments.GOVERNMENT]: 'government',
        [segments.NEWS]: 'news',
        [segments.OFFICIAL]: 'official',
        [segments.PARTIES]: 'parties',
        [segments.SEARCH]: 'search',

        // Subsites
        [segments.ANALYSES]: 'assesments', // Keeps original spelling from subsite builds
        [segments.ANALYSIS]: 'assesment',
        [segments.ASSETS]: 'assets',
        [segments.CANDIDATES]: 'candidates',
        [segments.CANDIDATES_LISTS]: 'candidates-lists',
        [segments.CAMPAIGNS]: 'campaigns',
        [segments.MUNICIPALITIES]: 'municipalities',
        [segments.ONLINE]: 'online',
        [segments.REGIONS]: 'regions',
        [segments.REPORTS]: 'reports',
        [segments.TRANSACTIONS]: 'account',
    },
};

export const languageRoot = (language) => {
    const subsite = getActiveSubsite();
    const prefix = getSubsitePrefix(subsite);
    if (subsite === 'samosprava2022') {
        return prefix;
    }
    return (
        prefix +
        ((language || getCurrentLanguage()) === languages.en
            ? languages.en + separators.url
            : '')
    );
};

export const localizePath = (lang, path) => {
    const cp = path ?? document.location.pathname;
    const cl = getCurrentLanguage();
    if (cl === lang) {
        return cp;
    }
    const subsite = getActiveSubsite(cp);
    if (subsite === 'samosprava2022') {
        return cp; // Samosprava 2022 is SK-only, no localized path changes
    }
    const cr = languageRoot();
    const cs = cp.substring(cr.length).split(separators.url);
    const as = Object.entries(localSegments[cl]);
    const ts = cs.map((segment) => {
        let tk = null;
        as.some(([key, translation]) => {
            if (segment === translation) {
                tk = key;
                return true;
            }
            return false;
        });
        return tk ? localSegments[lang][tk] : segment;
    });
    return languageRoot(lang) + ts.join(separators.url);
};

export const urlSegment = (segment, lang) => {
    return localSegments[lang || getCurrentLanguage()][segment] ?? segment;
};

export const buildUrlQuery = (options) => {
    const filters = [];
    Object.entries(options).forEach(([param, value]) => {
        filters.push(param + separators.value + value);
    });
    return filters.join(separators.parts);
};

export const queries = {
    searchAndFilter: (query) =>
        query ? separators.url + (query === true ? ':query' : query) : '',
};

// Helper to construct functions that behave as strings when coerced
const makeRoute = (fn) => {
    const routeFn = (...args) => fn(...args);
    Object.defineProperty(routeFn, 'toString', {
        value: () => fn(),
        writable: false,
    });
    Object.defineProperty(routeFn, 'valueOf', {
        value: () => fn(),
        writable: false,
    });
    return routeFn;
};

export const routes = {
    home: makeRoute((lang) => {
        return languageRoot(lang);
    }),
    news: makeRoute((lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2022') {
            return languageRoot(lang) + 'aktuality';
        }
        return languageRoot(lang) + urlSegment(segments.NEWS, lang);
    }),
    analyses: makeRoute((lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2022') {
            return languageRoot(lang) + 'hodnotenia';
        }
        return languageRoot(lang) + urlSegment(segments.ANALYSES, lang);
    }),
    article: makeRoute((slug, lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2022') {
            return (
                languageRoot(lang) + (slug ? 'aktuality/' + slug : 'aktuality')
            );
        }
        const newsSegment = urlSegment(segments.NEWS, lang);
        return (
            languageRoot(lang) +
            (slug
                ? newsSegment +
                  separators.url +
                  (slug === true ? ':slug' : slug)
                : '')
        );
    }),
    search: makeRoute((query, lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2022') {
            return (
                languageRoot(lang) +
                (query ? 'vyhladavanie/' + query : 'vyhladavanie')
            );
        }
        const searchSegment = urlSegment(segments.SEARCH, lang);
        return (
            languageRoot(lang) +
            (query
                ? searchSegment +
                  separators.url +
                  (query === true ? ':query' : encodeURIComponent(query))
                : '')
        );
    }),

    // Subsite-specific routes
    online: makeRoute((lang) => {
        return languageRoot(lang) + urlSegment(segments.ONLINE, lang);
    }),

    // Euro 24 / Parlament 23 / Landing Parties
    parties: makeRoute((subpage, lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'euro2024' || subsite === 'parlament2023') {
            return (
                languageRoot(lang) +
                urlSegment(segments.PARTIES, lang) +
                (subpage ? separators.url + urlSegment(subpage, lang) : '')
            );
        }
        return languageRoot(lang) + urlSegment(segments.PARTIES, lang);
    }),
    party: makeRoute((slug, subpage, lang) => {
        const subsite = getActiveSubsite();
        const spaceSep = subsite === 'parlament2023' ? '~' : '.';
        const niceSlug =
            slug === true
                ? ':slug'
                : encodeURIComponent(slug.replaceAll(' ', spaceSep));

        return (
            languageRoot(lang) +
            urlSegment(segments.PARTIES, lang) +
            separators.url +
            niceSlug +
            (subpage ? separators.url + urlSegment(subpage, lang) : '')
        );
    }),

    // Prezident 24 Candidates
    candidates: makeRoute((subpage, lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.CANDIDATES, lang) +
            (subpage ? separators.url + urlSegment(subpage, lang) : '')
        );
    }),
    candidate: makeRoute((slug, subpage, lang) => {
        const subsite = getActiveSubsite();
        const spaceSep = subsite === 'parlament2023' ? separators.value : '.';
        const niceSlug =
            slug === true
                ? ':slug'
                : encodeURIComponent(slug.replaceAll(' ', spaceSep));
        return (
            languageRoot(lang) +
            urlSegment(segments.CANDIDATES, lang) +
            separators.url +
            niceSlug +
            (subpage ? separators.url + urlSegment(subpage, lang) : '')
        );
    }),

    // Samosprava 2022/2026-specific routes
    charts: makeRoute((lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2022') {
            return languageRoot(lang) + 'grafy';
        }
        if (subsite === 'samosprava2026') {
            return languageRoot(lang) + urlSegment(segments.CHARTS, lang);
        }
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.CHARTS, lang)
        );
    }),
    campaigns: makeRoute((lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2026') {
            return (
                languageRoot(lang) +
                urlSegment(segments.CANDIDATES, lang) +
                separators.url +
                urlSegment(segments.CAMPAIGNS, lang)
            );
        }
        return languageRoot(lang) + 'grafy/kampane';
    }),
    donors: makeRoute((lang) => {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2026') {
            return (
                languageRoot(lang) +
                urlSegment(segments.CANDIDATES, lang) +
                separators.url +
                urlSegment(segments.DONATIONS, lang)
            );
        }
        return languageRoot(lang) + 'grafy/donori';
    }),
    candidateMunicipal: makeRoute((name, town, lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.CANDIDATES, lang) +
            separators.url +
            (name === true
                ? ':slug'
                : encodeURIComponent(
                      name.replaceAll(' ', '.') +
                          separators.value +
                          town.replaceAll(' ', '.')
                  ))
        );
    }),
    municipality: makeRoute((town, region, lang) => {
        const reg = region
            ? region.replaceAll(' ', '.') + separators.value
            : '';
        return (
            languageRoot(lang) +
            urlSegment(segments.MUNICIPALITIES, lang) +
            separators.url +
            (town === true
                ? ':municipality'
                : encodeURIComponent(reg + town.replaceAll(' ', '.')))
        );
    }),
    region: makeRoute((region, lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.REGIONS, lang) +
            separators.url +
            (region === true ? ':region' : encodeURIComponent(region))
        );
    }),

    // Landing page specific routes
    account: makeRoute((slug, lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.ACCOUNT, lang) +
            separators.url +
            (slug === true
                ? ':slug'
                : encodeURIComponent(slug.replaceAll(' ', separators.space)))
        );
    }),
    accounts: makeRoute((lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.ACCOUNTS, lang)
        );
    }),
    assetDeclarations: makeRoute((lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.ASSET_DECLARATIONS, lang)
        );
    }),
    assetDeclarationsDataDictionary: makeRoute((lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.ASSET_DECLARATIONS, lang) +
            separators.url +
            urlSegment(segments.DATA_DICTIONARY, lang)
        );
    }),
    assetDeclaration: makeRoute((slug, lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.ASSET_DECLARATIONS, lang) +
            separators.url +
            urlSegment(segments.OFFICIAL, lang) +
            separators.url +
            (slug === true
                ? ':slug'
                : encodeURIComponent(slug.replaceAll(' ', separators.space)))
        );
    }),
    donor: makeRoute((id, lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.DONATIONS, lang) +
            (id
                ? separators.url +
                  urlSegment(segments.DONOR, lang) +
                  separators.url +
                  (id === true ? ':id' : encodeURIComponent(id))
                : '')
        );
    }),
    donations: makeRoute((lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.DONATIONS, lang)
        );
    }),
    funding: makeRoute((lang) => {
        return languageRoot(lang) + urlSegment(segments.FUNDING, lang);
    }),
    fundingNews: makeRoute((lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.NEWS, lang)
        );
    }),
    government: makeRoute((lang) => {
        return (
            languageRoot(lang) +
            urlSegment(segments.FUNDING, lang) +
            separators.url +
            urlSegment(segments.GOVERNMENT, lang)
        );
    }),
};

export const rwq = {
    searchAndFilter: (route, queryOptions) =>
        route + queries.searchAndFilter(buildUrlQuery(queryOptions)),
};

export const parseQueryOptions = (allowedParams) => {
    const params = useParams();
    const options = {};
    if ((params.query ?? false) && params.query.length) {
        params.query.split(separators.parts).forEach((pair) => {
            const [filter, value] = pair.split(separators.value);
            if (allowedParams.includes(filter)) {
                options[filter] = value;
            }
        });
    }
    return options;
};

export const buildApiQuery = (apiParams, options) => {
    return Object.entries(options)
        .flatMap(([param, value]) =>
            apiParams.includes(param) ? [`${param}=${value}`] : []
        )
        .sort(sortAlphabetically())
        .join('&');
};

export const decodeSlug = (slug) => {
    const subsite = getActiveSubsite();
    const spaceSep = subsite === 'parlament2023' ? separators.value : '.';
    return slug.replaceAll(spaceSep, ' ');
};
