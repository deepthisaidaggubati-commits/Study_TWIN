const StudyPlan = require('../models/StudyPlan');
const TopicMastery = require('../models/TopicMastery');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

const getStudyPlans = async (userId) => {
  return await StudyPlan.find({ userId })
    .populate('tasks.topicId', 'name difficulty')
    .sort({ date: -1 });
};

const generateStudyPlan = async (userId, data) => {
  const { availableHoursPerDay, examDate, targetSubjectIds } = data;
  const hours = availableHoursPerDay ? Number(availableHoursPerDay) : 2;

  // Find user's topics ordered by mastery score (ascending)
  const masteries = await TopicMastery.find({ userId })
    .populate({
      path: 'topicId',
      select: 'name subjectId',
      populate: { path: 'subjectId', select: 'name' }
    })
    .sort({ masteryScore: 1 });

  const tasks = [];
  let remainingMinutes = hours * 60;

  for (const m of masteries) {
    if (remainingMinutes <= 0) break;
    if (!m.topicId) continue;

    if (targetSubjectIds && targetSubjectIds.length > 0) {
      if (!targetSubjectIds.includes(m.topicId.subjectId._id.toString())) continue;
    }

    const taskType = m.masteryScore < 50 ? 'Learn' : (m.forgettingRisk > 50 ? 'Revise' : 'Practice Quiz');
    const duration = Math.min(45, remainingMinutes);

    tasks.push({
      topicId: m.topicId._id,
      taskType,
      estimatedDuration: duration,
      completed: false
    });

    remainingMinutes -= duration;
  }

  // Fallback task if no topics have mastery records yet
  if (tasks.length === 0) {
    const userSubjects = await Subject.find({ userId });
    const userTopics = await Topic.find({ subjectId: { $in: userSubjects.map(s => s._id) } });
    
    if (userTopics.length > 0) {
      tasks.push({
        topicId: userTopics[0]._id,
        taskType: 'Learn',
        estimatedDuration: 45,
        completed: false
      });
    }
  }

  const totalDuration = tasks.reduce((sum, t) => sum + t.estimatedDuration, 0);

  const plan = await StudyPlan.create({
    userId,
    date: new Date(),
    tasks,
    estimatedDuration: totalDuration,
    completed: false
  });

  return await StudyPlan.findById(plan._id).populate('tasks.topicId', 'name difficulty');
};

const updateTaskStatus = async (userId, planId, taskId, completed) => {
  const plan = await StudyPlan.findOne({ _id: planId, userId });
  if (!plan) {
    throw { statusCode: 404, message: 'Study plan not found or access denied.' };
  }

  const task = plan.tasks.id(taskId);
  if (!task) {
    throw { statusCode: 404, message: 'Task not found in study plan.' };
  }

  task.completed = completed;
  plan.completed = plan.tasks.every(t => t.completed);

  await plan.save();
  return plan;
};

module.exports = {
  getStudyPlans,
  generateStudyPlan,
  updateTaskStatus
};
