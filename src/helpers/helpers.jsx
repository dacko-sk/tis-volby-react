import { setTitle as setBrowserTitle } from './browser';
import { chartKeys } from './charts';
import { getCurrentLocale } from './languages';

export const isNumeric = (value) => !Number.isNaN(Number(value));

export const fixNumber = (value) => {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        return Number(value.replace(',', '.').replace(/\s/g, ''));
    }
    return Number(value) || 0;
};

export const slovakFormat = (value, options) =>
    new Intl.NumberFormat(getCurrentLocale(), options).format(value);

export const numFormat = (value) => slovakFormat(value, {});

export const pctFormat = (value) => {
    const num = Number(value);
    if (!Number.isNaN(num)) {
        return `${numFormat(num)} %`;
    }
    return '';
};

export const humanPctFormat = (value) =>
    pctFormat(100 * value, { maximumFractionDigits: 2 });

export const humanPctSignFormat = (value) =>
    pctFormat(100 * value, {
        maximumFractionDigits: 2,
        signDisplay: 'exceptZero',
    });

export const wholeNumFormat = (value) =>
    slovakFormat(value, {
        maximumFractionDigits: 0,
    });

export const currencyFormat = (value) =>
    slovakFormat(value, {
        style: 'currency',
        currency: 'EUR',
    });

export const wholeCurrencyFormat = (value) =>
    slovakFormat(value, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
        // unit: 'million',
        notation: 'compact',
    });

export const slovakDateFormat = (timestamp, options) => {
    if (
        timestamp === undefined ||
        timestamp === null ||
        timestamp === '' ||
        timestamp === 0
    ) {
        return '';
    }
    const date = new Date(
        typeof timestamp === 'number' ? 1000 * timestamp : timestamp
    );
    if (isNaN(date.getTime())) {
        return '';
    }
    return new Intl.DateTimeFormat(getCurrentLocale(), options).format(date);
};

export const dateTimeFormat = (timestamp) =>
    slovakDateFormat(timestamp, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });

export const dateFormat = (timestamp) =>
    slovakDateFormat(timestamp, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

export const dateNumericFormat = (timestamp) =>
    slovakDateFormat(timestamp, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

export const dateShortFormat = (timestamp) =>
    slovakDateFormat(timestamp, {
        month: 'numeric',
        day: 'numeric',
    });

export const datePickerFormat = (timestamp) =>
    timestamp
        ? new Date(
              timestamp.toString().length >= 10 ? timestamp * 1000 : timestamp
          )
              .toISOString()
              .split('T')[0]
        : '';

export const getTimeFromDate = (string) => {
    const t = new Date(string).getTime();
    return Number.isNaN(t) ? 0 : t / 1000;
};

export const shortenValue = (value, length, removals) => {
    if (value) {
        let shorten = value;
        if (Array.isArray(removals)) {
            removals.forEach((removal) => {
                shorten = shorten.replace(removal, '');
            });
        }
        if (typeof shorten === 'string' && shorten.length > length) {
            return `${shorten.substring(0, length)}…`;
        }
        return shorten;
    }
    return '';
};

export const shortenUrl = (value) =>
    shortenValue(value, 32, ['https://', 'www.']);

export const fixUrl = (url) => {
    if (Array.isArray(url)) return fixUrl(url[0]);
    if (typeof url !== 'string') return '';
    return url.startsWith('http') ? url : `https://${url}`;
};

export const decodeHTMLEntities = (rawStr) =>
    rawStr
        ? rawStr.replace(
              /&#(\d+);/g,
              (match, dec) => `${String.fromCharCode(dec)}`
          )
        : '';

/**
 * Break text separated by newline character to react fragments separated with <br/> tag
 */
export const nl2r = (text) =>
    typeof text === 'string' && text.includes('\n')
        ? text.split('\n').map((fragment, index) => {
              const k = index + fragment;
              return (
                  <span key={k}>
                      {index > 0 && <br />}
                      {fragment}
                  </span>
              );
          })
        : text;

/**
 * Highlight last n words of the sentence in text-secondary (orange) style
 */
export const secondarySentenceEnding = (textOrReact, wordsAmount, isLast) => {
    if (isLast ?? true) {
        const wa = wordsAmount || 1;
        if (typeof textOrReact === 'string') {
            const words = textOrReact.split(' ');
            return (
                <span key={textOrReact}>
                    {`${words.slice(0, words.length - wa).join(' ')} `}
                    <span className="text-secondary">
                        {words.slice(-wa).join(' ')}
                    </span>
                </span>
            );
        }
        if (Array.isArray(textOrReact)) {
            return textOrReact.map((item, index) =>
                secondarySentenceEnding(
                    item,
                    wa,
                    index === textOrReact.length - 1
                )
            );
        }
        if (
            typeof textOrReact === 'object' &&
            (textOrReact.props.children ?? false)
        ) {
            const children = Object.values(textOrReact.props.children);
            return children.map((child, index) =>
                secondarySentenceEnding(
                    child,
                    wa,
                    index === children.length - 1
                )
            );
        }
    }
    return textOrReact;
};

export const sortNumbers = (asc) => (a, b) => ((asc ?? true) ? a - b : b - a);

export const sortByNumericProp = (prop, asc) => (a, b) =>
    asc ? a[prop] - b[prop] : b[prop] - a[prop];

export const sortAlphabetically = (asc) => (a, b) =>
    (asc ?? true) ? a.localeCompare(b) : b.localeCompare(a);

export const sumOfValues = (obj) =>
    Object.values(obj).reduce((sum, val) => sum + val, 0);

export const removeAccentsFromString = (str) =>
    str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

export const compareStr = (a, b) =>
    a &&
    b &&
    removeAccentsFromString(a.toLowerCase().trim()) ===
        removeAccentsFromString(b.toLowerCase().trim());

export const contains = (haystack, needle) =>
    haystack &&
    needle &&
    removeAccentsFromString(haystack.toLowerCase()).includes(
        removeAccentsFromString(needle.toLowerCase().trim())
    );

export const swapName = (name) => {
    const [first, second] = name.split(' ');
    return first && second ? `${second} ${first}` : name;
};

export const generateRandomString = (length) =>
    [...Array(length ?? 6)].map(() => Math.random().toString(36)[2]).join('');

export const setTitle = setBrowserTitle;

export const regions = {
    BB: 'Banskobystrický kraj',
    BA: 'Bratislavský kraj',
    KE: 'Košický kraj',
    NR: 'Nitriansky kraj',
    PO: 'Prešovský kraj',
    TN: 'Trenčiansky kraj',
    TT: 'Trnavský kraj',
    ZA: 'Žilinský kraj',
};

const replacements = {
    ...regions,
    'Banskobystrický samosprávny kraj': 'BBSK',
    'Bratislavský samosprávny kraj': 'BSK',
    'Košický samosprávny kraj': 'KSK',
    'Nitriansky samosprávny kraj': 'NSK',
    'Prešovský samosprávny kraj': 'PSK',
    'Trenčiansky samosprávny kraj': 'TSK',
    'Trnavský samosprávny kraj': 'TTSK',
    'Žilinský samosprávny kraj': 'ŽSK',
    Banskobystrický: 'Banskobystrický samosprávny kraj',
    Bratislavský: 'Bratislavský samosprávny kraj',
    Košický: 'Košický samosprávny kraj',
    Nitriansky: 'Nitriansky samosprávny kraj',
    Prešovský: 'Prešovský samosprávny kraj',
    Trenčiansky: 'Trenčiansky samosprávny kraj',
    Trnavský: 'Trnavský samosprávny kraj',
    Žilinský: 'Žilinský samosprávny kraj',
};

export const substitute = (value) => replacements[value] ?? value;

const cities = {
    BB: 'Banská Bystrica',
    BA: 'Bratislava',
    KE: 'Košice',
    NR: 'Nitra',
    PO: 'Prešov',
    TN: 'Trenčín',
    TT: 'Trnava',
    ZA: 'Žilina',
    'Banskobystrický samosprávny kraj': 'Banská Bystrica',
    'Bratislavský samosprávny kraj': 'Bratislava',
    'Košický samosprávny kraj': 'Košice',
    'Nitriansky samosprávny kraj': 'Nitra',
    'Prešovský samosprávny kraj': 'Prešov',
    'Trenčiansky samosprávny kraj': 'Trenčín',
    'Trnavský samosprávny kraj': 'Trnava',
    'Žilinský samosprávny kraj': 'Žilina',
};

export const regionalCity = (value) => cities[value] ?? value;

export const sortBySpending = sortByNumericProp(chartKeys.OUTGOING, false);

export const sortByDonors = sortByNumericProp(chartKeys.UNIQUE, false);

export const getTimestampFromIsoDate = (string) => {
    const t = new Date(string).getTime();
    return Number.isNaN(t) ? 0 : t / 1000;
};

export const sortByTextProp = (prop) => (a, b) =>
    a[prop].localeCompare(b[prop]);

export const sortByName = sortByTextProp('name');

export const getLastWord = (inputString) => {
    if (!inputString.trim()) {
        return '';
    }

    const words = inputString.split(' ');
    return words[words.length - 1];
};

export const sortBySurname = (a, b) =>
    getLastWord(a).localeCompare(getLastWord(b));

export const badgePctFormat = (value) =>
    Number(value) > -1 ? pctFormat(value) : 'N/A';
