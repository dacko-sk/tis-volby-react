import { useState, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { assetDeclarationsColumns as ac } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import {
    allowedParams,
    columnAlign,
    columnContent,
    columnLabel,
    defaultSort,
    endpoints,
} from '../../helpers/assetDeclarations';
import { contains } from '../../helpers/helpers';
import {
    parseQueryOptions,
    routes,
    rwq,
    separators,
} from '../../helpers/routes';

import AssetDeclarationsFilters from './AssetDeclarationsFilters';
import DataTable from '../datatables/DataTable';
import TableSettings, { defaultBlocksize } from '../datatables/TableSettings';
import PaginationWithGaps from '../general/PaginationWithGaps';

import '../datatables/Tables.scss';

function AssetDeclarationsSearch({
    hiddenColumns = [],
    route = routes.assetDeclarations(),
    routeOptions = {},
}) {
    const [openFilters, setOpenFilters] = useState(window.screen.width > 991);
    const [openSettings, setOpenSettings] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const options = {
        ...routeOptions,
        ...parseQueryOptions(allowedParams),
    };
    const blocksize =
        (options.b ?? false) ? Number(options.b) : defaultBlocksize;
    const offset = (options.o ?? false) ? Number(options.o) : 0;
    const visibleColumns = []; // No optional columns for now

    const queryParamsString = JSON.stringify(options);

    const rawQuery = useQuery({
        queryKey: ['asset_declarations_list'],
        queryFn: () =>
            fetch(endpoints.search).then((response) => response.json()),
    });

    const processedData = useMemo(() => {
        if (!rawQuery.data) {
            return { rows: [], total: 0 };
        }

        let officials = [...(rawQuery.data.officials || [])];

        // Search Query Filter
        const query = options.q ? options.q : '';
        if (query) {
            officials = officials.filter((o) => {
                const nameMatch = contains(o.nrsr_name || o.name, query);
                const sortedDeclarations = [...(o.declarations || [])].sort(
                    (a, b) => b.year - a.year
                );
                const functionMatch = contains(
                    sortedDeclarations[0]?.public_function || '',
                    query
                );
                return nameMatch || functionMatch;
            });
        }

        // Years Filter (OR logic)
        const yearsStr = options.y ?? '';
        if (yearsStr) {
            const selectedYears = yearsStr
                .split(separators.numbers)
                .map((y) => Number(y));

            officials = officials.filter((o) => {
                const officialYears = (o.declarations || []).map((d) => d.year);
                return selectedYears.some((year) =>
                    officialYears.includes(year)
                );
            });
        }

        // Function Filter
        const functionFilter = options.f ? options.f : '';
        if (functionFilter) {
            officials = officials.filter((o) => {
                return (o.declarations || []).some((d) =>
                    contains(d.public_function || '', functionFilter)
                );
            });
        }

        // Sorting
        const sortParam = options.s || defaultSort;
        const sortDesc = sortParam.startsWith(separators.numbers);
        const sortKey = sortDesc ? sortParam.substring(1) : sortParam;

        if (sortKey === ac.name) {
            officials.sort((a, b) => {
                const nameA = a.nrsr_name || a.name || '';
                const nameB = b.nrsr_name || b.name || '';
                return sortDesc
                    ? nameB.localeCompare(nameA, 'sk')
                    : nameA.localeCompare(nameB, 'sk');
            });
        } else if (sortKey === ac.function) {
            officials.sort((a, b) => {
                const declA = [...(a.declarations || [])].sort(
                    (x, y) => y.year - x.year
                );
                const declB = [...(b.declarations || [])].sort(
                    (x, y) => y.year - x.year
                );
                const funcA = declA[0]?.public_function || '';
                const funcB = declB[0]?.public_function || '';
                return sortDesc
                    ? funcB.localeCompare(funcA, 'sk')
                    : funcA.localeCompare(funcB, 'sk');
            });
        } else if (sortKey === ac.years) {
            // Sorting by years could mean counting declarations or highest year.
            // Let's sort by the number of declarations.
            officials.sort((a, b) => {
                const countA = (a.declarations || []).length;
                const countB = (b.declarations || []).length;
                return sortDesc ? countB - countA : countA - countB;
            });
        }

        const total = officials.length;

        // Pagination
        const start = offset * blocksize;
        const end = start + blocksize;
        const rows = officials.slice(start, end);

        return { rows, total };
    }, [rawQuery.data, queryParamsString]);

    // Create a mock query object for DataTable
    const dataQuery = {
        isLoading: rawQuery.isLoading,
        error: rawQuery.error,
        data: processedData,
    };

    const tableSize = 12 - (openFilters ? 3 : 0) - (openSettings ? 2 : 0);

    let totalPages = location.state?.totalPages ?? 0;
    if (dataQuery.data?.total ?? false) {
        totalPages = Math.ceil(dataQuery.data.total / blocksize);
    }

    const toggleFilter = () => {
        setOpenFilters(!openFilters);
    };

    const toggleSettings = () => {
        setOpenSettings(!openSettings);
    };

    const updateRouteQuery = (newQueryOptions, navigateOptions) =>
        navigate(rwq.searchAndFilter(route, newQueryOptions), navigateOptions);

    const getPageRoute = (i) => {
        // copy all options except offset and keys from routeOptions
        const { o, ...linkOpt } = options;
        Object.keys(routeOptions).forEach((key) => delete linkOpt[key]);
        if (i > 0) {
            linkOpt.o = i;
        }
        return rwq.searchAndFilter(route, linkOpt);
    };

    return (
        <div id="asset-declarations-search-container" className="mt-4">
            <div className="d-flex mb-2">
                <Button
                    onClick={toggleFilter}
                    variant={`${openFilters ? '' : 'outline-'}primary`}
                >
                    {t(labels.donations.filters.button)}
                </Button>
                <Button
                    className="ms-auto"
                    onClick={toggleSettings}
                    variant={`${openSettings ? '' : 'outline-'}primary`}
                >
                    {t(labels.donations.settings.button)}
                </Button>
            </div>
            <div className="row gx-3 gy-2">
                <aside
                    className={`col-12 ${openFilters ? 'col-lg-3' : 'd-none'}`}
                >
                    <AssetDeclarationsFilters
                        updateRouteQuery={updateRouteQuery}
                        functions={rawQuery.data?.functions || []}
                    />
                </aside>
                <aside
                    className={`col-12 ${
                        openSettings ? 'col-lg-2 order-lg-last' : 'd-none'
                    }`}
                >
                    <TableSettings
                        allowedParams={allowedParams}
                        columnLabel={columnLabel}
                        hiddenColumns={hiddenColumns}
                        optionalColumns={[]}
                        updateRouteQuery={updateRouteQuery}
                    />
                </aside>
                <div className={`col-12 col-lg-${tableSize}`}>
                    <div id="asset-declarations-results">
                        <DataTable
                            allowedParams={allowedParams}
                            columnAlign={columnAlign}
                            columnContent={columnContent}
                            columnLabel={columnLabel}
                            columns={ac}
                            dataQuery={dataQuery}
                            route={route}
                            hiddenColumns={hiddenColumns}
                            optionalColumns={[]}
                            visibleColumns={visibleColumns}
                            noDataMessage={t(labels.assetDeclarations.noData)}
                        />
                        <PaginationWithGaps
                            className="justify-content-center mt-4"
                            activePage={offset + 1}
                            totalPages={totalPages}
                            pageRouteCallback={getPageRoute}
                            useOffset
                        />
                        <div className="mt-4 small text-muted text-center">
                            {t(
                                labels.assetDeclarations
                                    .dataDictionaryDisclaimer
                            )}
                            <Link to={routes.assetDeclarationsDataDictionary()}>
                                {t(labels.assetDeclarations.dataDictionary)}
                            </Link>
                            .
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssetDeclarationsSearch;
