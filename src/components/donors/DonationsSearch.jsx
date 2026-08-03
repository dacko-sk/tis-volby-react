import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { donationsColumns as dc } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import {
    apiEndpoints,
    apiParams,
    allowedParams,
    optionalColumns,
    columnAlign,
    columnContent,
    columnLabel,
} from '../../helpers/dontaions';
import { partyAliases } from '../../helpers/parties';
import {
    buildApiQuery,
    parseQueryOptions,
    routes,
    rwq,
    separators,
} from '../../helpers/routes';

import { allDonationsParties } from '../../hooks/Queries';

import DonationsFilters from './DonationsFilters';
import DataTable from '../datatables/DataTable';
import TableSettings, { defaultBlocksize } from '../datatables/TableSettings';
import PaginationWithGaps from '../general/PaginationWithGaps';

import '../datatables/Tables.scss';

function DonationsSearch({
    hiddenColumns = [],
    parties = allDonationsParties(),
    route = routes.donations(),
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
    const blocksize = options.b ?? false ? Number(options.b) : defaultBlocksize;
    const offset = options.o ?? false ? Number(options.o) : 0;
    const visibleColumns =
        options.v ?? false
            ? options.v
                  .split(separators.numbers)
                  .map((item) => optionalColumns[Number(item)])
            : [];
    const queryParams = buildApiQuery(apiParams, {
        ...options,
        // always add blocksize to api request
        b: blocksize,
        // if party name option is provided, replace it with all party aliases
        ...(options.p ?? false
            ? { p: partyAliases(options.p).join(separators.array) }
            : {}),
    });

    const dq = useQuery({
        queryKey: [`donations_${queryParams}`],
        queryFn: () =>
            fetch(`${apiEndpoints.donations}?${queryParams}`).then((response) =>
                response.json()
            ),
    });

    const tableSize = 12 - (openFilters ? 3 : 0) - (openSettings ? 2 : 0);

    // prevent pagination from disappearing before the new query is loaded - use the previous total amount sent via router state property
    let totalPages = location.state?.totalPages ?? 0;
    if (dq.data?.total ?? false) {
        totalPages = Math.ceil(dq.data.total / blocksize);
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
        <div id="donations" className="mt-4">
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
                    <DonationsFilters
                        hiddenColumns={hiddenColumns}
                        parties={parties}
                        updateRouteQuery={updateRouteQuery}
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
                        optionalColumns={optionalColumns}
                        updateRouteQuery={updateRouteQuery}
                    />
                </aside>
                <div className={`col-12 col-lg-${tableSize}`}>
                    <div id="donations-results">
                        <DataTable
                            allowedParams={allowedParams}
                            columnAlign={columnAlign}
                            columnContent={columnContent}
                            columnLabel={columnLabel}
                            columns={dc}
                            dataQuery={dq}
                            route={route}
                            hiddenColumns={hiddenColumns}
                            optionalColumns={optionalColumns}
                            visibleColumns={visibleColumns}
                        />
                        <PaginationWithGaps
                            className="justify-content-center mt-4"
                            activePage={offset + 1}
                            totalPages={totalPages}
                            pageRouteCallback={getPageRoute}
                            useOffset
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonationsSearch;
