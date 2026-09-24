const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', topicController.getTopics);
router.post('/', topicController.createTopic);
router.get('/:id', topicController.getTopicById);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);

module.exports = router;
