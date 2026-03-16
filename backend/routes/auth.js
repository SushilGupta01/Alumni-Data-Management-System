const express = require('express');
const router = express.Router();
const { login, getCurrentUser, register } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;