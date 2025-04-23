"use client"

import React, { useState } from 'react';
import { 
  User, Settings, History, Trophy, GitPullRequest, DollarSign, 
  ChevronRight, ExternalLink, Clock, Tag, Github, Wallet, Star
} from 'lucide-react';

interface Bounty {
  id: string;
  title: string;
  repository: string;
  amount: number;
  status: 'in_progress' | 'completed' | 'reviewing';
  date: string;
}

const mockBounties: Bounty[] = [
  {
    id: '1',
    title: 'Implement Wallet Connect Feature',
    repository: 'solana-labs/wallet-adapter',
    amount: 5,
    status: 'completed',
    date: '2025-03-15'
  },
  {
    id: '2',
    title: 'Fix Transaction History Pagination',
    repository: 'solana-labs/explorer',
    amount: 3.5,
    status: 'in_progress',
    date: '2025-03-14'
  },
  {
    id: '3',
    title: 'Add Dark Mode Support',
    repository: 'solana-foundation/docs',
    amount: 2,
    status: 'reviewing',
    date: '2025-03-13'
  }
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#14F195]/20 text-[#14F195]';
      case 'in_progress':
        return 'bg-[#9945FF]/20 text-[#9945FF]';
      case 'reviewing':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0E12] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-[#9945FF]/20 flex items-center justify-center mr-6">
                <User className="w-10 h-10 text-[#9945FF]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">John Doe</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-400">
                    <Github className="w-4 h-4 mr-2" />
                    <span>@johndoe</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Wallet className="w-4 h-4 mr-2" />
                    <span className="font-mono text-sm">Gq7GW...9gQr</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-[#2D2D3A] rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-[#14F195]">120.5 SOL</p>
              </div>
              <div className="px-6 py-3 bg-[#2D2D3A] rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-[#9945FF]">94%</p>
              </div>
              <button className="p-3 bg-[#2D2D3A] text-white rounded-xl hover:bg-[#3D3D4A] transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Completed Bounties', value: '24', icon: Trophy, color: 'text-[#14F195]' },
            { label: 'Active Bounties', value: '3', icon: GitPullRequest, color: 'text-[#9945FF]' },
            { label: 'Total Contributions', value: '156', icon: History, color: 'text-yellow-500' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl p-6 hover:border-[#9945FF]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-full bg-[#2D2D3A] flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Chart */}
        <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Contribution Activity</h2>
            <select className="bg-[#2D2D3A] text-white rounded-lg px-4 py-2 border border-[#3D3D4A] focus:outline-none focus:border-[#9945FF]">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="w-full bg-[#2D2D3A] rounded-t-sm hover:bg-[#9945FF]/30 transition-colors cursor-pointer group relative"
                style={{ height: `${Math.random() * 100}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-[#1A1A24] border border-[#2D2D3A] rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <p className="text-xs text-white">
                    {new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[#14F195]">3 contributions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bounties */}
        <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#2D2D3A] flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Bounties</h2>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-[#2D2D3A] text-white rounded-lg hover:bg-[#3D3D4A] transition-colors">
                Filter
              </button>
              <button className="px-4 py-2 bg-[#9945FF] text-white rounded-lg hover:bg-[#9945FF]/90 transition-colors">
                Find Bounties
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-[#2D2D3A]">
            {mockBounties.map((bounty) => (
              <div 
                key={bounty.id} 
                className="p-6 hover:bg-[#2D2D3A]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <GitPullRequest className="w-4 h-4 text-[#9945FF] mr-2" />
                      <span className="text-gray-400 text-sm">{bounty.repository}</span>
                    </div>
                    <h3 className="text-white font-medium mb-3">{bounty.title}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(bounty.date)}
                      </div>
                      <div className="flex items-center text-[#14F195]">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {bounty.amount} SOL
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(bounty.status)}`}>
                        {bounty.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-[#2D2D3A] rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#1A1A24] border-t border-[#2D2D3A]">
            <button className="w-full flex items-center justify-center px-4 py-2 text-[#9945FF] hover:bg-[#9945FF]/10 rounded-lg transition-colors">
              View All Bounties
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;