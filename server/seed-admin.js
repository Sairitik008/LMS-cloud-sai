const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if user exists
    let user = await User.findOne({ email: 'admin@example.com' });
    if (user) await user.deleteOne();

    // Use PLAIN password - the pre('save') hook in User model will hash it
    user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', 
      role: 'admin'
    });

    console.log('Test Admin created: admin@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createTestUser();
