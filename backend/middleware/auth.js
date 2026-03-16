const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token is required' 
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          success: false,
          message: 'Invalid or expired token' 
        });
      }

      // Add user info to request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Token verification failed' 
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
  next();
};

// Check if user can access resource (admin or owner)
const canAccess = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.role === 'admin' || req.user.id == resourceUserId) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
  };
};

module.exports = { authenticateToken, isAdmin, canAccess };