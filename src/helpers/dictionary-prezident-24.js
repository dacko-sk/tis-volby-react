import { elections as el } from './constants';
import {
    attributionKeys as oa,
    genderKeys as og,
    regionKeys as or,
} from './online';
import { getCurrentLanguage, languages } from './routes';
import {
    baseData as abd,
    metaData as amd,
    transparencyIndicators as ati,
    transparencyClasses as atc,
} from './wp';

export const labels = {
    account: {
        allTransactions: [
            'Zobraziť všetky transakcie',
            'Show all transactions',
        ],
        balance: ['Zostatok', 'Balance'],
        candidateSpending: [
            'Priebežné výdavky kandidáta',
            'Candidate spending',
        ],
        download: ['Stiahnuť ako CSV', 'Download as CSV'],
        expensesAmount: ['Počet výdavkov', 'Number of expenses'],
        finalReportDisclaimer: [
            'Súčet výdavkov všetkých kandidátov podľa záverečných správ.',
            'Sum of spendings of all candidates.',
        ],
        incomesAmount: ['Počet príjmov', 'Number of incomes'],
        info: ['Informácie o kampani', 'Campaign details'],
        noData: [
            'Neevidujeme transparentný účet kandidáta',
            'Transparent account of the candite is unknown',
        ],
        overview: [
            'Prehľad transakcií na transparentnom účte',
            'Transparent Account Transactions',
        ],
        title: ['Transparentné účty', 'Transparent accounts'],
        totalDisclaimer: [
            'Súčet výdavkov na transparentných účtoch všetkých kandidátov.',
            'Sum of spendings on accounts of all candidates.',
        ],
        totalSpending: [
            'Celkové výdavky kandidátov',
            'Total candidates spending',
        ],
    },
    ads: {
        amount: {
            candidateDisclaimer: [
                'Počet reklám kandidáta od 1. novembra 2023.',
                'Amount of candidate ads since November 1, 2023.',
            ],
            disclaimer: [
                'Počet reklám všetkých kandidátov od 1. novembra 2023.',
                'Amount of ads of all candidates since November 1, 2023.',
            ],
            title: ['Počet reklám', 'Amount of ads'],
        },
        google: {
            disclaimer: [
                'Politickú reklamu kandidátov, zverejnenú prostredníctvom služieb Google Ads a Google Display & Video 360, sledujeme vďaka údajom, ktoré publikuje spoločnosť Google v Centre transparentnosti reklám. Sumy sú uvedené vrátane DPH.',
                'Political ads of candidates published in Google Ads and Google Display & Video 360 platforms is monitored thanks to the data published by Google in Google Ads Transparency Center. Amounts are with VAT.',
            ],
            format: {
                disclaimer: [
                    'Podiel jednotlivých formátov Google reklamy na celkových výdavkoch.',
                    'Share of individual Google Ads formats in total expenses.',
                ],
                title: ['Formáty reklamy', 'Ad format'],
            },
            spending: {
                disclaimer: [
                    'Zobrazené sú len politické účty, ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 € od 1. novembra 2023.',
                    'We list only profiles whose spending on Google Ads and Google Display & Video 360 platforms exceeded 100 € since November 1, 2023.',
                ],
                title: [
                    'Kandidáti s výdavkami na reklamu nad 100 €',
                    'Candidates with advertising expenses exceeding 100 €',
                ],
            },
            title: ['Google'],
            totalDisclaimer: [
                'Súčet výdavkov politických účtov, ktoré prostredníctvom služieb Google Ads a Google Display & Video 360 uverejnili reklamy v hodnote nad 100 € od 1. novembra 2023.',
                'Sum of expenses of profiles whose spending on Google Ads and Google Display & Video 360 platforms exceeded 100 € since November 1, 2023.',
            ],
            totalCandidateDisclaimer: [
                'Súčet výdavkov kandidáta na politickú reklamu uverejnenú prostredníctvom služieb Google Ads a Google Display & Video 360 od 1. novembra 2023.',
                `Sum of candidate's advertising expenses on Google Ads and Google Display & Video 360 platforms exceeded 100 € since November 1, 2023.`,
            ],
            totalSpendingTitle: [
                'Výdavky na Google reklamu',
                'Advertising expenses in Google',
            ],
        },
        meta: {
            attribution: {
                allTitle: [
                    'Bilancia všetkých strán',
                    'Attribution by all parties',
                ],
                amount: ['Počet', 'Amount'],
                attrLabels: {
                    [oa.YES]: ['Správne označené', 'Correctly tagged'],
                    [oa.NO]: ['Neoznačené', 'Untagged'],
                    [oa['N/A']]: ['Nezistené', 'Unknown'],
                },
                campaign: ['Kampaň', 'Campaign'],
                disclaimer: [
                    'Povinné označenie objednávateľa a dodávateľa podľa zákona o volebnej kampani od oficiálneho začiatku kampane 9. januára 2024. Za správne označenú reklamu vyhodnocujeme statusy, v TEXTE ktorých je uvedený objednávateľ a dodávateľ reklamy. Statusy bez textu vyhodnocujeme ako "Nezistené".',
                    'Mandatory attribution of customer & supplier since the beginning of campaign on January 9, 2024. We evaluate status as correctly labeled if it contains "objednávateľ" and "dodávateľ" words in the TEXT. Statuses with no text are evaluated as "not detected"',
                ],
                pctTitle: [
                    'Rebríček správnosti označovania',
                    'Chart of attribution correctness',
                ],
                pctDisclaimer: [
                    'Podiel správne označených reklám podľa zákona o volebnej kampani od oficiálneho začiatku kampane 9. januára 2024. Za správne označenú reklamu vyhodnocujeme statusy, v TEXTE ktorých je uvedený objednávateľ a dodávateľ reklamy. Statusy bez textu vyhodnocujeme ako "Nezistené".',
                    'Share of correctly labeled ads since the beginning of campaign on January 9, 2024. We evaluate status as correctly labeled if it contains "objednávateľ" and "dodávateľ" words in the TEXT. Statuses with no text are evaluated as "not detected"',
                ],
                precampaign: ['Predkampaň', 'Precampaign'],
                title: [
                    'Označenie objednávateľa a dodávateľa',
                    'Attribution of customer and supplier',
                ],
            },
            demography: {
                ages: ['Vekové skupiny', 'Age groups'],
                agesDisclaimer: [
                    'Podiel zásahu reklám vo vekových skupinách obyvateľstva od 1. novembra 2023.',
                    'Distribution of ads impressions between age groups since November 1, 2023.',
                ],
                genders: ['Pohlavia', 'Genders'],
                gendersDisclaimer: [
                    'Podiel zásahu reklám medzi pohlaviami od 1. novembra 2023.',
                    'Distribution of ads impressions between genders since November 1, 2023.',
                ],
                genderLabels: {
                    [og.female]: ['Ženy', 'Females'],
                    [og.male]: ['Muži', 'Males'],
                    [og.unknown]: ['Nezistené', 'Unknown'],
                },
                title: [
                    'Demografické rozloženie reklamy',
                    'Ads demographic distribution',
                ],
            },
            disclaimer: [
                'Politickú reklamu strán a ich politikov na sociálnych sieťach Facebook a Instagram sledujeme vďaka údajom, ktoré publikuje spoločnosť Meta v knižnici Meta Ad Library. Sumy sú uvedené vrátane DPH.',
                'Political ads of parties and their politicians published on Facebook and Instagram platforms is monitored thanks to the data published by Meta in Meta Ad Library. Amounts are with VAT.',
            ],
            ranges: {
                accountsTitle: [
                    'Najviac inzerujúce profily od začiatku predkampane',
                    'Profiles with highest advertising expenses range since the beginning of precampaign',
                ],
                disclaimer: [
                    'Meta uvádza výdavky za reklamu v 100-eurových intervaloch, preto nie je možné urciť presnú sumu. Zobrazujeme celý interval a odhad výdavkov, ktorý je súčtom stredov intervalov všetkých reklám daného profilu zobrazovaných od 1. novembra 2023.',
                    'Meta publishes advertising expenses in 100-eur intervals, therefore it is not possible to determine the exact amount. We show the whole interval and expenses estimate, which is the sum of middles of expenses intervals of all ads of the profile since November 1, 2023.',
                ],
                estimate: ['Odhadované výdavky', 'Estimated expenses'],
                range: ['Skutočný rozsah výdavkov', 'Real expenses interval'],
            },
            regions: {
                allDisclaimer: [
                    'Podiel zásahu online reklamy všetkých strán v krajoch Slovenska od 1. novembra 2023. Pre podrobnejšiu analýzu cielenia strán na regióny vzhľadom na veľkosť krajov, kliknite na názov profilu.',
                    'Distribution of ads impressions of all parties between regions of Slovakia since November 1, 2023. Click the profile name for detailed analysis of party targeting on regions based on their sizes.',
                ],
                diffAvg: [
                    'Odchýlka od priemerného zásahu kandidáta v SR',
                    'Deviation from average impressions in Slovakia',
                ],
                diffAvgDisclaimer: [
                    'Odchýlka zásahu reklamy na jedného obyvateľa kraja od priemerného zásahu kandidáta v celej SR.',
                    'Difference between impression per one citizen and average impressions in Slovakia',
                ],
                disclaimer: [
                    'Podiel zásahu online reklamy v krajoch Slovenska od 1. novembra 2023. Vnútorný graf zobrazuje veľkosti krajov podľa počtu obyvateľov.',
                    'Distribution of ads impressions between regions of Slovakia since November 1, 2023. The inner chart shows sizes of regions based on number of citizens.',
                ],
                label: ['Podiel zásahu reklám', 'Distribution of impressions'],
                regionLabels: {
                    [or.BA]: ['Bratislavský kraj', 'Bratislava region'],
                    [or.BB]: ['Banskobystrický kraj', 'Banská Bystrica region'],
                    [or.KE]: ['Košický kraj', 'Košice region'],
                    [or.NR]: ['Nitriansky kraj', 'Nitra region'],
                    [or.PO]: ['Prešovský kraj', 'Prešov region'],
                    [or.TN]: ['Trenčiansky kraj', 'Trenčín region'],
                    [or.TT]: ['Trnavský kraj', 'Trnava region'],
                    [or.ZA]: ['Žilinský kraj', 'Žilina region'],
                },
                sizeLabel: [
                    'Podiel populácie SR žijúcej v tomto kraji',
                    'Share of citizens living in this region',
                ],
                title: [
                    'Regionálne rozloženie reklamy',
                    'Regional distribution of ads',
                ],
            },
            spending: {
                accountsTitle: [
                    'Profily s týždennými výdavkami na reklamu nad 100 €',
                    'Profiles with weekly advertising expenses exceeding 100 €',
                ],
                disclaimer: [
                    'Zobrazené sú len profily, ktorých výdavky od 1. novembra 2023 alebo týždňové výdavky od začiatku kampane 9. januára 2024 presiahli 100 €.',
                    'Includes Meta profiles whose advertising expenses from November 1, 2023 or weekly expenses from the beginning of campaign on January 9, 2024 exceeded 100 €',
                ],
                label: [
                    'Týždňové výdavky na reklamu',
                    'Weekly advertising expenses',
                ],
            },
            title: ['Meta'],
            totalDisclaimer: [
                'Súčet výdavkov na politickú reklamu na sociálnych sieťach platformy Meta. Započítane sú všetky profily, ktorých výdavky od 1. novembra 2023 alebo týždňové výdavky od začiatku kampane 9. januára 2024 presiahli 100 €.',
                'Sum of advertising expenses on social networks of Meta. Includes Meta profiles whose advertising expenses from November 1, 2023 or weekly expenses from the beginning of campaign on January 9, 2024 exceeded 100 €',
            ],
            totalCandidateDisclaimer: [
                'Súčet výdavkov na politickú reklamu na sociálnych sieťach platformy Meta. Započítane sú všetky profily kandidáta, ktorých výdavky od 1. novembra 2023 alebo týždňové výdavky od začiatku kampane 9. januára 2024 presiahli 100 €.',
                'Sum of advertising expenses on social networks of Meta. Includes Meta profiles of the candidate whose advertising expenses from November 1, 2023 or weekly expenses from the beginning of campaign on January 9, 2024 exceeded 100 €',
            ],
            totalSpendingTitle: [
                'Výdavky na Meta reklamu',
                'Advertising expenses in Meta',
            ],
        },
        noAccounts: [
            'Hľadanému výrazu nezodpovedá žiaden online účet.',
            'No online account matches the search query',
        ],
        noData: [
            'Neevidujeme žiaden účet kandidáta s výdavkami na sponzorované príspevky na tejto platforme.',
            'We did not find any profiles of the candidate with sponsored ads on this platform.',
        ],
        pageTitle: ['Online kampane', 'Online campaigns'],
        percent: ['Podiel', 'Share'],
        showMore: [
            'Zistiť viac o online kampani',
            'Learn more about Online Campaigns',
        ],
        topDisclaimer: [
            'Zobrazení sú len kandidáti, ktorých týždenné výdavky na online reklamu na platformách Meta alebo Google presahujú 100 €.',
            'Includes candidates whose weekly advertising expenses on Meta or Google platforms are higher than 100 €.',
        ],
        topTitle: ['Top 10 online kampaní', 'Top 10 online campaigns'],
    },
    all: ['Zobraziť všetko', 'Show all'],
    analyses: {
        navTitle: ['Hodnotenia', 'Assessments'],
        pageTitle: [
            'Hodnotenie transparentnosti kampaní',
            'Assessment of campaigns transparency',
        ],
        top: ['%i hodnotených kampaní', '%i evaluated campaigns'],
        showAll: ['Zobraziť všetky hodnotenia', 'Show all assessments'],
    },
    analysis: {
        [abd.date]: ['Hodnotenie ku dňu', 'Evaluation date'],
        [abd.score]: ['Celkové hodnotenie', 'Assessment'],
        [amd.fb]: ['FB profil', 'FB profile'],
        [amd.web]: ['Volebný web', 'Elections web'],
        badges: [
            ['nezistené/netýka sa', 'áno', 'čiastočne', 'nie'],
            ['N/A', 'yes', 'partially', 'no'],
        ],
        disclaimer: [
            'Do hodnotenia transparentnosti prezidentských kandidátov bolo zaradených šesť kampaní, ktorých celkové výdavky ku dňu hodnotenia (12.3.) prekročili minimálnu hranicu 20-tisíc eur. Kampane zvyšných piatich kandidátov nebolo možné kvôli ich nízkej intenzite adekvátne zhodnotiť a porovnať.',
            'We evaluated 6 campaigns whose total expenses by the date of evaluation (March 12th) exceeded € 20,000. We were not able to evaluate campaigns of the remaining 5 candidates properly due to low intensity.',
        ],
        history: ['História hodnotení', 'Assessments history'],
        indicators: {
            [ati.account]: [
                {
                    name: [
                        'Označovanie platiteľov a príjemcov',
                        'Marking of Payers and Recipients',
                    ],
                    desc: [
                        'Na transparentnom účte sú precízne označené vklady kandidáta a príjemcovia platieb, vďaka čomu je možné identifikovať komu kandidát za kampaň platí.',
                        `The candidate's transparent account clearly indicates the originators and beneficiaries of payments, allowing for easy identification of who the candidate is paying for the campaign.`,
                    ],
                },
                {
                    name: ['Podrobnosť účtu', 'Account Details'],
                    desc: [
                        'Transparentnosť kampane nie je znižovaná využívaním veľkých súhrnných platieb (jednotlivá platba v objeme 10% aktuálnych výdavkov), najčastejšie pre agentúry, ktoré predstavujú značnú časť výdavkov v kampani.',
                        'Campaign transparency is not reduced by the use of aggregate payments, most often directed to agencies that account for a significant portion of campaign spending.',
                    ],
                },
                {
                    name: ['Popisovanie výdavkov', 'Description of Expenses'],
                    desc: [
                        'Predvolebná kampaň kandidáta je kontrolovateľná vďaka zrozumiteľným a výstižným popisom, ktoré vysvetľujú účel jednotlivých platieb.',
                        `The candidate's election campaign is easily traceable due to clear and concise descriptions accompanying individual payments.`,
                    ],
                },
                {
                    name: [
                        'Časová reálnosť výdavkov',
                        'Time Reality of Expenses',
                    ],
                    desc: [
                        'Výdavky na transparentom účte zodpovedajú reálnemu priebehu predvolebnej kampane. Kandidát sa vyhýba väčším zálohovým platbám, či využívaniu faktúr s dlhou dobou splatnosti viac ako jeden mesiac.',
                        'Expenditures on the transparent account correspond to the actual progression of the election campaign. The candidate avoids making substantial advance payments or using invoices with extended maturity periods.',
                    ],
                },
                {
                    name: [
                        'Identifikácia outdoorovej kampane',
                        'Identification of the Outdoor Campaign',
                    ],
                    desc: [
                        'Na transparentnom účte je možné identifikovať výdavky na outdoorovú kampaň kandidáta, minimálne v rozsahu mesačných výdavkov na tento typ reklamy.',
                        `The transparent account enables the identification of expenses related to the candidate's outdoor campaign, at least within the monthly expense range for this type of advertising.`,
                    ],
                },
            ],
            [ati.financing]: [
                {
                    name: [
                        'Informovanie o financovaní kampane',
                        'Information about Campaign Financing',
                    ],
                    desc: [
                        'Darcovia sú prehľadne identifikovateľní prostredníctvom transparentného účtu kandidáta. V prípade straníckych darov sú donori v priebehu kampane identifikovateľní na webovej stránke politickej strany.',
                        `The candidate's donors and creditors are readily identifiable through a transparent account and the party's official website.`,
                    ],
                },
                {
                    name: ['Miera diverzifikácie kampane', 'Campaign dversity'],
                    desc: [
                        'Množstvo identifikovateľných darcov, na ktorých je kampaň kandidáta postavená.',
                        'The regular election campaign relies on diverse funding sources, including activating supporters through small donations.',
                    ],
                },
                {
                    name: [
                        'Závislosť od veľkých darcov',
                        'Dependence on major donors',
                    ],
                    desc: [
                        'Miera závislosti kampane od veľkých identifikovateľných darcov (dary nad 10-tisíc eur).',
                        'Dependence on major donors (donations above 10,000 EUR).',
                    ],
                },
                {
                    name: [
                        'Informovanie o predkampani',
                        'Information about the Pre-Campaign',
                    ],
                    desc: [
                        'Transparentnosť kampane kandidát zvýšil dobrovoľným využívaním transparentného účtu už v čase predkampane.',
                        'The candidate enhances campaign transparency by voluntarily utilizing a transparent account during the pre-campaign period.',
                    ],
                },
                {
                    name: ['Plán kampane', 'Campaign Plan'],
                    desc: [
                        'Kandidát proaktívne informoval o plánovanej výške kampane a spôsobe jej financovania, prípadne na vyžiadanie poskytol tieto informácie',
                        'The candidate adopts a proactive approach, openly sharing information about the planned campaign budget and its financing methods. Alternatively, this information is promptly provided upon request.',
                    ],
                },
            ],
            [ati.information]: [
                {
                    name: ['Volebný program', 'Election Program'],
                    desc: [
                        'Kandidát v čase oficiálnej kampane zverejnil svoj program.',
                        'The candidate published its election program at the onset of the official campaign.',
                    ],
                },
                {
                    name: ['Predvolebné akcie', 'Election Campaign Events'],
                    desc: [
                        'Kandidát v priebehu oficiálnej kampane poskytuje informácie o svojich predvolebných akciách, najmä na webovej stránke alebo sociálnej sieti.',
                        `Throughout the official campaign period, the candidate consistently provided updates about its pre-election initiatives, featuring these updates on its official website and social media channels.`,
                    ],
                },
                {
                    name: ['Označovanie inzercie', 'Marking of Advertising'],
                    desc: [
                        'Kandidát v zmysle zákona označuje precízne politickú inzerciu na sociálnej sieti, bilboardoch a v tlači doplnením informácie o objednávateľovi a dodávateľovi reklamy.',
                        'In full compliance with the law, the candidate meticulously marked all political advertising on social media platforms. This was achieved by including comprehensive information about the advertiser and the supplier.',
                    ],
                },
                {
                    name: [
                        'Komunikácia s voličmi',
                        'Communication with Voters',
                    ],
                    desc: [
                        'Mystery test responzívnosti kandidáta a jeho tímu. Občianska otázka cez e-mail: "Vzhľadom na to, že som nenašla harmonogram podujatí v rámci prezidentskej kampane by som sa rada opýtala, či budete mať v najbližšej dobe, pred voľbami, nejaké osobné stretnutie s občanmi, v Bratislave, kde by bola možnosť bližšie spoznať Vás a Váš predvolebný program." Občianska otázka cez FB: "Dobrý deň, rada by som sa opýtala, či v prípade zvolenia v prezidentských voľbách budete mať vyhradený pravidelný termín na stretávanie sa s občanmi?"',
                        `Mystery test of candidate's response to potential Voters questions.`,
                    ],
                },
                {
                    name: [
                        'Majetkové priznanie kandidáta',
                        'Asset Declaration of the candidate',
                    ],
                    desc: [
                        'Kandidát na vyžiadanie Transparency vyplnil rozšírené majetkové priznanie a súhlasil s jeho zverejnením.',
                        `In response to Transparency's request, the candidate completed an extended asset declaration and consented to its public disclosure.`,
                    ],
                },
            ],
        },
        indicatorTitles: {
            [ati.account]: ['Transparentný účet', 'Transparent Account'],
            [ati.financing]: ['Financovanie kampane', 'Campaign Financing'],
            [ati.information]: [
                'Informovanosť o kampani',
                'Campaign Awareness',
            ],
        },
        meta: ['Údaje o kampani', 'Campaign details'],
        methodology: ['Metodika hodnotenia', 'Methodology'],
        navTitle: ['Hodnotenie', 'Assessment'],
        noAnalyses: [
            'Sekcia sa pripravuje. Hodnotenia kampaní budeme zverejňovať postupne.',
            'Section is being prepared',
        ],
        noAssets: [
            'Nie sú dostupné majetkové priznania kandidáta.',
            'No asset declarations available for this candidate',
        ],
        noData: [
            'Nie je dostupné hodnotenie kampane kandidáta.',
            'Campaign assessment for this candidate is not available.',
        ],
        references: ['Referencie', 'References'],
        transparency: {
            [atc.good]: ['transparentná kampaň', 'Transparent campaign'],
            [atc.average]: ['kampaň s výhradami', 'Campaign with reservations'],
            [atc.bad]: ['netransparentná kampaň', 'Non-transparent campaign'],
            [atc.unknown]: [
                'nedostatok dát / nehodnotené',
                'Lack of data / not evaluated',
            ],
        },
        transparencyShort: {
            [atc.good]: ['transparentná', 'Transparent'],
            [atc.average]: ['s výhradami', 'With reservations'],
            [atc.bad]: ['netransparentná', 'Non-transparent'],
            [atc.unknown]: ['N/A'],
        },
    },
    candidates: {
        assets: ['Majetkové priznania', 'Assets'],
        campaign: ['Informácie o kampani', 'Campaign details'],
        info: [
            ['kandidát odstúpil', 'postúpil do 2. kola', 'víťaz volieb'],
            [
                'candidate resigned',
                'advanced to the 2nd round',
                'elections winner',
            ],
        ],
        funding: ['Účet', 'Account'],
        monitoring: [
            'Monitorujeme týchto kandidátov',
            'We monitor the following candidates',
        ],
        navTitle: ['Kandidáti', 'Candidates'],
        noResults: [
            'Hľadanému výrazu nezodpovedá žiaden kandidát.',
            'No candidate matches the search query.',
        ],
        overview: ['Prehľad', 'Overview'],
    },
    charts: {
        amount: ['Suma', 'Amount'],
        campaign: ['Kampaň', 'Campaign'],
        disclaimer: [
            'Grafy obsahujú dáta z transparentných účtov, očistené o vrátené platby.',
            'Graphs contains data from transparent accounts net of return payments.',
        ],
        disclaimerClick: [
            'Po kliknutí na meno kandidáta sa rozbalia podrobnosti.',
            'Click the candidate name for details.',
        ],
        finalReport: {
            disclaimer: [
                'Grafy obsahujú dáta zo záverečných správ kandidátov.',
                'Graphs contains data from candidates final reports.',
            ],
            title: [
                'Top 10 kampaní podľa záverečných správ',
                'Top 10 campaigns by final reports',
            ],
        },
        incoming: ['Príjmy', 'Incomes'],
        outgoing: ['Výdavky', 'Expenses'],
        precampaign: ['Predkampaň', 'Precampaign'],
        sum: ['Spolu', 'Total'],
        top10: [
            'Top 10 kampaní podľa výdavkov a príjmov',
            'Top 10 campaigns by incomes and spendings',
        ],
        uniqueDonors: ['Počet unikátnych darcov', 'Number of unique donors'],
        updated: ['Naposledy aktualizované', 'Last updated on'],
    },
    contact: ['Kontakt', 'Contact'],
    cookies: {
        accept: ['Prijať všetky', 'Accept all'],
        about: [
            'Táto webová stránka používa cookies, aby vám priniesla čo najlepší online zážitok.',
            'This website uses cookies to bring you the best online experience.',
        ],
        optional: ['Voliteľné cookies', 'Optional Cookies'],
        reject: ['Odmietnuť všetky', 'Reject all'],
        selected: ['Potvrdiť výber', 'Accept selected'],
        settings: ['Nastavenia cookies', 'Cookies settings'],
        types: {
            analytics: ['Analytické cookies', 'Analytics'],
            functional: ['Funkčné cookies', 'Functional'],
            necessary: ['Nevyhnutné cookies', 'Necessary'],
        },
    },
    donate: {
        buttonShort: ['Darujte', 'Donate'],
        buttonLong: [
            'Darujte na kontrolu volieb',
            'Donate for elections monitoring',
        ],
        modalTitle: [
            'Nenechajme voľby bez kontroly!',
            `Don't let the elections without watch!`,
        ],
        modalText: [
            'Darujte už od 20 €, aby sme ustrážili férovosť volieb.\nĎakujeme.',
            'Donate from 20 € to support elections transparency.\nThank you.',
        ],
    },
    download: ['Stiahnuť', 'Download'],
    elections: {
        [el.p19]: ['Prezidentské\nvoľby 2019', 'President\nelections 2019'],
        [el.n20]: ['Parlamentné\nvoľby 2020', 'Parliamentary\nelections 2020'],
        [el.s22]: ['Samosprávne\nvoľby 2022', 'Municipal\nelections 2022'],
        [el.n23]: ['Parlamentné\nvoľby 2023', 'Parliamentary\nelections 2023'],
        [el.e24]: ['Európske\nvoľby 2024', 'European\nelections 2024'],
        [el.p24]: ['Prezidentské\nvoľby 2024', 'President\nelections 2024'],
        account: ['Transparentný účet', 'Transparent account'],
        date: ['Dátum konania 2. kola volieb', 'Date of elections 2nd round'],
        over: ['Voľby sa skončili', 'Elections ended'],
        timeTillstart: [
            'Zostávajúci čas do 2. kola volieb',
            'Countdown to elections 2nd round start',
        ],
        timeTillend: [
            'Zostávajúci čas do konca volieb',
            'Time to elections end',
        ],
        title: ['Voľby', 'Elections'],
    },
    errors: {
        loading: [
            'Chyba pri načítaní dát. Prosím načítajte stránku znovu.',
            'Data loading error. Please reload the page.',
        ],
    },
    fbFeed: [
        'Pre zobrazenie facebook vlákna je potrebné prijať ukladanie Funkčných cookies v Nastaveniach cookies',
        'Please accept Functional Cookies in Cookies Settings in order to show Facebook feed',
    ],
    followUs: ['Sledujte nás', 'Follow us'],
    home: {
        navTitle: ['Prezident 2024', 'President 2024'],
        pageTitle: ['Prezidentské\nvoľby 2024', 'President\nelections 2024'],
    },
    learnMore: ['Zistiť viac', 'Learn more'],
    lastUpdate: ['Naposledy aktualizované', 'Last updated on'],
    news: {
        latest: ['Najnovšie aktuality', 'Latest News (Slovak only)'],
        navTitle: ['Aktuality', 'News'],
        noData: ['Neboli nájdené žiadne články.', 'No articles found.'],
        pageTitle: ['Aktuality', 'News\n(Slovak only)'],
    },
    newsletter: {
        title: ['Newsletter'],
        subscribe: ['Prihlásiť sa na newsletter', 'Subscribe to Newsletter'],
    },
    online: {
        navTitle: ['Online'],
    },
    privacy: ['Ochrana súkromia', 'Privacy Policy'],
    readMore: ['Čítať ďalej…', 'Read more…'],
    root: ['Monitoring volieb', 'Elections Monitoring'],
    tis: [
        'Transparency International Slovensko',
        'Transparency International Slovakia',
    ],
    search: {
        label: ['Vyhľadávanie', 'Search'],
        results: [
            'Výsledky vyhľadávania výrazu',
            'Search results for the query',
        ],
    },
    showMore: ['Zobraziť viac', 'Show more'],
    sites: {
        root: ['Financovanie\npolitiky', 'Political\nfinance'],
        european: ['Európske\nvoľby', 'European\nelections'],
        national: ['Parlamentné\nvoľby', 'Parliament\nelections'],
        president: ['Prezidentské\nvoľby', 'President\nelections'],
        regional: ['Samosprávne\nvoľby', 'Municipal\nelections'],
    },
    sitesTitle: [
        'Ktorú oblasť politiky chcete preskúmať?',
        'Which political topic are you interested in?',
    ],
    sponsors: ['Donori projektu', 'Project donors'],
    supportTis: ['Podporte Transparency', 'Support Transparency'],
    usefulInfo: ['Užitočné informácie', 'Useful information'],
    webDev: ['Webové riešenie', 'Web development'],
};

export const t = (label, replacements) => {
    let tl = label;
    if (Array.isArray(label)) {
        tl = label[0] ?? '';
        if (getCurrentLanguage() === languages.en) {
            tl = label[1] ?? tl;
        }
    } else if (labels[label] ?? false) {
        return t(labels[label], replacements);
    }
    if (Array.isArray(replacements)) {
        // Use a regular expression to match placeholders (%s or %i)
        tl = tl.replace(/%[dfis]/g, (match) => {
            // Replace %s with the next string from the array
            // Return the placeholder if no replacement is available
            return replacements.length > 0 ? replacements.shift() : match;
        });
    }
    return tl;
};
