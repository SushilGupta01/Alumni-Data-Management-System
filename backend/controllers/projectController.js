const { pool: projectPool } = require('../config/db');

const getAllProjects = async (req, res) => {
  try {
    let query = `
      SELECT p.*, a.name as alumni_name 
      FROM Project p 
      LEFT JOIN Alumni a ON p.alumni_id = a.id
    `;
    
    if (req.user.role !== 'admin') {
      query += ' WHERE p.alumni_id = ?';
      const [projects] = await projectPool.query(query, [req.user.id]);
      return res.json({ success: true, count: projects.length, data: projects });
    }
    
    query += ' ORDER BY p.created_at DESC';
    const [projects] = await projectPool.query(query);
    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching projects' });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, project_url } = req.body;
    const alumni_id = req.user.role === 'admin' ? req.body.alumni_id : req.user.id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const [result] = await projectPool.query(
      'INSERT INTO Project (alumni_id, title, description, project_url) VALUES (?, ?, ?, ?)',
      [alumni_id, title, description, project_url]
    );

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ success: false, message: 'Error creating project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, project_url } = req.body;

    if (req.user.role !== 'admin') {
      const [project] = await projectPool.query('SELECT alumni_id FROM Project WHERE id = ?', [id]);
      if (project.length === 0 || project[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await projectPool.query(
      'UPDATE Project SET title = ?, description = ?, project_url = ? WHERE id = ?',
      [title, description, project_url, id]
    );

    return res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ success: false, message: 'Error updating project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      const [project] = await projectPool.query('SELECT alumni_id FROM Project WHERE id = ?', [id]);
      if (project.length === 0 || project[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await projectPool.query('DELETE FROM Project WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting project' });
  }
};

module.exports = { getAllProjects, createProject, updateProject, deleteProject };
