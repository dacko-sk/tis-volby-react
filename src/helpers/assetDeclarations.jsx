import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import FunctionBadge from '../components/assets/FunctionBadge';

import { assetDeclarationsColumns as ac } from './constants';
import { labels, t } from './dictionary';
import { routes } from './routes';
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
