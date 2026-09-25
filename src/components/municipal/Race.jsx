import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { getCandidateSpending } from '../../helpers/races';
import { labels, t } from '../../helpers/dictionary';

import useData from '../../hooks/AccountsData';
import { useElectionData } from '../../hooks/CmsQueries';

import ChallengersChart from './ChallengersChart';
import IncumbentCard from './IncumbentCard';

import './Race.scss';

// incumbent (current mayor) vs. challengers in one municipality
function Race({
    candidates,
    title,
    subtitle,
    incumbentLabel,
    detailLink,
    hero = false,
}) {
    const { csvData } = useData();
    const { data: cmsData } = useElectionData();

    const rows = candidates.map((cmsCandidate) => ({
        cmsCandidate,
        spending: getCandidateSpending(cmsCandidate, csvData, cmsData),
    }));
    const incumbent = rows.find((row) => row.cmsCandidate.current) ?? null;
    const challengers = rows
        .filter((row) => row !== incumbent)
        .sort((a, b) => b.spending.total - a.spending.total);

    // bars are scaled to the biggest spender of the whole race, incl. incumbent
    const max = Math.max(0, ...rows.map((row) => row.spending.total));
    const hasPartyAccounts = rows.some((row) => row.spending.hasParties);

    return (
        <article className={`race${hero ? ' race-hero' : ''}`}>
            <div className="race-header">
                <div>
                    {subtitle && (
                        <span className="race-subtitle">{subtitle}</span>
                    )}
                    <h3 className="race-title">{title}</h3>
                </div>
                {detailLink && (
                    <Link className="race-detail" to={detailLink}>
                        {t(labels.regionRaces.municipalityDetail)} ›
                    </Link>
                )}
            </div>
            <Row className="gy-4">
                {incumbent && (
                    <Col lg={4}>
                        <IncumbentCard
                            cmsCandidate={incumbent.cmsCandidate}
                            spending={incumbent.spending}
                            label={incumbentLabel}
                        />
                    </Col>
                )}
                <Col lg={incumbent ? 8 : 12}>
                    <h4 className="race-column-title">
                        {incumbent
                            ? t(labels.regionRaces.challengers)
                            : t(labels.regionRaces.candidates)}
                    </h4>
                    {challengers.length > 0 ? (
                        <ChallengersChart rows={challengers} max={max} />
                    ) : (
                        <p className="text-muted">
                            {t(labels.regionRaces.noChallengers)}
                        </p>
                    )}
                </Col>
            </Row>
            {hasPartyAccounts && (
                <em className="disclaimer d-block mt-3">
                    {t(labels.regionRaces.disclaimer)}
                </em>
            )}
        </article>
    );
}

export default Race;
