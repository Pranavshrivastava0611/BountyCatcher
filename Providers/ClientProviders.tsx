'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!}
      config={{
        loginMethods: [ "github"],
        solanaClusters: [
          {
            name: "devnet",
            rpcUrl: "https://api.devnet.solana.com",
          },
        ],
       
        appearance: {walletChainType: 'ethereum-and-solana',  walletList: ['metamask', 'rainbow', 'wallet_connect','phantom'],},
    externalWallets: {solana: {connectors: toSolanaWalletConnectors()}},

        embeddedWallets: {
          createOnLogin: "all-users",
          showWalletUIs: true
          
        },
        
      }}
    >
      {children}
    </PrivyProvider>
  );
}
