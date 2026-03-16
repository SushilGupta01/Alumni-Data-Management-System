const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Get all alumni
const getAllAlumni = async (req, res) => {
  try {
    const [alumni] = await pool.query(
      'SELECT id, name, email, phone, batch, created_at FROM Alumni ORDER BY created_at DESC'
    );

    // Get degrees for each alumni
    const alumniWithDegrees = await Promise.all(
      alumni.map(async (alum) => {
        try {
          const [degrees] = await pool.query(
            'SELECT id, degree_name, institution, year_of_completion, specialization FROM Degree WHERE alumni_id = ? ORDER BY year_of_completion DESC',
            [alum.id]
          );
          return { ...alum, degrees };
        } catch (error) {
          console.error('Error fetching degrees for alumni', alum.id, error);
          return { ...alum, degrees: [] };
        }
      })
    );

    return res.json({
      success: true,
      count: alumniWithDegrees.length,
      data: alumniWithDegrees
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching alumni data'
    });
  }
};

// Get single alumni
const getAlumniById = async (req, res) => {
  try {
    const { id } = req.params;

    const [alumni] = await pool.query(
      'SELECT id, name, email, phone, batch, created_at FROM Alumni WHERE id = ?',
      [id]
    );

    if (alumni.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    return res.json({
      success: true,
      data: alumni[0]
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching alumni data'
    });
  }
};

// Create new alumni (Admin only)
const createAlumni = async (req, res) => {
  try {
    const { name, email, phone, batch, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if email already exists
    const [existing] = await pool.query(
      'SELECT id FROM Alumni WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert alumni
    const [result] = await pool.query(
      'INSERT INTO Alumni (name, email, phone, batch, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, batch, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: 'Alumni created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create alumni error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating alumni'
    });
  }
};

// Update alumni
const updateAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, batch } = req.body;

    // Check if alumni exists
    const [existing] = await pool.query(
      'SELECT id FROM Alumni WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    // Check authorization (admin or owner)
    if (req.user.role !== 'admin' && req.user.id != id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this alumni'
      });
    }

    // Check if new email already exists (for different user)
    if (email) {
      const [emailCheck] = await pool.query(
        'SELECT id FROM Alumni WHERE email = ? AND id != ?',
        [email, id]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update alumni
    await pool.query(
      'UPDATE Alumni SET name = ?, email = ?, phone = ?, batch = ? WHERE id = ?',
      [name, email, phone, batch, id]
    );

    return res.json({
      success: true,
      message: 'Alumni updated successfully'
    });
  } catch (error) {
    console.error('Update alumni error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating alumni'
    });
  }
};

// Delete alumni (Admin only)
const deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if alumni exists
    const [existing] = await pool.query(
      'SELECT id FROM Alumni WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    // Delete alumni (cascades to related records)
    await pool.query('DELETE FROM Alumni WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Alumni deleted successfully'
    });
  } catch (error) {
    console.error('Delete alumni error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting alumni'
    });
  }
};

// Get alumni statistics
const getAlumniStats = async (req, res) => {
  try {
    const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM Alumni');
    const [batchCount] = await pool.query(
      'SELECT batch, COUNT(*) as count FROM Alumni GROUP BY batch ORDER BY batch DESC'
    );

    return res.json({
      success: true,
      data: {
        total: totalCount[0].count,
        byBatch: batchCount
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  getAlumniStats
};