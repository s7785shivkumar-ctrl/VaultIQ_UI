export interface Token {
  symbol: string;
  name: string;
  balance: number;
  usd: number;
  pnlUsd: number;
  pnlPct: number;
  icon: string;
  network: string;
  sparklineData: number[];
}

export interface Transaction {
  id: string;
  date: string;
  hash: string;
  type: 'Swap' | 'Send' | 'Receive' | 'Buy' | 'Sell';
  tokens: string;
  amount: string;
  usd: number;
  status: 'Success' | 'Pending' | 'Failed';
  network: string;
}

export interface PortfolioData {
  totalValue: number;
  totalPnl: number;
  totalPnlPct: number;
  weeklyData: { date: string; value: number }[];
}

export const mockTokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 2.143,
    usd: 6300.5,
    pnlUsd: 350.25,
    pnlPct: 5.9,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    network: 'Ethereum',
    sparklineData: [100, 120, 110, 130, 125, 140, 135]
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.125,
    usd: 7400,
    pnlUsd: -120,
    pnlPct: -1.59,
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    network: 'Bitcoin',
    sparklineData: [100, 95, 98, 92, 88, 85, 90]
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    balance: 250,
    usd: 2100,
    pnlUsd: 250,
    pnlPct: 13.5,
    icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    network: 'Ethereum',
    sparklineData: [100, 105, 115, 120, 118, 125, 130]
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 5000,
    usd: 5000,
    pnlUsd: 0,
    pnlPct: 0,
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    network: 'Ethereum',
    sparklineData: [100, 100, 100, 100, 100, 100, 100]
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    balance: 1500,
    usd: 1350,
    pnlUsd: 75,
    pnlPct: 5.88,
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    network: 'Polygon',
    sparklineData: [100, 102, 98, 105, 108, 106, 110]
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    balance: 80,
    usd: 1200,
    pnlUsd: -45,
    pnlPct: -3.61,
    icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    network: 'Ethereum',
    sparklineData: [100, 98, 95, 92, 94, 91, 89]
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-08-21',
    hash: '0x5a3b2c1d4e5f6789abcdef123456789012345678901234567890123456789def',
    type: 'Swap',
    tokens: 'ETH → USDC',
    amount: '0.5 ETH',
    usd: 1550,
    status: 'Success',
    network: 'Ethereum'
  },
  {
    id: '2',
    date: '2025-08-20',
    hash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    type: 'Send',
    tokens: 'USDC',
    amount: '1000 USDC',
    usd: 1000,
    status: 'Pending',
    network: 'Ethereum'
  },
  {
    id: '3',
    date: '2025-08-19',
    hash: '0x9f8e7d6c5b4a39281f0e9d8c7b6a5948372615049382746105938274615039',
    type: 'Buy',
    tokens: 'UNI',
    amount: '50 UNI',
    usd: 420,
    status: 'Success',
    network: 'Ethereum'
  },
  {
    id: '4',
    date: '2025-08-18',
    hash: '0x7f6e5d4c3b2a1908f7e6d5c4b3a2190e8f7d6c5b4a3918e7f6d5c4b3a2109f8e',
    type: 'Receive',
    tokens: 'ETH',
    amount: '1.2 ETH',
    usd: 3720,
    status: 'Success',
    network: 'Ethereum'
  },
  {
    id: '5',
    date: '2025-08-17',
    hash: '0x8e7d6c5b4a39281f0e9d8c7b6a5948372615049382746105938274615039f8e7',
    type: 'Swap',
    tokens: 'BTC → ETH',
    amount: '0.05 BTC',
    usd: 2960,
    status: 'Failed',
    network: 'Bitcoin'
  }
];

export const mockPortfolioData: PortfolioData = {
  totalValue: 23350.5,
  totalPnl: 510.25,
  totalPnlPct: 2.23,
  weeklyData: [
    { date: '2025-08-15', value: 22800 },
    { date: '2025-08-16', value: 23100 },
    { date: '2025-08-17', value: 22950 },
    { date: '2025-08-18', value: 23200 },
    { date: '2025-08-19', value: 23450 },
    { date: '2025-08-20', value: 23300 },
    { date: '2025-08-21', value: 23350.5 }
  ]
};

export const mockAIMessages = [
  {
    id: '1',
    type: 'assistant' as const,
    content: 'Hello! I\'m your AI portfolio assistant. I can help you analyze your holdings, identify trends, and suggest optimizations. What would you like to know about your portfolio?',
    timestamp: new Date().toISOString()
  }
];

export const quickPrompts = [
  'Analyze my portfolio risks',
  'Top performers this week',
  'Rebalancing suggestions',
  'Market outlook',
  'Tax implications',
  'DeFi opportunities'
];