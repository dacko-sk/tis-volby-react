# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

React SPA for [volby.transparency.sk](https://volby.transparency.sk/) — election campaign and political party funding monitoring, built for Transparency International Slovakia. One codebase serves a landing site plus five election "subsites" (`euro2024`, `prezident2024`, `parlament2023`, `samosprava2026`, `samosprava2022`), each with its own routes, dictionary and styling, switched at runtime by URL path.

## Commands

```bash
npm start   # webpack-dev-server, mode development, http://localhost:3000
npm run build   # production build to build/
```

There is no configured lint or test script in `package.json`. ESLint config (`eslint.config.mjs`, flat config) and Prettier config (`.prettierrc`) exist but must be invoked directly, e.g. `npx eslint src` / `npx prettier --check src`. There is no test runner set up — `test.js` and `test-aggr.js` at the repo root are one-off Node scripts for ad-hoc CSV/data analysis (e.g. `node test.js`), not an automated test suite.

## Environment

Webpack merges `.env`, `.env.<mode>`, `.env.local`, `.env.<mode>.local` (later overrides earlier) and only forwards variables prefixed `DHC_` into the bundle as `process.env.DHC_*` (see `webpack.config.mjs`). Known vars: `DHC_TYPO3_API_DOMAIN` (TYPO3/CMS API base URL) and `DHC_MAPBOX_TOKEN`.

## Architecture

### Multi-subsite routing

`src/App.jsx` is the single source of routing truth for every subsite. Routes aren't declared with JSX per-page; each subsite section builds a `[path, PageComponent, subpages?]` array (calling helpers from `src/helpers/routes.js`, e.g. `routes.party()`, `segments.NEWS`) and maps it into `<Route>` elements, for both `sk` and `en` languages (`src/helpers/languages.js`). `setSubsiteOverride()` is called before building each section's route array so `helpers/routes.js` and `helpers/languages.js` know which subsite's URL prefix/segment labels to use while resolving paths, then reset to `null`. `samosprava2022` is the exception — Slovak-only, plain static `<Route>` JSX, no language loop.

`getActiveSubsite(pathname)` (in `helpers/languages.js`) derives the current subsite from the URL prefix at render time (`/euro2024`, `/prezident2024`, etc.; no prefix = landing). `Layout.jsx` uses it to set a `subsite-*` CSS class on the root wrapper, which is how subsite-specific SCSS theming is scoped.

### Data sources — no backend API of its own

The app has three independent data-fetching layers, wired up as context providers in `src/ContextProviders.jsx` (order matters — `AccountsData` and `AdsData` wrap `GovData`):

- **Static CSVs** (`public/csv/**`, `public/<subsite>/csv/**`), parsed client-side with `react-papaparse`. `src/hooks/AccountsData.jsx`, `src/hooks/GovData.jsx`, `src/hooks/AdsData.jsx` load these via `require.context` (all files in a folder pulled in at build time) and expose the parsed/aggregated data through React context + hooks (`useGovData()`, etc.).
- **CMS (TYPO3) API**, fetched with `@tanstack/react-query` in `src/hooks/CmsQueries.jsx` / `src/hooks/Queries.jsx` against `DHC_TYPO3_API_DOMAIN`. `cmsSubsitesMap` translates internal subsite keys to CMS subsite keys where they differ (e.g. `samosprava2026` → `s-26`). WordPress-flavored content (news/analyses posts) is rendered through `src/components/wp/templates/*` from data shaped like WP REST API output.
- **Cookies/consent** via `src/hooks/Cookies.jsx`.

When adding a data-driven feature, check whether the numbers belong in a CSV (funding/financial data, mostly static per election) or the CMS (editorial content, candidate profiles, news) before building a new fetch path.

### i18n / labels

`src/helpers/dictionary.js` deep-merges per-subsite dictionaries (`dictionary-landing.js`, `dictionary-euro-24.js`, `dictionary-prezident-24.js`, `dictionary-23.js`, `dictionary-municipal.js`) into one `labels` tree, then builds a reverse path index so `t(labels.some.nested.key)` can resolve a label object back to its dotted path. Subsites can override a shared key with a more specific translation — check the relevant `dictionary-*.js` file, not just `dictionary.js`, when a label looks wrong for one subsite only.

### Page structure convention

Under `src/pages/<subsite>/`, list/detail pages that have tabs (e.g. a Party or Candidate profile with Overview/News/Donations/Assets tabs) follow a parent + sub-page split: a parent page component (e.g. `Party.jsx`) renders shared chrome and an `<Outlet>`, and per-tab content lives in a `party/` (or `candidate/`) subfolder (e.g. `pages/euro2024/party/PartyOverview.jsx`). This mirrors the nested route arrays in `App.jsx`.

### Styling

SCSS under `src/scss/`, entry point `volby-landing.scss` imported once in `App.jsx`. Bootstrap 5 + `react-bootstrap` for base components; subsite theming is applied via the `subsite-*` class set on the layout root (see Routing section above) rather than per-subsite stylesheets.
