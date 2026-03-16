const express = require('express');
const router = express.Router();
const {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  getAlumniStats
} = require('../controllers/alumniController');
const { authenticateToken, isAdmin, canAccess } = require('../middleware/auth');

router.get('/', authenticateToken, getAllAlumni);
router.get('/stats', authenticateToken, getAlumniStats);
router.get('/:id', authenticateToken, getAlumniById);
router.post('/', authenticateToken, isAdmin, createAlumni);
router.put('/:id', authenticateToken, updateAlumni);
router.delete('/:id', authenticateToken, isAdmin, deleteAlumni);

module.exports = router;