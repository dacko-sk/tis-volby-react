import { transparencyIndicators as ati } from './wp';

export const labels = {
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
    search: {
        results: ['Výsledky vyhľadávania výrazu', 'Search results for'],
        municipalities: ['Samosprávy', 'Municipalities'],
        noMunicipality: [
            'Hľadanému výrazu nezodpovedá žiadna samospráva.',
            'No municipality found for the given term.',
        ],
        candidates: ['Kandidáti', 'Candidates'],
        noCandidate: [
            'Hľadanému výrazu nezodpovedá žiaden kandidát.',
            'No candidate found for the given term.',
        ],
        news: ['Aktuality', 'News'],
        noNews: [
            'Hľadaný výraz nebol nájdený v žiadnej z aktualít.',
            'The searched term was not found in any of the news.',
        ],
    },
    type: ['Typ volieb', 'Type of elections'],
};
