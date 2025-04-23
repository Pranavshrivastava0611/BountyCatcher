import { Connection, clusterApiUrl } from '@solana/web3.js';

// Solana network configurations
export const SOLANA_NETWORKS = {
  mainnet: {
    name: 'Solana Mainnet',
    rpcUrl: clusterApiUrl('mainnet-beta'),
    network: 'mainnet-beta',
    nativeCurrency: {
      decimals: 9,
      name: 'Solana',
      symbol: 'SOL'
    },
    blockExplorer: 'https://explorer.solana.com'
  },
  devnet: {
    name: 'Solana Devnet',
    rpcUrl: clusterApiUrl('devnet'),
    network: 'devnet',
    nativeCurrency: {
      decimals: 9,
      name: 'Solana',
      symbol: 'SOL'
    },
    blockExplorer: 'https://explorer.solana.com/?cluster=devnet'
  },
  testnet: {
    name: 'Solana Testnet',
    rpcUrl: clusterApiUrl('testnet'),
    network: 'testnet',
    nativeCurrency: {
      decimals: 9,
      name: 'Solana',
      symbol: 'SOL'
    },
    blockExplorer: 'https://explorer.solana.com/?cluster=testnet'
  }
};

// Default connection
export const getSolanaConnection = (network: keyof typeof SOLANA_NETWORKS = 'mainnet') => {
  return new Connection(SOLANA_NETWORKS[network].rpcUrl, 'confirmed');
};

// Get current network configuration
export const getCurrentNetwork = (network: keyof typeof SOLANA_NETWORKS = 'mainnet') => {
  return SOLANA_NETWORKS[network];
}; 