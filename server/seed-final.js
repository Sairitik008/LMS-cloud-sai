const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedFinalTestAccounts = async () => {
  try {
    await connectDB();
    
    // Clean and Create Admin
    await User.findOneAndDelete({ email: 'admin@example.com' });
    await User.create({
      name: 'Prof. Ramesh Verma (Placement Officer)',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Clean and Create Student
    await User.findOneAndDelete({ email: 'student@example.com' });
    await User.create({
      name: 'Rahul Sharma',
      email: 'student@example.com',
      password: 'password123',
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
