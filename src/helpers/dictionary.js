import { labels as landingLabels } from './dictionary-landing';
import { labels as euroLabels } from './dictionary-euro-24';
import { labels as presidentLabels } from './dictionary-prezident-24';
import { labels as parlamentLabels } from './dictionary-23';
import { labels as samospravaLabels } from './dictionary-municipal';
import { getActiveSubsite, getCurrentLanguage, languages } from './languages';

const deepMerge = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (
        source &&
        typeof target === 'object' &&
        typeof source === 'object' &&
        !Array.isArray(target) &&
        !Array.isArray(source)
    ) {
        Object.keys(source).forEach((key) => {
            if (
                typeof source[key] === 'object' &&
                !Array.isArray(source[key])
            ) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        });
    }

    return deepMerge(target, ...sources);
};

// Deep merge all dictionaries
export const labels = {};
deepMerge(
    labels,
    euroLabels,
    presidentLabels,
    parlamentLabels,
    samospravaLabels,
    landingLabels
);

const labelPaths = new Map();
const buildLabelPaths = (obj, currentPath = '') => {
    if (typeof obj === 'object' && obj !== null) {
        if (currentPath) {
            labelPaths.set(obj, currentPath);
        }
        Object.entries(obj).forEach(([key, value]) => {
            const path = currentPath ? `${currentPath}.${key}` : key;
            buildLabelPaths(value, path);
        });
    }
};
buildLabelPaths(labels);

// Custom helper: Some subsites have slightly different translations for the same key.
// We override keys dynamically based on active subsite.
const subsiteOverrides = {
    euro2024: {
        home: {
            navTitle: ['Eurovoľby 2024', 'Euro elections 2024'],
            pageTitle: ['Európske\nvoľby 2024', 'European\nelections 2024'],
        },
        parties: {
            navTitle: ['Strany', 'Parties'],
            pageTitle: ['Strany a koalície', 'Parties & coalitions'],
        },
    },
    prezident2024: {
        home: {
            navTitle: ['Prezident 2024', 'President 2024'],
            pageTitle: [
                'Prezidentské\nvoľby 2024',
                'President\nelections 2024',
            ],
        },
        candidates: {
            navTitle: ['Kandidáti', 'Candidates'],
        },
        account: {
            totalSpending: [
                'Celkové výdavky kandidátov',
                'Total candidates spending',
            ],
            finalReportDisclaimer: [
                'Súčet výdavkov všetkých kandidátov podľa záverečných správ.',
                'Sum of spendings of all candidates.',
            ],
        },
        ads: {
            amount: {
                disclaimer: [
                    'Počet reklám všetkých kandidátov od 1. novembra 2023.',
                    'Amount of ads of all candidates since November 1, 2023.',
                ],
            },
            google: {
                totalDisclaimer: [
                    'Súčet výdavkov politických účtov, ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 € od 1. novembra 2023.',
                    'Sum of expenses of profiles whose spending on Google Ads and Google Display & Video 360 platforms exceeded 100 € since November 1, 2023.',
                ],
            },
            meta: {
                totalDisclaimer: [
                    'Súčet výdavkov na politickú reklamu na sociálnych sieťach platformy Meta. Započítane sú všetky profily, ktorých výdavky od 1. novembra 2023 alebo týždňové výdavky od začiatku kampane 9. januára 2024 presiahli 100 €.',
                    'Sum of advertising expenses on social networks of Meta. Includes Meta profiles whose advertising expenses from November 1, 2023 or weekly expenses from the beginning of campaign on January 9, 2024 exceeded 100 €',
                ],
            },
        },
    },
    parlament2023: {
        home: {
            navTitle: ['Voľby 2023', 'Elections 2023'],
            pageTitle: [
                'Parlamentné\nvoľby 2023',
                'Parliamentary\nelections 2023',
            ],
        },
        parties: {
            navTitle: ['Strany', 'Parties'],
            pageTitle: ['Strany a hnutia', 'Political Parties'],
        },
    },
    samosprava2022: {
        home: {
            navTitle: ['Samosprávne voľby 2022', 'Municipal elections 2022'],
            pageTitle: ['Samosprávne\nvoľby 2022', 'Municipal\nelections 2022'],
        },
        account: {
            totalSpending: [
                'Celkové výdavky kandidátov',
                'Total candidates spending',
            ],
            totalDisclaimer: ['', ''],
        },
    },
    samosprava2026: {
        home: {
            navTitle: ['Samosprávne voľby 2026', 'Municipal elections 2026'],
            pageTitle: ['Samosprávne\nvoľby 2026', 'Municipal\nelections 2026'],
        },
        account: {
            totalSpending: [
                'Celkové výdavky kandidátov',
                'Total candidates spending',
            ],
            totalIncomes: [
                'Celkové príjmy kandidátov',
                'Total candidate incomes',
            ],
            totalDisclaimer: ['', ''],
        },
        charts: {
            regionsTitle: [
                'Výdavky a príjmy podľa krajov',
                'Income and spending by region',
            ],
            allCampaignsTitle: [
                'Výdavky a príjmy všetkých kandidátov',
                'Income and spending of all candidates',
            ],
            allDonorsTitle: [
                'Počet unikátnych darcov na kandidáta',
                'Number of unique donors per candidate',
            ],
        },
        news: {
            latest: ['Najnovšie aktuality', 'Latest News (Slovak only)'],
            title: ['Aktuality', 'News\n(Slovak only)'],
        },
    },
};

export const t = (label, replacements) => {
    const subsite = getActiveSubsite();
    const lang = getCurrentLanguage();

    // Check if there is a subsite override for the label first
    const labelPath = typeof label === 'string' ? label : labelPaths.get(label);
    if (labelPath && subsite && subsiteOverrides[subsite]) {
        const parts = labelPath.split('.');
        let override = subsiteOverrides[subsite];
        for (const part of parts) {
            override = override?.[part];
        }
        if (override) {
            let tl = override;
            if (Array.isArray(override)) {
                tl = override[0] ?? '';
                if (lang === languages.en) {
                    tl = override[1] ?? tl;
                }
            }
            if (Array.isArray(replacements)) {
                tl = tl.replace(/%[dfis]/g, (match) => {
                    return replacements.length > 0
                        ? replacements.shift()
                        : match;
                });
            }
            return tl;
        }
    }

    let tl = label;
    if (Array.isArray(label)) {
        tl = label[0] ?? '';
        if (lang === languages.en) {
            tl = label[1] ?? tl;
        }
    } else if (labels[label] ?? false) {
        return t(labels[label], replacements);
    }
    if (Array.isArray(replacements)) {
        tl = tl.replace(/%[dfis]/g, (match) => {
            return replacements.length > 0 ? replacements.shift() : match;
        });
    }
    return tl;
};
