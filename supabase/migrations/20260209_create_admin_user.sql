-- This migration creates an admin user account
-- Note: You need to run `supabase link` and `supabase db push` to apply this migration

-- First, we'll insert a demo admin user
-- The user needs to be created via Supabase Auth API in production
-- For development/testing, you can create it manually in Supabase dashboard

-- After creating a user with email 'admin@haven.com' in Supabase Auth,
-- assign the admin role by running this query in the SQL editor:

-- 1. Get the user_id from the auth.users table:
-- SELECT id FROM auth.users WHERE email = 'admin@haven.com';

-- 2. Then insert the admin role (replace {USER_ID} with the actual user ID):
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('{USER_ID}', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Example query with a placeholder UUID:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('00000000-0000-0000-0000-000000000000'::uuid, 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;
