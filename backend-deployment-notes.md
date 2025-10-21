# From ChatGPT

## ✅ **Checklist: Supabase + Vercel setup (React + TS + Vite)**

<del>1. **Create your Supabase project**</del>

* Go to [supabase.com](https://supabase.com/).
* Sign up (GitHub or email).
* Click **New Project** → name it, set a password, and **choose a region** (preferably EU).
* Wait for the project to initialize.

  🔗 Docs: [Getting Started – Supabase](https://supabase.com/docs/guides/getting-started)

---

### 2. **Get your API keys and project URL**

* In the Supabase dashboard → **Project Settings → API**:

  * Copy:

    * `Project URL`
    * `anon (public)` key (used in your frontend)
    * `service_role` key (⚠️ keep secret, don’t use in frontend)
* You’ll later set these as environment variables in Vercel and locally in `.env`.

  🔗 Docs: [API Configuration](https://supabase.com/docs/guides/api)

---

### 3. **Set up your database schema**

* Go to **SQL Editor** in Supabase dashboard.
* Either:

  * Run the “User Management Starter” SQL (recommended for basic auth flow).
  * Or write your own tables and schema manually.
* If you plan to restrict access, **enable Row Level Security (RLS)** and add policies.

  🔗 Docs: [Supabase Database Overview](https://supabase.com/docs/guides/database/overview)

---

### 4. **Enable Authentication**

* In the left sidebar → **Authentication → Providers**:

  * Enable **Email + Password** (and optionally OAuth providers like Google or GitHub).
* Under **URL Configuration**, set:

  * `SITE_URL` → your local dev URL (e.g. `http://localhost:5173`)
  * Add `https://yourapp.vercel.app` later (after deployment).

  🔗 Docs: [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

---

### 5. **Set up Storage (for image uploads)**

* Go to **Storage → Create New Bucket**.
* Give it a name like `images` or `uploads`.
* Decide if it’s **public** or **private** (public is fine for non-sensitive images).
* Later, you’ll use `supabase.storage.from('images')` in code to upload/fetch.

  🔗 Docs: [Supabase Storage](https://supabase.com/docs/guides/storage)

---

### 6. **Set up your local React + Vite project**

* Create a new Vite app:

  ```bash
  npm create vite@latest my-app -- --template react-ts
  cd my-app
  npm install
  ```
* Install Supabase client:

  ```bash
  npm install @supabase/supabase-js
  ```
* Create `.env` file in your root:

  ```bash
  VITE_SUPABASE_URL=https://your-project-url.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
* Add `.env` to `.gitignore` (never commit your keys).

  🔗 Docs: [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/initializing)

---

### 7. **Initialize the Supabase client in your code**

* Create a helper file `src/lib/supabaseClient.ts`:

  ```ts
  import { createClient } from '@supabase/supabase-js'

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
  ```
* Import and use it anywhere in your app:

  ```ts
  const { data, error } = await supabase.from('my_table').select('*')
  ```

---

### 8. **Add authentication logic (optional now, easy later)**

* Use Supabase Auth methods directly in your React components:

  ```ts
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }
  ```
* Supabase automatically persists sessions using localStorage.

  🔗 Docs: [Auth with Supabase JS Client](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)

---

### 9. **Add image uploads**

* Example for uploading a file:

  ```ts
  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${file.name}`, file)
  }
  ```

  🔗 Docs: [Storage Uploads](https://supabase.com/docs/reference/javascript/storage-from-upload)

---

### 10. **Test locally**

* Run your app:

  ```bash
  npm run dev
  ```
* Test signup, login, image upload, DB fetches.

---

### 11. **Push your code to GitHub**

* Initialize git:

  ```bash
  git init
  git add .
  git commit -m "initial commit"
  git remote add origin <your-repo-url>
  git push -u origin main
  ```

---

### 12. **Deploy your app to Vercel**

* Go to [vercel.com](https://vercel.com/).
* Click **New Project** → **Import Git Repository**.
* During setup:

  * Choose **Framework Preset: Vite**.
  * Add your environment variables:

    * `VITE_SUPABASE_URL`
    * `VITE_SUPABASE_ANON_KEY`
* Deploy.

  🔗 Docs: [Deploying Vite Apps on Vercel](https://vercel.com/docs/frameworks/vite)

---

### 13. **Configure Supabase Auth Redirects**

* Back in Supabase → **Authentication → URL Configuration**:

  * Add your Vercel domain (e.g. `https://myapp.vercel.app`) as an **allowed redirect URL**.
  * Keep your local dev URL too.

---

### 14. **Verify everything works**

* Visit your live Vercel app.
* Sign up a user, log in, fetch some data, and upload an image.
* Open Supabase dashboard → **Auth → Users** to confirm the signup.
* Check **Storage → images** to confirm uploads.

---

### 15. **Optional: use Supabase CLI for migrations**

* Install CLI globally:

  ```bash
  npm install -g supabase
  ```
* Link your project:

  ```bash
  supabase link --project-ref <your-project-id>
  ```
* Run local migrations or push schema changes.

  🔗 Docs: [Supabase CLI Guide](https://supabase.com/docs/guides/cli)

---

## ⚠️ **Tips & Pitfalls**

### Environment Variables

* Vite only exposes variables prefixed with `VITE_`.
  Don’t forget that, or you’ll wonder why your app “can’t find `SUPABASE_URL`.”
* Always define the same variables in **Vercel’s Environment tab** (under “Settings → Environment Variables”).

---

### Supabase Auth

* Forgetting to whitelist your Vercel domain in Supabase Auth will break redirects and cause mysterious “invalid URL” errors.
  Check **Auth → URL Configuration** after every deployment.

---

### Storage

* If using public buckets, anyone with a URL can access the file — not private.
* Free tier has limited storage (1 GB).
  Clean up unused files periodically.

---

### Database

* Supabase free tier DB = 500 MB. That’s fine for small projects, but you can fill it faster than you think if you store JSON or logs.
* Use SQL Editor or the CLI to back up/export occasionally.

---

### Deployment

* Vercel’s static deployments are fast, but remember: **no Node backend** — it’s all client-side or via Supabase.
  If you need custom backend logic, use Supabase Edge Functions or another serverless host.

---

### Idle Projects

* Supabase may pause free projects after inactivity.
  Just log in to wake it up — your data remains intact.

---

### Performance

* Use `select('columns')` to fetch only what you need from Supabase.
* Use RLS wisely — it’s great for security, but can slow queries if overcomplicated.



# From internal AI

<del> 1. Create a Supabase project</del>

* Sign up / log in at app.supabase.com and create a new project.
* Choose a project name and password. Note the project ref / URL shown in the dashboard.


## 2. Add Auth redirect URLs
* In Supabase Dashboard → Authentication → Settings → Redirect URLs:
    * Add your local dev URL (Vite default): http://localhost:5173
    * Add your production URL (you’ll add actual Vercel URL after deploy, e.g. https://your-app.vercel.app)
    * Add any preview domains you expect to use.


## 3. Create your database schema (quick or migrations)
* Quick way: use SQL Editor in Supabase to create tables and run SQL.
* Migration workflow (recommended if you want versioned migrations):
    * Install Supabase CLI (see Supabase docs for platform-specific install).
    * Link CLI to your project (supabase login / supabase link or equivalent).
    * Create migration files for schema changes and apply them to your project via the CLI.
* Tip: enable Row Level Security (RLS) and create policies once you know your access rules.


## 4. Secure keys & note which to use where
* From Supabase Dashboard → Settings → API get:
    * anon/public key (safe to use in client code)
    * service_role key (sensitive; never expose in client)
* Keep keys out of source control.


## 5. Local dev: add environment variables
* In your Vite app, create .env.local (add to .gitignore):
    * VITE_SUPABASE_URL=<your-supabase-url>
    * VITE_SUPABASE_ANON_KEY=<your-anon-key>
* Reminder: Vite env vars must begin with VITE_ to be exposed to the client.


## 6. Install Supabase client library
* In your project root run:
    * npm install @supabase/supabase-js (or yarn/pnpm equivalent)


## 7. Initialize Supabase client in your app
* Example (create a single client file used across app):
    * import { createClient } from '@supabase/supabase-js'
    * export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
* Treat this client as singleton (provide via React Context if convenient).


## 8. Implement basic auth flows
* Implement sign-up, sign-in, sign-out, and session persistence using supabase.auth APIs.
* Listen to auth state changes to update UI and protect routes.
* Use browser storage (supabase client handles session storage by default).


## 9. Protect data with RLS and policies
* Turn on Row Level Security on tables you want protected.
* Create Postgres policies (e.g., allow INSERT/SELECT only for authenticated users or owner checks).
* Test actions from both authenticated and anonymous clients.


## 10. If you need server-side privileged actions
* Use Supabase Edge Functions or Vercel serverless functions to run code with service_role key.
* Store the service_role key only in server environment variables (never in client).


## 11. Test locally
* Run your Vite dev server (npm run dev).
* Test sign-up / sign-in, DB reads/writes, and any auth redirect flows (magic links / OAuth).
* If using OAuth (Google/GitHub), configure provider settings in Supabase and OAuth redirect URIs.


## 12. Prepare for deploy on Vercel
* Create a Vercel account and connect your Git repo (or use Vercel CLI).
* In Vercel project settings → Environment Variables add:
    * VITE_SUPABASE_URL = <value>
    * VITE_SUPABASE_ANON_KEY = <value>
    * (If using server functions) add SUPABASE_SERVICE_ROLE or other server-only secrets under "Environment Variables" with the scope set to Production/Preview appropriately.
* For preview deployments, set the same env vars for the Preview environment (Vercel allows separate values).


## 13. Deploy
* Push to the branch connected to Vercel (or run vercel deploy).
* After first deploy, add the production URL in Supabase Auth redirect URLs.


## 14. Post-deploy checks
* Test sign-up / sign-in on the deployed site.
* Verify DB operations work and RLS policies apply as expected.
* Confirm email links and OAuth redirects function correctly.


## 15. Add migrations to your workflow (ongoing)
* Keep migrations under version control (via Supabase CLI).
* Apply migrations to production via CLI only after review/test on staging/dev.


## 16. Monitoring, backups & costs
* Monitor usage in Supabase Dashboard (rate/row limits on free tier).
* Turn on automated DB backups or export periodic SQL dumps if your data is important.
* Track Vercel usage (serverless invocations, bandwidth) on their dashboard.


## 17. Helpful extras and best practices
* Use React Context or a small auth provider wrapper to expose session/user to the app.
* Avoid storing the service_role key anywhere client-accessible; only use it on server functions.
* Use environment-specific settings in Vercel (Preview/Production) for keys.
* Add a rate limit or abuse protection if you expose endpoints that use a service key.
* Keep secrets out of logs and git history.