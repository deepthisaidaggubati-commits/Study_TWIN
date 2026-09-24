const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', recommendationController.getRecommendations);
router.post('/generate', recommendationController.generateRecommendations);
router.put('/:id/complete', recommendationController.markCompleted);

module.exports = router;
