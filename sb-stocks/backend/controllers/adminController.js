const Stock = require('../models/Stock');
const User = require('../models/User');

// @desc    Create a new stock listing
// @route   POST /api/admin/stocks
// @access  Private/Admin
const createStock = async (req, res) => {
  try {
    const { symbol, companyName, sector, currentPrice } = req.body;
    const exists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Stock already exists' });

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      companyName,
      sector,
      currentPrice,
      previousClose: currentPrice,
    });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a stock listing
// @route   PUT /api/admin/stocks/:id
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    Object.assign(stock, req.body, { lastUpdated: Date.now() });
    const updated = await stock.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete (deactivate) a stock listing
// @route   DELETE /api/admin/stocks/:id
// @access  Private/Admin
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    stock.isActive = false;
    await stock.save();
    res.json({ message: 'Stock deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a user's active status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User is now ${user.isActive ? 'active' : 'inactive'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStock, updateStock, deleteStock, getUsers, toggleUserStatus };
