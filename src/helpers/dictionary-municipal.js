import { transparencyIndicators as ati } from './wp';

export const labels = {
    campaignDonorsLink: [
        'Zoznam darcov kampane Rande s demokraciou',
        'List of Rande s demokraciou campaign donors',
    ],
    campaignDonorsPage: {
        title: [
            'Darcovia a darkyne kampane Rande s demokraciou',
            'Donors of the Rande s demokraciou campaign',
        ],
        intro: [
            'Podstránka „Samosprávne voľby 2026” vznikla aj vďaka podpore 117 darcov a darkýň v rámci kampane Rande s demokraciou. Mená niektorých uvádzame so súhlasom nižšie. Všetkým za podporu ďakujeme!',
            'The "Municipal Elections 2026" section was also made possible thanks to 117 donors within the Rande s demokraciou campaign. Below we list the names of some of them, with their consent. We thank everyone for their support!',
        ],
    },
    analysis: {
        indicators22: {
            [ati.account]: [
                {
                    name: ['Existencia samostatného účtu'],
                    desc: [''],
                },
                {
                    name: ['Oznamovacia povinnosť'],
                    desc: [''],
                },
                {
                    name: ['Označovanie platcov a príjemcov'],
                    desc: [''],
                },
                {
                    name: ['Podrobnosť účtu'],
                    desc: [''],
                },
                {
                    name: ['Popisovanie výdavkov'],
                    desc: [''],
                },
                {
                    name: ['Časová reálnosť výdavkov'],
                    desc: [''],
                },
            ],
            [ati.financing]: [
                {
                    name: ['Viaczdrojovosť'],
                    desc: [''],
                },
                {
                    name: ['Nezávislosť od veľkých darov'],
                    desc: [''],
                },
                {
                    name: ['Informovanie o predkampani'],
                    desc: [''],
                },
                {
                    name: ['Plán kampane'],
                    desc: [''],
                },
            ],
            [ati.information]: [
                {
                    name: ['Existencia webu'],
                    desc: [''],
                },
                {
                    name: ['Volebný program'],
                    desc: [''],
                },
                {
                    name: ['Responzívnosť uvedeného kontaktu'],
                    desc: [''],
                },
                {
                    name: ['Kampaňový tím / spolupracujúce agentúry'],
                    desc: [''],
                },
                {
                    name: ['Predvolebné akcie'],
                    desc: [''],
                },
                {
                    name: ['Označovanie inzercie'],
                    desc: [''],
                },
            ],
        },
    },
    campaigns: {
        all: [
            'Výdavky a príjmy všetkých kandidátov',
            'Income and spending of all candidates',
        ],
        allDonors: [
            'Počet unikátnych darcov na kandidáta',
            'Number of unique donors per candidate',
        ],
    },
    candidate: {
        disclaimerCandidate: [
            'Kandidát(ka), ktorý(á) na financovanie kampane využíva stranícky účet, viacero účtov alebo účet nemá a vizualizáciu príjmov a výdavkov preto nie je možné zobraziť.',
            'A candidate who uses a party account, multiple accounts, or does not have an account for campaign financing, and therefore their income and spending visualization cannot be displayed.',
        ],
        disclaimerParties: [
            'Zoznam ďalších kandidátov, ktorí na financovanie kampaní využívajú stranícke účty, viacero účtov alebo účty nemajú a vizualizáciu ich príjmov a výdavkov preto nie je možné zobraziť. Podrobnosti nájdete po rozkliknutí mena kandidáta. Kandidátov postupne dopĺňame.',
            "List of other candidates who use party accounts, multiple accounts, or do not have accounts for campaign financing, and therefore their income and spending visualization cannot be displayed. Details can be found by clicking on the candidate's name. Candidates are being added gradually.",
        ],
        region: ['Kraj', 'Region'],
        balance: ['Bilancia', 'Balance'],
        name: ['Meno', 'Name'],
        numIncoming: ['Počet príjmov', 'Number of incomes'],
        numOutgoing: ['Počet výdavkov', 'Number of expenses'],
        partyAccount: ['Stranícky účet', 'Party account'],
        partyAccounts: ['Stranícke účty', 'Party accounts'],
        supportingParties: ['Podpora strán', 'Party support'],
    },
    charts: {
        title: ['Grafy', 'Charts'],
        unknownRegion: ['Nezistený', 'Unknown'],
        regionsTitle: [
            'Výdavky a príjmy podľa krajov',
            'Income and spending by region',
        ],
        regionsSubtitle: [
            'Kumulatívne hodnoty za župné aj miestne voľby.',
            'Cumulative values for regional and local elections.',
        ],
        partiesTitle: ['Stranícke kampane', 'Party campaigns'],
        candidatesTitle: [
            'Výdavky a príjmy jednotlivých kandidátov',
            'Income and spending of individual candidates',
        ],
        showAll: ['Zobraziť všetkých', 'Show all'],
        top10DonorsTitle: [
            'Top 10 kandidátov s najvyšším počtom unikátnych darcov',
            'Top 10 candidates with the highest number of unique donors',
        ],
        Top10SpendingTitle: [
            'Top 10 kampaní kandidátov na primátorov a županov podľa výdavkov a príjmov',
            'Top 10 campaigns of mayoral and regional candidates by spending and income',
        ],
        weeklySpendingTitle: [
            'Vývoj výdavkov na kampaň',
            'Campaign spending development',
        ],
        weeklySpendingSeries: [
            'Výdavky kandidátov a strán spolu',
            'Total candidate and party spending',
        ],
        weeklySpendingPreviousElections: ['Voľby 2022', '2022 elections'],
        allCampaignsTitle: [
            'Výdavky a príjmy všetkých kandidátov',
            'Income and spending of all candidates',
        ],
        allDonorsTitle: [
            'Počet unikátnych darcov na kandidáta',
            'Number of unique donors per candidate',
        ],
        partyCandidatesTitle: [
            'Kandidáti bez transparentného účtu a stranícki kandidáti',
            'Candidates without transparent accounts and party candidates',
        ],
        campaignsPageTitle: [
            'Zoznam všetkých kandidátov',
            'List of all candidates',
        ],
        showAllCandidates: [
            'Zobraziť všetkých kandidátov',
            'Show all candidates',
        ],
        showMoreCandidatesRegion: [
            'Zobraziť ďalších kandidátov v kraji',
            'Show more candidates in the region',
        ],
    },
    municipality: ['Samospráva', 'Municipality'],
    news: {
        latest: ['Najnovšie aktuality', 'Latest news'],
        title: ['Aktuality', 'News'],
    },
    party: {
        supportedCandidates: ['Podporení kandidáti', 'Supported Candidates'],
    },
    regionRaces: {
        heroTitle: ['Hlavné súboje v kraji', 'Main races in the region'],
        regionalRace: ['Voľby predsedu kraja', 'Regional governor election'],
        cityRace: ['Krajské mesto', 'Regional capital'],
        otherRaces: [
            'Súboje v ďalších samosprávach',
            'Races in other municipalities',
        ],
        municipalityDetail: ['Detail samosprávy', 'Municipality detail'],
        incumbent: {
            regional: ['Úradujúci župan', 'Incumbent governor'],
            city: ['Úradujúci primátor', 'Incumbent mayor'],
            local: ['Úradujúci starosta / primátor', 'Incumbent mayor'],
        },
        challengers: ['Vyzývatelia', 'Challengers'],
        candidates: ['Kandidáti', 'Candidates'],
        noChallengers: [
            'Úradujúci kandidát nemá v týchto voľbách vyzývateľov.',
            'The incumbent has no challengers in these elections.',
        ],
        spending: [
            'Aktuálna veľkosť výdavkov v kampani',
            'Current campaign spending',
        ],
        onPartyAccounts: ['na straníckych účtoch', 'on party accounts'],
        campaignRating: ['Hodnotenie kampane', 'Campaign rating'],
        comingSoon: ['Pripravujeme', 'Coming soon'],
        selfGovRating: [
            'Hodnotenie transparentnosti samosprávy',
            'Municipality transparency rating',
        ],
        ranking: ['%d. miesto z %d', 'rank %d of %d'],
        notRated: ['Nehodnotené', 'Not rated'],
        supportingParties: ['Podpora strán', 'Party support'],
        ownAccount: [
            'Transparentný účet kandidáta',
            "Candidate's transparent account",
        ],
        partyAccounts: ['Stranícke účty *', 'Party accounts *'],
        noAccount: ['bez transparentného účtu', 'no transparent account'],
        disclaimer: [
            '* Pri kandidátoch, ktorých kampaň je financovaná zo straníckych účtov, zobrazujeme sumu výdavkov na straníckych účtoch, z ktorých sú financovaní aj ďalší kandidáti podporení týmito stranami.  Nie je možné jednoznačne určiť, aká časť tejto sumy prislúcha konkrétnemu kandidátovi. Pre podrobnú analýzu transakcií na straníckom účte, kliknite na názov strany.',
            '* For candidates whose campaign is financed from party accounts, we show the total spending of those party accounts, which also finance other candidates supported by these parties. It is not possible to determine which part of this amount belongs to a specific candidate. For a detailed analysis of party account transactions, click the party name.',
        ],
        previous: ['Predchádzajúca samospráva', 'Previous municipality'],
        next: ['Nasledujúca samospráva', 'Next municipality'],
    },
    search: {
        results: ['Výsledky vyhľadávania výrazu', 'Search results for'],
        municipalities: ['Samosprávy', 'Municipalities'],
        noMunicipality: [
            'Hľadaný výraz sa nenachádza v názvoch samospráv.',
            'The searched term was not found in any municipality names.',
        ],
        candidates: ['Kandidáti', 'Candidates'],
        noCandidate: [
            'Hľadaný výraz sa nenachádza v menách kandidátov.',
            'The searched term was not found in any candidate names.',
        ],
        parties: ['Strany a koalície', 'Parties and coalitions'],
        noParty: [
            'Hľadaný výraz sa nenachádza v názvoch strán.',
            'The searched term was not found in any party names.',
        ],
        news: ['Aktuality', 'News (Slovak only)'],
        noNews: [
            'Hľadaný výraz sa nenachádza v žiadnej z aktualít.',
            'The searched term was not found in any of the news.',
        ],
    },
    type: ['Typ volieb', 'Type of elections'],
};
