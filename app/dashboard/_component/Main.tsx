import { usePrivy, useWallets, useSolanaWallets, useDelegatedActions } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  Github,
  LogOut,
  ExternalLink,
  Loader,
  AlertCircle,
  CheckCircle2,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterWallet() {
  const {
    ready,
    authenticated,
    login,
    logout,
    user,
    linkGithub,
  } = usePrivy();

  const { exportWallet } = useSolanaWallets();
  const { wallets } = useWallets();
  const { delegateWallet } = useDelegatedActions();

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const githubUsername = user?.github?.username;
  const githubId = user?.github?.subject;
  const email = user?.email?.address;

  const embeddedEthereumWallet = wallets.find(
    (wallet) =>
      wallet.walletClientType === "privy" &&
      wallet.type === "ethereum" &&
      wallet.connectorType === "embedded"
  );

  const embeddedSolanaWallet = user?.linkedAccounts?.find(
    (acc) =>
      acc.type === "wallet" &&
      acc.walletClientType === "privy" &&
      acc.chainType === "solana"
  );

  const isSolanaDelegated = !!user?.linkedAccounts?.find(
    (acc) =>
      acc.type === "wallet" &&
      acc.walletClientType === "privy" &&
      acc.chainType === "solana" &&
      acc.delegated === true
  );

  const canRegister = !!githubId && !!githubUsername && !!embeddedEthereumWallet;

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (!user?.id) return;
  
      try {
        const res = await axios.get(`/api/check-wallet?userId=${user.github?.username}`);
       
        if (res.data.registered) {
          setAlreadyRegistered(true);
        }
      } catch (error) {
        console.error("Error checking wallet registration:", error);
      }
    };
    checkIfRegistered();
  }, [user?.id]);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      if (!canRegister) {
        setStatus("Connect both GitHub and have an embedded wallet.");
        toast.error("Connect both GitHub and have an embedded wallet.");
        setIsLoading(false);
        return;
      }
      if (!isSolanaDelegated && embeddedSolanaWallet) {
        setStatus("Delegating Solana wallet...");
        await delegateWallet({
          //@ts-ignore
          address: embeddedSolanaWallet.address,
          chainType: "solana",
        });
        setStatus("Wallet delegated! Registering...");
      }

      const res = await axios.post("/api/register-wallet", {
        userId: user?.id,
        githubId,
        username: githubUsername,
        email,
        privyWallet: embeddedEthereumWallet.address,
        walletType: embeddedEthereumWallet.type,
      });

      if (res.status === 200) {
        setStatus("Wallet registered successfully!");
        toast.success("Wallet registered successfully!");
        setAlreadyRegistered(true);
      } else {
        setStatus(res.data.message || "Something went wrong");
        toast.error("Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error registering wallet.");
      toast.error("Error registering wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText(""), 2000);
      toast.success("Copied to clipboard");
    });
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-[#14F195]">
          <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          <span className="text-sm sm:text-base">Loading...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            Connect Your Wallet
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto">
            Link your GitHub account and wallet to start earning SOL rewards for your contributions.
          </p>
        </div>
        <button
          onClick={login}
          className="flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium rounded-lg transition-all duration-200 shadow-lg shadow-[#14F195]/20 text-sm sm:text-base"
        >
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Login with GitHub & Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
      <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#2D2D3A]">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#14F195]" />
            Wallet Dashboard
          </h2>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 bg-[#2D2D3A]/50 rounded-lg">
            <div className="flex items-center mr-4 mb-2 sm:mb-0">
              <Github className="w-4 h-4 sm:w-5 sm:h-5 text-[#14F195] mr-2 sm:mr-3" />
              <span className="text-sm sm:text-base text-gray-300">
                GitHub Account
              </span>
            </div>
            {githubUsername ? (
              <span className="text-sm sm:text-base text-[#14F195] font-medium">
                {githubUsername}
              </span>
            ) : (
              <button
                onClick={linkGithub}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#9945FF]/20 text-[#9945FF] rounded-lg hover:bg-[#9945FF]/30 transition-colors text-sm sm:text-base"
              >
                Connect GitHub
              </button>
            )}
          </div>

          {embeddedSolanaWallet && (
            <div className="p-3 sm:p-4 bg-[#2D2D3A]/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-base text-gray-300">
                  Solana Wallet
                </span>
                <span className="text-xs sm:text-sm text-[#14F195]">
                  Connected
                </span>
              </div>
              <div className="relative group">
                <div className="sm:hidden flex items-center bg-[#0E0E12] rounded p-2">
                  <code className="text-xs text-gray-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap pr-10">
                    {`${
                      //@ts-ignore
                      embeddedSolanaWallet.address.slice(0, 6)
                    }...${
                      //@ts-ignore
                      embeddedSolanaWallet.address.slice(-4)
                    }`}
                  </code>
                </div>
                <code className="hidden sm:block w-full p-2 bg-[#0E0E12] rounded text-sm text-gray-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap pr-10">
                  {
                    //@ts-ignore
                    embeddedSolanaWallet.address
                  }
                </code>
                <button
                  //@ts-ignore
                  onClick={() => copyToClipboard(embeddedSolanaWallet.address)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-[#2D2D3A] rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
          )}

          {canRegister && !alreadyRegistered && (
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Register Wallet
                </>
              )}
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={async ()=>{
                
              await exportWallet();
              }}
              className="flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 bg-[#9945FF]/20 hover:bg-[#9945FF]/30 text-[#9945FF] rounded-lg transition-colors text-sm sm:text-base"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Export SOL Wallet
            </button>
          </div>

          {status && (
            <div
              className={`p-3 sm:p-4 rounded-lg flex items-center space-x-2 ${
                status.includes("successfully")
                  ? "bg-[#14F195]/10 text-[#14F195]"
                  : "bg-[#9945FF]/10 text-[#9945FF]"
              }`}
            >
              {status.includes("successfully") ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              )}
              <span className="text-sm sm:text-base">{status}</span>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2D2D3A] hover:bg-[#3D3D4A] text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}