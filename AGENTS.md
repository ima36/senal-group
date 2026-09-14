# AGENTS.md — senal-group

Notes for whoever (or whatever) works on this repo next. Read this before
changing dependencies, the routing layout, or anything under `src/app`.

---

## What this project is

`senalgroup.com` — the parent-company site for Senal Group. It used to be a
sub-route (`/senal-group`) inside the Senal Sky project; it was split out into
its own project on its own domain. Its two siblings are separate repos:

- **senal-sky** — travel & tourism, `senalsky.com`, purple/mauve brand
- **senal-site** — construction, `senalsite.com`, orange brand
- **senal-sea** — import & export. **No site yet.** Anything that links to it
  must handle "no URL" as a first-class state, not as an empty string.

Senal Group's own palette is **charcoal + gold**. There are no purple or orange
tokens in this project and none should be added — borrowing Sky's mauve is the
exact thing the client flagged.

---

## Stack and version pins

| Package                 | Version   | Why pinned                                                    |
| ----------------------- | --------- | ------------------------------------------------------------- |
| `next`                  | `15.4.11` | **Payload 3.88's peer range excludes Next 15.5.x.** Do not "upgrade". |
| `payload`               | `3.88.0`  | Matched across every `@payloadcms/*` package.                  |
| `@payloadcms/*`         | `3.88.0`  | db-postgres, next, plugin-seo, richtext-lexical, storage-vercel-blob, ui. All must move together. |
| `typescript`            | `5.9.3`   | Exact.                                                         |
| `eslint-config-next`    | `15.4.11` | Tracks `next`.                                                 |
| `sharp`                 | `0.34.2`  | Exact — Payload's image pipeline.                              |

React 19, Tailwind 3.4, SCSS via `sass`.

There is deliberately **no** `@tanstack/react-query`, `zustand`, `sonner` or
`embla-carousel` here, unlike senal-sky: nothing on this site needs client-side
data fetching, a store, toasts or a carousel. Do not add them back "for
consistency".

---

## Gotchas hit while building this

### 1. `robots.ts` must be at the root of `app/`, not in a route group

Next matches `sitemap.ts` at any depth but anchors robots to the app root
(`^[\\/]robots…` in `next/dist/lib/metadata/is-metadata-route.js`). A
`src/app/(frontend)/robots.ts` compiles fine, produces no warning, registers no
route, and `/robots.txt` 404s. It lives at `src/app/robots.ts`.
`src/app/(frontend)/sitemap.ts` in the group is fine and does work.

### 2. There is no root layout, and a root `not-found.tsx` is therefore rejected

`(frontend)/layout.tsx` and `(payload)/layout.tsx` each render their own
`<html>`. Adding `src/app/not-found.tsx` fails the build with *"not-found.tsx
doesn't have a root layout"*. The site's 404 for unmatched URLs is served by the
catch-all `src/app/(frontend)/[...notFound]/page.tsx`, which calls `notFound()`
and lands in `(frontend)/not-found.tsx` with the full header and footer. Real
routes beat a catch-all on specificity, so `/admin`, `/api/*`, `/terms` and
`/privacy` are unaffected — but if you add a route group at the root, re-check
this.

### 3. The build must pass with no database

There is no Postgres in CI. Every Payload read is wrapped and returns a safe
default:

- `src/lib/api/site-settings.actions.ts` → `FALLBACK_CONTENT`
- `src/lib/api/companies.actions.ts` → `[]`, and the page then falls back to
  `src/lib/content/fallback-companies.ts` so the three companies are never
  missing
- `src/lib/api/legal.actions.ts` → `null` / `[]`

`getPayload()` itself rejects when the database is unreachable, so the try/catch
has to wrap the client call too, not just the query. Payload's pino logger still
prints the connection error and `pg` emits an `unhandledRejection: undefined`
during the build — both are noise from a caught failure, not a build error.

Never introduce a page that hard-fails without a database. Either keep the
fetcher's fallback or mark the route `dynamic = 'force-dynamic'`.

### 4. The fetchers are **not** Server Actions

`src/lib/api/*.actions.ts` keep the `.actions.ts` name from the sibling project
but use `import 'server-only'` and React `cache()` rather than `'use server'`.
Nothing calls them from the client, so a Server Action endpoint per function is
pure overhead — and `'use server'` forbids the non-async exports and the
`cache()` wrapper that dedupe the layout's and the page's identical reads.

### 5. Contact details are fetched once, in the layout

`(frontend)/layout.tsx` reads them and passes them to `ContactProvider`. In the
version this was ported from, the header, footer and contact form each ran their
own `useQuery` for the same global under three different query keys
(`"homeData"`, `"home-data"`, `"home"`), so every page paid for three round
trips. Do not reintroduce a client fetch for contact details.

### 6. Payload CLI works without a database

`npm run generate:importmap` and `npm run generate:types` both read the config
only. Run them after every schema change; `payload-types.ts` is committed.

### 7. `payload-types.ts` contains `any`

It is Payload's generated output (`children: { type: any }` in the rich-text
shape). Application code is `any`-free and `tsc --noEmit` passes; do not hand-edit
the generated file to "fix" it — it will be overwritten.

### 8. `⚠ Compiled with warnings` is Sass, and is not ours

A clean build prints `⚠ Compiled with warnings` with no detail. The warnings are
all the same one, from Next's own bundled sass-loader:

```
Module Warning (from ./node_modules/next/dist/compiled/sass-loader/cjs.js):
Deprecation The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
```

Nothing in `globals.scss` triggers it and nothing in this repo can silence it —
it is fixed by a Next version we cannot take (see the pin table). A warm webpack
cache skips sass-loader, so the line comes and goes between builds. If you ever
need to see what a warning actually says, Next swallows the body: add a
`webpack` hook in `next.config.ts` that taps `compiler.hooks.done` and logs
`stats.compilation.warnings`, then take it out again.

### 9. `scripts/` has its own `.env` loader

Node's `--env-file` is rejected inside `NODE_OPTIONS`, and `dotenv` is not a
dependency, so `scripts/load-env.ts` parses `.env` directly. **Import it first**
in any script — `payload.config.ts` reads `process.env` at module scope, and ESM
evaluates imports in source order.

---

## Layout of the source

```
src/
  app/
    robots.ts                     ← root-only, see gotcha 1
    (frontend)/
      layout.tsx                  ← <html>, fonts, providers, JSON-LD
      page.tsx                    ← generateMetadata + the home page
      sitemap.ts
      not-found.tsx               ← in-site 404 (used by /terms, /privacy)
      [...notFound]/page.tsx      ← catch-all → not-found.tsx, see gotcha 2
      terms/page.tsx              ← 404s when the CMS field is empty
      privacy/page.tsx
      home/
        HomePage.tsx              ← server; composes the five sections
        _features/components/
          HeroSection.tsx         ← server
          HeroMedia.tsx           ← client island (IntersectionObserver)
          AboutSenal.tsx          ← server
          OurCompanies.tsx        ← server, CMS-driven
          MessageFromCeo.tsx      ← server
          GetInTouch.tsx          ← client island (the form)
    (payload)/                    ← generated admin + REST/GraphQL routes
  collections/   Users, Media, Companies
  globals/       SiteSettings
  lib/
    api/         the three fetchers
    content/     defaults.ts (all default copy), images.ts (alt text),
                 fallback-companies.ts
    payload/     client, fields, map, revalidate
    components/  common/*, ui/*
    site.config.ts
    styles/globals.scss + Font/
  assets/icons/  SenalWordmark + the small icon set
scripts/         seed.ts, load-env.ts
```

### Client islands — the whole list

`Header`, `HeroMedia`, `GetInTouch`, `NavigationLink`, `ClientLoadingWrapper`,
`NavigationProvider`, `ContactProvider`, `BackButton`, `LoadingPage`. Everything
else is a server component and its content is in the first HTML response. Keep
it that way: this is a marketing site whose entire job is to be read by people
and crawlers.

---

## House rules

- **One `<h1>` per page**, no skipped levels. The hero's `<h1>` holds the
  wordmark plus a `sr-only` span carrying the text.
- **`priority` on exactly one image per page** — the hero. `ImageCheck` defaults
  it to `false` for this reason.
- **Every image needs real alt text.** Media requires it in the CMS; the
  fallbacks in `/public` have theirs written in `src/lib/content/images.ts`,
  from what is actually in each frame.
- **Gold is not a text colour on white.** `#C9A227` is ~3.1:1 on white — rules,
  icons, accents and large headings only; body copy is charcoal (~15.9:1). Gold
  on charcoal is ~7.2:1 and fine for text.
- **Every animation must have a `prefers-reduced-motion` off-switch.** The
  `@media (prefers-reduced-motion: reduce)` block in `globals.scss` covers the
  ken-burns drift, the loader shine and the scroll cue.
- **No dead links.** A missing URL renders a state, not an `href` to nowhere:
  `whatsappLink()` returns `null` rather than `wa.me/undefined`, and a company
  with no site gets *Website coming soon*.
- **No `alert()` for validation.** Inline messages, `aria-invalid`,
  `aria-describedby`, and focus moved to the first bad field.

## The default copy lives in one place

`src/lib/content/defaults.ts` is imported by three consumers that would
otherwise drift: the Payload field `defaultValue`s, `scripts/seed.ts`, and the
runtime fallbacks in `lib/api`. Change the copy there, not in a component.

The CEO's message in particular is the client's own words, supplied verbatim.
Do not paraphrase it, and keep the paragraph breaks — one array row each.
