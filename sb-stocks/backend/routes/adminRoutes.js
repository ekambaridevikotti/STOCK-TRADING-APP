const express = require('express');
const router = express.Router();
const {
  createStock,
  updateStock,
  deleteStock,
  getUsers,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/stocks', protect, admin, createStock);
router.put('/stocks/:id', protect, admin, updateStock);
router.delete('/stocks/:id', protect, admin, deleteStock);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/status', protect, admin, toggleUserStatus);

module.exports = router;
