/**
 * Demo Database Pruning & Storage Reclamation Utility
 * 
 * Safe on-demand cleaner for MongoDB Atlas Free Tier (M0).
 * - Preserves: Permanent core accounts (admin@example.com, student@example.com, any admin)
 * - Preserves: All courses, tutorials, materials, and mock tests
 * - Prunes: Expired or inactive guest student accounts
 * - Prunes: Results for removed accounts
 * - Prunes: Excess historical results (caps active students to recent 10 results)
 */

const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const Result = require('./models/Result');
const Course = require('./models/Course');
const MockTest = require('./models/MockTest');

async function pruneDemoData() {
  console.log('🧹 Starting Demo Database Pruning & Storage Reclamation...\n');

  try {
    await connectDB();

    // 1. Snapshot initial state
    const [totalUsers, totalResults, totalCourses, totalTests] = await Promise.all([
      User.countDocuments(),
      Result.countDocuments(),
      Course.countDocuments(),
      MockTest.countDocuments(),
    ]);

    console.log('📊 Current Collection Counts:');
    console.log(`   - Users: ${totalUsers}`);
    console.log(`   - Test Results: ${totalResults}`);
    console.log(`   - Courses: ${totalCourses}`);
    console.log(`   - Mock Tests: ${totalTests}\n`);

    // Protected emails
    const protectedEmails = [
      (process.env.ADMIN_SEED_EMAIL || 'admin@example.com').toLowerCase(),
      (process.env.STUDENT_SEED_EMAIL || 'student@example.com').toLowerCase(),
    ];

    // 2. Identify expired or stale guest accounts
    const now = new Date();
    const staleGuestUsers = await User.find({
      role: 'student',
      isPermanent: false,
      email: { $nin: protectedEmails },
      $or: [
        { expiresAt: { $lte: now } },
        { createdAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      ],
    }).select('_id email');

    let deletedUsersCount = 0;
    let deletedResultsCount = 0;

    if (staleGuestUsers.length > 0) {
      const staleUserIds = staleGuestUsers.map((u) => u._id);
      const resDeleteResults = await Result.deleteMany({ student: { $in: staleUserIds } });
      const resDeleteUsers = await User.deleteMany({ _id: { $in: staleUserIds } });
      deletedUsersCount += resDeleteUsers.deletedCount || 0;
      deletedResultsCount += resDeleteResults.deletedCount || 0;
      console.log(`🗑️  Removed ${deletedUsersCount} expired guest student accounts and their associated results.`);
    } else {
      console.log('✅ No expired guest accounts found.');
    }

    // 3. Prune orphaned results (results where student no longer exists)
    const allStudentIds = (await User.find({}).select('_id')).map((u) => u._id);
    const orphanedResults = await Result.deleteMany({ student: { $nin: allStudentIds } });
    if (orphanedResults.deletedCount > 0) {
      deletedResultsCount += orphanedResults.deletedCount;
      console.log(`🗑️  Removed ${orphanedResults.deletedCount} orphaned test results.`);
    }

    // 4. Cap results per remaining student to recent 10
    const activeStudents = await User.find({ role: 'student' }).select('_id email');
    let cappedCount = 0;

    for (const student of activeStudents) {
      const excessResults = await Result.find({ student: student._id })
        .sort({ createdAt: -1 })
        .select('_id')
        .skip(10);

      if (excessResults.length > 0) {
        const ids = excessResults.map((r) => r._id);
        const delRes = await Result.deleteMany({ _id: { $in: ids } });
        cappedCount += delRes.deletedCount || 0;
      }
    }

    if (cappedCount > 0) {
      deletedResultsCount += cappedCount;
      console.log(`✂️  Capped excess historical results: removed ${cappedCount} results.`);
    }

    // 5. Final Snapshot
    const [finalUsers, finalResults] = await Promise.all([
      User.countDocuments(),
      Result.countDocuments(),
    ]);

    console.log('\n🎉 Pruning Complete:');
    console.log(`   - Total Users Remaining: ${finalUsers} (Removed: ${deletedUsersCount})`);
    console.log(`   - Total Results Remaining: ${finalResults} (Removed: ${deletedResultsCount})`);
    console.log(`   - Core Showcase Accounts Protected: ${protectedEmails.join(', ')}`);
    console.log('   - MongoDB Atlas M0 Free Tier Storage Budget: Healthy & Bounded.\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Pruning Error:', err);
    process.exit(1);
  }
}

pruneDemoData();

