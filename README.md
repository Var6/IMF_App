# IMF Partner Portal

A full-stack Next.js application for an insurance brokerage (modelled on
[citizenimf.com](https://citizenimf.com)). Partners register, get verified by an
admin, submit insurance policies from India's leading insurers, and earn
**reward coins** (non-monetary reward points) when policies are created.

## Features

### Partner side
- **Landing page** with a **Partner Registration Portal**.
- **Registration** capturing mandatory KYC (Aadhaar, PAN, **selfie**, mobile,
  email, name), **bank account details** (account number, IFSC, bank), address,
  and **optional** 10th / 12th marksheets.
- On submit, a **verification wait screen** — login only works once an admin
  approves the account.
- **Login** (blocked until verified).
- **Dashboard** with a top nav bar (name, avatar, coin balance, logout):
  - **Services** — Health, Life, Car, Two-wheeler, Travel, Personal Accident,
    Home, Shop, Marine.
  - Opening a category (e.g. **Life Insurance**) lists all **insurer partners**
    (LIC, Max Life, Bajaj, Tata AIA, ICICI Pru, PNB MetLife, …).
  - **Create policy** — a full proposal form (proposer, nominee, sum assured,
    premium, term, premium-paying term, documents) sent to the admin.
  - **My Requests** — track every submission with a **chat** thread per request.
  - **Profile** — coin balance and a full **earnings / coin history** ledger.

### Admin side (separate login at `/admin/login`)
- **Dashboard** with statistics: partner counts, submissions by status, coins
  issued, **top earners**, **most active partners**, policies by category.
- **Partners** — verify / reject registrations, **reset a partner's password**,
  view KYC documents, and **increase / decrease** a partner's coins (logged).
- **Submissions** — review each request, **chat** with the partner, and
  **create the policy**. Before a policy can be marked *created*, the admin
  **must assign a coin reward** — which is credited to the partner instantly and
  shown in their history. The partner then sees a *"Policy created
  successfully"* banner.

## Tech stack
- **Next.js 16** (App Router, TypeScript, React 19)
- **Tailwind CSS v4**
- **MongoDB** via Mongoose
- **Cloudflare R2** (S3-compatible) for image / document uploads
- **jose** (JWT sessions in httpOnly cookies) + **bcryptjs**

## Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env.local` and fill in the values:
```bash
cp .env.example .env.local
```
- `MONGODB_URI` — a MongoDB connection string (local or Atlas).
- `JWT_SECRET` — a long random string.
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` —
  your Cloudflare R2 credentials (needed for uploads).
- `R2_PUBLIC_URL` — optional; if the bucket is public, files load directly,
  otherwise they are served through an authenticated presigned-URL proxy.

### 3. Create the first admin
```bash
npm run seed
```
This creates an admin from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000

- Partner registration: `/register`
- Partner login: `/login`
- Admin login: `/admin/login`

## Coins, not currency
Rewards are tracked as **coins / reward points**, never as currency. Admins
credit or debit coins; every change is recorded in a ledger the partner can see.

## Project structure
```
app/
  page.tsx                     Landing page
  register/                    Partner registration portal
  login/  pending/             Partner login + verification wait screen
  dashboard/                   Partner area (services, requests, profile)
  admin/login/                 Admin login
  admin/(console)/             Admin area (dashboard, partners, submissions)
  api/                         Route handlers (auth, upload, policies, admin)
components/                    Shared UI (nav, chat, uploader, cards…)
lib/                           db, auth, r2, catalog, validation, helpers
models/                        Mongoose models
scripts/seed.ts               First-admin seeder
```
