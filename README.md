# Muchitsujo

Muchitsujo is a community platform for Indonesia's local idol scene — the chika idol
circuit, JKT48, and the small gigs and conventions around them. It collects the things
fans normally have to piece together from scattered Instagram stories: who the groups
are, who's in them, what they sound like, when and where the next event is, and what to
chant once you're there. It's built for fans who don't want to miss an event, and for
the community admins who keep that information current.

**Live demo:** https://ngidol-masrakus-projects.vercel.app

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL, hosted on Supabase |
| ORM | Prisma 6 |
| Auth | Custom JWT — `jsonwebtoken` + `bcrypt`, stored in an httpOnly cookie |
| Storage | Supabase Storage (idol, member and event images) |
| UI | Bootstrap 5 + React-Bootstrap |
| Hosting | Vercel |

> **On auth:** `next-auth` is present in `package.json` but the application does not use
> it. Sessions are issued and verified by the project's own routes under
> `src/app/api/auth/`. The only file importing `next-auth` is
> `src/components/SaveButton.jsx`, which is currently unused.

## Features

- **Idol database** — groups, their members, and their songs. Each group carries its
  social links; each member has a profile and Instagram/X handles; songs link out to
  Spotify.
- **Event schedule** — upcoming events with date (an event can span several days),
  time, venue, ticket price and source link, filterable by category.
- **Event archive** — past events kept browsable at `/user/arsip` instead of being
  deleted.
- **Chant guide** — chant and mix references at `/user/chant`, so newcomers can join in.
- **Gallery** — community photos on the landing page.
- **Per-user favourites** — signed-in users can favourite categories, idols and members,
  and save events to their own page.
- **Admin panel** — CRUD for idols and events at `/admin`, plus an import scanner that
  turns an event URL into a reviewable draft instead of manual data entry.
- **In-app notifications** — admin actions generate notifications surfaced in the UI.

> **Not yet implemented:** email notifications. The schema has an `EmailLog` model and
> per-user `emailNotifications` / `eventReminders` flags, but nothing sends mail yet —
> there is no mail transport in the project and `EmailLog` is never written to. Treat it
> as a planned feature.

## Running locally

### Prerequisites

- Node.js 18.17 or newer
- A PostgreSQL database (the project is built against Supabase Postgres)
- A Supabase project, for image storage

### 1. Install

```bash
git clone https://github.com/masraku/Ngidol.git
cd Ngidol
npm install
```

### 2. Environment variables

Create `.env` in the project root:

```bash
DATABASE_URL=        # Postgres connection string (pooled, port 6543 on Supabase)
DIRECT_URL=          # Postgres direct connection (port 5432) — used for migrations
JWT_SECRET=          # any long random string; signs the session cookie
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

And `.env.local` for the Supabase client:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server-side only, never expose to the browser
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

No real values are committed to this repository. `SUPABASE_SERVICE_ROLE_KEY` bypasses
row-level security — keep it out of client code and out of version control.

Prisma needs both `DATABASE_URL` and `DIRECT_URL`: the pooled connection is used at
runtime, the direct one for schema migrations.

If you point `next.config.mjs` at a different Supabase project, update the hostname in
`images.remotePatterns` or Next.js will refuse to optimise the images.

### 3. Database

```bash
npx prisma migrate deploy   # apply migrations to an existing database
# or, for a fresh local database:
npx prisma migrate dev

npm run db:seed             # populate it
```

The seed is idempotent — it upserts on stable keys, so running it more than once is
safe. See `prisma/seed.js` for what it loads and where that data came from.

### 4. Run

```bash
npm run dev
```

The app is served at http://localhost:3000, which redirects to `/user`.

## Project structure

```
prisma/
  schema.prisma          Data model: User, Admin, Idol, Member, Song, Event,
                         Category, Notification, EmailLog
  migrations/            Migration history
  seed.js                Idempotent seed data
script/
  generate-slug.js       One-off slug backfill utility
src/
  app/
    layout.js            Root layout, fonts, Bootstrap, AuthProvider
    api/                 Route handlers
      auth/              Register, login, logout, session, admin creation
      idol/              Idol list, detail, create
      event/             Event list, detail, archive, by-category
      category/
      user/              Profile, preferences, saved events
      admin/import/      Event import scanner
      notification/
    user/                Public-facing pages
      page.jsx           Landing page
      idol/              Idol list and detail
      event/             Event list and detail
      arsip/             Past events
      chant/             Chant guide
      categories/        Browse by category
      preferences/       Favourite categories, idols, members
      mypage/            Saved events and account
      auth/              Sign in and register
      about/
      context/           AuthContext — client-side session state
    admin/               Admin panel: idol and event CRUD, automation, settings
  components/            Shared React components
  lib/
    prisma.js            Prisma client singleton
    supabase.js          Supabase browser and server clients
    notification.js      Notification helper
    uploadImageToSupabase.js
    importScanner.js     Event URL scraping for the import feature
  data/chant.js          Static chant reference data
  style/                 Global CSS
public/assets/           Gallery and static images
```

## Notes

- `src/app/user/` is the public site; `src/app/admin/` is the admin panel. Both sit
  under the same Next.js app and share the Prisma client.
- `next.config.mjs` permanently redirects `/` to `/user`.
- Images are served from Supabase Storage, so `next.config.mjs` whitelists that
  hostname under `images.remotePatterns`.
