const StudySession = require('../models/StudySession');
const TopicMastery = require('../models/TopicMastery');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

const getSessions = async (userId, filters = {}) => {
  const query = { userId };
  if (filters.subjectId) query.subjectId = filters.subjectId;
  if (filters.topicId) query.topicId = filters.topicId;
  if (filters.studyType) query.studyType = filters.studyType;

  return await StudySession.find(query)
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty')
    .sort({ startTime: -1 });
};

const getSessionById = async (sessionId, userId) => {
  const session = await StudySession.findOne({ _id: sessionId, userId })
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty');

  if (!session) {
    throw { statusCode: 404, message: 'Study session not found or access denied.' };
  }
  return session;
};

const createSession = async (userId, data) => {
  const { subjectId, topicId, startTime, endTime, duration, studyType, notes } = data;

  if (!subjectId || !topicId || duration === undefined || duration === null) {
    throw { statusCode: 400, message: 'subjectId, topicId, and duration are required.' };
  }

  const durationNum = Number(duration);
  if (isNaN(durationNum) || durationNum <= 0) {
    throw { statusCode: 400, message: 'Session duration must be a positive number of minutes.' };
  }

  // 1. Verify user owns subject
  const subject = await Subject.findOne({ _id: subjectId, userId });
  if (!subject) {
    throw { statusCode: 403, message: 'Subject not found or does not belong to active user.' };
  }

  // 2. Verify topic belongs to subject
  const topic = await Topic.findOne({ _id: topicId, subjectId });
  if (!topic) {
    throw { statusCode: 400, message: 'Topic not found or does not belong to the selected subject.' };
  }

  const allowedTypes = ['Learning', 'Revision', 'Practice', 'Quiz', 'Coding'];
  const finalType = allowedTypes.includes(studyType) ? studyType : 'Learning';

  const end = endTime ? new Date(endTime) : new Date();
  const start = startTime ? new Date(startTime) : new Date(end.getTime() - durationNum * 60000);

  const session = await StudySession.create({
    userId,
    subjectId,
    topicId,
    startTime: start,
    endTime: end,
    duration: durationNum,
    studyType: finalType,
    notes: notes || ''
  });

  // Update TopicMastery
  let mastery = await TopicMastery.findOne({ userId, topicId });
  if (!mastery) {
    mastery = new TopicMastery({ userId, topicId });
  }

  mastery.lastStudied = end;
  if (finalType === 'Revision') {
    mastery.lastRevised = end;
  }

  // Effort boost
  const effortBoost = Math.min(5, Math.round(durationNum * 0.1));
  mastery.masteryScore = Math.min(100, (mastery.masteryScore || 0) + effortBoost);

  if (finalType === 'Revision') {
    mastery.forgettingRisk = Math.max(0, (mastery.forgettingRisk || 50) - 15);
  }

  await mastery.save();

  return await StudySession.findById(session._id)
    .populate('subjectId', 'name')
    .populate('topicId', 'name difficulty');
};

const deleteSession = async (sessionId, userId) => {
  const session = await StudySession.findOneAndDelete({ _id: sessionId, userId });
  if (!session) {
    throw { statusCode: 404, message: 'Study session not found or access denied.' };
  }
  return { message: 'Study session deleted successfully.' };
};

const getStudyAnalytics = async (userId) => {
  const sessions = await StudySession.find({ userId })
    .populate('subjectId', 'name')
    .populate('topicId', 'name');

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayMinutes = sessions
    .filter(s => new Date(s.endTime || s.startTime) >= startOfDay)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  const weeklyMinutes = sessions
    .filter(s => new Date(s.startTime) >= startOfWeek)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  const monthlyMinutes = sessions
    .filter(s => new Date(s.startTime) >= startOfMonth)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  // Top Subject and Top Topic calculations
  const subjectMinutesMap = {};
  const topicMinutesMap = {};
  const studyTypeMap = { Learning: 0, Revision: 0, Practice: 0, Quiz: 0, Coding: 0 };

  sessions.forEach(s => {
    const subName = s.subjectId?.name || 'Unknown Subject';
    const topName = s.topicId?.name || 'Unknown Topic';
    const mins = s.duration || 0;

    subjectMinutesMap[subName] = (subjectMinutesMap[subName] || 0) + mins;
    topicMinutesMap[topName] = (topicMinutesMap[topName] || 0) + mins;
    if (studyTypeMap[s.studyType] !== undefined) {
      studyTypeMap[s.studyType] += mins;
    }
  });

  let mostStudiedSubject = 'None';
  let maxSubMins = 0;
  Object.entries(subjectMinutesMap).forEach(([name, mins]) => {
    if (mins > maxSubMins) {
      maxSubMins = mins;
      mostStudiedSubject = name;
    }
  });

  let mostStudiedTopic = 'None';
  let maxTopMins = 0;
  Object.entries(topicMinutesMap).forEach(([name, mins]) => {
    if (mins > maxTopMins) {
      maxTopMins = mins;
      mostStudiedTopic = name;
    }
  });

  // Calculate Streak Rules: A day is counted if user completes >= 1 valid session
  const activeDatesSorted = Array.from(
    new Set(sessions.map(s => new Date(s.startTime).toISOString().split('T')[0]))
  ).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  if (activeDatesSorted.length > 0) {
    // Current streak calculation
    let checkDate = new Date();
    while (activeDatesSorted.includes(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Longest streak calculation
    for (let i = 0; i < activeDatesSorted.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(activeDatesSorted[i - 1]);
        const curr = new Date(activeDatesSorted[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }
  }

  return {
    totalSessions,
    totalMinutes,
    todayMinutes,
    weeklyMinutes,
    monthlyMinutes,
    avgDuration,
    mostStudiedSubject,
    mostStudiedTopic,
    studyTypeDistribution: studyTypeMap,
    currentStreak,
    longestStreak
  };
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  deleteSession,
  getStudyAnalytics
};
