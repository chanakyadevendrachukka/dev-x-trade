import { useState, useEffect } from 'react';
import { yahooFinanceService, MarketData, CryptoData } from '@/services/yahooFinanceService';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  region: string;
  lastUpdated: Date;
}

export interface CurrencyPair {
  symbol: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

// Comprehensive stock list with 100+ stocks across all major sectors
export const mockStocks: Stock[] = [
  // Technology Stocks - FAANG + Major Tech
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 187.32,
    change: 1.28,
    changePercent: 0.69,
    volume: 58394210,
    marketCap: 2920000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 402.65,
    change: 3.71,
    changePercent: 0.93,
    volume: 22154780,
    marketCap: 2990000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 157.95,
    change: -0.63,
    changePercent: -0.40,
    volume: 18729340,
    marketCap: 1980000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: 4.23,
    changePercent: 1.73,
    volume: 45123890,
    marketCap: 785000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 145.86,
    change: -1.42,
    changePercent: -0.96,
    volume: 32567120,
    marketCap: 1520000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 312.18,
    change: 5.67,
    changePercent: 1.85,
    volume: 19876540,
    marketCap: 785000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.25,
    change: 12.45,
    changePercent: 1.44,
    volume: 28345670,
    marketCap: 2150000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 425.60,
    change: -2.34,
    changePercent: -0.55,
    volume: 8976540,
    marketCap: 189000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ORCL',
    name: 'Oracle Corporation',
    price: 118.45,
    change: 1.23,
    changePercent: 1.05,
    volume: 15432180,
    marketCap: 325000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    price: 234.56,
    change: 2.78,
    changePercent: 1.20,
    volume: 6789123,
    marketCap: 231000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ADBE',
    name: 'Adobe Inc.',
    price: 512.34,
    change: -3.45,
    changePercent: -0.67,
    volume: 2345678,
    marketCap: 238000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    price: 43.21,
    change: 0.87,
    changePercent: 2.05,
    volume: 45678901,
    marketCap: 180000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 178.90,
    change: 4.56,
    changePercent: 2.62,
    volume: 35678912,
    marketCap: 289000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'QCOM',
    name: 'QUALCOMM Inc.',
    price: 156.78,
    change: 2.34,
    changePercent: 1.52,
    volume: 12345678,
    marketCap: 175000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'CSCO',
    name: 'Cisco Systems Inc.',
    price: 52.34,
    change: 0.45,
    changePercent: 0.87,
    volume: 23456789,
    marketCap: 218000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'IBM',
    name: 'International Business Machines',
    price: 145.67,
    change: -1.23,
    changePercent: -0.84,
    volume: 5678901,
    marketCap: 133000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'UBER',
    name: 'Uber Technologies Inc.',
    price: 67.89,
    change: 1.45,
    changePercent: 2.18,
    volume: 34567890,
    marketCap: 135000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'LYFT',
    name: 'Lyft Inc.',
    price: 15.67,
    change: 0.34,
    changePercent: 2.22,
    volume: 12345678,
    marketCap: 5400000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SPOT',
    name: 'Spotify Technology S.A.',
    price: 187.45,
    change: 3.67,
    changePercent: 2.00,
    volume: 1876543,
    marketCap: 35600000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SNAP',
    name: 'Snap Inc.',
    price: 12.34,
    change: -0.23,
    changePercent: -1.83,
    volume: 56789012,
    marketCap: 19800000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TWTR',
    name: 'Twitter Inc.',
    price: 54.20,
    change: 2.10,
    changePercent: 4.03,
    volume: 45678901,
    marketCap: 42000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'PINS',
    name: 'Pinterest Inc.',
    price: 27.89,
    change: 0.78,
    changePercent: 2.88,
    volume: 23456789,
    marketCap: 18200000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SQ',
    name: 'Block Inc.',
    price: 78.45,
    change: 1.56,
    changePercent: 2.03,
    volume: 8765432,
    marketCap: 45300000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'PYPL',
    name: 'PayPal Holdings Inc.',
    price: 65.43,
    change: -0.89,
    changePercent: -1.34,
    volume: 12345678,
    marketCap: 74500000000,
    lastUpdated: new Date()
  },
  
  // Financial Stocks
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 178.45,
    change: 2.15,
    changePercent: 1.22,
    volume: 12456780,
    marketCap: 523000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BAC',
    name: 'Bank of America Corp.',
    price: 34.78,
    change: 0.45,
    changePercent: 1.31,
    volume: 45678900,
    marketCap: 275000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'WFC',
    name: 'Wells Fargo & Company',
    price: 52.34,
    change: -0.78,
    changePercent: -1.47,
    volume: 23456780,
    marketCap: 195000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'GS',
    name: 'Goldman Sachs Group Inc.',
    price: 389.67,
    change: 4.23,
    changePercent: 1.10,
    volume: 1876540,
    marketCap: 132000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MS',
    name: 'Morgan Stanley',
    price: 89.34,
    change: 1.45,
    changePercent: 1.65,
    volume: 8765432,
    marketCap: 155000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'C',
    name: 'Citigroup Inc.',
    price: 56.78,
    change: 0.89,
    changePercent: 1.59,
    volume: 18765432,
    marketCap: 112000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'AXP',
    name: 'American Express Company',
    price: 187.65,
    change: 2.34,
    changePercent: 1.26,
    volume: 3456789,
    marketCap: 142000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BRK.B',
    name: 'Berkshire Hathaway Inc.',
    price: 445.67,
    change: 3.45,
    changePercent: 0.78,
    volume: 3456789,
    marketCap: 655000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    price: 245.89,
    change: 1.78,
    changePercent: 0.73,
    volume: 7654321,
    marketCap: 525000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MA',
    name: 'Mastercard Inc.',
    price: 378.90,
    change: 2.45,
    changePercent: 0.65,
    volume: 2345678,
    marketCap: 365000000000,
    lastUpdated: new Date()
  },
  
  // Healthcare & Pharmaceuticals
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    price: 162.45,
    change: 1.23,
    changePercent: 0.76,
    volume: 6789012,
    marketCap: 427000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'PFE',
    name: 'Pfizer Inc.',
    price: 28.90,
    change: -0.34,
    changePercent: -1.16,
    volume: 34567890,
    marketCap: 162000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group Inc.',
    price: 524.78,
    change: 6.45,
    changePercent: 1.24,
    volume: 2345678,
    marketCap: 492000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ABBV',
    name: 'AbbVie Inc.',
    price: 145.67,
    change: 1.89,
    changePercent: 1.31,
    volume: 8765432,
    marketCap: 257000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TMO',
    name: 'Thermo Fisher Scientific',
    price: 567.89,
    change: 4.56,
    changePercent: 0.81,
    volume: 1234567,
    marketCap: 222000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ABT',
    name: 'Abbott Laboratories',
    price: 108.45,
    change: 0.78,
    changePercent: 0.72,
    volume: 5678901,
    marketCap: 190000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    price: 623.45,
    change: 8.90,
    changePercent: 1.45,
    volume: 2345678,
    marketCap: 595000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MRK',
    name: 'Merck & Co. Inc.',
    price: 112.34,
    change: 1.45,
    changePercent: 1.31,
    volume: 9876543,
    marketCap: 284000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BMY',
    name: 'Bristol-Myers Squibb',
    price: 56.78,
    change: -0.45,
    changePercent: -0.79,
    volume: 12345678,
    marketCap: 120000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'GILD',
    name: 'Gilead Sciences Inc.',
    price: 78.90,
    change: 1.23,
    changePercent: 1.58,
    volume: 8765432,
    marketCap: 99000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'REGN',
    name: 'Regeneron Pharmaceuticals',
    price: 789.01,
    change: 12.34,
    changePercent: 1.59,
    volume: 567890,
    marketCap: 85000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'BIIB',
    name: 'Biogen Inc.',
    price: 234.56,
    change: -3.45,
    changePercent: -1.45,
    volume: 1234567,
    marketCap: 34000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'AMGN',
    name: 'Amgen Inc.',
    price: 267.89,
    change: 2.78,
    changePercent: 1.05,
    volume: 2345678,
    marketCap: 146000000000,
    lastUpdated: new Date()
  },
  
  // Consumer Goods & Retail
  {
    symbol: 'PG',
    name: 'Procter & Gamble Co.',
    price: 158.34,
    change: 0.78,
    changePercent: 0.49,
    volume: 5678901,
    marketCap: 376000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'KO',
    name: 'The Coca-Cola Company',
    price: 61.23,
    change: 0.34,
    changePercent: 0.56,
    volume: 12345678,
    marketCap: 264000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'PEP',
    name: 'PepsiCo Inc.',
    price: 173.45,
    change: -0.89,
    changePercent: -0.51,
    volume: 3456789,
    marketCap: 239000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    price: 167.89,
    change: 1.45,
    changePercent: 0.87,
    volume: 8765432,
    marketCap: 545000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'HD',
    name: 'The Home Depot Inc.',
    price: 345.67,
    change: 2.34,
    changePercent: 0.68,
    volume: 3456789,
    marketCap: 355000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'NKE',
    name: 'NIKE Inc.',
    price: 112.45,
    change: 1.67,
    changePercent: 1.51,
    volume: 6789012,
    marketCap: 177000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SBUX',
    name: 'Starbucks Corporation',
    price: 98.76,
    change: 0.89,
    changePercent: 0.91,
    volume: 8765432,
    marketCap: 113000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MCD',
    name: 'McDonald\'s Corporation',
    price: 287.65,
    change: 1.23,
    changePercent: 0.43,
    volume: 2345678,
    marketCap: 211000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TGT',
    name: 'Target Corporation',
    price: 134.56,
    change: -1.23,
    changePercent: -0.91,
    volume: 4567890,
    marketCap: 61000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'LOW',
    name: 'Lowe\'s Companies Inc.',
    price: 245.67,
    change: 2.89,
    changePercent: 1.19,
    volume: 3456789,
    marketCap: 155000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'COST',
    name: 'Costco Wholesale Corporation',
    price: 567.89,
    change: 3.45,
    changePercent: 0.61,
    volume: 1234567,
    marketCap: 252000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'KR',
    name: 'The Kroger Co.',
    price: 45.67,
    change: 0.23,
    changePercent: 0.51,
    volume: 6789012,
    marketCap: 33000000000,
    lastUpdated: new Date()
  },
  
  // Energy & Utilities
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    price: 118.67,
    change: 2.34,
    changePercent: 2.01,
    volume: 18976540,
    marketCap: 502000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'CVX',
    name: 'Chevron Corporation',
    price: 156.78,
    change: 1.89,
    changePercent: 1.22,
    volume: 8976543,
    marketCap: 295000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'COP',
    name: 'ConocoPhillips',
    price: 123.45,
    change: 2.67,
    changePercent: 2.21,
    volume: 6789012,
    marketCap: 158000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SLB',
    name: 'Schlumberger Limited',
    price: 56.78,
    change: 1.34,
    changePercent: 2.42,
    volume: 12345678,
    marketCap: 80000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'EOG',
    name: 'EOG Resources Inc.',
    price: 134.56,
    change: 3.45,
    changePercent: 2.63,
    volume: 4567890,
    marketCap: 78000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'NEE',
    name: 'NextEra Energy Inc.',
    price: 78.90,
    change: 0.45,
    changePercent: 0.57,
    volume: 8765432,
    marketCap: 159000000000,
    lastUpdated: new Date()
  },
  
  // Industrial & Manufacturing
  {
    symbol: 'BA',
    name: 'The Boeing Company',
    price: 189.45,
    change: -2.34,
    changePercent: -1.22,
    volume: 8976543,
    marketCap: 112000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'LMT',
    name: 'Lockheed Martin Corporation',
    price: 456.78,
    change: 3.45,
    changePercent: 0.76,
    volume: 1234567,
    marketCap: 119000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'CAT',
    name: 'Caterpillar Inc.',
    price: 267.89,
    change: 4.56,
    changePercent: 1.73,
    volume: 2345678,
    marketCap: 140000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'DE',
    name: 'Deere & Company',
    price: 378.90,
    change: 2.34,
    changePercent: 0.62,
    volume: 1876543,
    marketCap: 115000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'GE',
    name: 'General Electric Company',
    price: 123.45,
    change: 1.78,
    changePercent: 1.46,
    volume: 34567890,
    marketCap: 135000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MMM',
    name: '3M Company',
    price: 98.76,
    change: -0.89,
    changePercent: -0.89,
    volume: 3456789,
    marketCap: 55000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'HON',
    name: 'Honeywell International Inc.',
    price: 203.45,
    change: 1.67,
    changePercent: 0.83,
    volume: 2345678,
    marketCap: 138000000000,
    lastUpdated: new Date()
  },
  
  // Media & Entertainment
  {
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    price: 89.34,
    change: -1.23,
    changePercent: -1.36,
    volume: 12345678,
    marketCap: 163000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'CMCSA',
    name: 'Comcast Corporation',
    price: 45.67,
    change: 0.34,
    changePercent: 0.75,
    volume: 18765432,
    marketCap: 195000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'VZ',
    name: 'Verizon Communications Inc.',
    price: 38.90,
    change: 0.12,
    changePercent: 0.31,
    volume: 23456789,
    marketCap: 163000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'T',
    name: 'AT&T Inc.',
    price: 16.78,
    change: -0.23,
    changePercent: -1.35,
    volume: 45678901,
    marketCap: 120000000000,
    lastUpdated: new Date()
  },
  
  // Real Estate & REITs
  {
    symbol: 'SPG',
    name: 'Simon Property Group Inc.',
    price: 123.45,
    change: 1.89,
    changePercent: 1.55,
    volume: 2345678,
    marketCap: 45000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'PLD',
    name: 'Prologis Inc.',
    price: 134.56,
    change: 0.78,
    changePercent: 0.58,
    volume: 3456789,
    marketCap: 125000000000,
    lastUpdated: new Date()
  },
  
  // Semiconductors & Tech Hardware
  {
    symbol: 'TSM',
    name: 'Taiwan Semiconductor Mfg.',
    price: 89.34,
    change: 2.45,
    changePercent: 2.82,
    volume: 23456789,
    marketCap: 460000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    price: 567.89,
    change: 8.90,
    changePercent: 1.59,
    volume: 1876543,
    marketCap: 265000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'TXN',
    name: 'Texas Instruments Inc.',
    price: 178.90,
    change: 1.23,
    changePercent: 0.69,
    volume: 4567890,
    marketCap: 164000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'MU',
    name: 'Micron Technology Inc.',
    price: 67.89,
    change: 2.34,
    changePercent: 3.57,
    volume: 18765432,
    marketCap: 76000000000,
    lastUpdated: new Date()
  },
  
  // Automotive
  {
    symbol: 'F',
    name: 'Ford Motor Company',
    price: 12.34,
    change: 0.23,
    changePercent: 1.90,
    volume: 56789012,
    marketCap: 49000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'GM',
    name: 'General Motors Company',
    price: 34.56,
    change: 0.89,
    changePercent: 2.64,
    volume: 23456789,
    marketCap: 50000000000,
    lastUpdated: new Date()
  },
  
  // Airlines & Travel
  {
    symbol: 'AAL',
    name: 'American Airlines Group Inc.',
    price: 16.78,
    change: 0.45,
    changePercent: 2.76,
    volume: 34567890,
    marketCap: 11000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'UAL',
    name: 'United Airlines Holdings Inc.',
    price: 45.67,
    change: 1.23,
    changePercent: 2.77,
    volume: 8765432,
    marketCap: 15000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'DAL',
    name: 'Delta Air Lines Inc.',
    price: 43.21,
    change: 0.78,
    changePercent: 1.84,
    volume: 9876543,
    marketCap: 28000000000,
    lastUpdated: new Date()
  },
  
  // Emerging & Growth Stocks
  {
    symbol: 'ROKU',
    name: 'Roku Inc.',
    price: 67.89,
    change: 2.34,
    changePercent: 3.57,
    volume: 12345678,
    marketCap: 7300000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    price: 23.45,
    change: 0.89,
    changePercent: 3.95,
    volume: 45678901,
    marketCap: 48000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'SNOW',
    name: 'Snowflake Inc.',
    price: 178.90,
    change: 4.56,
    changePercent: 2.61,
    volume: 3456789,
    marketCap: 56000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'ZM',
    name: 'Zoom Video Communications',
    price: 67.89,
    change: -1.23,
    changePercent: -1.78,
    volume: 8765432,
    marketCap: 20000000000,
    lastUpdated: new Date()
  },
  {
    symbol: 'DOCU',
    name: 'DocuSign Inc.',
    price: 56.78,
    change: 1.45,
    changePercent: 2.62,
    volume: 5678901,
    marketCap: 11000000000,
    lastUpdated: new Date()
  }
];

// Market indices mock data
export const mockIndices: MarketIndex[] = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    value: 4387.16,
    change: 23.54,
    changePercent: 0.54,
    region: 'US',
    lastUpdated: new Date()
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones',
    value: 34156.69,
    change: -89.23,
    changePercent: -0.26,
    region: 'US',
    lastUpdated: new Date()
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ',
    value: 13619.67,
    change: 67.89,
    changePercent: 0.50,
    region: 'US',
    lastUpdated: new Date()
  },
  {
    symbol: '^FTSE',
    name: 'FTSE 100',
    value: 7589.34,
    change: 12.45,
    changePercent: 0.16,
    region: 'UK',
    lastUpdated: new Date()
  },
  {
    symbol: '^N225',
    name: 'Nikkei 225',
    value: 29567.23,
    change: -145.67,
    changePercent: -0.49,
    region: 'Japan',
    lastUpdated: new Date()
  }
];

// Currency pairs mock data
export const mockCurrencies: CurrencyPair[] = [
  {
    symbol: 'EUR/USD',
    fromCurrency: 'EUR',
    toCurrency: 'USD',
    rate: 1.0823,
    change: 0.0012,
    changePercent: 0.11,
    lastUpdated: new Date()
  },
  {
    symbol: 'GBP/USD',
    fromCurrency: 'GBP',
    toCurrency: 'USD',
    rate: 1.2698,
    change: -0.0034,
    changePercent: -0.27,
    lastUpdated: new Date()
  },
  {
    symbol: 'USD/JPY',
    fromCurrency: 'USD',
    toCurrency: 'JPY',
    rate: 149.67,
    change: 0.45,
    changePercent: 0.30,
    lastUpdated: new Date()
  },
  {
    symbol: 'USD/CHF',
    fromCurrency: 'USD',
    toCurrency: 'CHF',
    rate: 0.8834,
    change: 0.0023,
    changePercent: 0.26,
    lastUpdated: new Date()
  },
  {
    symbol: 'AUD/USD',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    rate: 0.6445,
    change: -0.0012,
    changePercent: -0.19,
    lastUpdated: new Date()
  }
];

// Custom hook for fetching stock data
export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        // Try to fetch real data first, fallback to mock data
        try {
          const realData = await yahooFinanceService.getMultipleQuotes(
            mockStocks.map(stock => stock.symbol)
          );
          
          // Transform Yahoo Finance data to our Stock interface
          const transformedStocks = realData.map((quote) => ({
            symbol: quote.symbol,
            name: mockStocks.find(s => s.symbol === quote.symbol)?.name || quote.symbol,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
            volume: quote.volume,
            marketCap: quote.marketCap || 0,
            lastUpdated: new Date()
          }));
          
          setStocks(transformedStocks);
        } catch (yahooError) {
          console.warn('Yahoo Finance API unavailable, using mock data:', yahooError);
          setStocks(mockStocks);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
        setStocks(mockStocks); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStocks, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { stocks, loading, error };
}

// Custom hook for fetching market indices
export function useMarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        setLoading(true);
        // For now, use mock data - can be enhanced with real API later
        setIndices(mockIndices);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market indices');
        setIndices(mockIndices);
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchIndices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { indices, loading, error };
}

// Custom hook for fetching currency data
export function useCurrencies() {
  const [currencies, setCurrencies] = useState<CurrencyPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        // For now, use mock data - can be enhanced with real API later
        setCurrencies(mockCurrencies);
        setError(null);
      } catch (err) {
        setError('Failed to fetch currency data');
        setCurrencies(mockCurrencies);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchCurrencies, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { currencies, loading, error };
}

// Function to search stocks by symbol or name
export function searchStocks(query: string, stocks: Stock[]): Stock[] {
  if (!query.trim()) return stocks;
  
  const searchTerm = query.toLowerCase().trim();
  
  return stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm) || 
    stock.name.toLowerCase().includes(searchTerm)
  );
}

// Function to get stock by symbol
export function getStockBySymbol(symbol: string, stocks: Stock[]): Stock | undefined {
  return stocks.find(stock => stock.symbol === symbol);
}

// Utility formatting functions
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(1)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  } else {
    return value.toLocaleString();
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Mock news data
export const mockNews = [
  {
    id: 1,
    title: "Tech Stocks Rally as AI Sector Shows Strong Growth",
    summary: "Major technology companies see significant gains as artificial intelligence continues to drive market sentiment.",
    source: "Financial Times",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "Technology"
  },
  {
    id: 2,
    title: "Federal Reserve Hints at Potential Rate Cuts",
    summary: "Central bank officials suggest more accommodative monetary policy could be on the horizon.",
    source: "Reuters",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: "Economics"
  },
  {
    id: 3,
    title: "Energy Sector Surges on Oil Price Recovery",
    summary: "Oil and gas companies benefit from stabilizing crude prices and increased demand forecasts.",
    source: "Bloomberg",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    category: "Energy"
  }
];

// Generate price history for charts
export function generatePriceHistory(days: number, basePrice: number, volatility: number = 2): number[] {
  const history = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = Math.max(0.01, currentPrice + change);
    history.push(currentPrice);
  }
  
  return history;
}

// Mock crypto data
export const mockCryptos = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 62000,
    change: 1200,
    changePercent: 1.97,
    volume: 28500000000,
    marketCap: 1200000000000
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3200,
    change: -45,
    changePercent: -1.39,
    volume: 15200000000,
    marketCap: 385000000000
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    price: 545,
    change: 12,
    changePercent: 2.25,
    volume: 2100000000,
    marketCap: 84000000000
  }
];
