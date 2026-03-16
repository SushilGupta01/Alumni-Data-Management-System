const express = require('express');
const router = express.Router();
const {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllAchievements);
router.post('/', authenticateToken, createAchievement);
router.put('/:id', authenticateToken, updateAchievement);
router.delete('/:id', authenticateToken, deleteAchievement);

module.exports = router;
