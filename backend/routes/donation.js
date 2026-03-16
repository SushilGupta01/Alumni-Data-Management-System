const express = require('express');
const router = express.Router();
const {
  getAllDonations,
  createDonation,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, getAllDonations);
router.post('/', authenticateToken, createDonation);
router.put('/:id', authenticateToken, updateDonation);
router.delete('/:id', authenticateToken, deleteDonation);

module.exports = router;