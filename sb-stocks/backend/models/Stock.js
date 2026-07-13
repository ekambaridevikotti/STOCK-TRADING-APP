const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    companyName: { type: String, required: true },
    sector: { type: String, default: 'N/A' },
    currentPrice: { type: Number, required: true },
    previousClose: { type: Number, default: 0 },
    dayHigh: { type: Number, default: 0 },
    dayLow: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
