import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { serverUrl } from '../utils/supabase/client';

export interface Wallet {
  id: string;
  address: string;
  network: string;
  ens?: string;
  balance: number;
  isConnected: boolean;
  type: 'MetaMask' | 'WalletConnect' | 'Ledger' | 'Injected';
  connected_at?: string;
}

interface WalletContextType {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  connectWallet: (type: Wallet['type']) => Promise<void>;
  disconnectWallet: (id: string) => void;
  selectWallet: (id: string) => void;
  isConnecting: boolean;
  refreshWallets: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { accessToken, user } = useAuth();

  const refreshWallets = async () => {
    if (!accessToken || !user) return;

    try {
      const response = await fetch(`${serverUrl}/wallets`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const walletsData = await response.json();
        setWallets(walletsData);
        
        if (walletsData.length > 0 && !selectedWallet) {
          setSelectedWallet(walletsData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      refreshWallets();
    } else {
      setWallets([]);
      setSelectedWallet(null);
    }
  }, [user, accessToken]);

  const connectWallet = async (type: Wallet['type']) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWallet = {
        address: '0x' + Math.random().toString(16).substr(2, 40),
        network: 'Ethereum',
        ens: type === 'MetaMask' ? 'vaultiq.eth' : undefined,
        balance: Math.random() * 10,
        isConnected: true,
        type
      };

      const response = await fetch(`${serverUrl}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ wallet: mockWallet })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to connect wallet');
      }

      const { wallet } = await response.json();
      
      setWallets(prev => [...prev, wallet]);
      setSelectedWallet(wallet);
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async (id: string) => {
    if (!accessToken) return;

    try {
      const response = await fetch(`${serverUrl}/wallets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const newWallets = wallets.filter(w => w.id !== id);
        setWallets(newWallets);
        
        if (selectedWallet?.id === id) {
          setSelectedWallet(newWallets[0] || null);
        }
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const selectWallet = (id: string) => {
    const wallet = wallets.find(w => w.id === id);
    if (wallet) {
      setSelectedWallet(wallet);
    }
  };

  return (
    <WalletContext.Provider value={{
      wallets,
      selectedWallet,
      connectWallet,
      disconnectWallet,
      selectWallet,
      isConnecting,
      refreshWallets
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}