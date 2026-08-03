import { Link } from 'react-router';

import {
    parseQueryOptions,
    routes,
    rwq,
    separators,
} from '../../helpers/routes';

export default function SortLink({
    allowedParams,
    column,
    children,
    defaultSort = `${separators.numbers}date`,
    route = routes.donations(),
}) {
    const options = parseQueryOptions(allowedParams);

    // copy all options except s & o
    const { s, o, ...linkOpt } = options;
    let currentClass = 'text-decoration-none';
    let targetSort;
    switch (options.s ?? defaultSort) {
        // current column is sorted ascending, target is descending
        case column:
            currentClass += ' s-a';
            targetSort = separators.numbers + column;
            break;
        // current column is sorted descending, target is no sort
        case separators.numbers + column:
            currentClass += ' s-d';
            targetSort = separators.numbers;
            break;
        // other unsorted columns, target is ascending
        default:
            targetSort = column;
    }
    if (targetSort !== defaultSort) {
        linkOpt.s = targetSort;
    }
    return (
        <Link className={currentClass} to={rwq.searchAndFilter(route, linkOpt)}>
            {children}
        </Link>
    );
}
