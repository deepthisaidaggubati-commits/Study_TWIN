const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

const getSubjects = async (userId) => {
  return await Subject.find({ userId }).sort({ createdAt: -1 });
};

const getSubjectById = async (subjectId, userId) => {
  const subject = await Subject.findOne({ _id: subjectId, userId });
  if (!subject) {
    throw { statusCode: 404, message: 'Subject not found or access denied.' };
  }
  return subject;
};

const createSubject = async (userId, data) => {
  const { name, description, examDate } = data;
  if (!name) {
    throw { statusCode: 400, message: 'Subject name is required.' };
  }

  const subject = await Subject.create({
    userId,
    name,
    description: description || '',
    examDate: examDate ? new Date(examDate) : null
  });

  return subject;
};

const updateSubject = async (subjectId, userId, updateData) => {
  const subject = await Subject.findOne({ _id: subjectId, userId });
  if (!subject) {
    throw { statusCode: 404, message: 'Subject not found or access denied.' };
  }

  if (updateData.name !== undefined) subject.name = updateData.name;
  if (updateData.description !== undefined) subject.description = updateData.description;
  if (updateData.examDate !== undefined) subject.examDate = updateData.examDate ? new Date(updateData.examDate) : null;

  await subject.save();
  return subject;
};

const deleteSubject = async (subjectId, userId) => {
  const subject = await Subject.findOneAndDelete({ _id: subjectId, userId });
  if (!subject) {
    throw { statusCode: 404, message: 'Subject not found or access denied.' };
  }
  // Delete associated topics
  await Topic.deleteMany({ subjectId });
  return { message: 'Subject and associated topics deleted successfully.' };
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
