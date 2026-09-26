const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const StudySession = require('../models/StudySession');
const QuizAttempt = require('../models/QuizAttempt');
const TopicMastery = require('../models/TopicMastery');
const Recommendation = require('../models/Recommendation');

const getDashboardData = async (userId) => {
  // 1. Fetch Subjects & Topics
  const subjects = await Subject.find({ userId }).sort({ examDate: 1 });
  const subjectIds = subjects.map(s => s._id);

  const topics = await Topic.find({ subjectId: { $in: subjectIds } }).populate('subjectId', 'name');
  const topicIds = topics.map(t => t._id);

  // 2. Fetch Topic Mastery Records
  const masteries = await TopicMastery.find({ userId, topicId: { $in: topicIds } })
    .populate({
      path: 'topicId',
      select: 'name difficulty subjectId',
      populate: { path: 'subjectId', select: 'name' }
    });

  const totalTopicsCount = topics.length;

  const overallProgress = totalTopicsCount > 0
    ? Math.round(masteries.reduce((sum, m) => sum + (m.masteryScore || 0), 0) / totalTopicsCount)
    : 0;

  // Complete Topic Mastery List for full view
  const topicMasteryList = masteries.map(m => {
    const daysSinceLastRevised = m.lastRevised
      ? Math.floor((new Date() - new Date(m.lastRevised)) / (1000 * 60 * 60 * 24))
      : null;

    return {
      id: m._id,
      topicId: m.topicId?._id,
      topicName: m.topicId?.name || 'Topic',
      subjectName: m.topicId?.subjectId?.name || 'Subject',
      difficulty: m.topicId?.difficulty || 3,
      masteryScore: m.masteryScore || 0,
      accuracy: m.accuracy || 0,
      attempts: m.attempts || 0,
      lastStudied: m.lastStudied,
      lastRevised: m.lastRevised,
      daysSinceLastRevised,
      forgettingRisk: m.forgettingRisk || 0
    };
  });

  // Strong / Weak / High Risk Topic breakdowns
  const strongTopics = topicMasteryList.filter(m => m.masteryScore >= 75);

  const weakTopics = topicMasteryList
    .filter(m => m.masteryScore < 50)
    .map(m => ({
      ...m,
      reason: m.attempts === 0
        ? 'No practice quizzes or study sessions logged yet'
        : `Recent quiz accuracy is ${m.accuracy}% and mastery is below 50%`,
      recommendedAction: m.masteryScore < 30 ? 'Deep Study Session (45 mins)' : 'Practice Quiz (25 mins)'
    }));

  const highRiskTopics = topicMasteryList
    .filter(m => m.forgettingRisk >= 60 || (m.daysSinceLastRevised !== null && m.daysSinceLastRevised >= 5))
    .map(m => ({
      ...m,
      riskCategory: m.forgettingRisk >= 80 ? 'Very High' : 'High',
      recommendedAction: `Revise for ${m.forgettingRisk >= 80 ? 45 : 35} minutes`
    }));

  // 3. Study Session Time Calculations & Streak
  const sessions = await StudySession.find({ userId }).sort({ startTime: -1 });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const todaySessions = sessions.filter(s => new Date(s.endTime || s.startTime) >= startOfDay);
  const todayStudyTime = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const todaySessionsCount = todaySessions.length;
  const todayTopicsCount = new Set(todaySessions.map(s => s.topicId?.toString())).size;

  const weeklyStudyTime = sessions
    .filter(s => new Date(s.startTime) >= startOfWeek)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  // Calculate Streak
  let currentStreak = 0;
  if (sessions.length > 0) {
    const sessionDates = new Set(
      sessions.map(s => new Date(s.startTime).toISOString().split('T')[0])
    );
    let checkDate = new Date();
    while (sessionDates.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // 4. Exam Readiness Heuristic Calculation
  const topicCoverageRatio = totalTopicsCount > 0 ? (masteries.filter(m => m.masteryScore > 20).length / totalTopicsCount) : 0;
  const streakFactor = Math.min(1, currentStreak / 7);
  const rawReadiness = (overallProgress * 0.5) + (topicCoverageRatio * 100 * 0.25) + (streakFactor * 100 * 0.25) - (highRiskTopics.length * 4);
  const examReadiness = Math.max(0, Math.min(100, Math.round(rawReadiness)));

  // 5. Recent Quiz Performance
  const recentAttempts = await QuizAttempt.find({ userId })
    .populate({
      path: 'quizId',
      select: 'topicId difficulty',
      populate: { path: 'topicId', select: 'name' }
    })
    .sort({ attemptedAt: -1 })
    .limit(5);

  const quizPerformance = recentAttempts.map(a => ({
    id: a._id,
    topicName: a.quizId?.topicId?.name || 'Quiz',
    score: a.score,
    correctAnswers: a.correctAnswers,
    totalQuestions: a.totalQuestions,
    attemptedAt: a.attemptedAt
  }));

  // 6. Top Recommendation
  const topRecommendation = await Recommendation.findOne({ userId, completed: false })
    .populate('topicId', 'name')
    .sort({ priority: -1, createdAt: -1 });

  // 7. Upcoming Exams
  const upcomingExams = subjects
    .filter(s => s.examDate && new Date(s.examDate) >= new Date())
    .map(s => {
      const daysRemaining = Math.ceil((new Date(s.examDate) - new Date()) / (1000 * 60 * 60 * 24));
      let prepStatus = 'On Track';
      if (overallProgress < 50 || daysRemaining < 7) prepStatus = 'Needs Focus';
      if (daysRemaining < 3) prepStatus = 'Critical Revision';

      return {
        id: s._id,
        name: s.name,
        examDate: s.examDate,
        daysRemaining,
        prepStatus
      };
    });

  // 8. 7-Day Activity Heatmap & Weekly Trend
  const weeklyActivityHeatmap = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessions.filter(s => new Date(s.startTime).toISOString().split('T')[0] === dateStr);
    const dayMins = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    weeklyActivityHeatmap.push({
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: dayMins,
      sessionsCount: daySessions.length
    });
  }

  return {
    overallProgress,
    examReadiness,
    currentStreak,
    todayStudyTime,
    todaySessionsCount,
    todayTopicsCount,
    weeklyStudyTime,
    totalTopicsCount,
    topicMasteryList,
    strongTopics,
    weakTopics,
    highRiskTopics,
    recommendedNextActivity: topRecommendation ? {
      id: topRecommendation._id,
      topicName: topRecommendation.topicId?.name || 'Topic',
      recommendationType: topRecommendation.recommendationType,
      priority: topRecommendation.priority,
      reason: topRecommendation.reason,
      estimatedDuration: topRecommendation.estimatedDuration
    } : null,
    quizPerformance,
    upcomingExams,
    weeklyActivityHeatmap,
    masteryDistribution: {
      low: topicMasteryList.filter(m => m.masteryScore <= 40).length,
      medium: topicMasteryList.filter(m => m.masteryScore > 40 && m.masteryScore <= 70).length,
      high: topicMasteryList.filter(m => m.masteryScore > 70).length
    }
  };
};

module.exports = {
  getDashboardData
};
