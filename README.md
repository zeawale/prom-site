<div align="center">

# prom-site 🧩

### Corporate Website · 1C Partner in Nizhny Novgorod

*every word on the site is editable in the CMS — no redeploy, no rebuild*

![Next.js](https://img.shields.io/badge/Next.js_16-1e1e2e?style=for-the-badge&logo=nextdotjs&logoColor=a6e3a1)
![React](https://img.shields.io/badge/React_19-1e1e2e?style=for-the-badge&logo=react&logoColor=a6e3a1)
![TypeScript](https://img.shields.io/badge/TypeScript-1e1e2e?style=for-the-badge&logo=typescript&logoColor=a6e3a1)
![Payload CMS](https://img.shields.io/badge/Payload_CMS_3-1e1e2e?style=for-the-badge&logo=payloadcms&logoColor=a6e3a1)
![SQLite](https://img.shields.io/badge/SQLite-1e1e2e?style=for-the-badge&logo=sqlite&logoColor=a6e3a1)
![Vitest](https://img.shields.io/badge/Vitest-1e1e2e?style=for-the-badge&logo=vitest&logoColor=a6e3a1)
![pnpm](https://img.shields.io/badge/pnpm-1e1e2e?style=for-the-badge&logo=pnpm&logoColor=a6e3a1)

[![Figma](https://img.shields.io/badge/Figma_Design-1e1e2e?style=for-the-badge&logo=figma&logoColor=a6e3a1)](https://www.figma.com/design/MhQUztZQARwwwbrzVjKCNX/)

</div>

---

## 📋 about

A redesign and full rebuild of the corporate website for **NPP PRO-M** — an official 1C partner that sells and supports 1C software and cloud services for small businesses. It replaces the company's old WordPress site and is built from scratch.

My first commercial project, done solo: the Figma design, the data model and the code are all mine.

The main requirement from the client: **all text content is managed in the admin panel** without touching the code or redeploying.

<!-- Add a screenshot or GIF here -->
<!-- ![demo](link-to-screenshot) -->

## ✨ features

- 🗂️ Catalog of **61 services** in 10 categories — instant in-memory search, sidebar with counters, "popular" and "new" flags
- 🪟 Service popup with its own URL: opens over the catalog, works with the back button, and the same address renders as a standalone page for search engines
- 📝 Lead form with a separate, unticked consent checkbox — every lead stores the consent time, IP and policy version
- 🍪 Cookie banner with three categories and versioned consent — the Yandex map loads only after the visitor allows it
- ✏️ Everything is editable: pages, tariffs, FAQ, reviews, legal documents, contacts — with on-demand cache revalidation on save
- 🧱 Schema changes go through migrations only, no auto-push
- 🔁 301 redirects from the old WordPress URLs and 410 for removed sections — one hop to the canonical address
- 🗺️ `sitemap.xml`, `robots.txt`, a custom 404 and per-page metadata generated from the database
- 📱 Responsive: desktop, tablet (≤ 1199px) and phone (≤ 767px)
- ♿ One `<h1>` per page, a visible focus outline, tab order that follows the layout

## 🧭 pages

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About the company |
| `/services`, `/services/[category]` | 1C services catalog |
| `/services/[category]/[slug]` | Service page × 61 |
| `/fresh`, `/grm`, `/its` | Product pages: 1C:Fresh, 1C:GRM, 1C:ITS |
| `/programs/[slug]` | 1C programs × 7 |
| `/contacts` | Contacts and office map |
| `/privacy`, `/cookie`, `/consent` | Legal documents |
| `/admin` | Payload admin panel |

## 🛠️ tech stack

- **Framework:** Next.js 16 (App Router) + React 19
- **CMS:** Payload CMS 3, embedded in the same Next.js app
- **Database:** SQLite via the Payload Drizzle adapter
- **Language:** TypeScript
- **Styles:** CSS Modules + design tokens exported from Figma
- **Font & icons:** self-hosted Montserrat, Material Symbols via Iconify — nothing loads from a CDN
- **Tests:** Playwright (e2e) + Vitest (integration)
- **Tooling:** ESLint 9, Prettier, pnpm

## 🗃️ project structure

```
src/
  app/
    (frontend)/      pages, layout, tokens.css
    (payload)/       admin panel and API routes
  collections/       Services, Categories, Programs, Reviews, Leads, LegalPages, Media, Users
  globals/           Home, About, Contacts, Fresh, GRM, ITS, Settings, CookieBanner…
  components/        UI by section: layout, home, catalog, product, about, contacts, cookie
  lib/               queries, revalidation, cookie consent, legacy redirects
  migrations/        database schema history
  seed/              content seeds
  proxy.ts           canonical host, 301 and 410
tests/
  e2e/               Playwright
  int/               Vitest
```

## 🚀 getting started

Requires Node.js 20.9+ and pnpm.

```bash
git clone https://github.com/zeawale/prom-site.git
cd prom-site

cp .env.example .env
# set PAYLOAD_SECRET in .env

pnpm install
pnpm migrate
```

Fill the database. The order matters — `pnpm seed` goes first, the rest link to the catalog it creates:

```bash
pnpm seed
pnpm seed:programs
pnpm seed:its
pnpm seed:fresh
pnpm seed:grm
pnpm seed:legal
pnpm seed:home
pnpm seed:reviews
pnpm seed:pages
pnpm seed:cookie
```

```bash
pnpm dev
```

The site runs at `http://localhost:3000`, the admin panel at `http://localhost:3000/admin` — the first visit asks to create an admin user.

## 📜 scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build — the only step that type-checks |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm test:e2e` | Playwright end-to-end tests |
| `pnpm test:int` | Vitest integration tests |
| `pnpm migrate` | Apply database migrations |
| `pnpm migrate:create <name>` | Generate a migration from schema changes |
| `pnpm generate:types` | Regenerate `payload-types.ts` |

## 🧪 tests

97 end-to-end tests: a smoke run over every route (status, console errors, a single `<h1>`), the lead form, the cookie banner, the catalog popup and search, redirects, 404, sitemap and robots.

```bash
pnpm test:e2e --workers=1
```

> Against the dev server, run with one worker: parallel runs are flaky.

---

<div align="center">
<sub>Commercial project · design & development by zeawale · 2026</sub>
</div>
