import { Link } from 'react-router';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';
import { getCurrentLanguage, languages } from '../../helpers/routes';
import { resources, transparencyClasses } from '../../helpers/wp';

import { municipalTypes } from '../../hooks/AccountsData';
import { useAnalysesList } from '../../hooks/CmsQueries';

import AnalysesFeatured from '../../components/analyses/AnalysesFeatured';
import AnalysisList from '../../components/analyses/AnalysisList';
import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';

const analysesList = (items) => (
    <Row className="articles list">
        {items.map((item) => (
            <AnalysisList key={item.key} item={item} />
        ))}
    </Row>
);

const legend = (
    <ul className="arrows lh-lg">
        {[
            transparencyClasses.good,
            transparencyClasses.average,
            transparencyClasses.bad,
            // not used in 2026 - all assessed campaigns have enough data
            // transparencyClasses.unknown,
        ].map((cls) => (
            <li key={cls}>
                <span className={`badge score-${cls}`}>
                    {t(labels.analysis.transparency[cls])}
                </span>
            </li>
        ))}
    </ul>
);

const introText = {
    [languages.sk]: (
        <>
            <AlertWithIcon className="my-4" variant="primary">
                Tlačová správa k hodnoteniu transparentnosti kampaní:{' '}
                <Link to={resources.pressRelease}>
                    Len každá tretia kampaň v krajských mestách a župách je
                    transparentná
                </Link>
                .
            </AlertWithIcon>

            <p className="mt-4">
                Transparency International Slovensko prináša pred samosprávnymi
                voľbami 2026 hodnotenie transparentnosti{' '}
                <strong>
                    57 volebných kampaní kandidátov na primátorov krajských
                    miest, županov a starostov bratislavských mestských častí
                    Petržalka a Ružinov s vyše 50-tisíc obyvateľmi
                </strong>
                . Do hodnotenia sme zaradili kandidátov s výdavkami na kampaň
                najmenej 3&nbsp;000 eur a aspoň štyrmi relevantnými platobnými
                transakciami (stav k 13. októbru 2026). Pri menších kampaniach s
                nedostatkom dát by mohlo prísť pri hodnotení k skresleniu.
            </p>
            <p>
                <strong>
                    Transparentnú kampaň vedie 18 kandidátov, teda necelá
                    tretina hodnotených.
                </strong>{' '}
                Ďalších 27 získalo hodnotenie „Kampaň s výhradami“ a 12 kampaní
                sme označili za netransparentné. Pre lepšiu prehľadnosť
                používame princíp semafora: od zelenej transparentnej kampane
                cez oranžovú kampaň s výhradami až po červenú netransparentnú
                kampaň.
            </p>
            {legend}
            <p>
                <strong>Čo hodnotíme?</strong> Zaujíma nás nielen dodržiavanie
                základných pravidiel financovania kampaní, ale aj ochota
                kandidátov sprístupniť verejnosti informácie nad rámec zákonných
                povinností. Sledujeme 18 indikátorov rozdelených do troch
                oblastí:
            </p>
            <ul className="arrows lh-lg">
                <li>
                    <strong>Transparentný účet (50 %)</strong> – existencia a
                    prehľadnosť účtu, identifikácia príjemcov platieb,
                    popisovanie a časové vykazovanie výdavkov
                </li>
                <li>
                    <strong>Financovanie kampane (30 %)</strong> –
                    transparentnosť predkampane, počet prispievateľov, závislosť
                    od veľkých darcov a informácie o vonkajšej reklame
                </li>
                <li>
                    <strong>Informovanosť o kampani (20 %)</strong> – volebný
                    web a program, informácie o politickej reklame a
                    spolupracovníkoch, komunikácia s voličmi či informovanie o
                    podujatiach
                </li>
            </ul>
            <p>
                Súčasťou hodnotenia sú aj dve penalizačné kritériá zamerané na
                neprehľadné financovanie cez viaceré účty a obchádzanie zákazu
                platenej politickej reklamy na online platformách. Výsledné
                percentuálne skóre vyjadruje mieru transparentnosti kampane,{' '}
                <strong>
                    nie celkové hodnotenie kandidáta, jeho programu či osobnej
                    integrity
                </strong>
                .
            </p>
            <p className="mb-4">
                Podrobnejšie výsledky jednotlivých kandidátov nájdete nižšie.
                Viac o zisteniach prináša naša{' '}
                <Link to={resources.pressRelease}>
                    <strong>tlačová správa</strong>
                </Link>{' '}
                a pravidlá hodnotenia vysvetľuje{' '}
                <Link to={resources.methodology}>
                    <strong>
                        Metodika hodnotenia transparentnosti kampaní 2026
                    </strong>
                </Link>
                .
            </p>
        </>
    ),
    [languages.en]: (
        <>
            <AlertWithIcon className="my-4" variant="primary">
                Press release (Slovak only):{' '}
                <Link to={resources.pressRelease}>
                    Len každá tretia kampaň v krajských mestách a župách je
                    transparentná
                </Link>
                .
            </AlertWithIcon>

            <p className="mt-4">
                Ahead of the 2026 municipal elections, Transparency
                International Slovakia presents an assessment of the
                transparency of{' '}
                <strong>
                    57 election campaigns of candidates for mayors of regional
                    cities, regional governors and mayors of the Bratislava
                    boroughs of Petržalka and Ružinov with over 50,000
                    inhabitants
                </strong>
                . We included candidates with campaign spending of at least
                3,000 euros and at least four relevant payment transactions (as
                of October 13, 2026). For smaller campaigns lacking data, the
                assessment could be distorted.
            </p>
            <p>
                <strong>
                    18 candidates run a transparent campaign, i.e. less than a
                    third of those assessed.
                </strong>{' '}
                Another 27 were rated as „Campaign with reservations“ and we
                marked 12 campaigns as non-transparent. For better clarity, we
                use a traffic light system: from a green transparent campaign,
                through an orange campaign with reservations, to a red
                non-transparent campaign.
            </p>
            {legend}
            <p>
                <strong>What do we assess?</strong> We are interested not only
                in compliance with the basic rules of campaign financing, but
                also in the willingness of candidates to make information
                available to the public beyond their legal obligations. We
                monitor 18 indicators divided into three areas:
            </p>
            <ul className="arrows lh-lg">
                <li>
                    <strong>Transparent account (50 %)</strong> – existence and
                    clarity of the account, identification of payment
                    recipients, description and timing of expenses
                </li>
                <li>
                    <strong>Campaign financing (30 %)</strong> – transparency of
                    the pre-campaign, number of contributors, dependence on
                    large donors and information on outdoor advertising
                </li>
                <li>
                    <strong>Campaign awareness (20 %)</strong> – election
                    website and programme, information on political advertising
                    and collaborators, communication with voters and information
                    about events
                </li>
            </ul>
            <p>
                The assessment also includes two penalty criteria focused on
                non-transparent financing through multiple accounts and
                circumventing the ban on paid political advertising on online
                platforms. The final percentage score expresses the degree of
                campaign transparency,{' '}
                <strong>
                    not an overall assessment of the candidate, their programme
                    or personal integrity
                </strong>
                .
            </p>
            <p className="mb-4">
                Detailed results for individual candidates can be found below.
                More about the findings can be found in our{' '}
                <Link to={resources.pressRelease}>
                    <strong>press release</strong>
                </Link>{' '}
                (Slovak only), and the assessment rules are explained in the{' '}
                <Link to={resources.methodology}>
                    <strong>
                        2026 campaign transparency assessment methodology
                    </strong>
                </Link>{' '}
                (Slovak only).
            </p>
        </>
    ),
};

function Analyses() {
    const { data, cmsData, isLoading, error } = useAnalysesList();

    setTitle(t(labels.analyses.pageTitle));

    let content;
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else if (!data.length) {
        content = (
            <AlertWithIcon className="my-4" variant="primary">
                {t(labels.analysis.noAnalyses)}
            </AlertWithIcon>
        );
    } else {
        const accordions = (cmsData?.regions ?? []).map((region) => {
            const regionItems = data.filter(
                (item) => item.cmsCandidate.region === region.code
            );
            const types = Object.values(municipalTypes)
                .map((type) => ({
                    type,
                    items: regionItems.filter(
                        (item) =>
                            !!item.cmsCandidate.isRegionalFunction ===
                            (type === municipalTypes.regional)
                    ),
                }))
                .filter(({ items }) => items.length);

            return (
                <Accordion.Item key={region.code} eventKey={region.code}>
                    <Accordion.Header>{region.name}</Accordion.Header>
                    <Accordion.Body>
                        {types.length
                            ? types.map(({ type, items }, index) => (
                                  <div key={type}>
                                      <h2 className={index ? 'my-3' : 'mb-3'}>
                                          {t(
                                              labels.elections.municipalTypes[
                                                  type
                                              ]
                                          )}
                                      </h2>
                                      {analysesList(items)}
                                  </div>
                              ))
                            : t(labels.analyses.noRegion)}
                    </Accordion.Body>
                </Accordion.Item>
            );
        });

        content = <Accordion className="mt-4">{accordions}</Accordion>;
    }

    return (
        <section>
            <Title>{t(labels.analyses.pageTitle)}</Title>

            <AnalysesFeatured />

            {introText[getCurrentLanguage()]}

            {content}
        </section>
    );
}

export default Analyses;
