const express = require('express');
const router = express.Router();
const {
  getAllDegrees,
  createDegree,
  updateDegree,
  deleteDegree
} = require('../controllers/degreeController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllDegrees);
router.post('/', authenticateToken, createDegree);
router.put('/:id', authenticateToken, updateDegree);
router.delete('/:id', authenticateToken, deleteDegree);

module.exports = router;
