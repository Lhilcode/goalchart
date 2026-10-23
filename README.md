# Goal Chart

A public, mobile-friendly monthly goals-and-assists leaderboard built with React, Vite, and Supabase. Visitors can view and share the chart without an account. One authorized Supabase Auth user can add players, update records, and remove entries. Month-keyed records preserve previous months while the public chart automatically switches to the current month.
## Local development

1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the Supabase values described below.
## Supabase setup

1. Create a Supabase project. Add the single chart administrator in **Authentication > Users** and keep public sign-ups disabled.
2. Copy that user's Auth UID. Replace `REPLACE-WITH-ADMIN-AUTH-UUID` in `supabase-setup.sql` with the UID, then run the SQL in Supabase's SQL Editor. It creates the table, public read access, admin-only write policies, and starter records for the setup month.
3. Put the project URL, anon/public key, and same admin Auth UID into local `.env`:

	```env
	VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
	VITE_SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-KEY
	VITE_ADMIN_USER_ID=YOUR-ADMIN-AUTH-USER-UUID
	```
The browser anon key is expected to be public. Never use a Supabase `service_role` key in this app. Row-level security in `supabase-setup.sql` is the security boundary; the client-side UID check only hides editing controls from other users.

## Deploy to Vercel

1. Import this repository into Vercel. Vercel detects Vite; the build command is `npm run build` and the output directory is `dist` (also specified in `vercel.json`).
2. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_ADMIN_USER_ID` under **Project Settings > Environment Variables** for the environments you deploy.
3. Deploy or redeploy after setting the variables. They are embedded into the client build, so changing them requires a new deployment.

## Monthly records

The app reads and writes only the current local calendar month using a `YYYY-MM` key. At the start of a new month, it switches to that month's records without deleting older records. Starter players are inserted for the month in which the SQL setup is first run.
# Goal Chart

Public monthly goals-and-assists leaderboard backed by Supabase. The public page is read-only; one explicitly authorized Supabase Auth user can add players and update or remove monthly records. Each record is keyed to `YYYY-MM`, so a new month starts with an empty chart while prior months remain in the database.

## Supabase setup

1. Create a Supabase project and add one admin user in **Authentication > Users**. Keep public sign-ups disabled.
2. Copy the user's **Auth UID**. In `supabase-setup.sql`, replace `REPLACE-WITH-ADMIN-AUTH-UUID` with that UID and run the SQL in Supabase's SQL Editor. It creates the table, public read access, admin-only write policies, and the original starter players for the current month.
3. In `index.html`, replace `https://YOUR-PROJECT.supabase.co`, `YOUR-SUPABASE-ANON-KEY`, and `YOUR-ADMIN-USER-UUID` with the project URL, anon/public key, and the same Auth UID.
4. Host the page on a static web host with HTTPS. Visitors can view and share it without an account. The admin signs in with the Supabase Auth user.

The anon key is intended for browser use. Never put a Supabase `service_role` key in this page. Row-level security enforces access; the client-side admin UID check only controls whether editing controls are displayed.

## Monthly behavior

The page reads and writes only the current local calendar month. At the next month, it automatically switches to a new `month_key`; previous records remain stored. Starter records are inserted for the month when the setup SQL is first run.
