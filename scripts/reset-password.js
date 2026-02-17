#!/usr/bin/env node
/**
 * Reset User Password
 * This script resets the password for a user
 * 
 * Usage: node scripts/reset-password.js
 */

import { createClient } from '@supabase/supabase-js';

const email = 'vedangrajoriya@gmail.com';
const newPassword = 'Admin@12345'; // Change this to your desired password
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

async function resetPassword() {
  try {
    console.log(`🔄 Resetting password for ${email}...\n`);

    // Get the user
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Update the password
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Password reset successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 NEW LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${newPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Try logging in to the admin portal:');
    console.log('   http://localhost:5173/admin-login\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
