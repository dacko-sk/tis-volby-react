import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { sortByTextProp } from '../../../helpers/helpers';

import useAdsData, { csvConfig } from '../../../hooks/AdsData';
import useData, { legacyAggregatedKeys } from '../../../hooks/AccountsData';
import { partyData } from '../../../helpers/parties';

import DownloadLink from '../../../components/general/DownloadLink';
import Loading from '../../../components/general/Loading';

function PartiesAssets() {
    const { csvData } = useData();
    const { sheetsData } = useAdsData();

    setTitle(`${t(labels.parties.pageTitle)} - ${t(labels.parties.assets)}`);

    if (!(csvData.data ?? false)) {
        return <Loading />;
    }

    return (
        <>
            <h2 className="mb-4">{t(labels.party.extendedAssets)}</h2>
            <Row>
                {csvData.data
                    .sort(sortByTextProp(legacyAggregatedKeys.name))
                    .flatMap((row) => {
                        const pData = partyData(row[legacyAggregatedKeys.name]);
                        return (sheetsData.assets[row.fbName] ?? false)
                            ? [
                                  <Col
                                      key={row[legacyAggregatedKeys.name]}
                                      sm={6}
                                      lg={4}
                                  >
                                      <DownloadLink
                                          to={sheetsData.assets[row.fbName]}
                                      >
                                          {(pData.image ?? false) && (
                                              <figure className="party-logo-inline">
                                                  {pData.image}
                                              </figure>
                                          )}

                                          <h3 className="text-secondary my-0">
                                              {row.fullName}
                                          </h3>
                                      </DownloadLink>
                                  </Col>,
                              ]
                            : [];
                    })}
            </Row>
        </>
    );
}

export default PartiesAssets;
