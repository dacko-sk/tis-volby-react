import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Tooltip from 'react-bootstrap/Tooltip';

import { donationsColumns as dc, icons } from './constants';
import { labels, t } from './dictionary';
import {
    currencyFormat,
    dateNumericFormat,
    generateRandomString,
} from './helpers';
import { partyAlias } from './parties';
import { routes, segments, separators } from './routes';

import { settingsParams } from '../components/datatables/TableSettings';

export const apiEndpoints = {
    donations: 'https://volby.transparency.sk/api/donors/donations.php',
    donors: 'https://volby.transparency.sk/api/donors/donors.php',
    file: 'https://volby.transparency.sk/api/donors/donors_json.php',
    parties:
        'https://volby.transparency.sk/api/donors/donors_json.php?f=all_parties',
    stats: 'https://volby.transparency.sk/api/donors/donors_json.php?f=stats',
};
export const apiParams = [
    'o', // offset (page number - 1)
    'b', // block size
    'c', // 1=company, 0=person, unset=all
    'a', // amount
    'd', // date (timestamp)
    't', // type
    'f', // flag
    'i', // ID / unqId
    'p', // party
    'q', // search query
    's', // sort
];
export const allowedParams = [...apiParams, ...settingsParams];

export const hiddenDonorColumns = [dc.entity, dc.name, dc.address];
export const hiddenPartyColumns = [dc.party];
export const optionalColumns = [
    dc.address,
    dc.subtype,
    dc.source,
    dc.notes,
    dc.gender,
    dc.region,
];
export const defaultSort = `${separators.numbers}date`;

export const typeLabel = (i, plural) =>
    t(plural ? labels.donations.typesPlural : labels.donations.types)[i] ?? '';
export const flagLabel = (i) => t(labels.donations.flags)[i] ?? '';
export const flagAggLabel = (i) => t(labels.donations.flagsAggregated)[i] ?? '';
export const entityLabel = (i) => t(labels.donations.entities)[i] ?? '';
export const entityIcon = (i) => icons.entities[i] ?? '';
export const genderLabel = (i) => t(labels.gender[i] ?? '');
export const regionLabel = (i) => t(labels.regions[i] ?? '');

export const amountSettings = {
    min: 0,
    max: 2000000,
    step: 100,
};

export const isCompany = (sourceColumns) => {
    return (
        sourceColumns[3].substr(0, 1) === 'Y' || sourceColumns[4].trim().length
    );
};

export const columnAlign = (key) => {
    switch (key) {
        case dc.amount:
        case dc.date:
            return 'text-end';
        case dc.entity:
        case dc.flag:
        case dc.source:
            return 'text-center';
        default:
            return '';
    }
};
export const columnLabel = (key) =>
    Object.keys(labels.donations.columns).includes(key)
        ? t(labels.donations.columns[key])
        : '';
export const columnContent = (sourceColumns, targetColumn) => {
    const company = isCompany(sourceColumns);
    const name = sourceColumns[company ? 4 : 2].trim();
    const flag = sourceColumns[sourceColumns.length - 1]; // last column is flag (currently #13)
    switch (targetColumn) {
        case dc.party:
            return (
                <Link
                    to={routes.party(
                        partyAlias(sourceColumns[0]),
                        segments.DONATIONS
                    )}
                >
                    {partyAlias(sourceColumns[0])}
                </Link>
            );
        case dc.date:
            return (
                <div className="text-end text-nowrap">
                    {sourceColumns[1].length > 4
                        ? dateNumericFormat(sourceColumns[1])
                        : sourceColumns[1]}
                </div>
            );
        case dc.entity:
            return name ? (
                <OverlayTrigger
                    overlay={
                        <Tooltip id={generateRandomString()}>
                            {entityLabel(Number(company))}
                        </Tooltip>
                    }
                    placement="right"
                    delayShow={300}
                    delayHide={150}
                >
                    <div
                        className="text-center fs-5"
                        aria-label={entityLabel(Number(company))}
                    >
                        {icons.entities[Number(company)]}
                    </div>
                </OverlayTrigger>
            ) : (
                ''
            );
        case dc.name:
            return sourceColumns[3] ? (
                <Link to={routes.donor(sourceColumns[3])}>{name || '-'}</Link>
            ) : (
                <span>{name || '-'}</span>
            );
        case dc.address:
            return sourceColumns[5];
        case dc.type:
            return typeLabel(Number(sourceColumns[6])) ?? '';
        case dc.subtype:
            return sourceColumns[7];
        case dc.amount:
            return (
                <div className="text-end text-nowrap">
                    {currencyFormat(sourceColumns[8])}
                </div>
            );
        case dc.source:
            return (
                <div className="text-center">
                    <a
                        href={sourceColumns[9]}
                        className="text-decoration-none fs-4"
                        title={t(labels.download)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        📄
                    </a>
                </div>
            );
        case dc.flag:
            if (flag) {
                return (
                    <div className="text-center">
                        <OverlayTrigger
                            overlay={
                                <Tooltip id={generateRandomString()}>
                                    {flagLabel(Number(flag))}
                                </Tooltip>
                            }
                            placement="right"
                            delayShow={300}
                            delayHide={150}
                        >
                            <Badge
                                bg="white"
                                pill
                                className={`flag-${flag} border fs-6`}
                            >
                                🏴
                            </Badge>
                        </OverlayTrigger>
                    </div>
                );
            }
            return null;
        case dc.notes:
            return sourceColumns[10];
        case dc.gender:
            return genderLabel(sourceColumns[11]);
        case dc.region:
            return regionLabel(sourceColumns[12]);
        default:
            return null;
    }
};

// sort donor parties object (containing party:amount keys) by donation amount
export const getSortedDonorParties = (parties) =>
    Object.entries(parties)
        .sort((a, b) => b[1] - a[1])
        .map(([party]) => party);

export function FlagBadge({ compact = false, flag }) {
    const i = Number(flag);
    return (
        <>
            <Badge
                bg="white"
                pill
                className={`flag-${flag} border${compact ? '' : ' fs-2'}`}
            >
                {i ? '🏴' : '✔️'}
            </Badge>
            {!compact && <h5 className="mt-2">{flagAggLabel(i)}</h5>}
        </>
    );
}

export function DonorFlags({ compact = false, flags = [] }) {
    const flagsKeys = !Object.values(flags).includes(true)
        ? [0]
        : Object.entries(flags)
              .map(([flag, enabled]) => {
                  if (!enabled) {
                      return null;
                  }
                  return flag;
              })
              .filter((flag) => flag !== null);
    return compact ? (
        <Stack direction="horizontal" gap={2}>
            {flagsKeys.map((flag) => {
                return <FlagBadge key={flag} compact={compact} flag={flag} />;
            })}
        </Stack>
    ) : (
        <Row className="text-center mt-5">
            {flagsKeys.map((flag) => {
                return (
                    <Col key={flag}>
                        <FlagBadge compact={compact} flag={flag} />
                    </Col>
                );
            })}
        </Row>
    );
}

export function DonorParties({
    className = '',
    compact = false,
    parties = {},
}) {
    if (compact) {
        return getSortedDonorParties(parties).map((party, index) => {
            return (
                <Badge
                    key={party}
                    bg="secondary"
                    className={index > 0 ? 'ms-2' : ''}
                >
                    {partyAlias(party)}
                </Badge>
            );
        });
    }
    return (
        <Stack
            className={`flex-wrap ${className}`}
            direction="horizontal"
            gap={2}
        >
            {getSortedDonorParties(parties).map((party) => {
                const partyName = partyAlias(party);
                return (
                    <Link
                        key={partyName}
                        to={routes.party(partyName, segments.DONATIONS)}
                    >
                        <Badge bg="secondary">{partyName}</Badge>
                    </Link>
                );
            })}
        </Stack>
    );
}
