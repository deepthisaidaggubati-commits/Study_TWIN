const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
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
} = require('../models');

dotenv.config();

async function seedDatabase() {
  console.log('=== Seeding StudyTwin AI Realistic Demo Dataset ===');
  const conn = await connectDB();

  try {
    // 1. Clean existing seed namespace
    const seedEmail = 'demo@studytwin.ai';
    const existingUser = await User.findOne({ email: seedEmail });
    if (existingUser) {
      await User.findByIdAndDelete(existingUser._id);
      await Subject.deleteMany({ userId: existingUser._id });
      await StudySession.deleteMany({ userId: existingUser._id });
      await QuizAttempt.deleteMany({ userId: existingUser._id });
      await TopicMastery.deleteMany({ userId: existingUser._id });
      await Recommendation.deleteMany({ userId: existingUser._id });
      await StudyPlan.deleteMany({ userId: existingUser._id });
    }

    // 2. Create Demo User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('DemoPassword123!', salt);

    const demoUser = await User.create({
      name: 'Sarah Chen',
      email: seedEmail,
      passwordHash,
      academicLevel: 'Undergraduate',
      branch: 'Computer Science & AI',
      graduationYear: 2026
    });

    console.log('✔ Demo User created:', demoUser.email);

    // 3. Create Subjects
    const dbms = await Subject.create({
      userId: demoUser._id,
      name: 'Database Management Systems',
      description: 'Relational Model, Normalization, SQL, Indexing',
      examDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) // 25 days away
    });

    const dsa = await Subject.create({
      userId: demoUser._id,
      name: 'Data Structures & Algorithms',
      description: 'Trees, Graphs, Sorting, Dynamic Programming',
      examDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days away
    });

    const os = await Subject.create({
      userId: demoUser._id,
      name: 'Operating Systems',
      description: 'Processes, Deadlocks, Memory Virtualization, File Systems',
      examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days away
    });

    console.log('✔ 3 Subjects created.');

    // 4. Create Topics (with prerequisites)
    const topicRelAlg = await Topic.create({
      subjectId: dbms._id,
      name: 'Relational Algebra',
      description: 'Select, Project, Join, and Set Operations',
      difficulty: 2
    });

    const topicNorm = await Topic.create({
      subjectId: dbms._id,
      name: 'Database Normalization (1NF to BCNF)',
      description: 'Functional Dependencies and Key Decomposition',
      difficulty: 4,
      prerequisites: [topicRelAlg._id]
    });

    const topicBST = await Topic.create({
      subjectId: dsa._id,
      name: 'Binary Search Trees & AVL',
      description: 'BST Insertion, Deletion, and Self-balancing Rotations',
      difficulty: 4
    });

    const topicDeadlocks = await Topic.create({
      subjectId: os._id,
      name: 'Deadlock Detection & Banker Algorithm',
      description: 'Resource allocation graphs, avoidance, and safety state',
      difficulty: 5
    });

    console.log('✔ 4 Topics with prerequisite linkages created.');

    // 5. Create Adaptive Quizzes
    const quizNorm = await Quiz.create({
      subjectId: dbms._id,
      topicId: topicNorm._id,
      difficulty: 4,
      questions: [
        {
          question: 'Which normal form eliminates partial functional dependency on composite candidate keys?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctAnswer: 1,
          explanation: '2NF requires relation to be in 1NF and no non-prime attribute to be functionally dependent on any proper subset of any candidate key.',
          difficulty: 3,
          conceptTag: '2NF'
        },
        {
          question: 'In 3NF, what dependency must be removed between non-prime attributes?',
          options: ['Partial Dependency', 'Transitive Dependency', 'Multivalued Dependency', 'Join Dependency'],
          correctAnswer: 1,
          explanation: '3NF requires no non-prime attribute to be transitively dependent on the primary key.',
          difficulty: 4,
          conceptTag: '3NF'
        }
      ]
    });

    const quizBST = await Quiz.create({
      subjectId: dsa._id,
      topicId: topicBST._id,
      difficulty: 4,
      questions: [
        {
          question: 'What is the worst-case search time complexity in an unbalanced BST?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctAnswer: 2,
          explanation: 'In a skewed unbalanced BST, search degrades to O(N).',
          difficulty: 3,
          conceptTag: 'Complexity'
        }
      ]
    });

    console.log('✔ 2 Adaptive Quizzes created.');

    // 6. Create Study Sessions (across past 7 days for realistic heatmap)
    const now = new Date();
    const sessionDays = [0, 1, 2, 3, 4, 5, 6];

    for (const d of sessionDays) {
      const sessDate = new Date(now);
      sessDate.setDate(sessDate.getDate() - d);
      
      await StudySession.create({
        userId: demoUser._id,
        subjectId: d % 2 === 0 ? dbms._id : dsa._id,
        topicId: d % 2 === 0 ? topicNorm._id : topicBST._id,
        startTime: sessDate,
        endTime: new Date(sessDate.getTime() + (30 + d * 10) * 60000),
        duration: 30 + d * 10,
        studyType: d % 2 === 0 ? 'Revision' : 'Learning',
        notes: `Focus session day ${d}`
      });
    }

    console.log('✔ 7 Study Sessions across past week created.');

    // 7. Create Quiz Attempts & Mastery Records
    await QuizAttempt.create({
      userId: demoUser._id,
      quizId: quizNorm._id,
      score: 100,
      totalQuestions: 2,
      correctAnswers: 2,
      incorrectAnswers: 0,
      timeTaken: 45
    });

    await TopicMastery.create({
      userId: demoUser._id,
      topicId: topicNorm._id,
      masteryScore: 82,
      confidence: 85,
      attempts: 2,
      accuracy: 100,
      lastStudied: now,
      lastRevised: now,
      forgettingRisk: 12
    });

    await TopicMastery.create({
      userId: demoUser._id,
      topicId: topicDeadlocks._id,
      masteryScore: 42,
      confidence: 40,
      attempts: 1,
      accuracy: 50,
      lastStudied: new Date(now - 8 * 24 * 60 * 60 * 1000),
      lastRevised: new Date(now - 8 * 24 * 60 * 60 * 1000),
      forgettingRisk: 78
    });

    console.log('✔ Quiz Attempts & Topic Mastery records initialized.');

    // 8. Create Recommendations
    await Recommendation.create({
      userId: demoUser._id,
      topicId: topicDeadlocks._id,
      recommendationType: 'Revision',
      priority: 'High',
      reason: 'Your recent quiz accuracy for Deadlock Detection is 50% and it has not been revised for 8 days.',
      estimatedDuration: 35
    });

    console.log('✔ Data-driven recommendation created.');
    console.log('🎉 SEEDING COMPLETE! Login with demo@studytwin.ai / DemoPassword123!');
  } catch (err) {
    console.error('❌ Seeding Error:', err);
  } finally {
    await conn.disconnect();
  }
}

seedDatabase();
