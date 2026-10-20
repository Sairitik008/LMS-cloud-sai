const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const cleanIndexes = async () => {
  try {
    await connectDB();

    const collections = await mongoose.connection.db.listCollections().toArray();
    const userColl = collections.find(c => c.name === 'users');

    if (userColl) {
      console.log('Cleaning indexes for "users" collection...');
      try {
        await mongoose.connection.db.collection('users').dropIndex('username_1');
        console.log('✅ Dropped ghost index: username_1');
      } catch (e) {
        console.log('ℹ️ Index username_1 not found or already dropped.');
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanIndexes();
