const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const createTestUser = async () => {
  try {
    await connectDB();
    
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'password123';

    if (process.env.NODE_ENV === 'production') {
      if (!process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_SEED_PASSWORD === 'password123') {
        console.error('❌ SECURITY FATAL: Seeding default or weak admin password in production is strictly prohibited.');
        process.exit(1);
      }
    }

    // Check if user exists
    let user = await User.findOne({ email: adminEmail });
    if (user) await user.deleteOne();

    // Use PLAIN password - the pre('save') hook in User model will hash it
    user = await User.create({
      name: process.env.ADMIN_SEED_NAME || 'Admin User',
      email: adminEmail,
      password: adminPassword, 
      role: 'admin'
    });

    console.log(`Admin account provisioned for: ${adminEmail}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createTestUser();
