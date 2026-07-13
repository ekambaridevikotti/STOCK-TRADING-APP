const mongoose = require('mongoose');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

// @desc    Buy shares of a stock
// @route   POST /api/transactions/buy
// @access  Private
const buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid symbol and quantity' });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const user = await User.findById(req.user._id);
    const cost = stock.currentPrice * quantity;

    if (user.balance < cost) {
      return res.status(400).json({ message: 'Insufficient virtual balance' });
    }

    user.balance -= cost;
    await user.save();

    const portfolio = await Portfolio.findOne({ user: user._id });
    const existingHolding = portfolio.holdings.find((h) => h.symbol === stock.symbol);

    if (existingHolding) {
      const newQuantity = existingHolding.quantity + quantity;
      const newAvgPrice =
        (existingHolding.averageBuyPrice * existingHolding.quantity + cost) / newQuantity;
      existingHolding.quantity = newQuantity;
      existingHolding.averageBuyPrice = newAvgPrice;
    } else {
      portfolio.holdings.push({
        stock: stock._id,
        symbol: stock.symbol,
        quantity,
        averageBuyPrice: stock.currentPrice,
      });
    }
    portfolio.totalInvested += cost;
    await portfolio.save();

    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'BUY',
      quantity,
      price: stock.currentPrice,
      total: cost,
    });

    res.status(201).json({ transaction, balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sell shares of a stock
// @route   POST /api/transactions/sell
// @access  Private
const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid symbol and quantity' });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const portfolio = await Portfolio.findOne({ user: req.user._id });
    const holding = portfolio.holdings.find((h) => h.symbol === stock.symbol);

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient shares to sell' });
    }

    const proceeds = stock.currentPrice * quantity;

    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter((h) => h.symbol !== stock.symbol);
    }
    portfolio.totalInvested = Math.max(0, portfolio.totalInvested - proceeds);
    await portfolio.save();

    const user = await User.findById(req.user._id);
    user.balance += proceeds;
    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'SELL',
      quantity,
      price: stock.currentPrice,
      total: proceeds,
    });

    res.status(201).json({ transaction, balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's transaction history
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { buyStock, sellStock, getTransactions };
