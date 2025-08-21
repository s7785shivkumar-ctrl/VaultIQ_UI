import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Send, Repeat } from 'lucide-react';
import type { Token } from '../data/mockData';

interface TokenCardProps {
  token: Token;
  onSend?: () => void;
  onSwap?: () => void;
  onDetails?: () => void;
}

export default function TokenCard({ token, onSend, onSwap, onDetails }: TokenCardProps) {
  const isPositive = token.pnlPct >= 0;
  
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

  // Generate SVG sparkline
  const generateSparkline = (data: number[]) => {
    const width = 80;
    const height = 20;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          fill="none"
          stroke={isPositive ? "#16a34a" : "#ef4444"}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ImageWithFallback
                src={token.icon}
                alt={token.name}
                className="w-10 h-10 rounded-full"
              />
              <Badge 
                variant="secondary" 
                className="absolute -bottom-1 -right-1 text-xs px-1 py-0 h-4"
              >
                {token.network.slice(0, 3)}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{token.symbol}</h3>
              <p className="text-sm text-muted-foreground">{token.name}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold">{formatCurrency(token.usd)}</p>
            <p className="text-sm text-muted-foreground">
              {token.balance.toLocaleString()} {token.symbol}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(token.pnlPct)}
            </span>
            <span className={`text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              ({isPositive ? '+' : ''}{formatCurrency(token.pnlUsd)})
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {generateSparkline(token.sparklineData)}
          </div>
        </div>

        <div className="flex space-x-2 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSend?.();
            }}
          >
            <Send className="h-3 w-3 mr-1" />
            Send
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSwap?.();
            }}
          >
            <Repeat className="h-3 w-3 mr-1" />
            Swap
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDetails?.();
            }}
          >
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}