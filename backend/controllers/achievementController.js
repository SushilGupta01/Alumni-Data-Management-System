const { pool: achievementPool } = require('../config/db');

const getAllAchievements = async (req, res) => {
  try {
    let query = `
      SELECT a.*, al.name as alumni_name 
      FROM Achievement a 
      LEFT JOIN Alumni al ON a.alumni_id = al.id
    `;
    
    if (req.user.role !== 'admin') {
      query += ' WHERE a.alumni_id = ?';
      const [achievements] = await achievementPool.query(query, [req.user.id]);
      return res.json({ success: true, count: achievements.length, data: achievements });
    }
    
    query += ' ORDER BY a.achievement_date DESC';
    const [achievements] = await achievementPool.query(query);
    return res.json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching achievements' });
  }
};

const createAchievement = async (req, res) => {
  try {
    const { title, description, achievement_date } = req.body;
    const alumni_id = req.user.role === 'admin' ? req.body.alumni_id : req.user.id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const [result] = await achievementPool.query(
      'INSERT INTO Achievement (alumni_id, title, description, achievement_date) VALUES (?, ?, ?, ?)',
      [alumni_id, title, description, achievement_date]
    );

    return res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    return res.status(500).json({ success: false, message: 'Error creating achievement' });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, achievement_date } = req.body;

    if (req.user.role !== 'admin') {
      const [achievement] = await achievementPool.query('SELECT alumni_id FROM Achievement WHERE id = ?', [id]);
      if (achievement.length === 0 || achievement[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await achievementPool.query(
      'UPDATE Achievement SET title = ?, description = ?, achievement_date = ? WHERE id = ?',
      [title, description, achievement_date, id]
    );

    return res.json({ success: true, message: 'Achievement updated successfully' });
  } catch (error) {
    console.error('Update achievement error:', error);
    return res.status(500).json({ success: false, message: 'Error updating achievement' });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      const [achievement] = await achievementPool.query('SELECT alumni_id FROM Achievement WHERE id = ?', [id]);
      if (achievement.length === 0 || achievement[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await achievementPool.query('DELETE FROM Achievement WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Delete achievement error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting achievement' });
  }
};

module.exports = { getAllAchievements, createAchievement, updateAchievement, deleteAchievement };