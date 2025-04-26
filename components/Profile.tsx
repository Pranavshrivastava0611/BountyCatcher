"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Wallet,
  Github,
  ExternalLink,
  DollarSign,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
//@ts-ignore
import { CopyToClipboard } from "react-copy-to-clipboard";
import { usePrivy, useWallets, useSolanaWallets } from "@privy-io/react-auth";
import axios from "axios";

export interface RepoInfo {
  name: string;
  owner: string;
  private: boolean;
}
export interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: string;
  tokenType: string;
  repoId: string;
  repoInfo: RepoInfo;
  repoLink: string;
  issueNumber: string | null;
  status: string;
  contributorId: string | null;
  prLink: string | null;
  mergedAt: Date | null;
  createdAt: Date;
}

const Profile: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"completed" | "in_progress">(
    "completed"
  );
  const { user, exportWallet } = usePrivy();
  const { exportWallet: exportSolanaWallet } = useSolanaWallets();
  const { wallets } = useWallets();
  const [completedBounties, setCompletedBounties] = useState<Bounty[]>([]);
  const [generatedBounties, setGeneratedBounties] = useState<Bounty[]>([]);
  const [totalEarned, setTotalEarned] = useState<number>(0);

  useEffect(() => {
    const getCompletedBounties = async () => {
      if (!user?.github?.username) return;
      try {
        const response = await axios.get("/api/get-bounty-info", {
          params: {
            userId: user.github.username,
          },
        });
        const data = response.data;
        setCompletedBounties(data.completedBounties || []);
        setGeneratedBounties(data.generatedBounties || []);
      } catch (error) {
        console.error("Failed to fetch bounties", error);
      }
    };
    getCompletedBounties();
  }, [user?.github?.username]);

  useEffect(()=>{
    const total = completedBounties.reduce(
      (acc, bounty) => acc + parseFloat(bounty.amount),
      0
    );
    setTotalEarned(total);
  },[completedBounties])

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

  //@ts-ignore
  const walletAddress = embeddedSolanaWallet?.address || embeddedEthereumWallet?.address || "";
  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

    const handleCopy = async () => {
      if (walletAddress) {
        try {
          await navigator.clipboard.writeText(walletAddress);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
      }
    };

  const filteredBounties =
    activeTab === "completed" ? completedBounties : generatedBounties;

  return (
    <div className="min-h-screen bg-[#0E0E12] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Profile Header */}
        <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#9945FF]/20 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-[#9945FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">
                {user?.github?.name || "User"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                <div className="flex items-center text-gray-400 text-sm">
                  <Github className="w-4 h-4 mr-1.5" />
                  <span>{user?.github?.username}</span>
                </div>
                {walletAddress && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center px-2 py-1 bg-[#2D2D3A] rounded-lg text-sm">
                      <Wallet className="w-4 h-4 text-[#14F195] mr-1.5" />
                      <span className="font-mono text-gray-300">
                        {shortWallet}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="ml-1.5 p-1 hover:bg-[#3D3D4A] rounded transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-[#14F195]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Wallet Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {embeddedEthereumWallet && (
              <button
                onClick={exportWallet}
                className="flex items-center px-3 py-2 bg-[#9945FF]/20 text-[#9945FF] rounded-lg hover:bg-[#9945FF]/30 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Export ETH Wallet
              </button>
            )}
            {embeddedSolanaWallet && (
              <button
                onClick={() => exportSolanaWallet()}
                className="flex items-center px-3 py-2 bg-[#9945FF]/20 text-[#9945FF] rounded-lg hover:bg-[#9945FF]/30 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Export SOL Wallet
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Earned",
              value: totalEarned,
              icon: DollarSign,
              color: "text-[#14F195]",
            },
            {
              label: "Total Completed Bounties",
              value: completedBounties.length,
              icon: Github,
              color: "text-[#14F195]",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color} mt-0.5`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color} opacity-50`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bounties Section */}
        <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2D2D3A] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Bounties</h2>
            <div className="flex space-x-2">
              {["completed", "in_progress"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab as "completed" | "in_progress")
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? `bg-${
                          tab === "completed" ? "[#14F195]" : "[#9945FF]"
                        }/20 text-${
                          tab === "completed" ? "[#14F195]" : "[#9945FF]"
                        }`
                      : "text-gray-400 hover:bg-[#2D2D3A]"
                  }`}
                >
                  {tab === "in_progress" ? "Generated" : "Completed"}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#2D2D3A]">
            {filteredBounties.length > 0 ? (
              filteredBounties.map((bounty) => (
                <div
                  key={bounty.id}
                  className="p-4 hover:bg-[#2D2D3A]/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="flex items-center truncate">
                          <Github className="w-4 h-4 mr-1.5 flex-shrink-0" />
                          <span className="truncate">
                            {bounty.repoInfo?.owner}/{bounty.repoInfo?.name}
                          </span>
                        </div>
                        {bounty.issueNumber && (
                          <span className="text-[#9945FF] flex-shrink-0">
                            #{bounty.issueNumber}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-medium my-1 truncate">
                        {bounty.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#14F195] flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {bounty.amount} {bounty.tokenType}
                        </span>
                        <span className="text-gray-400">
                          {new Date(bounty.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {bounty.repoLink && (
                      <a
                        href={bounty.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-[#2D2D3A] rounded-lg transition-colors group flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400">
                {activeTab === "completed"
                  ? "No completed bounties yet!"
                  : "No in-progress bounties yet!"}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#2D2D3A]">
            <button className="w-full flex items-center justify-center px-4 py-1.5 text-[#9945FF] hover:bg-[#9945FF]/10 rounded-lg transition-colors text-sm">
              View All Bounties
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
