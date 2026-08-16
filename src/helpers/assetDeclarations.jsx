import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import FunctionBadge from '../components/assets/FunctionBadge';

import { assetDeclarationsColumns as ac } from './constants';
import { labels, t } from './dictionary';
import { routes } from './routes';
import { removeAccentsFromString } from './helpers';
import { settingsParams } from '../components/datatables/TableSettings';

export const apiParams = [
    'o', // offset (page number - 1)
    'b', // block size
    'q', // search query
    'y', // years
    'f', // function
    's', // sort
];
export const allowedParams = [...apiParams, ...settingsParams];

export const endpoints = {
    search: `${process.env.DHC_TYPO3_API_DOMAIN}/elections/asset-declarations/search`,
    official: (slug) =>
        `${process.env.DHC_TYPO3_API_DOMAIN}/elections/asset-declarations/official/${slug}`,
};

export const defaultSort = `name`;

export const columnAlign = (key) => {
    switch (key) {
        case ac.name:
            return 'col-name-nowrap';
        default:
            return '';
    }
};

export const columnLabel = (key) =>
    Object.keys(labels.assetDeclarations.columns).includes(key)
        ? t(labels.assetDeclarations.columns[key])
        : '';

export const columnContent = (official, targetColumn) => {
    switch (targetColumn) {
        case ac.name:
            return (
                <Link to={routes.assetDeclaration(official.official_id)}>
                    {official.nrsr_name || official.name}
                </Link>
            );
        case ac.function: {
            const sortedDeclarations = [...(official.declarations || [])].sort(
                (a, b) => b.year - a.year
            );

            const uniqueFunctionsMap = new Map();
            for (const decl of sortedDeclarations) {
                const fnString = decl.public_function;
                if (fnString) {
                    const fns = fnString.split('\n');
                    for (const rawFn of fns) {
                        const fn = rawFn.trim();
                        if (fn) {
                            const lowerFn = fn.toLowerCase();
                            const existing = uniqueFunctionsMap.get(lowerFn);
                            if (!existing) {
                                uniqueFunctionsMap.set(lowerFn, fn);
                            } else {
                                const countUpper = (str) =>
                                    str
                                        .split('')
                                        .filter((c) => c !== c.toLowerCase())
                                        .length;
                                if (countUpper(fn) > countUpper(existing)) {
                                    uniqueFunctionsMap.set(lowerFn, fn);
                                }
                            }
                        }
                    }
                }
            }
            const uniqueFunctions = Array.from(uniqueFunctionsMap.values());

            if (uniqueFunctions.length === 0) return '-';

            return (
                <div>
                    {uniqueFunctions.map((fn) => (
                        <FunctionBadge key={fn} fn={fn} />
                    ))}
                </div>
            );
        }
        case ac.years: {
            const years = [
                ...new Set((official.declarations || []).map((d) => d.year)),
            ].sort((a, b) => a - b);

            const ranges = [];
            let i = 0;
            while (i < years.length) {
                let start = years[i];
                let end = start;
                while (i + 1 < years.length && years[i + 1] === end + 1) {
                    end = years[i + 1];
                    i++;
                }
                if (end > start) {
                    ranges.push(`${start} - ${end}`);
                } else {
                    ranges.push(`${start}`);
                }
                i++;
            }

            return (
                <div>
                    {ranges.map((rangeLabel) => (
                        <Badge
                            key={rangeLabel}
                            bg="secondary"
                            className="me-1 mb-1"
                        >
                            {rangeLabel}
                        </Badge>
                    ))}
                </div>
            );
        }
        default:
            return null;
    }
};

/**
 * Asset declaration free-text fields (e.g. "Majetky" rows) are typed by hand
 * by different people across years, so the same item (a car, a flat, a
 * loan) can be phrased slightly differently from one year to the next.
 * These helpers implement a forgiving, order-independent comparison so
 * minor rephrasing doesn't trigger a false "changed" flag, at the cost of
 * some undetected changes ("leaks") when wording differs more substantially
 * - which is expected and acceptable (a human editor reviewing the flag can
 * reword the source data).
 */

// Splits a free-text field into individual item lines (one asset per line).
export const splitAssetLines = (text) =>
    typeof text === 'string'
        ? text
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
        : [];

// Word/phrase synonyms officials use interchangeably for the same item
// across years (e.g. "auto" vs "motorové vozidlo", "RD" vs "rodinný dom") -
// each variant collapses to its canonical form before tokenizing, so they
// compare as identical. Keyed on already lowercased, accent-stripped text;
// add more entries here as new variants are spotted in the data.
const assetSynonyms = [
    [
        'auto',
        ['automobil', 'osobne motorove vozidlo', 'motorove vozidlo', 'vozidlo'],
    ],
    ['rd', ['rodinneho domu', 'rodinny dom']],
    ['nadvorie', ['nadvoria']],
    ['porast', ['porasty']],
    ['travnaty', ['travnate']],
    ['trvaly', ['trvale']],
    ['lesny pozemok', ['lesne pozemky']],
];

const applyAssetSynonyms = (text) =>
    assetSynonyms.reduce(
        (result, [canonical, variants]) =>
            [...variants]
                .sort((a, b) => b.length - a.length)
                .reduce(
                    (acc, variant) =>
                        acc.replace(
                            new RegExp(
                                `\\b${variant.replace(/\s+/g, '\\s+')}\\b`,
                                'g'
                            ),
                            canonical
                        ),
                    result
                ),
        text
    );

// Qualifier words that get inconsistently included/omitted across years
// without changing what the item actually is (e.g. "osobný automobil" vs
// plain "auto", "Mercedes Benz" vs plain "Mercedes") - dropped entirely
// rather than mapped to a canonical form.
const assetFillerWords = [
    'osobny',
    'osobne',
    'osobna',
    'motorovy',
    'motorove',
    'motorova',
    'benz',
];

const applyAssetFillerWords = (text) =>
    assetFillerWords.reduce(
        (acc, word) => acc.replace(new RegExp(`\\b${word}\\b`, 'g'), ''),
        text
    );

// Legal-form abbreviation punctuation varies ("s.r.o." vs "SRO"), which
// would otherwise break the comparison below: generic punctuation-stripping
// turns "s.r.o." into three separate single-letter tokens instead of one -
// collapse it to a single canonical token first.
const normalizeCompanyForm = (text) =>
    text.replace(/\bs\.?\s*r\.?\s*o\.?\b/g, 'sro');

// "v" vs "na" as interchangeable prepositions before "spoločných" (shared
// building parts) - narrowly scoped to this phrase rather than a blanket
// filler removal, since "v"/"na" are too common elsewhere to safely drop
// everywhere without risking unrelated false matches.
const normalizeSharedPartsPreposition = (text) =>
    text.replace(/\b(?:v|na)\s+spolocnych\b/g, 'spolocnych');

// "Bratislava" is sometimes written as a prefix before the actual cadastral
// district ("Bratislava - Staré Mesto" vs plain "Staré Mesto"). Only the
// prefix form is dropped (matched by requiring another word right after
// it) - a standalone "kat. územie Bratislava" with no district name after
// it is left untouched, since there it's the only location identifier the
// line has.
const normalizeBratislavaDistrictPrefix = (text) =>
    text.replace(/\bbratislava(?:\s*-\s*|\s+)(?=[a-z])/g, '');

// Normalizes a single line for comparison: strips accents/case/punctuation,
// collapses known synonyms/filler words to a canonical form, and sorts its
// words, so reordered, differently-punctuated or differently-worded
// phrasing of the same item still compares equal.
export const normalizeAssetLine = (line) => {
    const stripped = removeAccentsFromString(line.toLowerCase().trim());
    const withSynonyms = applyAssetSynonyms(stripped);
    const withoutFillers = applyAssetFillerWords(withSynonyms);
    const withCompanyForm = normalizeCompanyForm(withoutFillers);
    const withSharedParts = normalizeSharedPartsPreposition(withCompanyForm);
    const withoutBratislavaPrefix =
        normalizeBratislavaDistrictPrefix(withSharedParts);
    return withoutBratislavaPrefix
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .sort()
        .join(' ');
};

const normalizedLineSet = (text) =>
    new Set(splitAssetLines(text).map(normalizeAssetLine));

// Extracts the cadastral folio ("LV") number from a real estate line, e.g.
// "...; číslo LV: 3378; ..." -> "3378", or the older "...; LV č. 6469; ..."
// format -> "6469". Some officials share a single LV across several
// distinct items (a flat, its garage, common areas), so this is used as a
// stable grouping key when the item text itself gets reworded.
export const extractLvId = (line) => {
    const match = /\bLV\s*(?:č\.?)?\s*:?\s*([A-Za-z0-9]+)/i.exec(line);
    return match ? match[1].toUpperCase() : null;
};

// Extracts a loan's origination date from a liability line, e.g.
// "...dátum vzniku: 19. 02. 2008" -> "19.02.2008". Used as a stable grouping
// key for the same reason as extractLvId above.
export const extractLoanDate = (line) => {
    const match =
        /d[aá]tum vzniku\s*:\s*([0-9]{1,2}\s*\.\s*[0-9]{1,2}\s*\.\s*[0-9]{4})/i.exec(
            line
        );
    return match ? match[1].replace(/\s+/g, '') : null;
};

// Extracts explicit numeric ownership shares from a line, e.g. "1/1",
// "5977/2073955" or "100%" - wherever they appear in the text (officials
// sometimes move the share from the trailing "podiel:" field into the item
// name itself between years).
export const extractNumericShares = (line) => {
    const matches = line.match(/\d+\s*\/\s*\d+|\d+(?:[.,]\d+)?\s*%/g) || [];
    return matches.map((share) => share.replace(/\s+/g, ''));
};

const groupLinesByKey = (lines, extractKey) =>
    lines.reduce((groups, line) => {
        const key = extractKey(line);
        if (key) (groups[key] ||= []).push(line);
        return groups;
    }, {});

const shareSetsConflict = (currentLines, previousLines) => {
    const currentShares = new Set(currentLines.flatMap(extractNumericShares));
    const previousShares = new Set(previousLines.flatMap(extractNumericShares));
    // A share going from unspecified to specified isn't a conflict - only
    // two explicitly stated, differing shares are.
    if (currentShares.size === 0 || previousShares.size === 0) return false;
    if (currentShares.size !== previousShares.size) return true;
    return [...currentShares].some((share) => !previousShares.has(share));
};

/**
 * Reconsiders lines the base per-line comparison marked as "changed" using a
 * stable domain identifier (a cadastral LV number, a loan's origination
 * date) that survives rewording. When a group of not-yet-matched lines
 * shares that identifier, has the same number of lines in both years, and
 * carries no explicitly conflicting numeric share, it's treated as the same
 * items reworded rather than a real change.
 */
const applyGroupOverride = (lines, unmatchedPrevious, extractGroupKey) => {
    const unmatchedCurrentLines = lines
        .filter((line) => line.changed)
        .map((line) => line.text);

    const currentGroups = groupLinesByKey(
        unmatchedCurrentLines,
        extractGroupKey
    );
    const previousGroups = groupLinesByKey(unmatchedPrevious, extractGroupKey);

    let remainingPrevious = unmatchedPrevious;
    let resultLines = lines;

    for (const [key, currentGroupLines] of Object.entries(currentGroups)) {
        const previousGroupLines = previousGroups[key];
        if (
            !previousGroupLines ||
            previousGroupLines.length !== currentGroupLines.length ||
            shareSetsConflict(currentGroupLines, previousGroupLines)
        ) {
            continue;
        }

        resultLines = resultLines.map((line) =>
            currentGroupLines.includes(line.text)
                ? { ...line, changed: false }
                : line
        );
        remainingPrevious = remainingPrevious.filter(
            (text) => !previousGroupLines.includes(text)
        );
    }

    return { lines: resultLines, remainingPrevious };
};

/**
 * Compares one Majetky field's text between two declaration years.
 *
 * `extractGroupKey` is an optional per-line key extractor (see extractLvId /
 * extractLoanDate above); when given, it refines the base comparison for
 * fields where a stable identifier is available.
 *
 * Returns:
 *  - changed: whether the field differs at all (item added, removed, or reworded)
 *  - lines: current year's lines, each tagged with whether it's new/changed
 */
export const diffAssetField = (currentText, previousText, extractGroupKey) => {
    const currentLines = splitAssetLines(currentText);
    const previousLines = splitAssetLines(previousText);
    const previousSet = normalizedLineSet(previousText);
    const currentSet = normalizedLineSet(currentText);

    let lines = currentLines.map((text) => ({
        text,
        changed: !previousSet.has(normalizeAssetLine(text)),
    }));

    let unmatchedPrevious = previousLines.filter(
        (text) => !currentSet.has(normalizeAssetLine(text))
    );

    if (extractGroupKey) {
        ({ lines, remainingPrevious: unmatchedPrevious } = applyGroupOverride(
            lines,
            unmatchedPrevious,
            extractGroupKey
        ));
    }

    return {
        changed: unmatchedPrevious.length > 0 || lines.some((l) => l.changed),
        lines,
    };
};

// Finds the closest earlier declaration (by year) to diff `decl` against, or
// null when `decl` is the earliest one on record (nothing to compare to).
export const findPreviousDeclaration = (decl, allDeclarations) =>
    [...allDeclarations]
        .filter((d) => d.year < decl.year)
        .sort((a, b) => b.year - a.year)[0] ?? null;
