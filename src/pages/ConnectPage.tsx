import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Wallet, ArrowRight, Loader2, CheckCircle, ExternalLink } from 'lucide-react';

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect with MetaMask browser extension',
    icon: '🦊',
    type: 'MetaMask' as const,
    available: true
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connect with WalletConnect protocol',
    icon: '🔗',
    type: 'WalletConnect' as const,
    available: true
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Connect your Ledger hardware wallet',
    icon: '🔒',
    type: 'Ledger' as const,
    available: true
  },
  {
    id: 'injected',
    name: 'Other Wallets',
    description: 'Connect with other injected wallets',
    icon: '🌐',
    type: 'Injected' as const,
    available: false
  }
];

export default function ConnectPage() {
  const navigate = useNavigate();
  const { wallets, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const handleConnect = async (type: 'MetaMask' | 'WalletConnect' | 'Ledger' | 'Injected') => {
    try {
      await connectWallet(type);
      toast.success(`${type} wallet connected successfully!`);
    } catch (error) {
      toast.error(`Failed to connect ${type} wallet. Please try again.`);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
    toast.success('Welcome to vaultIQ! Your portfolio is ready.');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-lg">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold mb-2">Connect a Wallet</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect MetaMask, WalletConnect or add hardware wallets to get started with your portfolio.
          </p>
        </div>

        {wallets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Connected Wallets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {wallets.map((wallet) => (
                <Card key={wallet.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{wallet.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {wallet.ens || formatAddress(wallet.address)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => disconnectWallet(wallet.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{wallet.network}</Badge>
                      <p className="text-sm">
                        {wallet.balance.toFixed(4)} ETH
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={handleContinue} className="w-full md:w-auto">
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {walletOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !option.available ? 'opacity-50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => handleConnect(option.type)}
                  disabled={!option.available || isConnecting}
                  className="w-full"
                  variant={option.available ? "default" : "secondary"}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : option.available ? (
                    'Connect'
                  ) : (
                    'Coming Soon'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium mb-2">New to Web3 wallets?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We recommend starting with MetaMask. It's beginner-friendly and works with most dApps.
                </p>
                <Button variant="link" className="p-0 h-auto text-sm">
                  Learn how to set up MetaMask →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}