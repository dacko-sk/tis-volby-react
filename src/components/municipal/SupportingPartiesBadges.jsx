import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';

import { findSubjectByPartyUid, getSubjectShortname } from '../../helpers/cms';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';

import { useElectionData } from '../../hooks/CmsQueries';

function SupportingPartiesBadges({ candidate }) {
    const { data: cmsData } = useElectionData();
    const outlineBadge = (key, label) => (
        <Badge
            key={key}
            bg={null}
            className="border border-secondary text-secondary bg-transparent"
        >
            {label}
        </Badge>
    );

    const parties = candidate?.supportingParties ?? [];

    // if no parties, show independent badge
    const badges = parties.length
        ? parties.map((party) => {
              const subject = findSubjectByPartyUid(cmsData, party.uid);
              if (!subject) {
                  return outlineBadge(
                      party.uid,
                      party.abbreviation || party.name
                  );
              }
              const shortname = getSubjectShortname(subject);
              return (
                  <Badge
                      as={Link}
                      key={shortname}
                      bg="secondary"
                      className="border border-secondary"
                      to={routes.party(shortname)}
                  >
                      {shortname}
                  </Badge>
              );
          })
        : outlineBadge('independent', t(labels.candidate.independentCandidate));

    return (
        <span className="d-inline-flex flex-wrap align-items-center gap-1 align-top">
            {badges}
        </span>
    );
}

export default SupportingPartiesBadges;
