import { getMunicipalityTickText } from '../../helpers/charts';
import { setTitle, sortByDonors, sortBySpending } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import useData, { s22AggregatedKeys } from '../../hooks/AccountsData';

import Regions from '../../components/municipal/RegionsLegacy';
import TisBarChart from '../../components/charts/TisBarChart';
import { chartKeys, columnVariants } from '../../helpers/charts';
import Title from '../../components/structure/Title';

const title = 'Grafy';
const unknownRegion = 'Nezistený';

function Charts() {
    const { csvData } = useData();

    // parse data
    const people = [];
    const parties = [];
    const regions = {};
    if (csvData?.data) {
        csvData.data.forEach((row) => {
            if (
                row?.[s22AggregatedKeys.region] !== undefined &&
                row.isTransparent
            ) {
                const region = row[s22AggregatedKeys.region] || unknownRegion;
                if (row.isParty) {
                    parties.push({
                        name: row[s22AggregatedKeys.name],
                        [chartKeys.INCOMING]: row.sum_incoming,
                        [chartKeys.OUTGOING]: row.sum_outgoing,
                    });
                } else {
                    people.push({
                        name: getMunicipalityTickText(row, true),
                        [chartKeys.INCOMING]: row.sum_incoming,
                        [chartKeys.OUTGOING]: row.sum_outgoing,
                        [chartKeys.UNIQUE]: row.num_unique_donors,
                    });

                    if (row[s22AggregatedKeys.region]) {
                        if (regions[region] !== undefined) {
                            regions[region][chartKeys.INCOMING] +=
                                row.sum_incoming;
                            regions[region][chartKeys.OUTGOING] +=
                                row.sum_outgoing;
                        } else {
                            regions[region] = {
                                name: region,
                                [chartKeys.INCOMING]: row.sum_incoming,
                                [chartKeys.OUTGOING]: row.sum_outgoing,
                            };
                        }
                    }
                }
            }
        });
        parties.sort(sortBySpending);
    }
    const donors = people.sort(sortByDonors).slice(0, 10);

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>

            <TisBarChart
                className="my-4"
                title="Výdavky a príjmy podľa krajov"
                subtitle="Kumulatívne hodnoty za župné aj miestne voľby."
                bars={columnVariants.inOut}
                data={Object.values(regions).sort(sortBySpending)}
                currency
            />

            <Regions />

            <TisBarChart
                className="my-4"
                title="Stranícke kampane"
                subtitle="Kumulatívne hodnoty za župné aj miestne voľby."
                bars={columnVariants.inOut}
                data={parties}
                namesLength={30}
                currency
                vertical
            />

            <TisBarChart
                className="my-4"
                title="Výdavky a príjmy jednotlivých kandidátov"
                bars={columnVariants.inOut}
                data={people.sort(sortBySpending).slice(0, 10)}
                buttonText="Zobraziť všetkých"
                buttonLink={routes.campaigns()}
                currency
                // scrollable
                vertical
            />

            <TisBarChart
                className="my-4"
                title="Top 10 kandidátov s najvyšším počtom unikátnych darcov"
                data={donors}
                bars={columnVariants.donors}
                buttonText="Zobraziť všetkých"
                buttonLink={routes.donors()}
                vertical
            />
        </section>
    );
}

export default Charts;
