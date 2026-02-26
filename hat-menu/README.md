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

