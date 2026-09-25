import { Link } from 'react-router';

import { labels, t } from '../../helpers/dictionary';
import { currencyFormat } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import { PartyAccountLink } from './ChallengersChart';
import SelfGovRating from './SelfGovRating';
import SupportingPartiesBadges from './SupportingPartiesBadges';

import defaultImg from '../../../public/img/user_grey.png';

function IncumbentCard({ cmsCandidate, spending, label }) {
    const name = cmsCandidate.person.name;

    let spendingValue = (
        <span className="text-muted">{t(labels.regionRaces.noAccount)}</span>
    );
    if (spending.hasAccount) {
        spendingValue = (
            <>
                <strong className="feature-amount">
                    {currencyFormat(spending.own)}
                </strong>
                {spending.hasParties && (
                    <small className="d-block">
                        + {currencyFormat(spending.partiesTotal)}{' '}
                        {t(labels.regionRaces.onPartyAccounts)} *
                    </small>
                )}
            </>
        );
    } else if (spending.hasParties) {
        spendingValue = (
            <strong className="feature-amount">
                {currencyFormat(spending.partiesTotal)} *
            </strong>
        );
    }

    return (
        <div className="incumbent-card">
            <div className="incumbent-label">{label}</div>
            <Link
                className="incumbent-person"
                to={routes.candidateMunicipal(
                    name,
                    cmsCandidate.municipality,
                    null
                )}
            >
                <img
                    src={cmsCandidate.photo || defaultImg}
                    alt={name}
                    loading="lazy"
                />
                <span className="incumbent-name">{name}</span>
            </Link>
            <dl className="incumbent-features">
                <dt>{t(labels.regionRaces.spending)}</dt>
                <dd>
                    {spendingValue}
                    {spending.hasParties && (
                        <span className="challenger-parties mt-1">
                            {spending.parties.map((party, index) => (
                                <PartyAccountLink
                                    key={party.account}
                                    party={party}
                                    index={index}
                                    badge
                                />
                            ))}
                        </span>
                    )}
                </dd>
                <dt>{t(labels.regionRaces.campaignRating)}</dt>
                <dd className="text-muted">
                    {t(labels.regionRaces.comingSoon)}
                </dd>
                <dt>{t(labels.regionRaces.selfGovRating)}</dt>
                <dd>
                    <SelfGovRating selfGov={cmsCandidate.selfGov} />
                </dd>
                {cmsCandidate.supportingParties?.length > 0 && (
                    <>
                        <dt>{t(labels.regionRaces.supportingParties)}</dt>
                        <dd>
                            <SupportingPartiesBadges candidate={cmsCandidate} />
                        </dd>
                    </>
                )}
            </dl>
        </div>
    );
}

export default IncumbentCard;
