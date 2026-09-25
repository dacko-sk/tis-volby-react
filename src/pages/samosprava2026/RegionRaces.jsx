import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { labels, t } from '../../helpers/dictionary';
import { regions, setTitle } from '../../helpers/helpers';
import { routes } from '../../helpers/routes';

import useData from '../../hooks/AccountsData';
import { useRegionRacesData } from '../../hooks/CmsQueries';

import Loading from '../../components/general/Loading';
import Race from '../../components/municipal/Race';
import RacesCarousel from '../../components/municipal/RacesCarousel';
import Title from '../../components/structure/Title';

function RegionRaces() {
    const params = useParams();
    const region = params?.region ?? null;
    const navigate = useNavigate();

    const { csvData } = useData();
    const { data, isLoading } = useRegionRacesData(region);

    useEffect(() => {
        if (regions[region] === undefined) {
            // redirect to home page in case region does not exist
            navigate(routes.home());
        }
    }, [region, navigate]);

    setTitle(regions[region]);

    let content = <Loading />;
    if (!isLoading && csvData?.data && data) {
        const { regionInfo, regional, city, municipalities } = data;
        const labelsIncumbent = labels.regionRaces.incumbent;

        content = (
            <>
                <section className="races-hero mb-5">
                    <h2 className="mb-4">{t(labels.regionRaces.heroTitle)}</h2>
                    {regional.length > 0 && (
                        <Race
                            hero
                            candidates={regional}
                            title={regionInfo?.municipality}
                            subtitle={t(labels.regionRaces.regionalRace)}
                            incumbentLabel={t(labelsIncumbent.regional)}
                            detailLink={routes.municipality(
                                regionInfo?.abbreviation,
                                region
                            )}
                        />
                    )}
                    {city.length > 0 && (
                        <div className="mt-4">
                            <Race
                                hero
                                candidates={city}
                                title={regionInfo?.city}
                                subtitle={t(labels.regionRaces.cityRace)}
                                incumbentLabel={t(labelsIncumbent.city)}
                                detailLink={routes.municipality(
                                    regionInfo?.city,
                                    region
                                )}
                            />
                        </div>
                    )}
                </section>

                {municipalities.length > 0 && (
                    <section className="races-others">
                        <h2 className="mb-3">
                            {t(labels.regionRaces.otherRaces)}
                        </h2>
                        <RacesCarousel
                            items={municipalities.map((m) => ({
                                key: m.name,
                                label: m.name,
                                candidates: m.candidates,
                            }))}
                            renderSlide={(item) => (
                                <Race
                                    candidates={item.candidates}
                                    title={item.label}
                                    incumbentLabel={t(labelsIncumbent.local)}
                                    detailLink={routes.municipality(
                                        item.label,
                                        region
                                    )}
                                />
                            )}
                        />
                    </section>
                )}
            </>
        );
    }

    return (
        <section className="region-races-page">
            <Title>{regions[region]}</Title>
            {content}
        </section>
    );
}

export default RegionRaces;
