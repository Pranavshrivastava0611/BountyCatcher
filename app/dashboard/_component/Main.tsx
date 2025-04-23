"use client"

import { usePrivy, useWallets, useSolanaWallets, useDelegatedActions } from '@privy-io/react-auth';
import { useState } from 'react';
import { Wallet, Github, LogOut, ExternalLink, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterWallet() {
  const {
    ready,
    authenticated,
    login,
    logout,
    user,
    linkGithub,
    exportWallet,
  } = usePrivy();

  const { exportWallet: exportSolanaWallet } = useSolanaWallets();
  const { wallets } = useWallets();
  const { delegateWallet } = useDelegatedActions();

  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const githubUsername = user?.github?.username;
  const githubId = user?.github?.subject;
  const email = user?.email?.address;

  const embeddedEthereumWallet = wallets.find(
    (wallet) =>
      wallet.walletClientType === 'privy' &&
      wallet.type === 'ethereum' &&
      wallet.connectorType === 'embedded'
  );

  const embeddedSolanaWallet = user?.linkedAccounts?.find(
    (acc) =>
      acc.type === 'wallet' &&
      acc.walletClientType === 'privy' &&
      acc.chainType === 'solana'
  );

  const isSolanaDelegated = !!user?.linkedAccounts?.find(
    (acc) =>
      acc.type === 'wallet' &&
      acc.walletClientType === 'privy' &&
      acc.chainType === 'solana' &&
      acc.delegated === true
  );

  const canRegister = !!githubId && !!githubUsername && !!embeddedEthereumWallet;

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      if (!canRegister) {
        setStatus('Connect both GitHub and have an embedded wallet.');
        return;
      }
      
      if (!isSolanaDelegated && embeddedSolanaWallet) {
        setStatus('Delegating Solana wallet...');
        await delegateWallet({
          //@ts-ignore
          address: embeddedSolanaWallet.address,
          chainType: "solana",
        });
        setStatus('Wallet delegated! Registering...');
      }

      const res = await fetch('/api/register-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          githubId,
          username: githubUsername,
          email,
          privyWallet: embeddedEthereumWallet.address,
          walletType: embeddedEthereumWallet.type,
        }),
      });

      if (res.ok) {
        setStatus('Wallet registered successfully!');
      } else {
        const error = await res.json();
        setStatus(error.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error registering wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  //@ts-ignore
  const ebSolWallet = embeddedSolanaWallet?.address;

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-[#14F195]">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading Privy...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            Connect Your Wallet
          </h2>
          <p className="text-gray-300 max-w-md">
            Link your GitHub account and wallet to start earning SOL rewards for your contributions.
          </p>
        </div>
        <button
          onClick={login}
          className="flex items-center px-6 py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium rounded-lg transition-all duration-200 shadow-lg shadow-[#14F195]/20"
        >
          <Wallet className="w-5 h-5 mr-2" />
          Login with GitHub & Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8">
      <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-[#2D2D3A]">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-[#14F195]" />
            Wallet Dashboard
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Connection Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#2D2D3A]/50 rounded-lg">
              <div className="flex items-center">
                <Github className="w-5 h-5 text-[#14F195] mr-3" />
                <span className="text-gray-300">GitHub Account</span>
              </div>
              {githubUsername ? (
                <span className="text-[#14F195] font-medium">
                  {githubUsername}
                </span>
              ) : (
                <button
                  onClick={linkGithub}
                  className="px-4 py-2 bg-[#9945FF]/20 text-[#9945FF] rounded-lg hover:bg-[#9945FF]/30 transition-colors"
                >
                  Connect GitHub
                </button>
              )}
            </div>

            {embeddedEthereumWallet && (
              <div className="p-4 bg-[#2D2D3A]/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Ethereum Wallet</span>
                  <span className="text-[#14F195]">Connected</span>
                </div>
                <code className="block w-full p-2 bg-[#0E0E12] rounded text-sm text-gray-400 font-mono">
                  {embeddedEthereumWallet.address}
                </code>
              </div>
            )}

            {embeddedSolanaWallet && (
              <div className="p-4 bg-[#2D2D3A]/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Solana Wallet</span>
                  <span className="text-[#14F195]">Connected</span>
                </div>
                <code className="block w-full p-2 bg-[#0E0E12] rounded text-sm text-gray-400 font-mono">
                  {ebSolWallet}
                </code>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {canRegister && (
            <div className="space-y-4">
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Register Wallet
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={exportWallet}
                  className="flex items-center justify-center px-4 py-3 bg-[#9945FF]/20 hover:bg-[#9945FF]/30 text-[#9945FF] rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Export ETH Wallet
                </button>

                <button
                  onClick={()=> exportSolanaWallet()}
                  className="flex items-center justify-center px-4 py-3 bg-[#9945FF]/20 hover:bg-[#9945FF]/30 text-[#9945FF] rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Export SOL Wallet
                </button>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
                status.includes("successfully")
                  ? "bg-[#14F195]/10 text-[#14F195]"
                  : "bg-[#9945FF]/10 text-[#9945FF]"
              }`}
            >
              {status.includes("successfully") ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{status}</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-6 py-3 bg-[#2D2D3A] hover:bg-[#3D3D4A] text-white rounded-lg transition-colors mt-6"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}