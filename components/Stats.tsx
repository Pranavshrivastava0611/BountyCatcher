"use client"

import React, { useEffect, useRef,useState } from 'react';
import { Trophy, Users, Code, DollarSign } from 'lucide-react';
import axios from 'axios';


export interface User {
  id: string;
  userId: string;
  githubId: string;
  username: string;
  email?: string | null;
  privyWallet?: string | null;
  role: 'contributor' | 'maintainer' | 'admin';
  createdAt: string; // ISO date string
}
export interface Repo {
  id: string;
  githubRepoId: string;
  owner: string;
  name: string;
  fullName: string;
  installationId: string;
  registeredById: string;
  createdAt: string;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: string;
  tokenType: string;
  repoId: string;
  repoInfo: any; // or create a specific type if you know the structure
  repoLink: string;
  repoOwner: string;
  issueNumber?: string | null;
  status: string; // e.g., "open", "closed"
  contributorId?: string | null;
  prLink?: string | null;
  mergedAt?: string | null;
  createdAt: string;
}

const Stats: React.FC = () => {

  const chartRef = useRef<HTMLCanvasElement>(null);
  const [userInfo,SetUserInfo] = useState<User[]>([])
  const [repos,setRepos] = useState<Repo[]>([]);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const bountyAmount = bounties.reduce((total, bounty) => {
    return total + (parseFloat(bounty.amount) || 0);
  }, 0);
  

    const statItems = [
  {
    icon: <Trophy className="h-8 w-8 text-[#14F195]" />,
    value: bounties.length,
    label: 'Issues Resolved',
    description: 'Successfully closed GitHub issues across projects',
  },
  {
    icon: <Users className="h-8 w-8 text-[#14F195]" />,
    value: userInfo.length,
    label: 'Contributors',
    description: 'Active community of developers earning rewards',
  },
  {
    icon: <Code className="h-8 w-8 text-[#14F195]" />,
    value: repos.length,
    label: 'Repositories',
    description: 'Open source projects using our bounty system',
  },
  {
    icon: <DollarSign className="h-8 w-8 text-[#14F195]" />,
    value: bountyAmount,
    label: 'SOL Distributed',
    description: 'Rewarded to open source contributors',
  },
];

  useEffect(()=>{
      const getBountiesInfo = async ()=>{
          try{
          const response = await axios.get("/api/get-bonties-page-info");
          console.log("response" , response.data);
          SetUserInfo(response.data.user_info);
          setRepos(response.data.repos);
          setBounties(response.data.bounties);
          console.log("bounties",bounties)
          console.log("repos",repos)
          console.log("user info",userInfo)
          }catch(e){
            console.log("error in getting the page info ", e)
          }
        }

        getBountiesInfo();
  },[])

  useEffect(() => {
    // A simple animation for the chart
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 250;

    // Define chart data - mock growth over time
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = [1200, 1800, 2500, 3200, 4000, 6500, 8900, 12000, 15000, 20000, 35000, 50000];

    // Chart settings
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...values);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#1A1A24';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#2D2D3A';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i < months.length; i++) {
      const x = padding + (chartWidth / (months.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }

    // Draw axis labels
    ctx.fillStyle = '#9945FF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    // X-axis labels (months)
    for (let i = 0; i < months.length; i++) {
      const x = padding + (chartWidth / (months.length - 1)) * i;
      ctx.fillText(months[i], x, canvas.height - padding + 15);
    }

    // Y-axis labels (values)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = canvas.height - padding - (chartHeight / 5) * i;
      ctx.fillText(Math.floor((maxValue / 5) * i).toString(), padding - 10, y + 4);
    }

    // Draw chart line
    ctx.strokeStyle = '#14F195';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Move to first point
    const startX = padding;
    const startY = canvas.height - padding - (values[0] / maxValue) * chartHeight;
    ctx.moveTo(startX, startY);
    
    // Draw line to each subsequent point with animation
    let i = 0;
    const drawNextSegment = () => {
      if (i < values.length - 1) {
        i++;
        const x = padding + (chartWidth / (values.length - 1)) * i;
        const y = canvas.height - padding - (values[i] / maxValue) * chartHeight;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw point
        ctx.fillStyle = '#14F195';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Start over for next segment
        setTimeout(drawNextSegment, 100);
      }
    };
    
    drawNextSegment();
    
    // Draw first point
    ctx.fillStyle = '#14F195';
    ctx.beginPath();
    ctx.arc(startX, startY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw chart area fill
    ctx.fillStyle = 'rgba(20, 241, 149, 0.1)';
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    
    for (let i = 0; i < values.length; i++) {
      const x = padding + (chartWidth / (values.length - 1)) * i;
      const y = canvas.height - padding - (values[i] / maxValue) * chartHeight;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
    
  }, []);

  return (
    <section id="stats" className="py-20 bg-[#0E0E12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            Impact Statistics
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our bounty system has made a significant impact on the Solana ecosystem by incentivizing contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#1A1A24] border border-[#2D2D3A] rounded-lg p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center p-3 bg-[#2D2D3A] rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{item.value}</h3>
              <p className="text-[#14F195] font-medium mb-2">{item.label}</p>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-4">SOL Distribution Growth</h3>
              <p className="text-gray-400 mb-6">
                The amount of SOL distributed to contributors has grown exponentially as more projects adopt our bounty system.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Monthly Growth</span>
                    <span className="text-[#14F195] font-medium">32%</span>
                  </div>
                  <div className="w-full bg-[#2D2D3A] rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#9945FF] to-[#14F195] h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Contributor Retention</span>
                    <span className="text-[#14F195] font-medium">78%</span>
                  </div>
                  <div className="w-full bg-[#2D2D3A] rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#9945FF] to-[#14F195] h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Issue Resolution Rate</span>
                    <span className="text-[#14F195] font-medium">92%</span>
                  </div>
                  <div className="w-full bg-[#2D2D3A] rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#9945FF] to-[#14F195] h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 md:pl-8">
              <div className="rounded-lg overflow-hidden border border-[#2D2D3A]">
                <canvas ref={chartRef} className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;