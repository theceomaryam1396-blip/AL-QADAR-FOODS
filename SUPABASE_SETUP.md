Supabase setup for AL-QADAR FOODS

This document explains how to provision a Supabase project, run the required SQL, and configure environment variables for a secure admin system.

1) Create a Supabase project
- Visit https://app.supabase.com and create a new project.
- Note the project `URL` and `anon` public key (found in Project Settings → API).

2) Run the initialization SQL
- Open the Supabase Dashboard → SQL Editor.
- Paste the contents of `supabase/init.sql` and run it.
- This creates the `profiles` table, an `auth.users` trigger that auto-creates profiles on signup, and RLS policies that restrict access to admins.

3) Add an admin user
- In the Supabase Dashboard → Authentication → Users, create a user with email/password (or sign up via the site).
- Then, in the SQL editor or Table Editor, set that user's profile role to admin:

  UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

- Alternatively, you can update by `id` (the user's UUID) if preferred.

4) Environment variables (Vercel)
- Client-side envs (exposed to the browser):
  - `VITE_SUPABASE_URL` = your Supabase Project URL
  - `VITE_SUPABASE_ANON_KEY` = anon public key (Project Settings → API)

- Server-side secret (DO NOT expose to the browser):
  - `SUPABASE_SERVICE_ROLE` = your Supabase service_role key (Project Settings → API → Service role key)

  Note: The server key must NOT be prefixed with `VITE_` and must be kept secret. Use it only for server-side operations.

5) Vercel setup
- Add the three env vars in your Vercel project (Project → Settings → Environment Variables):
  - `VITE_SUPABASE_URL` (Environment: Production/Preview/Development as needed)
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE` (mark as secret)
- Redeploy the site after adding env vars.

6) Verify
- Sign in with the admin user's email/password at the admin route (`/admin`). The route checks the active session and the `profiles.role`.
- If you want to verify via SQL that the admin is set:
  SELECT id, email, role FROM public.profiles WHERE email = 'your-admin-email@example.com';

7) Notes on security
- The app checks `profiles.role` on route load and Supabase RLS prevents non-admins from reading or writing protected tables.
- Do not set role information in client storage; roles are verified by reading the `profiles` row from Supabase every session.
- If you need server-side privileged operations (e.g., background jobs), use `SUPABASE_SERVICE_ROLE` on the server only.

If you want, I can apply these steps for you if you provide Superbase dashboard access; otherwise run the SQL and the env config steps locally/through the dashboard and tell me when done so I can verify the deployment and test the admin route.
