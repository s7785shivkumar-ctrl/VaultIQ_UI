import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PortfolioOverview from '../components/PortfolioOverview';
import TokenCard from '../components/TokenCard';
import AIPanel from '../components/AIPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  mockTokens, 
  mockPortfolioData, 
  mockTransactions,
  type Transaction 
} from '../data/mockData';
import { ArrowRight, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const navigate = useNavigate();

  const handleTokenAction = (action: string, tokenSymbol: string) => {
    toast.info(`${action} ${tokenSymbol} - Feature coming soon!`);
  };

  const formatAddress = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <DashboardLayout onOpenAI={() => setIsAIOpen(true)}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Portfolio Overview */}
        <PortfolioOverview 
          portfolioData={mockPortfolioData}
          tokens={mockTokens}
        />

        {/* Token Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Tokens</h2>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Prices
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTokens.map((token) => (
              <TokenCard
                key={token.symbol}
                token={token}
                onSend={() => handleTokenAction('Send', token.symbol)}
                onSwap={() => handleTokenAction('Swap', token.symbol)}
                onDetails={() => handleTokenAction('View details for', token.symbol)}
              />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/transactions')}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{transaction.type}</span>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {transaction.tokens}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <button
                          onClick={() => copyToClipboard(transaction.hash)}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1"
                        >
                          <span>{formatAddress(transaction.hash)}</span>
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(transaction.usd)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Features Teaser */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Unlock Premium Features</h3>
                <p className="text-muted-foreground mb-4">
                  Get advanced portfolio analytics, tax reports, and AI-powered investment insights.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Advanced Analytics</Badge>
                  <Badge variant="secondary">Tax Optimization</Badge>
                  <Badge variant="secondary">DeFi Tracking</Badge>
                  <Badge variant="secondary">API Access</Badge>
                </div>
              </div>
              <div className="text-center">
                <Badge className="mb-3 bg-blue-600 text-white">PRO</Badge>
                <div>
                  <Button>
                    Upgrade to Premium
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Panel */}
      <AIPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </DashboardLayout>
  );
}