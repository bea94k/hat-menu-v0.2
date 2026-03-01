# Recipe web app

Coding supported by AI.  
More documentation in [copilot-instructions](.github/copilot-instructions.md).

## .env needed in /hat-menu
```
VITE_SUPABASE_URL=<from Supabase>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<from Supabase>
```

## To run the frontend
```
cd hat-menu
npm install
npm run dev
```

## To run local mock DB from JSON file
```
cd hat-menu
npm run json-db
```

## Local Supabase auth callback setup
For local email/password auth, keep Supabase auth URLs aligned with Vite origin (`http://localhost:5173`).

See [hat-menu/README.md](hat-menu/README.md) and confirm these values in `hat-menu/supabase/config.toml`:
- `site_url = "http://localhost:5173"`
- `additional_redirect_urls` includes:
	- `http://localhost:5173`
	- `http://localhost:5173/sign-in`
	- `http://localhost:5173/sign-up`
