const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

// @desc    Get logged-in user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user._id }).populate('stocks');
    res.json(watchlist || { user: req.user._id, stocks: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a stock to the watchlist
// @route   POST /api/watchlist/:symbol
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist.stocks.includes(stock._id)) {
      watchlist.stocks.push(stock._id);
      await watchlist.save();
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a stock from the watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const watchlist = await Watchlist.findOne({ user: req.user._id });
    watchlist.stocks = watchlist.stocks.filter((id) => id.toString() !== stock._id.toString());
    await watchlist.save();
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
