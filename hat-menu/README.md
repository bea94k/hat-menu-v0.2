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

## Local Supabase auth redirect URLs
This app uses Vite's default local origin: `http://localhost:5173`.

In `hat-menu/supabase/config.toml`, use:

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
