const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check Admin table first
    const [admins] = await pool.query(
      'SELECT * FROM Admin WHERE email = ?', 
      [email]
    );
    
    if (admins.length > 0) {
      const admin = admins[0];
      const validPassword = await bcrypt.compare(password, admin.password);
      console.log(validPassword)
      if (validPassword) {
        const token = jwt.sign(
          { 
            id: admin.id, 
            email: admin.email, 
            role: 'admin',
            name: admin.name
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );
        
        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: 'admin'
            }
          }
        });
      }
    }

    // Check Alumni table
    const [alumni] = await pool.query(
      'SELECT * FROM Alumni WHERE email = ?', 
      [email]
    );
    
    if (alumni.length > 0) {
      const alum = alumni[0];
      const validPassword = await bcrypt.compare(password, alum.password);
      console.log(validPassword)
      if (validPassword) {
        const token = jwt.sign(
          { 
            id: alum.id, 
            email: alum.email, 
            role: 'alumni',
            name: alum.name
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );
        
        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: alum.id,
              name: alum.name,
              email: alum.email,
              role: 'alumni',
              phone: alum.phone,
              batch: alum.batch
            }
          }
        });
      }
    }

    // Invalid credentials
    return res.status(401).json({ 
      success: false,
      message: 'Invalid email or password' 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query, table;
    if (userRole === 'admin') {
      table = 'Admin';
    } else {
      table = 'Alumni';
    }

    const [users] = await pool.query(
      `SELECT id, name, email, created_at FROM ${table} WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: { ...users[0], role: userRole }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user information'
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phone, batch, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Validate role
    if (!['alumni', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be alumni or admin'
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM Alumni WHERE email = ? UNION SELECT id FROM Admin WHERE email = ?',
      [email, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let result;
    if (role === 'admin') {
      // Insert new admin
      [result] = await pool.query(
        'INSERT INTO Admin (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
    } else {
      // Insert new alumni
      [result] = await pool.query(
        'INSERT INTO Alumni (name, email, phone, batch, password) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, batch || null, hashedPassword]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: result.insertId,
        email: email,
        role: role,
        name: name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: result.insertId,
          name: name,
          email: email,
          role: role,
          phone: role === 'alumni' ? phone : undefined,
          batch: role === 'alumni' ? batch : undefined
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

module.exports = { login, getCurrentUser, register };
