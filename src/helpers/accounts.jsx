import { Link } from 'react-router';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { icons, transactionsColumns as tc } from './constants';
import { labels, t } from './dictionary';
import {
    currencyFormat,
    dateNumericFormat,
    generateRandomString,
} from './helpers';
import { findPartyByAccount } from './parties';
import { routes, rwq, segments, separators } from './routes';

import { settingsParams } from '../components/datatables/TableSettings';

export const apiEndpoints = {
    transactions: 'https://volby.transparency.sk/api/accounts/search.php',
};
export const apiParams = [
    'o', // offset (page number - 1)
    'b', // block size
    'w', // direction
    'y', // year
    'a', // amount
    'd', // date (timestamp)
    'q', // search query
    's', // sort
    'e', // elections
    't', // type
    'i', // transparent account ID
    'p', // transparent account name
];
export const allowedParams = [...apiParams, ...settingsParams];

export const hiddenColumnsDefault = [tc.id, tc.year, tc.currency];
export const hiddenColumnsAccount = [
    ...hiddenColumnsDefault,
    tc.ta,
    tc.elections,
];
export const hiddenColumnsParty = [...hiddenColumnsDefault, tc.ta];
export const optionalColumns = [
    tc.currency,
    tc.txType,
    tc.ks,
    tc.vs,
    tc.ss,
    tc.note,
];
export const defaultSort = `${separators.numbers}date`;
export const electionsYears = [2020, 2022, 2023, 2024];

export const amountSettings = {
    min: 0,
    max: 1000000,
    step: 100,
};

export const getColumnIndex = (targetColumn) =>
    Object.keys(tc).findIndex((colKey) => colKey === targetColumn);

export const columnAlign = (key) => {
    switch (key) {
        case tc.amount:
        case tc.date:
            return 'text-end';
        default:
            return '';
    }
};

export const columnLabel = (key) =>
    Object.keys(labels.accounts.columns).includes(key)
        ? t(labels.accounts.columns[key])
        : '';

export const detailLink = (sourceColumns, routeQuery = {}) => {
    const [accId] = (sourceColumns[getColumnIndex(tc.id)] ?? '0-').split('-');
    const party = findPartyByAccount(accId);
    const route = party
        ? routes.party(party, segments.ACCOUNTS)
        : routes.account(
              [sourceColumns[getColumnIndex(tc.ta)], accId].join(
                  separators.value
              )
          );
    return rwq.searchAndFilter(route, routeQuery);
};

export const columnContent = (sourceColumns, targetColumn) => {
    const val = sourceColumns[getColumnIndex(targetColumn)];
    const direction = Number(sourceColumns[getColumnIndex(tc.amount)] <= 0);
    switch (targetColumn) {
        case tc.ta:
            return (
                <Link
                    to={detailLink(sourceColumns)}
                    data-id={sourceColumns[getColumnIndex(tc.id)]}
                >
                    {sourceColumns[getColumnIndex(tc.ta)]}
                </Link>
            );
        case tc.elections:
            return (
                <div className="el-icon">
                    <OverlayTrigger
                        overlay={
                            <Tooltip id={generateRandomString()}>
                                {t(labels.elections.types[val])}
                            </Tooltip>
                        }
                        placement="left"
                        delayShow={300}
                        delayHide={150}
                    >
                        <img src={icons.elections[val]} />
                    </OverlayTrigger>
                    <span>{sourceColumns[getColumnIndex(tc.year)]}</span>
                </div>
            );
        case tc.date:
            return (
                <div className="text-end text-nowrap">
                    {val.length > 4 ? dateNumericFormat(val) : val}
                </div>
            );
        case tc.amount:
            return (
                <div className="d-flex align-items-center justify-content-between">
                    <OverlayTrigger
                        overlay={
                            <Tooltip id={generateRandomString()}>
                                {t(
                                    labels.accounts.paymentDirections[direction]
                                )}
                            </Tooltip>
                        }
                        placement="left"
                        delayShow={300}
                        delayHide={150}
                    >
                        <div data-direction={direction}>
                            {icons.payments[direction]}
                        </div>
                    </OverlayTrigger>

                    <div className="text-end text-nowrap">
                        {currencyFormat(val)}
                    </div>
                </div>
            );
        default:
            return <div>{val}</div>;
    }
};
