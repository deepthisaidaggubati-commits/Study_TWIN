const express = require('express');
const router = express.Router();
const masteryController = require('../controllers/masteryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', masteryController.getUserMasteryRecords);
router.get('/topic/:topicId', masteryController.getMasteryByTopic);
router.put('/topic/:topicId', masteryController.updateTopicMastery);

module.exports = router;
