const subjectService = require('../services/subjectService');

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await subjectService.getSubjects(req.user._id);
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching subjects' });
  }
};

const getSubjectById = async (req, res, next) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching subject' });
  }
};

const createSubject = async (req, res, next) => {
  try {
    const subject = await subjectService.createSubject(req.user._id, req.body);
    res.status(201).json({ success: true, message: 'Subject created successfully', data: subject });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error creating subject' });
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const updated = await subjectService.updateSubject(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Subject updated successfully', data: updated });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error updating subject' });
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const result = await subjectService.deleteSubject(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error deleting subject' });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
