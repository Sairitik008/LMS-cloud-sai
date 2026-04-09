const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'http://localhost:5000/api';

const runSmokeTest = async () => {
  console.log('🚀 Starting System Smoke Test...');
  let adminToken = '';
  let studentToken = '';

  try {
    // 1. Admin Login
    console.log('--- Phase 1: Admin Authentication ---');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    adminToken = loginRes.data.token;
    console.log('✅ Admin Login Successful');

    const config = { headers: { Authorization: `Bearer ${adminToken}` } };

    // 2. Create a Course
    console.log('--- Phase 2: Admin Content Creation ---');
    const courseRes = await axios.post(`${API_URL}/courses`, {
      title: 'Smoke Test Course',
      description: 'Verifying the backbone logic.',
      category: 'System Audit',
      thumbnail: 'https://via.placeholder.com/300'
    }, config);
    const courseId = courseRes.data._id;
    console.log(`✅ Course Created: ${courseId}`);

    // 3. Create a Mock Test
    const testRes = await axios.post(`${API_URL}/mocktests`, {
      title: 'Backbone Audit Quiz',
      description: 'A test to ensure the assessment engine is functional.',
      category: 'System Audit',
      duration: 10,
      passingScore: 50,
      questions: [
        {
          questionText: 'Does this system work?',
          options: ['Yes', 'No', 'Maybe', 'Error'],
          correctAnswer: 0,
          explanation: 'Standard audit verification.'
        }
      ]
    }, config);
    const testId = testRes.data._id;
    console.log(`✅ Mock Test Created: ${testId}`);

    // 4. Student Registration
    console.log('--- Phase 3: Student Flow ---');
    // Generate unique email to avoid "User already exists" error
    const studentEmail = `audit_student_${Date.now()}@example.com`;
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Audit Student',
      email: studentEmail,
      password: 'password123'
    });
    studentToken = regRes.data.token;
    console.log(`✅ Student Registration Successful (${studentEmail})`);

    const studentConfig = { headers: { Authorization: `Bearer ${studentToken}` } };

    // 5. Submit Test Result
    console.log('--- Phase 4: Assessment Processing ---');
    const submitRes = await axios.post(`${API_URL}/results`, {
      mockTestId: testId,
      answers: [{ questionIndex: 0, selectedOption: 0 }],
      timeTaken: 5
    }, studentConfig);
    console.log(`✅ Test Result Submitted. Score: ${submitRes.data.score}%`);

    // 6. Check Leaderboard
    const lbRes = await axios.get(`${API_URL}/results/leaderboard`);
    console.log('✅ Leaderboard Data Verified');
    console.log(`✅ Top Student: ${lbRes.data[0]?.user?.name || 'N/A'}`);

    console.log('\n🌟 ALL SYSTEM FLOWS VERIFIED 100% 🌟');
    process.exit(0);
  } catch (err) {
    console.error('❌ SMOKE TEST FAILED');
    console.error(err.response?.data || err.message);
    process.exit(1);
  }
};

runSmokeTest();
