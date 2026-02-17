-- First, verify if the user exists and check their current role
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'vedangrajoriya@gmail.com';

-- If the role is NULL or doesn't exist, you'll need to insert it
-- Run this if the above shows NULL for role:
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::app_role
-- FROM auth.users
-- WHERE email = 'vedangrajoriya@gmail.com'
-- ON CONFLICT (user_id, role) DO NOTHING;
