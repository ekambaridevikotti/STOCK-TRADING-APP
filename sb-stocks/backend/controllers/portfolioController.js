const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc    Get logged-in user's portfolio with live valuation
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const symbols = portfolio.holdings.map((h) => h.symbol);
    const stocks = await Stock.find({ symbol: { $in: symbols } });
    const priceMap = stocks.reduce((acc, s) => {
      acc[s.symbol] = s.currentPrice;
      return acc;
    }, {});

    const holdingsWithValue = portfolio.holdings.map((h) => {
      const currentPrice = priceMap[h.symbol] || h.averageBuyPrice;
      const currentValue = currentPrice * h.quantity;
      const investedValue = h.averageBuyPrice * h.quantity;
      return {
        symbol: h.symbol,
        quantity: h.quantity,
        averageBuyPrice: h.averageBuyPrice,
        currentPrice,
        currentValue,
        profitLoss: currentValue - investedValue,
        profitLossPercent: investedValue > 0 ? ((currentValue - investedValue) / investedValue) * 100 : 0,
      };
    });

    const totalCurrentValue = holdingsWithValue.reduce((sum, h) => sum + h.currentValue, 0);

    res.json({
      user: req.user._id,
      balance: req.user.balance,
      holdings: holdingsWithValue,
      totalInvested: portfolio.totalInvested,
      totalCurrentValue,
      netWorth: req.user.balance + totalCurrentValue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPortfolio };
