import parse, { attributesToProps, domToReact } from 'html-react-parser';

import { decodeHTMLEntities, isNumeric } from './helpers';
import { routes } from './routes';
import { getActiveSubsite } from './languages';

export const categories = {
    news22: 858,
    news23: 877,
    news24e: 947,
    news24p: 933,
    news26: 968,
    funding: 963,
    bannerNews: 960,
    bannerNewsEn: 961,
    newsGlobal: 875,
};

export const newsCategories = [
    categories.news22,
    categories.news23,
    categories.news24e,
    categories.news24p,
    categories.news26,
    categories.funding,
    categories.newsGlobal,
];

const proxyHttpImages = (html) => {
    const regex = /(http:\/\/cms.transparency.sk\/[^",]+.(png|jpe?g|gif|svg))/i;
    return html.replace(regex, 'https://images.weserv.nl/?url=$1');
};

const parserOptions = {
    replace: ({ name, attribs, children }) => {
        if (
            name === 'div' &&
            attribs &&
            (attribs.class || '').includes('wp-block-image')
        ) {
            // remove "wp-block-image" wrappers, keep just children
            return domToReact(children, parserOptions);
        }
        if (
            name === 'p' &&
            attribs &&
            (attribs.class || '').includes('has-text-align-')
        ) {
            // replace paragraph alignment classes from WP with BS5 classes
            return (
                <p
                    className={attribs.class.replace(
                        /\bhas-text-align-(\w+)\b/g,
                        'text-$1'
                    )}
                >
                    {domToReact(children, parserOptions)}
                </p>
            );
        }
        if (name === 'img' && attribs && attribs.src) {
            const props = {
                ...attributesToProps(attribs),
                // proxy image to force https
                src: proxyHttpImages(attribs.src),
                // add bootstrap 5 classes to images
                className: 'figure-img img-fluid',
            };
            return <img {...props} />;
        }
        if (name === 'a') {
            if (
                children.length &&
                children[0].type === 'text' &&
                children[0].data.startsWith('Continue reading')
            ) {
                // remove "continue reading" links to WP domain
                return <></>;
            }
            if (attribs) {
                if (attribs.rel?.startsWith('lightbox')) {
                    // remove lightbox links
                    // will recursively run parser on children
                    return domToReact(children, parserOptions);
                }
                if (attribs.href?.startsWith('http://')) {
                    const props = {
                        ...attributesToProps(attribs),
                        // force http links to https
                        href: attribs.href.replace('http://', 'https://'),
                    };
                    return (
                        <a {...props}>{domToReact(children, parserOptions)}</a>
                    );
                }
            }
        }
        if (name === 'figure') {
            // add bootstrap 5 classes to figures, remove "wp-block-image" class
            return (
                <figure
                    className={`figure text-center w-100 ${(attribs.class || '')
                        .replace('wp-block-image', '')
                        .trim()}`}
                >
                    {domToReact(children, parserOptions)}
                </figure>
            );
        }
        if (name === 'figcaption') {
            // add bootstrap 5 classes to figcaptions
            return (
                <figcaption className="figure-caption col-11 col-md-10 col-lg-8 col-xl-6 mx-auto">
                    {domToReact(children, parserOptions)}
                </figcaption>
            );
        }
        // otherwise no replacement
        return null;
    },
};

export const parseWpHtml = (html) => parse(html, parserOptions);

export const processArticles = (data) =>
    Array.isArray(data)
        ? data.map((article) => ({
              ...article,
              title: {
                  ...article.title,
                  // fix titles
                  rendered: decodeHTMLEntities(article.title.rendered),
              },
          }))
        : [];

export const wpCat = {
    get analyses() {
        const subsite = getActiveSubsite();
        if (subsite === 'prezident2024') return 934;
        if (subsite === 'euro2024') return 948;
        if (subsite === 'parlament2023') return 925;
        return 0;
    },
    get assets() {
        const subsite = getActiveSubsite();
        if (subsite === 'prezident2024') return 935;
        if (subsite === 'euro2024') return 949;
        if (subsite === 'parlament2023') return 926;
        return 0;
    },
    get featured() {
        const subsite = getActiveSubsite();
        if (subsite === 'prezident2024') return 951;
        if (subsite === 'euro2024') return 957;
        if (subsite === 'parlament2023') return 928;
        return 0;
    },
    get news() {
        const subsite = getActiveSubsite();
        if (subsite === 'samosprava2026') return categories.news26;
        if (subsite === 'prezident2024') return categories.news24p;
        if (subsite === 'euro2024') return categories.news24e;
        if (subsite === 'parlament2023') return categories.news23;
        return 0;
    },
};

export const resources = {
    get methodology() {
        const subsite = getActiveSubsite();
        if (subsite === 'prezident2024') {
            return routes.article('metodika-hodnotenia-kampani');
        }
        if (subsite === 'euro2024') {
            return routes.article(
                'hodnotenie-transparentnosti-kampani-pre-eurovolby-metodika'
            );
        }
        return routes.article('metodika-hodnotenia-kampani');
    },
    get pressRelease() {
        const subsite = getActiveSubsite();
        if (subsite === 'prezident2024') {
            return routes.article(
                'najmenej-transparentnu-kampan-vedie-peter-pellegrini'
            );
        }
        if (subsite === 'euro2024') {
            return routes.article(
                'transparentnu-eurokampan-vedu-len-tri-strany'
            );
        }
        return routes.article(
            'najmenej-transparentnu-kampan-vedie-peter-pellegrini'
        );
    },
};

export const metaData = new Proxy(
    {},
    {
        ownKeys(target) {
            const subsite = getActiveSubsite();
            if (subsite === 'euro2024' || subsite === 'parlament2023') {
                return ['coalition', 'leader', 'fb', 'web'];
            }
            return ['fb', 'web'];
        },
        getOwnPropertyDescriptor(target, prop) {
            return {
                enumerable: true,
                configurable: true,
            };
        },
        get(target, prop) {
            return prop;
        },
    }
);

export const baseData = {
    date: 'date',
    score: 'score',
};

export const transparencyClasses = {
    good: 'good',
    average: 'average',
    bad: 'bad',
    unknown: 'unknown',
};

export const transparencyIndicators = {
    account: 'account',
    financing: 'financing',
    information: 'information',
};

export const indicatorsCriteria = {
    get [transparencyIndicators.account]() {
        return 5;
    },
    get [transparencyIndicators.financing]() {
        return 5;
    },
    get [transparencyIndicators.information]() {
        const subsite = getActiveSubsite();
        if (subsite === 'parlament2023') {
            return 7;
        }
        return subsite === 'euro2024' ? 6 : 5;
    },
};

export const transparencyClass = (score) => {
    let cls = transparencyClasses.unknown;
    const num = Number(score);
    if (isNumeric(num) && num > -1) {
        cls = transparencyClasses.bad;
        if (score >= 40) {
            cls =
                score >= 70
                    ? transparencyClasses.good
                    : transparencyClasses.average;
        }
    }
    return cls;
};

export const parseAnalysisData = (html) => {
    if (html) {
        const start = '<tbody><tr>';
        const end = '</tr></tbody>';
        const startPos = html.indexOf(start);
        const endPos = html.indexOf(end);

        if (startPos > -1 && endPos > -1) {
            // parse table
            const tableData = [];
            html.substring(startPos + start.length, endPos)
                .replaceAll('<tr>', '')
                .split('</tr>')
                .forEach((row) => {
                    const cols = [];
                    row.split('</td>').forEach((col, index) => {
                        // ignore first row (names), save the rest into tableData
                        if (index > 0 && col.trim()) {
                            const val = col
                                .replaceAll('<td>', '')
                                .replaceAll(/<a[^>]*>/g, '')
                                .replaceAll(/<\/a>/g, '');
                            const num = Number(val.replaceAll(',', '.'));
                            cols.push(
                                val && isNumeric(num)
                                    ? // not empty & numeric
                                      num
                                    : // string
                                      decodeHTMLEntities(val)
                            );
                        }
                    });
                    tableData.push(cols);
                });

            const subsite = getActiveSubsite();
            if (subsite === 'samosprava2022') {
                const required = 23;
                if (tableData.length >= required) {
                    // Samosprava 2022 format
                    const analysis = {
                        isSamosprava: true,
                        base: {
                            score: tableData[6],
                            date: tableData[5],
                        },
                        meta: {
                            fb: tableData[3]?.[0],
                            web: tableData[4]?.[0],
                        },
                        score: tableData[6],
                        date: tableData[5],
                        municipality: tableData[1],
                        fb: tableData[3],
                        web: tableData[4],
                        type: tableData[0],
                        support: tableData[2],
                        lastColumn: tableData[6].length - 1,
                        lastScore: tableData[6][tableData[6].length - 1],
                    };

                    const validColumns = [];
                    tableData[6].forEach((column, columnKey) => {
                        if (column !== '') {
                            validColumns.push(columnKey);
                        }
                    });

                    let rowKey = 7;
                    Object.keys(transparencyIndicators).forEach((group) => {
                        analysis[group] = [];
                        let len = 0;
                        if (group === transparencyIndicators.account) len = 6;
                        else if (group === transparencyIndicators.financing)
                            len = 4;
                        else if (group === transparencyIndicators.information)
                            len = 6;

                        Array.from({ length: len }).forEach(() => {
                            analysis[group].push(
                                tableData[rowKey].filter((column, columnKey) =>
                                    validColumns.includes(columnKey)
                                )
                            );
                            rowKey += 1;
                        });
                    });

                    return analysis;
                }
            } else {
                // extract data from parsed table
                const metaProps = Object.keys(metaData);
                const baseProps = Object.keys(baseData);
                let required = metaProps.length + baseProps.length;
                Object.keys(transparencyIndicators).forEach((group) => {
                    required += indicatorsCriteria[group];
                });

                if (tableData.length >= required) {
                    const analysis = {
                        base: {},
                        lastColumn: -1,
                        lastScore: -1,
                        meta: {},
                    };
                    let rowKey = 0;

                    // campaign metaData
                    metaProps.forEach((prop) => {
                        // only first column is used
                        [analysis.meta[prop]] = tableData[rowKey];
                        rowKey += 1;
                    });

                    const validColumns = [];
                    // get valid columns by checking the score row - it is the last one from the baseProps
                    // if empty or not numeric, ignore the column
                    tableData[rowKey + baseProps.length - 1].forEach(
                        (column, columnKey) => {
                            if (column !== '') {
                                validColumns.push(columnKey);
                                analysis.lastColumn += 1;
                                analysis.lastScore = isNumeric(column)
                                    ? column
                                    : -1;
                            }
                        }
                    );
                    // base campaign data
                    baseProps.forEach((prop) => {
                        // remove invalid columns
                        tableData[rowKey].forEach((column, columnKey) => {
                            if (!validColumns.includes(columnKey)) {
                                tableData[rowKey].splice(columnKey, 1);
                            }
                        });
                        // save valid columns as property value
                        analysis.base[prop] = tableData[rowKey];
                        rowKey += 1;
                    });

                    // transparency analysis indicators
                    Object.keys(transparencyIndicators).forEach((group) => {
                        analysis[group] = [];
                        Array.from({
                            length: indicatorsCriteria[group],
                        }).forEach(() => {
                            // remove invalid columns
                            tableData[rowKey].forEach((column, columnKey) => {
                                if (!validColumns.includes(columnKey)) {
                                    tableData[rowKey].splice(columnKey, 1);
                                }
                            });
                            // save valid columns as property value
                            analysis[group].push(tableData[rowKey]);
                            rowKey += 1;
                        });
                    });

                    return analysis;
                }
            }
        }
    }
    return {
        error: 'Corrupted table format',
    };
};

export const sortByScore = (a, b) => {
    const scoreA = parseFloat(a.analysis.lastScore);
    const scoreB = parseFloat(b.analysis.lastScore);

    const validA = !isNaN(scoreA);
    const validB = !isNaN(scoreB);

    if (validA && validB) {
        return scoreB - scoreA;
    }
    if (validA) return -1;
    if (validB) return 1;
    return 0;
};

export const getAnalysedData = (data) => {
    const subsite = getActiveSubsite();
    const processed = processArticles(data);
    const filtered =
        subsite === 'euro2024'
            ? processed.filter((article) => article.tags && article.tags.length)
            : processed;
    const analysed = filtered.map((article) => ({
        ...article,
        analysis: parseAnalysisData(article.content.rendered),
    }));
    return analysed.sort(sortByScore);
};
