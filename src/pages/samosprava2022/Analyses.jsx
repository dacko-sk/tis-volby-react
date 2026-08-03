import { useState } from 'react';
import { Link } from 'react-router';
import Accordion from 'react-bootstrap/Accordion';

import { labels, t } from '../../helpers/dictionary';
import { setTitle, substitute } from '../../helpers/helpers';
import { routes, segments } from '../../helpers/routes';

import AlertWithIcon, { icons } from '../../components/general/AlertWithIcon';
import Title from '../../components/structure/Title';
import Posts, { templates } from '../../components/wp/Posts';

export const analysesCategories = {
    main: 859,
    regions: {
        BA: 863,
        BB: 862,
        KE: 864,
        NR: 865,
        PO: 866,
        TN: 867,
        TT: 868,
        ZA: 869,
    },
    top: 870,
    types: {
        regional: 860,
        local: 861,
    },
};

export const getExcludedCategories = (typeId, regionId) =>
    Object.values(analysesCategories.types)
        .filter((id) => id !== typeId)
        .concat(
            Object.values(analysesCategories.regions).filter(
                (id) => id !== regionId
            )
        );

export const newAnalysesAlert = (
    <AlertWithIcon className="mt-4" icon={icons.info} variant="primary">
        Zverejnili sme aktualizované hodnotenie transparentností kampaní v
        župách a krajských mestách ku 24.10.2022.
    </AlertWithIcon>
);

export const winnersAlert = (
    <AlertWithIcon icon={icons.info} variant="primary">
        Víťazi volieb sú zvýraznení modrým orámovaním.
    </AlertWithIcon>
);

export const title = 'Hodnotenie transparentnosti kampaní';

function Analyses() {
    const [activeKey, setActiveKey] = useState(null);
    // initially all accordions are NOT loaded
    const [loadedRegions, setLoadedRegions] = useState({});

    const accordions = [];
    Object.entries(analysesCategories.regions).forEach(([region, regionId]) => {
        const types = [];
        if (loadedRegions[region]) {
            Object.entries(analysesCategories.types).forEach(
                ([type, typeId]) => {
                    const excluded = getExcludedCategories(typeId, regionId);
                    types.push(
                        <div key={typeId}>
                            <h2
                                className={
                                    typeId === analysesCategories.types.local
                                        ? 'my-3'
                                        : 'mb-3'
                                }
                            >
                                {t(labels.elections.municipalTypes[type])}
                            </h2>
                            <Posts
                                categories={[typeId, regionId]}
                                categoriesExclude={excluded}
                                noResults="Pre tento typ volieb v tomto kraji doposiaľ nie sú k dispozícii žiadne hodnotenia."
                                section={segments.ANALYSES}
                            />
                        </div>
                    );
                }
            );
        }
        accordions.push(
            <Accordion.Item key={region} eventKey={region}>
                <Accordion.Header>{substitute(region)}</Accordion.Header>
                <Accordion.Body>{types}</Accordion.Body>
            </Accordion.Item>
        );
    });

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKey(ak);
        // start posts loading (if needed)
        if (ak && !loadedRegions[ak]) {
            setLoadedRegions((prevState) => {
                return {
                    ...prevState,
                    [ak]: true,
                };
            });
        }
    };

    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>

            {newAnalysesAlert}
            {winnersAlert}

            <Posts
                categories={[analysesCategories.top]}
                noResults="Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne."
                section={segments.ANALYSES}
                template={templates.featured}
            />

            <p className="mt-4">
                Rok 2022 možno označiť aj ako supervolebný. Na konci októbra si
                voliči po prvýkrát v jediný deň vyberú ôsmich županov, takmer
                tritisíc primátorov, starostov a zhruba 21-tisíc miestnych a
                regionálnych poslancov.
            </p>
            <p>
                V Transparency International Slovensko sme pripravili hodnotenie
                transparentnosti kampaní v najväčších samosprávach. Pozreli sme
                sa na 132 uchádzačov o post primátorov ôsmich krajských miest a
                post predsedov ôsmich samosprávnych krajov.
            </p>
            <p>
                Priebežné hodnotenie sme k 10.10.2022 udelili 98 kandidátom s
                merateľnými kampaňami, pri ktorých suma výdavkov presahovala
                3-tisíc eur, alebo mali viac ako štyri relevantné výdavkové
                položky na transparentnom účte. Hodnotenie sme aktualizovali k
                24.10.2022 pre 103 kandidátov, ktorí k danému dátumu spĺňali
                uvedené kritériá. V profiloch jednotlivých kandidátov je
                zobrazené pôvodné aj aktualizované hodnotenie.
            </p>
            <p>
                Zamerali sme sa pri ňom predovšetkým na dostupné údaje na
                transparentných účtoch, weboch a sociálnych sieťach kandidátov,
                výsledné hodnotenie tak neodráža ďalšie aspekty kampaní. Pre
                lepšiu prehľadnosť sme zvolili princíp semafora - pri každom
                hodnotenom kandidátovi tak svieti jedno z hodnotení:
            </p>
            <ul className="arrows lh-lg">
                <li>
                    <span className="badge score-good">
                        Transparentná kampaň (zelená farba)
                    </span>
                </li>
                <li>
                    <span className="badge score-average">
                        Kampaň s výhradami (oranžová farba)
                    </span>
                </li>
                <li>
                    <span className="badge score-bad">
                        Netransparentná kampaň (červená farba)
                    </span>
                </li>
                <li>
                    <span className="badge score-unknown">
                        Nedostatok dát / nehodnotené (šedá farba)
                    </span>
                </li>
            </ul>
            <p className="mb-4">
                Podrobnejšie výsledky nájdete v sekcii nižšie a v{' '}
                <Link
                    to={routes.article(
                        segments.NEWS,
                        'hodnotenie-kampani-pred-miestnymi-a-regionalnymi-volbami-2022'
                    )}
                >
                    Metodike hodnotenia
                </Link>
                .
            </p>

            <Accordion
                className="mt-4"
                activeKey={activeKey}
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        </section>
    );
}

export default Analyses;
