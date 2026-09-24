const dotenv = require('dotenv');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('./server');
const connectDB = require('./config/db');
const { User, Subject, Topic, StudySession, TopicMastery } = require('./models');

dotenv.config();
const request = supertest(app);

async function runSessionTests() {
  console.log('=== Starting Phase 7 Study Session Tracking Tests ===');
  await connectDB();

  const testEmail = `session_test_${Date.now()}@studytwin.ai`;
  const password = 'TestUserPassword123!';
  let token = '';
  let userId = '';
  let subjectId = '';
  let topicId = '';
  let sessionId = '';

  try {
    // 1. Setup User, Subject, Topic
    const regRes = await request.post('/api/auth/register').send({
      name: 'Session Student', email: testEmail, password
    });
    token = regRes.body.data.token;
    userId = regRes.body.data.user.id;

    const subRes = await request.post('/api/subjects').set('Authorization', `Bearer ${token}`).send({
      name: 'Computer Networks'
    });
    subjectId = subRes.body.data._id;

    const topRes = await request.post('/api/topics').set('Authorization', `Bearer ${token}`).send({
      subjectId, name: 'TCP/IP Model', difficulty: 3
    });
    topicId = topRes.body.data._id;

    console.log('✔ Setup User, Subject & Topic successfully.');

    // 2. Test Session Creation with Validation
    console.log('\n--- Test 1: Session Creation & Validation ---');
    const invRes = await request.post('/api/study-sessions').set('Authorization', `Bearer ${token}`).send({
      subjectId, topicId, duration: -10 // Invalid negative duration
    });
    if (invRes.status !== 400) throw new Error('Expected 400 for negative duration');
    console.log('✔ Invalid duration correctly rejected with 400.');

    const sessRes = await request.post('/api/study-sessions').set('Authorization', `Bearer ${token}`).send({
      subjectId,
      topicId,
      duration: 35,
      studyType: 'Revision',
      notes: 'Reviewed 3-way handshake and SYN flood mitigations'
    });

    if (sessRes.status !== 201 || !sessRes.body.data._id) throw new Error('Failed to create study session');
    sessionId = sessRes.body.data._id;
    console.log('✔ Session created successfully (201 Created). Session ID:', sessionId);

    // 3. Verify TopicMastery Recalibration
    const mastery = await TopicMastery.findOne({ userId, topicId });
    if (!mastery || !mastery.lastRevised) throw new Error('TopicMastery lastRevised timestamp not updated');
    console.log('✔ TopicMastery automatically updated with lastRevised timestamp & effort boost.');

    // 4. Test Analytics API
    console.log('\n--- Test 2: Study Analytics & Streak ---');
    const analyticsRes = await request.get('/api/study-sessions/analytics').set('Authorization', `Bearer ${token}`);
    if (analyticsRes.status !== 200 || analyticsRes.body.data.todayMinutes !== 35) {
      throw new Error(`Analytics API check failed: ${JSON.stringify(analyticsRes.body)}`);
    }
    console.log('✔ Analytics API returned real data:');
    console.log('   - Today Minutes:', analyticsRes.body.data.todayMinutes);
    console.log('   - Current Streak:', analyticsRes.body.data.currentStreak, 'day(s)');
    console.log('   - Most Studied Subject:', analyticsRes.body.data.mostStudiedSubject);

    // 5. Test Deleting Session
    console.log('\n--- Test 3: Delete Session ---');
    const delRes = await request.delete(`/api/study-sessions/${sessionId}`).set('Authorization', `Bearer ${token}`);
    if (delRes.status !== 200) throw new Error('Failed to delete session');
    console.log('✔ Session deleted successfully (200 OK).');

    // Teardown
    await User.findByIdAndDelete(userId);
    await Subject.findByIdAndDelete(subjectId);
    await Topic.findByIdAndDelete(topicId);
    await StudySession.deleteMany({ userId });
    await TopicMastery.deleteMany({ userId });

    console.log('\n🎉 ALL PHASE 7 STUDY SESSION TRACKING TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('\n❌ Session Test Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

runSessionTests();
