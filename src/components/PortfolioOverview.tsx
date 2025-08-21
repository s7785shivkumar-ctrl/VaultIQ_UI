import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Plus, ArrowDownToLine } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { PortfolioData, Token } from '../data/mockData';

interface PortfolioOverviewProps {
  portfolioData: PortfolioData;
  tokens: Token[];
}

export default function PortfolioOverview({ portfolioData, tokens }: PortfolioOverviewProps) {
  const isPositive = portfolioData.totalPnlPct >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Get top performers
  const topPerformers = tokens
    .filter(token => token.pnlPct > 0)
    .sort((a, b) => b.pnlPct - a.pnlPct)
    .slice(0, 3);

  const topLosers = tokens
    .filter(token => token.pnlPct < 0)
    .sort((a, b) => a.pnlPct - b.pnlPct)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Total Portfolio Value */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
                <p className="text-3xl font-bold">{formatCurrency(portfolioData.totalValue)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(portfolioData.totalPnlPct)}
                  </span>
                  <span className={`text-sm ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({isPositive ? '+' : ''}{formatCurrency(portfolioData.totalPnl)})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    24h
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Wallet
                </Button>
                <Button size="sm">
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Receive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Performance Chart */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData.weeklyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? "#16a34a" : "#ef4444"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isPositive ? "#16a34a" : "#ef4444"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    hide 
                  />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                    labelFormatter={(date: string) => new Date(date).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={isPositive ? "#16a34a" : "#ef4444"}
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformers.length > 0 ? (
              <div className="space-y-3">
                {topPerformers.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {token.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+{token.pnlPct.toFixed(2)}%</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(token.pnlUsd)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No gains this period</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topLosers.length > 0 ? (
              <div className="space-y-3">
                {topLosers.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {token.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">{token.pnlPct.toFixed(2)}%</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(token.pnlUsd)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No losses this period</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}