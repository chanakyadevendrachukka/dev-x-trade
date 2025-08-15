import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Treemap, LineChart, Line } from 'recharts';
import { mockStocks, mockCryptos, generatePriceHistory, formatNumber } from '@/utils/stocksApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';

const Analysis = () => {
  // Mock data for sector performance
  const sectorPerformance = [
    { name: 'Technology', value: 8.2 },
    { name: 'Healthcare', value: 3.5 },
    { name: 'Financials', value: -1.2 },
    { name: 'Consumer', value: 2.8 },
    { name: 'Energy', value: -2.5 },
  ];

  // Crypto market cap treemap data
  const cryptoTreemapData = mockCryptos
    .map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol,
      value: crypto.marketCap,
      price: crypto.price,
      change: crypto.changePercent,
      marketCap: crypto.marketCap,
      volume: crypto.volume
    }))
    .sort((a, b) => b.value - a.value);

  // Generate price history for Bitcoin and Ethereum
  const [btcHistory, setBtcHistory] = useState(generatePriceHistory(30, 62000, 5));
  const [ethHistory, setEthHistory] = useState(generatePriceHistory(30, 3200, 6));

  // Format historical data for charts
  const btcHistoryData = btcHistory.map((price, index) => ({
    day: index + 1,
    price
  }));

  const ethHistoryData = ethHistory.map((price, index) => ({
    day: index + 1,
    price
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Custom content for the treemap
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, changePercent, value } = props;
    
    // Color based on change percent (green for positive, red for negative)
    const color = changePercent >= 0 ? "#4ade80" : "#f87171";
    const cellValue = changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color,
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {width > 50 && height > 30 ? (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 6}
              textAnchor="middle"
              fill="#fff"
              fontSize={14}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
            >
              {cellValue}
            </text>
          </>
        ) : null}
      </g>
    );
  };

  return (
    <PageLayout title="AI Market Analysis">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-display">
            Advanced AI Analytics
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Powered by machine learning algorithms, our AI provides deep market insights, 
            predictive analytics, and intelligent risk assessment for superior trading decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">AI Sector Performance (YTD)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorPerformance}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Crypto Market Intelligence</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={cryptoTreemapData}
                  dataKey="value"
                  nameKey="name"
                  content={<CustomizedContent />}
                />
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bitcoin className="h-5 w-5 mr-2 text-orange-500" />
              Bitcoin AI Analysis
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={btcHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">AI Market Signals & Indicators</h2>
            <div className="space-y-4">
              <div className="flex justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">S&P 500</h3>
                  <p className="text-sm text-muted-foreground">Technical Analysis</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500">BUY</p>
                  <p className="text-sm">11 of 15 indicators</p>
                </div>
              </div>
              <div className="flex justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">NASDAQ</h3>
                  <p className="text-sm text-muted-foreground">Moving Averages</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-yellow-500">NEUTRAL</p>
                  <p className="text-sm">7 of 15 indicators</p>
                </div>
              </div>
              <div className="flex justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">Russell 2000</h3>
                  <p className="text-sm text-muted-foreground">Moving Averages</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-500">SELL</p>
                  <p className="text-sm">4 of 15 indicators</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analysis;