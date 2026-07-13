const Stock = require('../models/Stock');

// @desc    Get all stocks (supports search via ?q=)
// @route   GET /api/stocks
// @access  Private
const getStocks = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { isActive: true };
    if (q) {
      filter.$or = [
        { symbol: { $regex: q, $options: 'i' } },
        { companyName: { $regex: q, $options: 'i' } },
      ];
    }
    const stocks = await Stock.find(filter).sort({ symbol: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stock by symbol
// @route   GET /api/stocks/:symbol
// @access  Private
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStocks, getStockBySymbol };
