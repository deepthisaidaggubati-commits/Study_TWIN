const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const TopicMastery = require('../models/TopicMastery');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const Recommendation = require('../models/Recommendation');

const generateQuestionsForTopic = (topicName, description, difficulty) => {
  const name = topicName || 'General Concept';
  const desc = description || 'core subject material';
  const diff = difficulty || 3;

  return [
    {
      question: `What is the primary core objective when studying ${name}?`,
      options: [
        `To master fundamental principles of ${name} and apply them to problem solving`,
        `To memorize definitions without practical execution`,
        `To bypass prerequisite concepts in ${desc}`,
        `To avoid testing retention and performance`
      ],
      correctAnswer: 0,
      explanation: `Understanding core principles of ${name} enables higher-order synthesis and long-term retention.`,
      difficulty: Math.max(1, diff - 1),
      conceptTag: 'Core Concept'
    },
    {
      question: `Which key characteristic is most critical when evaluating ${name}?`,
      options: [
        `System performance, edge case handling, and structural efficiency`,
        `Arbitrary execution order without verification`,
        `Ignoring time and space constraints`,
        `Static hardcoded logic without adaptability`
      ],
      correctAnswer: 0,
      explanation: `Evaluation of ${name} relies on assessing efficiency, constraints, and correctness under dynamic conditions.`,
      difficulty: diff,
      conceptTag: 'Optimization & Analysis'
    },
    {
      question: `When applying ${name} in practical scenarios, which design consideration is paramount?`,
      options: [
        `Maintaining scalability, modularity, and alignment with ${desc}`,
        `Increasing complexity unnecessarily`,
        `Relying on deprecated methods without testing`,
        `Eliminating verification checks during execution`
      ],
      correctAnswer: 0,
      explanation: `Practical application of ${name} requires maintaining clean modular architecture and robust verification.`,
      difficulty: Math.min(5, diff + 1),
      conceptTag: 'Practical Application'
    }
  ];
};

const getQuizzes = async (topicId, subjectId) => {
  const filter = {};
  if (topicId) filter.topicId = topicId;
  if (subjectId) filter.subjectId = subjectId;

  let quizzes = await Quiz.find(filter)
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty description');

  // If no quizzes exist in DB, auto-generate adaptive quizzes for existing topics in DB
  if (quizzes.length === 0) {
    const topicFilter = {};
    if (topicId) topicFilter._id = topicId;
    if (subjectId) topicFilter.subjectId = subjectId;

    const topics = await Topic.find(topicFilter).populate('subjectId', 'name');
    for (const top of topics) {
      if (!top.subjectId) continue;
      const questions = generateQuestionsForTopic(top.name, top.description, top.difficulty);
      const newQuiz = await Quiz.create({
        subjectId: top.subjectId._id,
        topicId: top._id,
        questions,
        difficulty: top.difficulty || 3
      });
    }

    // Re-query created quizzes
    quizzes = await Quiz.find(filter)
      .populate('subjectId', 'name')
      .populate('topicId', 'name difficulty description');
  }

  return quizzes;
};

const generateAdaptiveQuiz = async (userId, topicId) => {
  const topic = await Topic.findById(topicId).populate('subjectId', 'name');
  if (!topic) {
    throw { statusCode: 404, message: 'Topic not found.' };
  }

  const mastery = await TopicMastery.findOne({ userId, topicId });
  const currentMasteryScore = mastery?.masteryScore || 0;
  
  // Adapt quiz difficulty based on current student mastery
  let adaptiveDifficulty = topic.difficulty || 3;
  if (currentMasteryScore > 75) adaptiveDifficulty = Math.min(5, adaptiveDifficulty + 1);
  else if (currentMasteryScore < 35) adaptiveDifficulty = Math.max(1, adaptiveDifficulty - 1);

  const questions = generateQuestionsForTopic(topic.name, topic.description, adaptiveDifficulty);

  const quiz = await Quiz.create({
    subjectId: topic.subjectId._id,
    topicId: topic._id,
    questions,
    difficulty: adaptiveDifficulty
  });

  return await Quiz.findById(quiz._id)
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty description');
};

const getQuizById = async (quizId) => {
  const quiz = await Quiz.findById(quizId)
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty');

  if (!quiz) {
    throw { statusCode: 404, message: 'Quiz not found.' };
  }
  return quiz;
};

const createQuiz = async (data) => {
  const { subjectId, topicId, questions, difficulty } = data;

  if (!subjectId || !topicId || !questions || !Array.isArray(questions) || questions.length === 0) {
    throw { statusCode: 400, message: 'subjectId, topicId, and a valid list of questions are required.' };
  }

  const quiz = await Quiz.create({
    subjectId,
    topicId,
    questions,
    difficulty: difficulty || 3
  });

  return await Quiz.findById(quiz._id)
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty');
};

const submitQuizAttempt = async (userId, quizId, answers, timeTaken) => {
  const quiz = await Quiz.findById(quizId).populate('topicId', 'name subjectId');
  if (!quiz) {
    throw { statusCode: 404, message: 'Quiz not found.' };
  }

  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
    throw { statusCode: 400, message: 'Please provide answers for all quiz questions.' };
  }

  let correctCount = 0;
  const questionResults = quiz.questions.map((q, idx) => {
    const isCorrect = Number(answers[idx]) === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q._id,
      question: q.question,
      options: q.options,
      userAnswer: answers[idx],
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      conceptTag: q.conceptTag || 'General'
    };
  });

  const totalQuestions = quiz.questions.length;
  const incorrectCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);

  const attempt = await QuizAttempt.create({
    userId,
    quizId: quiz._id,
    score,
    totalQuestions,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    timeTaken: timeTaken || 0,
    attemptedAt: new Date()
  });

  // Update TopicMastery
  let mastery = await TopicMastery.findOne({ userId, topicId: quiz.topicId._id });
  if (!mastery) {
    mastery = new TopicMastery({ userId, topicId: quiz.topicId._id });
  }

  const newAttemptsCount = (mastery.attempts || 0) + 1;
  const oldAccuracy = mastery.accuracy || 0;
  const newAccuracy = Math.round(((oldAccuracy * (newAttemptsCount - 1)) + score) / newAttemptsCount);

  // Mastery Formula: Weighted combination of overall accuracy (55%) + recent score (35%) + attempt volume (10%)
  const newMasteryScore = Math.min(100, Math.round((newAccuracy * 0.55) + (score * 0.35) + (Math.min(10, newAttemptsCount) * 1)));

  mastery.attempts = newAttemptsCount;
  mastery.accuracy = newAccuracy;
  mastery.masteryScore = newMasteryScore;
  mastery.lastRevised = new Date();
  
  // Decrease forgetting risk on quiz completion
  const riskReduction = score >= 80 ? 30 : (score >= 60 ? 15 : 5);
  mastery.forgettingRisk = Math.max(0, (mastery.forgettingRisk || 50) - riskReduction);

  await mastery.save();

  // Trigger automated contextual recommendation update
  if (score < 60) {
    await Recommendation.create({
      userId,
      topicId: quiz.topicId._id,
      recommendationType: 'Practice Quiz',
      priority: 'High',
      reason: `Recent quiz accuracy for ${quiz.topicId.name} was ${score}%. Reinforce weak concepts before the exam.`,
      estimatedDuration: 25
    });
  } else if (mastery.forgettingRisk > 50) {
    await Recommendation.create({
      userId,
      topicId: quiz.topicId._id,
      recommendationType: 'Revision',
      priority: 'Medium',
      reason: `Good quiz score on ${quiz.topicId.name}! Schedule a quick 20-minute revision in 4 days to consolidate memory.`,
      estimatedDuration: 20
    });
  }

  return {
    attemptId: attempt._id,
    score,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    totalQuestions,
    timeTaken: timeTaken || 0,
    questionResults,
    updatedMastery: {
      masteryScore: mastery.masteryScore,
      accuracy: mastery.accuracy,
      forgettingRisk: mastery.forgettingRisk,
      attempts: mastery.attempts
    }
  };
};

const getQuizHistory = async (userId) => {
  const attempts = await QuizAttempt.find({ userId })
    .populate({
      path: 'quizId',
      select: 'subjectId topicId difficulty questions',
      populate: [
        { path: 'subjectId', select: 'name' },
        { path: 'topicId', select: 'name difficulty' }
      ]
    })
    .sort({ attemptedAt: -1 });

  return attempts.map(a => ({
    id: a._id,
    quizId: a.quizId?._id,
    subjectName: a.quizId?.subjectId?.name || 'Subject',
    topicName: a.quizId?.topicId?.name || 'Topic',
    difficulty: a.quizId?.difficulty || 3,
    score: a.score,
    correctAnswers: a.correctAnswers,
    totalQuestions: a.totalQuestions,
    timeTaken: a.timeTaken,
    attemptedAt: a.attemptedAt
  }));
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  generateAdaptiveQuiz,
  submitQuizAttempt,
  getQuizHistory
};
