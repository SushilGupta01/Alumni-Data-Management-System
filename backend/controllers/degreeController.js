const { pool: degreePool } = require('../config/db');

const getAllDegrees = async (req, res) => {
  try {
    let query = `
      SELECT d.*, a.name as alumni_name 
      FROM Degree d 
      LEFT JOIN Alumni a ON d.alumni_id = a.id
    `;
    
    if (req.user.role !== 'admin') {
      query += ' WHERE d.alumni_id = ?';
      const [degrees] = await degreePool.query(query, [req.user.id]);
      return res.json({ success: true, count: degrees.length, data: degrees });
    }
    
    query += ' ORDER BY d.year_of_completion DESC';
    const [degrees] = await degreePool.query(query);
    return res.json({ success: true, count: degrees.length, data: degrees });
  } catch (error) {
    console.error('Get degrees error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching degrees' });
  }
};

const createDegree = async (req, res) => {
  try {
    const { degree_name, institution, year_of_completion, specialization } = req.body;
    const alumni_id = req.user.role === 'admin' ? req.body.alumni_id : req.user.id;

    if (!degree_name || !institution) {
      return res.status(400).json({ success: false, message: 'Degree name and institution are required' });
    }

    const [result] = await degreePool.query(
      'INSERT INTO Degree (alumni_id, degree_name, institution, year_of_completion, specialization) VALUES (?, ?, ?, ?, ?)',
      [alumni_id, degree_name, institution, year_of_completion, specialization]
    );

    return res.status(201).json({
      success: true,
      message: 'Degree created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create degree error:', error);
    return res.status(500).json({ success: false, message: 'Error creating degree' });
  }
};

const updateDegree = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree_name, institution, year_of_completion, specialization } = req.body;

    if (req.user.role !== 'admin') {
      const [degree] = await degreePool.query('SELECT alumni_id FROM Degree WHERE id = ?', [id]);
      if (degree.length === 0 || degree[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await degreePool.query(
      'UPDATE Degree SET degree_name = ?, institution = ?, year_of_completion = ?, specialization = ? WHERE id = ?',
      [degree_name, institution, year_of_completion, specialization, id]
    );

    return res.json({ success: true, message: 'Degree updated successfully' });
  } catch (error) {
    console.error('Update degree error:', error);
    return res.status(500).json({ success: false, message: 'Error updating degree' });
  }
};

const deleteDegree = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      const [degree] = await degreePool.query('SELECT alumni_id FROM Degree WHERE id = ?', [id]);
      if (degree.length === 0 || degree[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await degreePool.query('DELETE FROM Degree WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Degree deleted successfully' });
  } catch (error) {
    console.error('Delete degree error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting degree' });
  }
};

module.exports = { getAllDegrees, createDegree, updateDegree, deleteDegree };