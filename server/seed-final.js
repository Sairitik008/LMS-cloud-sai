const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedFinalTestAccounts = async () => {
  try {
    await connectDB();
    
    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'password123';
    const studentEmail = process.env.STUDENT_SEED_EMAIL || 'student@example.com';
    const studentPassword = process.env.STUDENT_SEED_PASSWORD || 'password123';

    // Clean and Create Admin
    await User.findOneAndDelete({ email: adminEmail });
    await User.create({
      name: process.env.ADMIN_SEED_NAME || 'Prof. Ramesh Verma (Placement Officer)',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    // Clean and Create Student
    await User.findOneAndDelete({ email: studentEmail });
    await User.create({
      name: process.env.STUDENT_SEED_NAME || 'Rahul Sharma',
      email: studentEmail,
      password: studentPassword,
      role: 'student',
      education: 'B.Tech Computer Science (3rd Year, NIT/State Univ)',
      skills: ['Java', 'Data Structures & Algorithms', 'Spring Boot', 'React', 'SQL'],
      hobbies: ['Competitive Programming', 'Hackathons', 'Cricket'],
      portfolioUrl: 'https://leetcode.com/rahul_sharma'
    });

    console.log('✅ TEST ACCOUNTS SYNCED');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFinalTestAccounts();
