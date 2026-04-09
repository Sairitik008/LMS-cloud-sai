const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedFinalTestAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clean and Create Admin
    await User.findOneAndDelete({ email: 'admin@example.com' });
    await User.create({
      name: 'LMS Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Clean and Create Student
    await User.findOneAndDelete({ email: 'student@example.com' });
    await User.create({
      name: 'LMS Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    });

    console.log('✅ TEST ACCOUNTS SYNCED');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFinalTestAccounts();
