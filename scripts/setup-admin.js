#!/usr/bin/env node
/**
 * Admin User Setup Script
 * This script creates an admin user in Supabase and assigns the admin role
 * 
 * Usage: node scripts/setup-admin.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing environment variables');
  console.error('Please set:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const adminEmail = 'admin@haven.com';
const adminPassword = 'Admin@123456';

async function setupAdmin() {
  try {
    console.log('🚀 Setting up admin user...\n');

    // Step 1: Create the admin user
    console.log('📧 Creating admin user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log('✓ Admin user already exists');
        // Get the existing user
        const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();
        if (getUserError) throw getUserError;
        
        const existingAdmin = users.users.find(u => u.email === adminEmail);
        if (!existingAdmin) {
          throw new Error('Could not find existing admin user');
        }
        authData.user = existingAdmin;
      } else {
        throw authError;
      }
    }

    const userId = authData.user?.id;
    console.log(`✓ Admin user created/found with ID: ${userId}\n`);

    // Step 2: Create admin profile
    console.log('👤 Creating admin profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        email: adminEmail,
        first_name: 'Admin',
        last_name: 'User',
      }, { onConflict: 'user_id' });

    if (profileError) {
      console.warn('⚠️  Profile creation warning:', profileError.message);
    } else {
      console.log('✓ Admin profile created/updated\n');
    }

    // Step 3: Assign admin role
    console.log('🔐 Assigning admin role...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin',
      }, { onConflict: 'user_id,role' });

    if (roleError) {
      throw roleError;
    }
    console.log('✓ Admin role assigned\n');

    // Success
    console.log('✅ Admin setup complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('User ID:  ' + userId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Access the admin portal:');
    console.log('   http://localhost:5173/admin-login\n');
    console.log('💡 Tip: Save these credentials in a secure location!\n');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    process.exit(1);
  }
}

setupAdmin();
