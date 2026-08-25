import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useDebouncedCallback } from 'use-debounce';

import {
    allowedParams,
    amountSettings,
    columnLabel,
    electionsYears,
} from '../../helpers/accounts';
import { icons, transactionsColumns as tc } from '../../helpers/constants';
import { labels, t as translate } from '../../helpers/dictionary';
import {
    currencyFormat,
    datePickerFormat,
    getTimeFromDate,
    sortAlphabetically,
    sortNumbers,
} from '../../helpers/helpers';
import { partyFullName } from '../../helpers/parties';
import { parseQueryOptions, separators } from '../../helpers/routes';

function TransactionsFilters({
    hiddenColumns = [],
    parties = [],
    updateRouteQuery,
}) {
    const options = parseQueryOptions(allowedParams);

    const [query, setQuery] = useState(options.q ?? '');

    let elections = options.e?.split(separators.array) ?? [];
    let years =
        options.y?.split(separators.numbers).map((item) => Number(item)) ?? [];
    const type = (options.t ?? '') !== '' ? Number(options.t) : '';
    const direction = (options.w ?? '') !== '' ? Number(options.w) : '';
    const [amount, setAmount] = useState(
        options.a?.split(separators.numbers).map((item) => Number(item)) ?? [
            amountSettings.min,
            amountSettings.max,
        ]
    );
    const timestamp = options.d
        ?.split(separators.numbers)
        .map((item) => Number(item)) ?? [0, 0];
    const party = options.p ?? '';

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

    const updateElections = (event) => {
        // copy all options except e & o
        const { e, o, ...linkOpt } = options;
        if (event.target.checked) {
            elections.push(event.target.value);
            elections.sort(sortAlphabetically());
        } else {
            elections = elections.filter((item) => item !== event.target.value);
        }
        if (elections.length) {
            linkOpt.e = elections.join(separators.array);
        }
        updateRouteQuery(linkOpt);
    };

    const updateYears = (e) => {
        // copy all options except y & o
        const { y, o, ...linkOpt } = options;
        const id = Number(e.target.value);
        if (e.target.checked) {
            years.push(id);
            years.sort(sortNumbers(true));
        } else {
            years = years.filter((item) => item !== id);
        }
        if (years.length) {
            linkOpt.y = years.join(separators.numbers);
        }
        updateRouteQuery(linkOpt);
    };

    const updateType = (e) => {
        // copy all options except t & o
        const { t, o, ...linkOpt } = options;
        const id = Number(e.target.value);
        if (e.target.checked) {
            if (type !== Number(!id)) {
                linkOpt.t = id;
            }
        } else if (type === '') {
            linkOpt.t = Number(!id);
        }
        updateRouteQuery(linkOpt);
    };

    const updateDirection = (e) => {
        // copy all options except w & o
        const { w, o, ...linkOpt } = options;
        const id = Number(e.target.value);
        if (e.target.checked) {
            if (direction !== Number(!id)) {
                linkOpt.w = id;
            }
        } else if (direction === '') {
            linkOpt.w = Number(!id);
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
                        htmlFor="transactions-search"
                        className="visually-hidden"
                    >
                        {translate(labels.search.label)}
                    </Form.Label>
                    <Form.Control
                        placeholder={translate(labels.search.label)}
                        aria-label={translate(labels.search.label)}
                        aria-describedby="search-icon"
                        id="transactions-search"
                        onChange={updateQuery}
                        value={query}
                    />
                    <InputGroup.Text id="search-icon">🔍</InputGroup.Text>
                </InputGroup>
            </Form.Group>

            {!hiddenColumns.includes(tc.elections) && (
                <Form.Group className="mt-3">
                    <h6 className="fw-bold text-primary text-uppercase">
                        {columnLabel(tc.elections)}
                    </h6>
                    {Object.entries(labels.elections.types).map(
                        ([elType, typeLabels]) => (
                            <Form.Check
                                key={elType}
                                label={
                                    <span className="el-icon">
                                        <img src={icons.elections[elType]} />
                                        <span>{translate(typeLabels)}</span>
                                    </span>
                                }
                                id={`et-${elType}`}
                                name="elections"
                                type="checkbox"
                                value={elType}
                                checked={elections.includes(elType)}
                                onChange={updateElections}
                            />
                        )
                    )}
                </Form.Group>
            )}

            {!hiddenColumns.includes(tc.elections) && (
                <Form.Group className="mt-3">
                    <h6 className="fw-bold text-primary text-uppercase">
                        {columnLabel(tc.year)}
                    </h6>
                    {electionsYears.map((elYear) => (
                        <Form.Check
                            key={elYear}
                            inline
                            label={elYear}
                            id={`ey-${elYear}`}
                            name="year"
                            type="checkbox"
                            value={elYear}
                            checked={years.includes(elYear)}
                            onChange={updateYears}
                        />
                    ))}
                </Form.Group>
            )}

            <Form.Group className="mt-3">
                <h6 className="fw-bold text-primary text-uppercase">
                    {translate(labels.accounts.paymentType)}
                </h6>
                {translate(labels.accounts.paymentTypes).map((label, index) => (
                    <Form.Check
                        key={label}
                        inline
                        label={label}
                        id={`payment-type-${index}`}
                        name="payment-type"
                        type="checkbox"
                        value={index}
                        checked={type !== Number(!index)}
                        onChange={updateType}
                    />
                ))}
            </Form.Group>

            <Form.Group className="mt-3">
                <h6 className="fw-bold text-primary text-uppercase">
                    {translate(labels.accounts.paymentDirection)}
                </h6>
                {translate(labels.accounts.paymentDirections).map(
                    (label, index) => (
                        <Form.Check
                            key={label}
                            inline
                            label={
                                <>
                                    <span data-direction={index}>
                                        {icons.payments[index]}
                                    </span>
                                    {label}
                                </>
                            }
                            id={`payment-direction-${index}`}
                            name="payment-direction"
                            type="checkbox"
                            value={index}
                            checked={direction !== Number(!index)}
                            onChange={updateDirection}
                        />
                    )
                )}
            </Form.Group>

            <Form.Group className="mt-3">
                <h6 className="fw-bold text-primary text-uppercase">
                    {columnLabel(tc.amount)}
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
                    {columnLabel(tc.date)}
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

            {!hiddenColumns.includes(tc.party) && parties.length > 1 && (
                <Form.Group className="mt-3">
                    <h6 className="fw-bold text-primary text-uppercase">
                        {translate(labels.parties.party)}
                    </h6>
                    <Form.Select size="sm" onChange={updateParty} value={party}>
                        <option key="" value="">
                            {translate(labels.all)}
                        </option>
                        {parties.map((partyName) => (
                            <option key={partyName} value={partyName}>
                                {partyFullName(partyName)}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            )}
        </Form>
    );
}

export default TransactionsFilters;
