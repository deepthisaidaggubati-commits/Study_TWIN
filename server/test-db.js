const dotenv = require('dotenv');
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

async function runDatabaseTests() {
  console.log('=== Starting Phase 2 MongoDB & Mongoose Models Test ===');
  
  // 1. Test Connection
  const conn = await connectDB();
  console.log('✔ MongoDB connection verified.');

  try {
    // Clean test sandbox namespace
    await User.deleteMany({ email: 'phase2_test_user@studytwin.ai' });

    // 2. Test User Model Creation
    const testUser = await User.create({
      name: 'Phase2 Test Student',
      email: 'phase2_test_user@studytwin.ai',
      passwordHash: '$2a$10$e8Z4wZ.testpasswordhashstring',
      academicLevel: 'Undergraduate',
      branch: 'Computer Science',
      graduationYear: 2026
    });
    console.log('✔ User Model test passed:', testUser._id);

    // 3. Test Subject Model Creation
    const testSubject = await Subject.create({
      userId: testUser._id,
      name: 'Database Management Systems',
      description: 'Relational Database Concepts and SQL',
      examDate: new Date('2026-12-15')
    });
    console.log('✔ Subject Model test passed:', testSubject._id);

    // 4. Test Topic Model Creation (with prerequisites relation)
    const testTopicPrereq = await Topic.create({
      subjectId: testSubject._id,
      name: 'Relational Algebra',
      description: 'Foundational set operations',
      difficulty: 2
    });

    const testTopic = await Topic.create({
      subjectId: testSubject._id,
      name: 'Database Normalization',
      description: '1NF, 2NF, 3NF, BCNF Decomposition',
      difficulty: 4,
      prerequisites: [testTopicPrereq._id]
    });
    console.log('✔ Topic Model & Prerequisite relationship test passed:', testTopic._id);

    // 5. Test StudySession Model Creation
    const now = new Date();
    const startTime = new Date(now.getTime() - 45 * 60 * 1000);
    const testSession = await StudySession.create({
      userId: testUser._id,
      subjectId: testSubject._id,
      topicId: testTopic._id,
      startTime: startTime,
      endTime: now,
      duration: 45,
      studyType: 'Learning',
      notes: 'Focused on 3NF functional dependencies'
    });
    console.log('✔ StudySession Model test passed:', testSession._id);

    // 6. Test Quiz & QuizAttempt Models Creation
    const testQuiz = await Quiz.create({
      subjectId: testSubject._id,
      topicId: testTopic._id,
      difficulty: 4,
      questions: [{
        question: 'Which normal form eliminates partial dependency?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: 1,
        explanation: '2NF requires relation to be in 1NF and no non-prime attribute dependent on any candidate key proper subset.',
        difficulty: 3,
        conceptTag: 'Normalization'
      }]
    });
    console.log('✔ Quiz Model test passed:', testQuiz._id);

    const testAttempt = await QuizAttempt.create({
      userId: testUser._id,
      quizId: testQuiz._id,
      score: 100,
      totalQuestions: 1,
      correctAnswers: 1,
      incorrectAnswers: 0,
      timeTaken: 42
    });
    console.log('✔ QuizAttempt Model test passed:', testAttempt._id);

    // 7. Test TopicMastery Model Creation
    const testMastery = await TopicMastery.create({
      userId: testUser._id,
      topicId: testTopic._id,
      masteryScore: 85,
      confidence: 78,
      attempts: 1,
      accuracy: 100,
      lastStudied: now,
      lastRevised: now,
      forgettingRisk: 15
    });
    console.log('✔ TopicMastery Model test passed:', testMastery._id);

    // 8. Test Recommendation Model Creation
    const testRec = await Recommendation.create({
      userId: testUser._id,
      topicId: testTopic._id,
      recommendationType: 'Revision',
      priority: 'High',
      reason: 'Scheduled review for 3NF normalization retention',
      estimatedDuration: 30
    });
    console.log('✔ Recommendation Model test passed:', testRec._id);

    // 9. Test StudyPlan Model Creation
    const testPlan = await StudyPlan.create({
      userId: testUser._id,
      date: new Date(),
      tasks: [{
        topicId: testTopic._id,
        taskType: 'Revise',
        estimatedDuration: 30,
        completed: false
      }],
      estimatedDuration: 30
    });
    console.log('✔ StudyPlan Model test passed:', testPlan._id);

    // Clean up test documents
    await User.deleteMany({ email: 'phase2_test_user@studytwin.ai' });
    await Subject.deleteMany({ userId: testUser._id });
    await Topic.deleteMany({ subjectId: testSubject._id });
    await StudySession.deleteMany({ userId: testUser._id });
    await Quiz.deleteMany({ subjectId: testSubject._id });
    await QuizAttempt.deleteMany({ userId: testUser._id });
    await TopicMastery.deleteMany({ userId: testUser._id });
    await Recommendation.deleteMany({ userId: testUser._id });
    await StudyPlan.deleteMany({ userId: testUser._id });

    console.log('✔ Cleaned up test sandbox records.');
    console.log('🎉 ALL PHASE 2 MONGODB & MONGOOSE MODEL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Model Test Failed:', err);
    process.exit(1);
  } finally {
    await conn.disconnect();
  }
}

runDatabaseTests();
