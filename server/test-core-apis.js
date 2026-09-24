const dotenv = require('dotenv');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('./server');
const connectDB = require('./config/db');
const {
  User,
  Subject,
  Topic,
  StudySession,
  Quiz,
  QuizAttempt,
  TopicMastery,
  Recommendation,
  StudyPlan
} = require('./models');

dotenv.config();
const request = supertest(app);

async function runCoreApiTests() {
  console.log('=== Starting Phase 4 Core Backend APIs Integration Test ===');
  await connectDB();

  // Test Users Credentials
  const userAEmail = `core_user_a_${Date.now()}@studytwin.ai`;
  const userBEmail = `core_user_b_${Date.now()}@studytwin.ai`;
  const password = 'TestUserPassword123!';

  let tokenA = '';
  let tokenB = '';
  let userAId = '';
  let userBId = '';

  let subjectAId = '';
  let topicAId = '';
  let quizAId = '';
  let sessionAId = '';
  let planAId = '';

  try {
    // ----------------------------------------------------
    // SETUP: Register & Login User A and User B
    // ----------------------------------------------------
    console.log('\n--- Setup: Authenticating Users ---');
    const regA = await request.post('/api/auth/register').send({
      name: 'User A', email: userAEmail, password
    });
    tokenA = regA.body.data.token;
    userAId = regA.body.data.user.id;

    const regB = await request.post('/api/auth/register').send({
      name: 'User B', email: userBEmail, password
    });
    tokenB = regB.body.data.token;
    userBId = regB.body.data.user.id;

    console.log('✔ User A & User B authenticated successfully.');

    // ----------------------------------------------------
    // 1. SUBJECTS API TESTS
    // ----------------------------------------------------
    console.log('\n--- 1. Subjects API Tests ---');
    
    // 1.1 Create Subject (Success)
    const createSubRes = await request
      .post('/api/subjects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Data Structures & Algorithms',
        description: 'Trees, Graphs, Sorting, Dynamic Programming',
        examDate: '2026-11-20'
      });
    if (createSubRes.status !== 201) throw new Error(`Subject creation failed: ${JSON.stringify(createSubRes.body)}`);
    subjectAId = createSubRes.body.data._id;
    console.log('✔ POST /api/subjects (201 Created) Passed. Subject ID:', subjectAId);

    // 1.2 Invalid Request (Missing Subject Name)
    const invSubRes = await request
      .post('/api/subjects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ description: 'No Name' });
    if (invSubRes.status !== 400) throw new Error('Expected 400 for missing subject name');
    console.log('✔ POST /api/subjects Invalid Request (400) Passed.');

    // 1.3 Unauthenticated Request
    const unauthSubRes = await request.get('/api/subjects');
    if (unauthSubRes.status !== 401) throw new Error('Expected 401 for unauthenticated request');
    console.log('✔ GET /api/subjects Unauthenticated (401) Passed.');

    // 1.4 Cross-User Data Isolation (User B attempts to access User A subject)
    const crossSubRes = await request
      .get(`/api/subjects/${subjectAId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    if (crossSubRes.status !== 404 && crossSubRes.status !== 403) throw new Error('Expected 404/403 for unauthorized cross-user access');
    console.log('✔ Cross-User Data Boundary Check Passed.');

    // ----------------------------------------------------
    // 2. TOPICS API TESTS
    // ----------------------------------------------------
    console.log('\n--- 2. Topics API Tests ---');

    // 2.1 Create Topic (Success)
    const createTopRes = await request
      .post('/api/topics')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        subjectId: subjectAId,
        name: 'Binary Search Trees',
        description: 'BST Insertion, Deletion, and Inorder Traversal',
        difficulty: 4
      });
    if (createTopRes.status !== 201) throw new Error(`Topic creation failed: ${JSON.stringify(createTopRes.body)}`);
    topicAId = createTopRes.body.data._id;
    console.log('✔ POST /api/topics (201 Created) Passed. Topic ID:', topicAId);

    // 2.2 Get Topics
    const getTopRes = await request
      .get(`/api/topics?subjectId=${subjectAId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    if (getTopRes.status !== 200 || getTopRes.body.count !== 1) throw new Error('GET /api/topics failed');
    console.log('✔ GET /api/topics (200 OK) Passed.');

    // ----------------------------------------------------
    // 3. STUDY SESSIONS API TESTS
    // ----------------------------------------------------
    console.log('\n--- 3. Study Sessions API Tests ---');

    // 3.1 Log Study Session
    const createSessRes = await request
      .post('/api/study-sessions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        subjectId: subjectAId,
        topicId: topicAId,
        duration: 45,
        studyType: 'Learning',
        notes: 'Constructed BST balancing logic'
      });
    if (createSessRes.status !== 201) throw new Error(`Study session creation failed: ${JSON.stringify(createSessRes.body)}`);
    sessionAId = createSessRes.body.data._id;
    console.log('✔ POST /api/study-sessions (201 Created) Passed.');

    // 3.2 Get Session Stats
    const statsRes = await request
      .get('/api/study-sessions/stats')
      .set('Authorization', `Bearer ${tokenA}`);
    if (statsRes.status !== 200 || statsRes.body.data.todayMinutes !== 45) throw new Error('GET /api/study-sessions/stats failed');
    console.log('✔ GET /api/study-sessions/stats (200 OK) Passed.');

    // ----------------------------------------------------
    // 4. QUIZZES & ATTEMPTS API TESTS
    // ----------------------------------------------------
    console.log('\n--- 4. Quizzes & Quiz Attempts API Tests ---');

    // 4.1 Create Quiz
    const createQuizRes = await request
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        subjectId: subjectAId,
        topicId: topicAId,
        difficulty: 4,
        questions: [{
          question: 'What is the worst-case search time complexity in an unbalanced BST?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctAnswer: 2,
          explanation: 'In an unbalanced skewed BST, search degrades to O(N).',
          difficulty: 3,
          conceptTag: 'Trees'
        }]
      });
    if (createQuizRes.status !== 201) throw new Error('Quiz creation failed');
    quizAId = createQuizRes.body.data._id;
    console.log('✔ POST /api/quizzes (201 Created) Passed.');

    // 4.2 Submit Quiz Attempt
    const attemptRes = await request
      .post(`/api/quizzes/${quizAId}/attempt`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        answers: [2],
        timeTaken: 25
      });
    if (attemptRes.status !== 200 || attemptRes.body.data.score !== 100) throw new Error('Quiz attempt submission failed');
    console.log('✔ POST /api/quizzes/:id/attempt (200 OK) Passed. Score: 100%');

    // ----------------------------------------------------
    // 5. TOPIC MASTERY & RECOMMENDATIONS API TESTS
    // ----------------------------------------------------
    console.log('\n--- 5. Topic Mastery & Recommendations API Tests ---');

    // 5.1 Get Mastery
    const masteryRes = await request
      .get(`/api/mastery/topic/${topicAId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    if (masteryRes.status !== 200) throw new Error('Get topic mastery failed');
    console.log('✔ GET /api/mastery/topic/:id (200 OK) Passed. Score:', masteryRes.body.data.masteryScore);

    // 5.2 Generate Recommendations
    const recGenRes = await request
      .post('/api/recommendations/generate')
      .set('Authorization', `Bearer ${tokenA}`);
    if (recGenRes.status !== 200) throw new Error('Recommendation generation failed');
    console.log('✔ POST /api/recommendations/generate (200 OK) Passed.');

    // ----------------------------------------------------
    // 6. STUDY PLANS API TESTS
    // ----------------------------------------------------
    console.log('\n--- 6. Study Plans API Tests ---');

    const planGenRes = await request
      .post('/api/study-plans/generate')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ availableHoursPerDay: 2 });
    if (planGenRes.status !== 201) throw new Error('Study plan generation failed');
    planAId = planGenRes.body.data._id;
    console.log('✔ POST /api/study-plans/generate (201 Created) Passed.');

    // ----------------------------------------------------
    // 7. MAIN DASHBOARD AGGREGATED METRICS API TEST
    // ----------------------------------------------------
    console.log('\n--- 7. Dashboard Aggregated Metrics API Test ---');

    const dashRes = await request
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${tokenA}`);
    if (dashRes.status !== 200 || dashRes.body.data.todayStudyTime !== 45) throw new Error(`Dashboard API failed: ${JSON.stringify(dashRes.body)}`);
    
    console.log('✔ GET /api/dashboard (200 OK) Passed.');
    console.log('   Dashboard Metrics Summary:');
    console.log('   - Overall Progress:', dashRes.body.data.overallProgress + '%');
    console.log('   - Estimated Exam Readiness:', dashRes.body.data.examReadiness + '%');
    console.log('   - Current Streak:', dashRes.body.data.currentStreak + ' day(s)');
    console.log('   - Today Study Time:', dashRes.body.data.todayStudyTime + ' mins');

    // ----------------------------------------------------
    // TEARDOWN
    // ----------------------------------------------------
    await User.deleteMany({ email: { $in: [userAEmail, userBEmail] } });
    await Subject.deleteMany({ userId: { $in: [userAId, userBId] } });
    await Topic.deleteMany({ subjectId: subjectAId });
    await StudySession.deleteMany({ userId: { $in: [userAId, userBId] } });
    await Quiz.deleteMany({ subjectId: subjectAId });
    await QuizAttempt.deleteMany({ userId: { $in: [userAId, userBId] } });
    await TopicMastery.deleteMany({ userId: { $in: [userAId, userBId] } });
    await Recommendation.deleteMany({ userId: { $in: [userAId, userBId] } });
    await StudyPlan.deleteMany({ userId: { $in: [userAId, userBId] } });

    console.log('\n✔ Teardown complete. Test sandbox data deleted.');
    console.log('\n🎉 ALL PHASE 4 CORE BACKEND API TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('\n❌ Core API Test Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runCoreApiTests();
