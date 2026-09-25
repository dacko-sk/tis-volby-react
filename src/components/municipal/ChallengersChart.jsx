import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import { partyStackColor } from '../../helpers/races';
import { labels, t } from '../../helpers/dictionary';
import { currencyFormat } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import { getSubjectShortname } from '../../hooks/CmsQueries';

const pct = (value, max) => `${max ? (100 * value) / max : 0}%`;

export function PartyAccountLink({
    party,
    index,
    badge = false,
    className = '',
    style = {},
    children,
    ref,
}) {
    const linkClassName = `${badge ? 'party-badge ' : ''}${className}`.trim();
    const linkStyle = badge
        ? { backgroundColor: partyStackColor(index), ...style }
        : style;
    const title = `${party.subject?.name ?? party.name}: ${currencyFormat(party.amount)}`;
    return party.subject ? (
        <Link
            ref={ref}
            className={linkClassName}
            style={linkStyle}
            title={title}
            to={routes.party(getSubjectShortname(party.subject))}
        >
            {children ?? party.name}
        </Link>
    ) : (
        <a
            ref={ref}
            className={linkClassName}
            style={linkStyle}
            title={title}
            href={party.account}
            rel="noreferrer"
            target="_blank"
        >
            {children ?? party.name}
        </a>
    );
}

// stacked bar; party names are shown inside the segments, or as badges
// behind the bar when the segment is too narrow for the name
function ChallengerBar({ spending, max }) {
    const trackRef = useRef(null);
    const segmentRefs = useRef({});
    const [narrow, setNarrow] = useState([]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        const measure = () => {
            const next = Object.entries(segmentRefs.current)
                .filter(([, el]) => el && el.scrollWidth > el.clientWidth)
                .map(([account]) => account);
            setNarrow((prev) => (prev.join() === next.join() ? prev : next));
        };
        const observer = new ResizeObserver(measure);
        observer.observe(track);
        return () => observer.disconnect();
    }, []);

    const share = (value) =>
        `${spending.total ? (100 * value) / spending.total : 0}%`;
    const outside = spending.parties
        .map((party, index) => ({ party, index }))
        .filter(({ party }) => !party.amount || narrow.includes(party.account));

    return (
        <div className="bar-track" ref={trackRef}>
            <div
                className="bar-fill"
                style={{ width: pct(spending.total, max) }}
            >
                {spending.own > 0 && (
                    <span
                        className="bar-segment bar-own"
                        style={{ width: share(spending.own) }}
                        title={`${t(labels.regionRaces.ownAccount)}: ${currencyFormat(spending.own)}`}
                    />
                )}
                {spending.parties.map((party, index) =>
                    party.amount > 0 ? (
                        <PartyAccountLink
                            key={party.account}
                            ref={(el) => {
                                segmentRefs.current[party.account] = el;
                            }}
                            party={party}
                            index={index}
                            className={`bar-segment bar-party${narrow.includes(party.account) ? ' bar-party-narrow' : ''}`}
                            style={{
                                width: share(party.amount),
                                backgroundColor: partyStackColor(index),
                            }}
                        />
                    ) : null
                )}
            </div>
            {outside.map(({ party, index }) => (
                <PartyAccountLink
                    key={party.account}
                    party={party}
                    index={index}
                    className={`party-label-outside${party.amount ? ' connected' : ''}`}
                    style={{ color: partyStackColor(index) }}
                />
            ))}
        </div>
    );
}

// rows: [{ cmsCandidate, spending }], max: value of full-width bar
function ChallengersChart({ rows, max }) {
    return (
        <div className="challengers-chart">
            <div className="challengers-legend">
                <span>
                    <i className="legend-own" />
                    {t(labels.regionRaces.ownAccount)}
                </span>
                <span>
                    <i className="legend-party" />
                    {t(labels.regionRaces.partyAccounts)}
                </span>
            </div>
            {rows.map(({ cmsCandidate, spending }) => {
                const name = cmsCandidate.person.name;
                return (
                    <div className="challenger" key={cmsCandidate.uid}>
                        <div className="challenger-name">
                            <Link
                                to={routes.candidateMunicipal(
                                    name,
                                    cmsCandidate.municipality,
                                    null
                                )}
                            >
                                {name}
                            </Link>
                            {spending.hasParties && ' *'}
                        </div>
                        <div className="challenger-bar">
                            <ChallengerBar spending={spending} max={max} />
                            <span className="challenger-amount">
                                {spending.hasAccount || spending.hasParties ? (
                                    currencyFormat(spending.total)
                                ) : (
                                    <em>{t(labels.regionRaces.noAccount)}</em>
                                )}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ChallengersChart;
