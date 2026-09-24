const express = require('express');
const router = express.Router();
const studyPlanController = require('../controllers/studyPlanController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', studyPlanController.getStudyPlans);
router.post('/generate', studyPlanController.generateStudyPlan);
router.put('/:id/tasks', studyPlanController.updateTaskStatus);

module.exports = router;
