// Run with: node seed/seedStocks.js
// Populates the Stocks collection with a starter set of well-known US stocks.
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stock = require('../models/Stock');

dotenv.config();

const sampleStocks = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', currentPrice: 195.5, previousClose: 193.2 },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Technology', currentPrice: 430.1, previousClose: 428.4 },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', sector: 'Technology', currentPrice: 172.8, previousClose: 170.9 },
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', sector: 'Consumer Discretionary', currentPrice: 186.3, previousClose: 184.0 },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', sector: 'Automotive', currentPrice: 245.7, previousClose: 250.1 },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Technology', currentPrice: 125.4, previousClose: 122.9 },
  { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', sector: 'Financials', currentPrice: 205.6, previousClose: 204.1 },
  { symbol: 'META', companyName: 'Meta Platforms Inc.', sector: 'Technology', currentPrice: 512.3, previousClose: 508.7 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    for (const s of sampleStocks) {
      await Stock.findOneAndUpdate({ symbol: s.symbol }, s, { upsert: true, new: true });
    }

    console.log(`Seeded ${sampleStocks.length} stocks successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
