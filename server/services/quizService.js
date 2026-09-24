const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const TopicMastery = require('../models/TopicMastery');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const Recommendation = require('../models/Recommendation');

const getQuizzes = async (topicId, subjectId) => {
  const filter = {};
  if (topicId) filter.topicId = topicId;
  if (subjectId) filter.subjectId = subjectId;

  let quizzes = await Quiz.find(filter)
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty');

  return quizzes;
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
  submitQuizAttempt,
  getQuizHistory
};
