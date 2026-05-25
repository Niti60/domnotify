/**
 * Admin Seed Script
 * 
 * Creates the first admin user in the database
 * 
 * Usage:
 * node scripts/create-admin.js
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../src/models/User.js';
// dotenv.config({ path: '.env.local' });

const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@domnotify.com',
  password: 'admin@dom!',
  role: 'company',
  isAdmin: true,
  isPremiumUser: true,
  premiumPlanType: 'enterprise',
  isVerified: true,
};

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/domnotify');
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });
    if (existingAdmin) {
      console.log('✗ Admin user already exists');
      console.log(`  Email: ${existingAdmin.email}`);
      console.log(`  Name: ${existingAdmin.name}`);
      process.exit(0);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(DEFAULT_ADMIN.password, salt);

    // Create admin user
    const admin = new User({
      ...DEFAULT_ADMIN,
      password: hashedPassword,
    });

    await admin.save();

    console.log('✓ Admin user created successfully');
    console.log('');
    console.log('Admin Credentials:');
    console.log(`  Email: ${DEFAULT_ADMIN.email}`);
    console.log(`  Password: ${DEFAULT_ADMIN.password}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password immediately after login!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
