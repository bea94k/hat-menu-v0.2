# Hat Menu Frontend

## Environment
Create `hat-menu/.env`:

```bash
VITE_SUPABASE_URL=<from Supabase dashboard>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<from Supabase dashboard>
```

## Run locally

```bash
npm install
npm run dev
```

## Authentication
- Auth method: email/password via Supabase Auth.
- All app routes are protected; unauthenticated users are redirected to `/sign-in`.
- Auth-only pages (`/sign-in`, `/sign-up`) redirect authenticated users to `/`.
- Unknown routes redirect to `/`.

## Local auth URL configuration
This app uses Vite's default local origin: `http://localhost:5173`.

In `hat-menu/supabase/config.toml`, keep:

```toml
[auth]
site_url = "http://localhost:5173"
additional_redirect_urls = [
  "http://localhost:5173",
  "http://localhost:5173/sign-in",
  "http://localhost:5173/sign-up"
]
```

If you run on a different local port, update these URLs to match your Vite origin.

## Supabase dashboard setup
- In Supabase, enable **Email** provider under Authentication.
- In Authentication URL settings, include local URLs above and your production URL(s).
- Keep using only publishable/anon key in frontend; never expose `service_role` in client code.

## Supabase DB migrations

- The migration files are in `/src/supabase/migrations`.
- To create new migrations, use the prompt [/.github/prompts/supabase-create-migration.md](/.github/prompts/supabase-create-migration.md)

- So far migrations have been run through CLI against the remote DB.

### Running migrations

Make sure you have the supabase CLI tool installed. Run the commands in `/hat-menu` directory.

When running migrations for the first time, follow all steps.

When running migrations after initial auth and linking, **steps 3 and 4 are enough**.

1. `supabase login` -> authenticate CLI
2. `supabase link --project-ref YOUR_PROJECT_REF` -> connect local project to remote Supabase project
3. `supabase migration list` -> show local vs remote status (what has not been run against remote yet)
4. `supabase db push` -> apply **all** pending migrations from /migrations to the remote DB
5. (optional) `supabase migration list` again -> confirm that the migrations you wanted were run
6. `npm run update-types` -> update TS types. It uses double quotes, so **run linting** in the file.

## PWA / Service workers

PWA / service workers are handled through vite-plugin-pwa package, even though the page is http (not https). In local development, the newer service worker is available every time you re-run the `npm run dev`, it takes 3-5 seconds for the new worker to be available.