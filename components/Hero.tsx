"use client"

import React, { useEffect, useRef } from 'react';
import { ArrowRight, Github, Code } from 'lucide-react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(100, Math.floor(window.innerWidth / 10));
    const colors = ['#00FFFF', '#39FF14', '#FF44CC', '#FFD700'];


    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 10 + 1
        this.speedX = Math.random() * 2 - 0.5;
        this.speedY = Math.random() * 2 - 0.5;
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
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Connect particles with lines
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(153, 69, 255, ${0.1 - distance/1000})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    function handleResize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      particlesArray.length = 0;
      init();
    }

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity:0.7}}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E12] via-[#0E0E12]/90 to-[#0E0E12]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div 
          className="inline-block mb-4 px-4 py-1 rounded-full bg-[#2D2D3A] border border-[#3D3D4A]"
        >
          <p className="text-sm text-gray-300">
            <span className="inline-flex items-center">
              <Github className="w-4 h-4 mr-2 text-[#14F195]" />
              <span>Powered by Solana & GitHub</span>
            </span>
          </p>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          <span className="block text-white">Contribute to Open Source.</span>
          <span className="block mt-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            Get Paid in SOL.
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Our GitHub bot automatically sends SOL rewards to contributors who successfully solve issues on your repositories. Incentivize contributions and grow your project faster.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#14F195] hover:bg-[#14F195]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14F195] transition-all"
          >
            Learn How It Works
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <a
            href="#bounties"
            className="inline-flex items-center justify-center px-6 py-3 border border-[#9945FF] text-base font-medium rounded-md text-white bg-transparent hover:bg-[#9945FF]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9945FF] transition-all"
          >
            <Code className="w-4 h-4 mr-2" />
            View Active Bounties
          </a>
        </div>

        <div className="mt-12 flex justify-center space-x-6">
          <div className="text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">150+</p>
            <p className="text-sm text-gray-400">Active Bounties</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">50K+</p>
            <p className="text-sm text-gray-400">SOL Distributed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">3.2K+</p>
            <p className="text-sm text-gray-400">Contributors</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;