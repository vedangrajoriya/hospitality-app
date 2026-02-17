#!/usr/bin/env node
/**
 * Promote User to Admin
 * This script promotes an existing user to admin role
 * 
 * Usage: node scripts/promote-to-admin.js <email>
 */

import { createClient } from '@supabase/supabase-js';

const email = 'vedangrajoriya@gmail.com';
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

async function promoteToAdmin() {
  try {
    console.log(`🚀 Promoting ${email} to admin...\n`);

    // Step 1: Find the user
    console.log('🔍 Finding user in Supabase Auth...');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const userId = user.id;
    console.log(`✓ User found with ID: ${userId}\n`);

    // Step 2: Assign admin role
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
    console.log('✅ User promoted to admin successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 PROMOTION DETAILS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${email}`);
    console.log(`User ID: ${userId}`);
    console.log(`Role: admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 User needs to log out and log back in for changes to take effect.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

promoteToAdmin();
