# Senal Group — senalgroup.com

The parent-company site for Senal Group, holding company of **Senal Sky**
(travel & tourism), **Senal Site** (construction) and **Senal Sea**
(import & export).

Next.js 15 (App Router) + Payload CMS 3 on Postgres, with media on Vercel Blob.
The whole site is one page plus two legal pages; everything on it is editable in
the admin panel at `/admin`.

---

## Requirements

- Node **22** (anything ≥ 20.9 works; the lockfile was produced on 22)
- A Postgres database — Neon is what this is set up for
- A Vercel Blob store, for production media

---

## First-time setup

### 1. Install

```bash
npm install
```

### 2. Create the database (Neon)

1. Create a project at <https://neon.tech>.
2. Copy the **pooled** connection string — the host contains `-pooler`. The
   unpooled one runs out of connections under serverless load.
3. It looks like:
   `postgresql://user:password@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`

### 3. Environment

```bash
cp .env.example .env
```

Fill in:

| Variable                       | What it is                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `DATABASE_URI`                 | The Neon **pooled** connection string.                                                        |
| `PAYLOAD_SECRET`               | Any long random string: `openssl rand -base64 32`. Changing it logs every admin user out.     |
| `NEXT_PUBLIC_SITE_URL`         | `https://senalgroup.com`. Drives canonical URLs, the sitemap, robots.txt and JSON-LD.         |
| `NEXT_PUBLIC_SENAL_SKY_URL`    | `https://senalsky.com` — the Senal Sky card and the footer link.                               |
| `NEXT_PUBLIC_SENAL_SITE_URL`   | `https://senalsite.com` — the Senal Site card and the footer link.                             |
| `BLOB_READ_WRITE_TOKEN`        | Vercel Blob token. **Leave blank locally** — Payload falls back to disk storage.               |
| `NEXT_PUBLIC_BLOB_HOSTNAME`    | Only if your Blob host is not `*.public.blob.vercel-storage.com`.                              |

### 4. Generate Payload's artefacts

Run these after any change to a collection, a global or the config:

```bash
npm run generate:importmap   # writes src/app/(payload)/admin/importMap.js
npm run generate:types       # writes src/payload-types.ts
```

Neither needs a database.

### 5. Create the tables and the first admin user

```bash
npm run dev
```

Payload pushes the schema to an empty database on first boot. Then open
<http://localhost:3000/admin> — the first visit shows a **create first user**
form. Fill it in; that account is the owner's login.

> There is no separate "create admin" command. The first user is created through
> that form, and after it exists the route becomes a normal login.

### 6. Seed the content

```bash
npm run seed
```

This writes:

- **Site Settings & Contact** — hero, About copy, mission and vision, the CEO's
  message, and the SEO defaults.
- **Companies** — Senal Sky, Senal Site and Senal Sea, in that order, with
  Sky and Site linked to their live sites and Sea left without a URL so its card
  shows *Website coming soon*.
- The photographs from `/public/images` are uploaded into Media with alt text.

It is safe to re-run: companies are matched on `slug` and updated in place, and
an image already in Media is not uploaded twice. Nothing is ever deleted.

Set `SEED_CONTACT_EMAIL` before running it if you want a real address written in;
otherwise it writes `info@senalgroup.com` and the rest of the contact block is
left for the owner to fill in at **Site Settings & Contact → Contact**.

### 7. Vercel Blob (production media)

1. In the Vercel project → **Storage** → create a **Blob** store.
2. Copy the `BLOB_READ_WRITE_TOKEN` into the project's environment variables.
3. Redeploy.

With the token set, Payload uploads new media to Blob; without it, it writes to
local disk. Media uploaded before the token was set stays on disk, so set it
before the owner starts uploading.

---

## Everyday commands

| Command                     | What it does                                       |
| --------------------------- | -------------------------------------------------- |
| `npm run dev`               | Dev server on :3000, admin at `/admin`             |
| `npm run build`             | Production build                                   |
| `npm start`                 | Serve the production build                         |
| `npm run typecheck`         | `tsc --noEmit`                                     |
| `npm run lint`              | ESLint                                             |
| `npm run generate:types`    | Regenerate `src/payload-types.ts`                  |
| `npm run generate:importmap`| Regenerate the admin import map                    |
| `npm run seed`              | (Re-)seed content and companies                    |

---

## What the owner can edit

Everything at `/admin`:

**Site Settings & Contact** (a single global, six tabs)

- **Hero** — heading, tagline, background photograph, button label
- **About** — heading, paragraphs, the four-image collage, mission, vision
- **CEO Message** — heading, the message (one row per paragraph), name, title,
  and an optional photograph. Leave the photograph empty and the page draws a
  designed placeholder; upload one and it is used instead.
- **Contact** — email, two phone numbers, address, opening hours. Read by the
  footer, the Get In Touch form and the structured data.
- **Legal** — Terms & Conditions and Privacy Policy. **Leave one empty and its
  page returns 404 and disappears from the footer**, which is deliberate: an
  empty legal page is worse than no legal page.
- **SEO** — meta title, meta description, share image.

**Companies** — the cards under *Our Companies*. Add, remove or reorder them
(the `Order` field in the sidebar). A company with no `externalUrl` renders
*Website coming soon* instead of a dead button, which is how Senal Sea is set up
until its site exists.

Saving anything in the admin revalidates the affected pages automatically.

---

## Deploying to Vercel

1. Import the repository.
2. Set every variable from `.env.example` in **Settings → Environment
   Variables** (Production and Preview).
3. Build command `npm run build`, output "Next.js" — the defaults are correct.
4. Point `senalgroup.com` at the project.

The build does not need the database to be reachable: every CMS read has a safe
fallback. It does need `DATABASE_URI` at *runtime*.
