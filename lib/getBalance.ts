import { Connection,clusterApiUrl,PublicKey, LAMPORTS_PER_SOL,} from "@solana/web3.js";
import { privy } from "@/lib/privyClient"

export const CheckBalance = async (privyId : string) => {
    try{
        if (!privyId) {
            throw new Error("Maintainer address is required");
        }
        const maintainer = await privy.getUserById(privyId);
        if (!maintainer) {
            throw new Error("Maintainer not found");
        }
        const maintainerWallet = maintainer.linkedAccounts.find(
            (acc) => acc.type === "wallet" && acc.walletClientType === "privy" && acc.chainType === "solana"
        );
        if (!maintainerWallet) {
            throw new Error("Maintainer wallet not found");
        }
        //@ts-ignore
        const maintainer_address = maintainerWallet.address;
        if (!maintainer_address) {
            throw new Error("Maintainer address not found");
        }
        const connection = new Connection(clusterApiUrl("devnet"));
        const main_public_key = new PublicKey(maintainer_address)
        const balance = await connection.getBalance(main_public_key);
        return new Response(
          JSON.stringify({
            message: "Balance checked successfully",
            balance: balance/LAMPORTS_PER_SOL,
            status: 200,
          })
        );
        return 
    }catch(error : any){
        console.error("Error checking balance:", error);
        return new Response(
          JSON.stringify({
            message: "Error checking balance",
            error: error.message,
            status: 500,
          })
        );
    }
  

  
};