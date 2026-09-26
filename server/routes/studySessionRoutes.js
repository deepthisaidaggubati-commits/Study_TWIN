const express = require('express');
const router = express.Router();
const studySessionController = require('../controllers/studySessionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', studySessionController.getSessions);
router.post('/', studySessionController.createSession);
router.get('/stats', studySessionController.getStudyAnalytics);
router.get('/analytics', studySessionController.getStudyAnalytics);
router.get('/:id', studySessionController.getSessionById);
router.delete('/:id', studySessionController.deleteSession);

module.exports = router;
