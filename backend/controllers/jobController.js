const { pool: jobPool } = require('../config/db');

const getAllJobs = async (req, res) => {
  try {
    let query = `
      SELECT j.*, a.name as alumni_name 
      FROM Job j 
      LEFT JOIN Alumni a ON j.alumni_id = a.id
    `;
    
    if (req.user.role !== 'admin') {
      query += ' WHERE j.alumni_id = ?';
      const [jobs] = await jobPool.query(query, [req.user.id]);
      return res.json({ success: true, count: jobs.length, data: jobs });
    }
    
    query += ' ORDER BY j.start_date DESC';
    const [jobs] = await jobPool.query(query);
    return res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching jobs' });
  }
};

const createJob = async (req, res) => {
  try {
    const { company_name, position, start_date, location } = req.body;
    const alumni_id = req.user.role === 'admin' ? req.body.alumni_id : req.user.id;

    if (!company_name || !position) {
      return res.status(400).json({ success: false, message: 'Company name and position are required' });
    }

    const [result] = await jobPool.query(
      'INSERT INTO Job (alumni_id, company_name, position, start_date, location) VALUES (?, ?, ?, ?, ?)',
      [alumni_id, company_name, position, start_date, location]
    );

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({ success: false, message: 'Error creating job' });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, position, start_date, location } = req.body;

    if (req.user.role !== 'admin') {
      const [job] = await jobPool.query('SELECT alumni_id FROM Job WHERE id = ?', [id]);
      if (job.length === 0 || job[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await jobPool.query(
      'UPDATE Job SET company_name = ?, position = ?, start_date = ?, location = ? WHERE id = ?',
      [company_name, position, start_date, location, id]
    );

    return res.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    console.error('Update job error:', error);
    return res.status(500).json({ success: false, message: 'Error updating job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      const [job] = await jobPool.query('SELECT alumni_id FROM Job WHERE id = ?', [id]);
      if (job.length === 0 || job[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await jobPool.query('DELETE FROM Job WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting job' });
  }
};

module.exports = { getAllJobs, createJob, updateJob, deleteJob };
