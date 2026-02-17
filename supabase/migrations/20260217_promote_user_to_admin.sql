-- This migration promotes vedangrajoriya@gmail.com to admin role
-- The user must already exist in auth.users table

-- Get the user_id and assign admin role
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'vedangrajoriya@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the role was assigned
-- Uncomment below to check:
-- SELECT u.email, ur.role FROM auth.users u 
-- LEFT JOIN public.user_roles ur ON u.id = ur.user_id 
-- WHERE u.email = 'vedangrajoriya@gmail.com';
