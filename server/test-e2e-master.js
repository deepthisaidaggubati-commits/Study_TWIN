const dotenv = require('dotenv');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('./server');
const connectDB = require('./config/db');
const mlService = require('./services/mlService');
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

async function runMasterE2ETest() {
  console.log('=== STARTING MASTER END-TO-END SYSTEM TEST (PHASES 1 - 20) ===');
  await connectDB();

  const testEmail = `e2e_master_${Date.now()}@studytwin.ai`;
  const password = 'E2ESecurePassword123!';
  let token = '';
  let userId = '';
  let subjectId = '';
  let topicId = '';
  let quizId = '';

  try {
    // 1. Auth: Registration & Login
    console.log('\n--- 1. Auth System ---');
    const regRes = await request.post('/api/auth/register').send({
      name: 'Master Tester', email: testEmail, password, academicLevel: 'Undergraduate', branch: 'Artificial Intelligence', graduationYear: 2026
    });
    if (regRes.status !== 201) throw new Error('Registration failed');
    token = regRes.body.data.token;
    userId = regRes.body.data.user.id;
    console.log('✔ User Registration & JWT Issuance passed.');

    const loginRes = await request.post('/api/auth/login').send({ email: testEmail, password });
    if (loginRes.status !== 200 || !loginRes.body.data.token) throw new Error('Login failed');
    console.log('✔ User Login passed.');

    // 2. Subjects & Topics
    console.log('\n--- 2. Subjects & Topics ---');
    const subRes = await request.post('/api/subjects').set('Authorization', `Bearer ${token}`).send({
      name: 'Artificial Intelligence', description: 'Search, ML, Neural Nets', examDate: '2026-12-01'
    });
    subjectId = subRes.body.data._id;

    const topRes = await request.post('/api/topics').set('Authorization', `Bearer ${token}`).send({
      subjectId, name: 'Gradient Descent Optimization', difficulty: 4
    });
    topicId = topRes.body.data._id;
    console.log('✔ Subject & Topic created successfully.');

    // 3. Study Session Tracking
    console.log('\n--- 3. Study Session Tracking & Analytics ---');
    const sessRes = await request.post('/api/study-sessions').set('Authorization', `Bearer ${token}`).send({
      subjectId, topicId, duration: 45, studyType: 'Learning', notes: 'Studied stochastic gradient descent formulas'
    });
    if (sessRes.status !== 201) throw new Error('Session creation failed');

    const analyticsRes = await request.get('/api/study-sessions/analytics').set('Authorization', `Bearer ${token}`);
    if (analyticsRes.status !== 200 || analyticsRes.body.data.todayMinutes !== 45) throw new Error('Analytics failed');
    console.log('✔ Study session tracked & 45 mins logged.');

    // 4. Adaptive Quiz Engine
    console.log('\n--- 4. Adaptive Quiz Engine ---');
    const quizRes = await request.post('/api/quizzes').set('Authorization', `Bearer ${token}`).send({
      subjectId, topicId, difficulty: 4, questions: [{
        question: 'What hyperparameter controls the step size in Gradient Descent?',
        options: ['Batch Size', 'Learning Rate', 'Momentum', 'Epochs'],
        correctAnswer: 1,
        explanation: 'Learning rate controls step size along the gradient descent vector.',
        difficulty: 3,
        conceptTag: 'Hyperparameters'
      }]
    });
    quizId = quizRes.body.data._id;

    const attemptRes = await request.post(`/api/quizzes/${quizId}/attempt`).set('Authorization', `Bearer ${token}`).send({
      answers: [1], timeTaken: 20
    });
    if (attemptRes.status !== 200 || attemptRes.body.data.score !== 100) throw new Error('Quiz attempt submission failed');
    console.log('✔ Quiz attempted with 100% score.');

    // 5. Topic Mastery & Forgetting Risk Engine
    console.log('\n--- 5. Topic Mastery & Forgetting-Risk Engines ---');
    const masteryRes = await request.get(`/api/mastery/topic/${topicId}`).set('Authorization', `Bearer ${token}`);
    if (masteryRes.status !== 200) throw new Error('Mastery check failed');
    console.log('✔ Mastery Score calculated:', masteryRes.body.data.masteryScore + '%', '| Risk Category:', masteryRes.body.data.riskCategory);

    // 6. Python ML Service Inference
    console.log('\n--- 6. Python ML Service Inference Pipeline ---');
    const mlRisk = await mlService.predictForgettingRisk({
      days_since_last_revision: 5, historical_accuracy: 100, revision_count: 2, topic_difficulty: 4, study_duration_mins: 45
    });
    console.log('✔ ML Service prediction returned risk score:', mlRisk.risk_score + '%', '| Version:', mlRisk.model_version);

    // 7. Recommendations Engine
    console.log('\n--- 7. Personalized Recommendation Engine ---');
    const recRes = await request.post('/api/recommendations/generate').set('Authorization', `Bearer ${token}`);
    if (recRes.status !== 200) throw new Error('Recommendation engine failed');
    console.log('✔ Recommendations generated.');

    // 8. Main Dashboard Real Aggregated Metrics
    console.log('\n--- 8. Main Dashboard Integration ---');
    const dashRes = await request.get('/api/dashboard').set('Authorization', `Bearer ${token}`);
    if (dashRes.status !== 200) throw new Error('Dashboard API failed');
    console.log('✔ Dashboard verified.');
    console.log('   - Overall Progress:', dashRes.body.data.overallProgress + '%');
    console.log('   - Exam Readiness:', dashRes.body.data.examReadiness + '%');
    console.log('   - Study Streak:', dashRes.body.data.currentStreak + ' day(s)');

    // Teardown
    await User.findByIdAndDelete(userId);
    await Subject.findByIdAndDelete(subjectId);
    await Topic.findByIdAndDelete(topicId);
    await StudySession.deleteMany({ userId });
    await Quiz.findByIdAndDelete(quizId);
    await QuizAttempt.deleteMany({ userId });
    await TopicMastery.deleteMany({ userId });
    await Recommendation.deleteMany({ userId });
    await StudyPlan.deleteMany({ userId });

    console.log('\n✔ Teardown complete.');
    console.log('\n🎉 ALL MASTER END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Master E2E Test Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runMasterE2ETest();
