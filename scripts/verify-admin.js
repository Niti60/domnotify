/**
 * Admin Verification & Fix Script
 * 
 * Inspects MongoDB for admin users and their password state
 * Identifies and optionally fixes broken admin records
 * 
 * Usage:
 * node scripts/verify-admin.js          (view only)
 * node scripts/verify-admin.js --fix    (delete broken admin and reseed)
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../src/models/User.js';

const ADMIN_EMAIL = 'admin@domnotify.com';
const ADMIN_PASSWORD = 'admin@dom!';

async function verifyAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/domnotify');
    console.log('✓ Connected to MongoDB\n');

    // Find all admin users
    const admins = await User.find({ isAdmin: true }).select('email name password isAdmin createdAt');
    
    console.log('='.repeat(70));
    console.log('ADMIN USERS IN DATABASE');
    console.log('='.repeat(70));
    
    if (admins.length === 0) {
      console.log('\n✗ NO ADMIN USERS FOUND\n');
      console.log('Action: You need to create an admin user');
      console.log('Run: node scripts/create-admin.js\n');
      process.exit(0);
    }

    for (const admin of admins) {
      console.log(`\nAdmin: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Created: ${admin.createdAt}`);
      console.log(`Password Hash: ${admin.password ? admin.password.substring(0, 50) + '...' : 'MISSING'}`);
      console.log(`Hash Length: ${admin.password?.length || 0} chars`);
      
      // Check if password looks like bcrypt hash
      const isBcryptHash = admin.password && admin.password.startsWith('$2');
      console.log(`Is bcrypt hash: ${isBcryptHash ? '✓ YES' : '✗ NO (BROKEN)'}`);
      
      // Try to verify password
      if (isBcryptHash && admin.password.length > 20) {
        try {
          const match = await bcryptjs.compare(ADMIN_PASSWORD, admin.password);
          console.log(`Can verify with default password: ${match ? '✓ YES' : '✗ NO'}`);
        } catch (err) {
          console.log(`Can verify with default password: ✗ ERROR - ${err.message}`);
        }
      } else {
        console.log('Can verify with default password: ✗ HASH INVALID');
      }
    }

    console.log('\n' + '='.repeat(70));
    
    // Check for the specific admin
    const defaultAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!defaultAdmin) {
      console.log('\n✗ DEFAULT ADMIN (admin@domnotify.com) NOT FOUND\n');
    } else {
      console.log('\n✓ DEFAULT ADMIN FOUND\n');
      
      const isBcryptHash = defaultAdmin.password && defaultAdmin.password.startsWith('$2');
      
      if (!isBcryptHash) {
        console.log('⚠️  WARNING: Password hash is BROKEN or INVALID');
        console.log('\nTo fix: Run with --fix flag');
        console.log('node scripts/verify-admin.js --fix\n');
      } else {
        console.log('✓ Password hash looks valid');
        
        try {
          const match = await bcryptjs.compare(ADMIN_PASSWORD, defaultAdmin.password);
          if (match) {
            console.log('✓ Default password verifies correctly\n');
            console.log('You should be able to login with:');
            console.log(`  Email: ${ADMIN_EMAIL}`);
            console.log(`  Password: ${ADMIN_PASSWORD}\n`);
          } else {
            console.log('✗ Default password does NOT match\n');
            console.log('The admin was created with a different password.\n');
          }
        } catch (err) {
          console.log(`✗ Error verifying password: ${err.message}\n`);
        }
      }
    }

    // Check for duplicate admins
    if (admins.length > 1) {
      console.log('\n⚠️  WARNING: Multiple admin users found:');
      admins.forEach((a, i) => console.log(`  ${i + 1}. ${a.email}`));
      console.log('\nConsider deleting duplicates manually in MongoDB.\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

async function fixAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/domnotify');
    console.log('✓ Connected to MongoDB\n');

    console.log('='.repeat(70));
    console.log('FIXING ADMIN USER');
    console.log('='.repeat(70) + '\n');

    // Check if admin exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log(`Deleting broken admin record: ${existing._id}`);
      await User.deleteOne({ email: ADMIN_EMAIL });
      console.log('✓ Deleted\n');
    }

    // Create new admin with proper hashing
    console.log('Creating new admin user...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, salt);

    const admin = new User({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'company',
      isAdmin: true,
      isPremiumUser: true,
      premiumPlanType: 'enterprise',
      isVerified: true,
    });

    await admin.save();

    console.log('✓ Admin user created successfully\n');
    console.log('Admin Credentials:');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  ID: ${admin._id}\n`);

    // Verify it
    const verify = await bcryptjs.compare(ADMIN_PASSWORD, admin.password);
    console.log(`Verification: ${verify ? '✓ PASS' : '✗ FAIL'}\n`);

    console.log('⚠️  IMPORTANT: Change the default password immediately after login!\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error fixing admin:', error.message);
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);
if (args.includes('--fix')) {
  fixAdmin();
} else {
  verifyAdmin();
}
