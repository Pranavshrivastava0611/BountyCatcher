"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, DollarSign, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { usePathname } from "next/navigation";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface RepoInfo {
  name: string;
  full_name: string;
  owner: string;
  default_branch: string;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: string;
  tokenType: "SOL" | "ETH" | string;
  repoId: string;
  repoInfo: RepoInfo;
  repoLink: string;
  issueNumber: string;
  status: "open" | "closed";
  createdAt: string | Date;
  difficulty: "Easy" | "Medium" | "Hard";
}

const Bounties: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [date, setDate] = useState(new Date());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pathCheck = pathname.split("/").indexOf("bounties") !== -1;

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await axios.get("/api/bounties");
        const data = response.data;
        setBounties(data);
      } catch (error) {
        console.error("Error fetching bounties:", error);
      }
    };

    fetchBounties();
    setDate(new Date());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("bounties");
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsVisible(rect.top <= window.innerHeight * 0.75);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const section = document.getElementById("bounties");
      if (section) {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
      }
    };

    updateCanvasSize();

    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(70, Math.floor(canvas.width / 20));
    const colors = ["#9945FF", "#14F195", "#9945FF80", "#14F19580"];

    class ParticleClass implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 10 + 1;
        this.speedX = Math.random() * 4 - 0.25;
        this.speedY = Math.random() * 4 - 0.25;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray.length = 0;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new ParticleClass());
      }
    }

    function animate() {
      if (!isVisible) return;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx!);
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(153, 69, 255, ${0.15 - distance / 1000})`;
            ctx!.lineWidth = 0.2;
            ctx!.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx!.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx!.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    function handleResize() {
      updateCanvasSize();
      init();
    }

    window.addEventListener("resize", handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible]);

  function dateDiff(from: Date, to: Date): number {
    const diffTime = Math.abs(to.getTime() - from.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  const filteredBounties = bounties
    .filter((bounty) => {
      const query = searchQuery.toLowerCase();
      return (
        bounty.title.toLowerCase().includes(query) ||
        bounty.description.toLowerCase().includes(query) ||
        bounty.repoInfo.full_name.toLowerCase().includes(query)
      );
    })
    .slice(0, pathCheck ? bounties.length : 6); // 👈 Only 6 on non-/bounties pages

  return (
    <section
      id="bounties"
      className="py-20 bg-[#0E0E12] relative overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E12]/80 via-[#0E0E12]/60 to-[#0E0E12]/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            Active Bounties
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Browse through open issues with SOL bounties. Find the perfect issue
            that matches your skills and earn rewards.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-[#2D2D3A] rounded-md bg-[#1A1A24] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:border-transparent transition-all"
              placeholder="Search by title, repo, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map((bounty, index) => (
            <div
              key={bounty.id}
              className={`bounty-card bg-[#1A1A24] rounded-lg border border-[#2D2D3A] p-6 transition-all duration-700 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {bounty.title}
                </h3>
                <span className="flex items-center px-3 py-1 rounded-full bg-[#9945FF]/20 text-[#14F195] text-sm font-medium">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {bounty.amount} SOL
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {bounty.description}
              </p>
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <span className="font-medium text-gray-400 mr-2">Repo:</span>
                  <a
                    href={`https://github.com/${bounty.repoInfo.full_name}`}
                    className="hover:text-[#14F195] transition-colors"
                  >
                    {bounty.repoInfo.full_name}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  <span>
                    {dateDiff(new Date(bounty.createdAt), new Date())} days ago
                  </span>
                  <span className="mx-2">•</span>
                </div>
              </div>
              <a
                href={bounty.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2 border border-[#9945FF] rounded-md text-white hover:bg-[#9945FF]/10 transition-all text-sm font-medium"
              >
                View Issue
              </a>
            </div>
          ))}
        </div>

        {!pathCheck && (
          <div className="text-center mt-12">
            <button
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#14F195] hover:bg-[#14F195]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14F195] transition-all pulse-animation"
              onClick={() => router.push("/bounties")}
            >
              View All Bounties
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Bounties;
