# Admin Portal Setup Guide

## Quick Setup (Recommended)

### Using the Automated Setup Script:

1. **Get your Supabase Service Role Key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the `service_role` key (NOT the public key)

2. **Set environment variable:**
   ```bash
   # Windows PowerShell
   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   
   # Or add to .env.local file:
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Run the setup script:**
   ```bash
   node scripts/setup-admin.js
   ```

4. **You'll get your admin credentials:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 ADMIN CREDENTIALS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:    admin@haven.com
   Password: Admin@123456
   User ID:  550e8400-e29b-41d4-a716-446655440000
   ```

5. **Access the admin portal:**
   - Navigate to `http://localhost:5173/admin-login`
   - Sign in with the credentials above

---

## Manual Setup (Alternative)

### Steps:

1. **Create a user in Supabase Auth:**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Create user" or invite a user
   - Enter email: `admin@haven.com`
   - Set password: `Admin@123456`
   - Copy the User ID (UUID)

2. **Assign admin role in Supabase:**
   - Go to Supabase Dashboard → SQL Editor
   - Run this query (replace `{USER_ID}` with the actual UUID from step 1):
   
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('{USER_ID}', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

3. **Access the Admin Portal:**
   - Navigate to `/admin-login`
   - Enter the email and password you created
   - You'll be redirected to the admin dashboard if successful

## Admin Portal URL
- **Admin Login:** `http://localhost:5173/admin-login`
- **Admin Dashboard:** `http://localhost:5173/admin`

## Security Features
- ✅ Email/Password authentication required
- ✅ Role-based access control (only `admin` role can access)
- ✅ Auto-logout/redirect if user doesn't have admin role
- ✅ Logout button available in admin panel

## Default Demo Credentials (For Testing)
After following the steps above:
- **Email:** `admin@haven.com`
- **Password:** (whatever you set in Supabase)

## Troubleshooting

### "You do not have admin access" error
- Check that the user_roles table has an entry with:
  - `user_id`: matches the authenticated user
  - `role`: 'admin'

### Can't sign in
- Verify the email/password are correct in Supabase Auth
- Check that the email is confirmed (if email confirmation is enabled)

### Still redirecting to login
- Clear browser cache/localStorage
- Check browser console for error messages
- Verify the user has the admin role in the database

## Environment Variables
Make sure these are set in your `.env.local`:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```
