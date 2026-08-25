import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useDebouncedCallback } from 'use-debounce';

import { donationsColumns as dc, icons } from '../../helpers/constants';
import { labels, t as translate } from '../../helpers/dictionary';
import {
    amountSettings,
    allowedParams,
    columnLabel,
} from '../../helpers/dontaions';
import {
    currencyFormat,
    datePickerFormat,
    getTimeFromDate,
    sortAlphabetically,
    sortNumbers,
} from '../../helpers/helpers';
import { partyAlias, partyFullName } from '../../helpers/parties';
import { parseQueryOptions, separators } from '../../helpers/routes';

function DonationsFilters({
    hiddenColumns = [],
    parties = [],
    updateRouteQuery,
}) {
    const options = parseQueryOptions(allowedParams);

    const [query, setQuery] = useState(options.q ?? '');

    const entity = (options.c ?? '') !== '' ? Number(options.c) : '';
    let types =
        options.t ?? false
            ? options.t.split(separators.numbers).map((item) => Number(item))
            : [];
    let flags =
        options.f ?? false
            ? options.f.split(separators.numbers).map((item) => Number(item))
            : [];
    const party = options.p ?? '';

    const [amount, setAmount] = useState(
        options.a ?? false
            ? options.a.split(separators.numbers).map((item) => Number(item))
            : [amountSettings.min, amountSettings.max]
    );
    const timestamp = options.d
        ? options.d.split(separators.numbers).map((item) => Number(item))
        : [0, 0];

    const formSubmit = (e) => {
        // prevent form submit action, all paremeters are set via URL
        e.preventDefault();
    };

    const debounceSearch = useDebouncedCallback((value) => {
        // copy all options except q & o
        const { q, o, ...linkOpt } = options;
        if (value) {
            linkOpt.q = encodeURIComponent(value);
        }
        updateRouteQuery(linkOpt);
    }, 500);

    const updateQuery = (e) => {
        setQuery(e.target.value);
        debounceSearch(e.target.value);
    };

    const updateEntity = (e) => {
        // copy all options except c & o
        const { c, o, ...linkOpt } = options;
        if (e.target.value !== '') {
            linkOpt.c = Number(e.target.value);
        }
        updateRouteQuery(linkOpt);
    };

    const updateTypes = (e) => {
        // copy all options except t & o
        const { t, o, ...linkOpt } = options;
        const id = Number(e.target.value);
        if (e.target.checked) {
            types.push(id);
            types.sort(sortNumbers(true));
        } else {
            types = types.filter((item) => item !== id);
        }
        if (types.length) {
            linkOpt.t = types.join(separators.numbers);
        }
        updateRouteQuery(linkOpt);
    };

    const updateFlags = (e) => {
        // copy all options except f & o
        const { f, o, ...linkOpt } = options;
        const id = Number(e.target.value);
        if (e.target.checked) {
            flags.push(id);
            flags.sort(sortNumbers(true));
        } else {
            flags = flags.filter((item) => item !== id);
        }
        if (flags.length) {
            linkOpt.f = flags.join(separators.numbers);
        }
        updateRouteQuery(linkOpt);
    };

    const debounceArrNumParam = useDebouncedCallback((value, param) => {
        // copy all options except o
        const { o, ...linkOpt } = options;
        if (Array.isArray(value)) {
            linkOpt[param] = value.join(separators.numbers);
        } else if (linkOpt[param] ?? false) {
            delete linkOpt[param];
        }
        updateRouteQuery(linkOpt);
    }, 500);

    const updateAmount = (minmax) => {
        setAmount(minmax);
        debounceArrNumParam(
            minmax[0] === amountSettings.min && minmax[1] === amountSettings.max
                ? null
                : minmax,
            'a'
        );
    };

    const updateAmountMin = (e) => {
        const min = Math.max(
            Math.min(
                Number(e.target.value),
                amountSettings.max - amountSettings.step
            ),
            amountSettings.min
        );
        updateAmount([min, Math.max(min + amountSettings.step, amount[1])]);
    };

    const updateAmountMax = (e) => {
        const max = Math.min(
            Math.max(Number(e.target.value), amountSettings.step),
            amountSettings.max
        );
        updateAmount([Math.min(max - amountSettings.step, amount[0]), max]);
    };

    const updateDate = (minmax) => {
        // copy all options except d & o
        const { d, o, ...linkOpt } = options;
        if (minmax[0] || minmax[1]) {
            linkOpt.d = [minmax[0] || '', minmax[1] || ''].join(
                separators.numbers
            );
        }
        updateRouteQuery(linkOpt);
    };

    const updateDateMin = (e) => {
        const min = getTimeFromDate(e.target.value);
        let max = timestamp[1];
        if (min && max) {
            max = Math.max(min, max);
        }
        updateDate([min, max]);
    };

    const updateDateMax = (e) => {
        const max = getTimeFromDate(e.target.value);
        let min = timestamp[0];
        if (min && max) {
            min = Math.min(max, min);
        }
        updateDate([min, max]);
    };

    const updateParty = (e) => {
        // copy all options except p & o
        const { p, o, ...linkOpt } = options;
        if (e.target.value !== '') {
            linkOpt.p = encodeURIComponent(e.target.value);
        }
        updateRouteQuery(linkOpt);
    };

    return (
        <Form
            id="donations-filters"
            className="bg-light p-4"
            onSubmit={formSubmit}
        >
            <Form.Group>
                <h6 className="fw-bold text-primary text-uppercase">
                    {translate(labels.donations.filters.search)}
                </h6>
                <InputGroup>
                    <Form.Label
                        htmlFor="donations-search"
                        className="visually-hidden"
                    >
                        {translate(labels.search.label)}
                    </Form.Label>
                    <Form.Control
                        placeholder={translate(labels.search.label)}
                        aria-label={translate(labels.search.label)}
                        aria-describedby="search-icon"
                        id="donations-search"
                        onChange={updateQuery}
                        value={query}
                    />
                    <InputGroup.Text id="search-icon">🔍</InputGroup.Text>
                </InputGroup>
            </Form.Group>

            {!hiddenColumns.includes(dc.entity) && (
                <Form.Group className="mt-3">
                    <h6 className="fw-bold text-primary text-uppercase">
                        {columnLabel(dc.entity)}
                    </h6>
                    <Form.Check
                        key=""
                        inline
                        label={translate(labels.all)}
                        id="entity-all"
                        name="entity"
                        type="radio"
                        value=""
                        checked={entity === ''}
                        onChange={updateEntity}
                    />
                    {translate(labels.donations.entities).map(
                        (label, index) => (
                            <Form.Check
                                key={label}
                                inline
                                label={`${icons.entities[index]} ${label}`}
                                id={`entity-${label}`}
                                name="entity"
                                type="radio"
                                value={index}
                                checked={entity === index}
                                onChange={updateEntity}
                            />
                        )
                    )}
                </Form.Group>
            )}

            <Form.Group className="mt-3">
                <h6 className="fw-bold text-primary text-uppercase">
                    {columnLabel(dc.type)}
                </h6>
                {translate(labels.donations.types).map((label, index) => {
                    if (!label) {
                        return null;
                    }
                    return (
                        <Form.Check
                            key={label}
                            inline
                            label={label}
                            id={`type-${index}`}
                            name="type"
                            type="checkbox"
                            value={index}
                            checked={types.includes(index)}
                            onChange={updateTypes}
                        />
                    );
                })}
            </Form.Group>

            <Form.Group className="mt-3">
                <h6 className="fw-bold text-primary text-uppercase">
                    {columnLabel(dc.flag)}
                </h6>
                {translate(labels.donations.flags).map((label, index) => {
                    if (!index) {
                        return null;
                    }
                    return (
                        <Form.Check
                            key={label}
                            inline
                            label={
                                <>
                                    <span
                                        className={`flag-${index} badge rounded-pill border bg-light bg-opacity-25`}
                                    >
                                        🏴
                                    </span>
                                    {` ${label}`}
                                </>
                            }
                            id={`flag-${index}`}
                            name="flag"
                            type="checkbox"
                            value={index}
                            checked={flags.includes(index)}
                            onChange={updateFlags}
                        />
                    );
                })}
            </Form.Group>

            <Form.Group className="mt-3">
                <h6 className="fw-bold text-primary text-uppercase">
                    {columnLabel(dc.amount)}
                </h6>
                <div className="d-flex">
                    <Form.Label htmlFor="amount-min">
                        {translate(labels.donations.filters.from)}
                    </Form.Label>
                    <span className="ms-auto">{currencyFormat(amount[0])}</span>
                </div>
                <Form.Range
                    id="amount-min"
                    min={amountSettings.min}
                    max={amountSettings.max}
                    step={amountSettings.step}
                    value={amount[0]}
                    onChange={updateAmountMin}
                />
                <div className="d-flex">
                    <Form.Label htmlFor="amount-max">
                        {translate(labels.donations.filters.to)}
                    </Form.Label>
                    <span className="ms-auto">{currencyFormat(amount[1])}</span>
                </div>
                <Form.Range
                    id="amount-max"
                    min={amountSettings.min}
                    max={amountSettings.max}
                    step={amountSettings.step}
                    value={amount[1]}
                    onChange={updateAmountMax}
                />
            </Form.Group>

            <Form.Group className="mt-3">
                <h6 className="fw-bold text-primary text-uppercase">
                    {columnLabel(dc.date)}
                </h6>
                <Row className="align-items-center">
                    <Col xs={2}>
                        <Form.Label htmlFor="date-min" className="my-0">
                            {translate(labels.donations.filters.from)}
                        </Form.Label>
                    </Col>
                    <Col xs={10}>
                        <Form.Control
                            id="date-min"
                            type="date"
                            value={datePickerFormat(timestamp[0])}
                            onChange={updateDateMin}
                        />
                    </Col>
                </Row>
                <Row className="align-items-center mt-2">
                    <Col xs={2}>
                        <Form.Label htmlFor="date-max" className="my-0">
                            {translate(labels.donations.filters.to)}
                        </Form.Label>
                    </Col>
                    <Col xs={10}>
                        <Form.Control
                            id="date-max"
                            type="date"
                            value={datePickerFormat(timestamp[1])}
                            onChange={updateDateMax}
                        />
                    </Col>
                </Row>
            </Form.Group>

            {!hiddenColumns.includes(dc.party) && parties.length > 1 && (
                <Form.Group className="mt-3">
                    <h6 className="fw-bold text-primary text-uppercase">
                        {columnLabel(dc.party)}
                    </h6>
                    <Form.Select size="sm" onChange={updateParty} value={party}>
                        <option key="" value="">
                            {translate(labels.all)}
                        </option>
                        {parties.sort(sortAlphabetically()).map((p) => {
                            const partyName = partyAlias(p);
                            return (
                                <option key={partyName} value={partyName}>
                                    {partyFullName(partyName)}
                                </option>
                            );
                        })}
                    </Form.Select>
                </Form.Group>
            )}
        </Form>
    );
}

export default DonationsFilters;
