const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllJobs);
router.post('/', authenticateToken, createJob);
router.put('/:id', authenticateToken, updateJob);
router.delete('/:id', authenticateToken, deleteJob);

module.exports = router;
