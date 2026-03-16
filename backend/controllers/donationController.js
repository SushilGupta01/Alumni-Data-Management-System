const { pool } = require('../config/db');

const getAllDonations = async (req, res) => {
  try {
    let query = `
      SELECT d.*, a.name as alumni_name 
      FROM Donation d 
      LEFT JOIN Alumni a ON d.alumni_id = a.id
    `;
    
    if (req.user.role !== 'admin') {
      query += ' WHERE d.alumni_id = ?';
      const [donations] = await pool.query(query, [req.user.id]);
      return res.json({ success: true, count: donations.length, data: donations });
    }
    
    query += ' ORDER BY d.donation_date DESC';
    const [donations] = await pool.query(query);
    return res.json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    console.error('Get donations error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching donations' });
  }
};

const createDonation = async (req, res) => {
  try {
    const { amount, donation_date, purpose } = req.body;
    const alumni_id = req.user.role === 'admin' ? req.body.alumni_id : req.user.id;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO Donation (alumni_id, amount, donation_date, purpose) VALUES (?, ?, ?, ?)',
      [alumni_id, amount, donation_date, purpose]
    );

    return res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create donation error:', error);
    return res.status(500).json({ success: false, message: 'Error creating donation' });
  }
};

const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, donation_date, purpose } = req.body;

    if (req.user.role !== 'admin') {
      const [donation] = await pool.query('SELECT alumni_id FROM Donation WHERE id = ?', [id]);
      if (donation.length === 0 || donation[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await pool.query(
      'UPDATE Donation SET amount = ?, donation_date = ?, purpose = ? WHERE id = ?',
      [amount, donation_date, purpose, id]
    );

    return res.json({ success: true, message: 'Donation updated successfully' });
  } catch (error) {
    console.error('Update donation error:', error);
    return res.status(500).json({ success: false, message: 'Error updating donation' });
  }
};

const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      const [donation] = await pool.query('SELECT alumni_id FROM Donation WHERE id = ?', [id]);
      if (donation.length === 0 || donation[0].alumni_id != req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await pool.query('DELETE FROM Donation WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('Delete donation error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting donation' });
  }
};

module.exports = { getAllDonations, createDonation, updateDonation, deleteDonation };
