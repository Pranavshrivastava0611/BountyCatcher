import { PrivyClient } from '@privy-io/server-auth';

export const privy = new PrivyClient( process.env.NEXT_PUBLIC_PRIVY_APP_ID!, 
  process.env.NEXT_PUBLIC_PRIVY_APP_SECRET!,{
    walletApi : {
        authorizationPrivateKey : process.env.NEXT_PUBLIC_PRIVY_DELEGATED_KEY!
    }
  });

  

