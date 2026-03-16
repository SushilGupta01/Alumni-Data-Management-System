const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, getAllProjects);
router.post('/', authenticateToken, isAdmin, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, isAdmin, deleteProject);

module.exports = router;