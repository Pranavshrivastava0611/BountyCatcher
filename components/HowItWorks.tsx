'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GitPullRequest, DollarSign, Star, Users, ChevronRight, Code, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: <GitPullRequest className="w-6 h-6 text-[#14F195]" />,
    title: 'Maintainers Create Bounties',
    description:
      'Repository maintainers tag issues with bounty amounts in SOL. The bot automatically detects these tags and creates the bounty.',
    code: `# Add a bounty label to your issue
labels: ["bounty:5SOL"]

# The bot will automatically create a 5 SOL bounty
# and track the issue for completion`,
    demoImage: "createIssue.png"
  },
  {
    icon: <Users className="w-6 h-6 text-[#14F195]" />,
    title: 'Contributors Solve Issues',
    description:
      'Contributors browse bounties, work on solutions, and submit pull requests referencing the bounty issue.',
    code: `# Clone the repository
git clone https://github.com/user/repo.git

# Create a branch for the bounty
git checkout -b fix/issue-123

# Work on the solution and commit
git commit -m "Fix: Implement solution for #123"`,
    demoImage: "pullreq.png"
  },
  {
    icon: <Star className="w-6 h-6 text-[#14F195]" />,
    title: 'PR Gets Approved',
    description:
      'When a maintainer approves and merges a pull request, the bot verifies that the solution resolves the issue.',
    code: `# Maintainer reviews and approves PR
/approve

# Bot verifies the solution
✓ Issue requirements met
✓ Tests passing
✓ Code review approved`,
    demoImage: "pullreqmerge.png"
  },
  {
    icon: <DollarSign className="w-6 h-6 text-[#14F195]" />,
    title: 'Instant SOL Payout',
    description:
      'The bot automatically transfers SOL to the contributor\'s wallet address. No manual intervention required.',
    code: `# Automatic SOL transfer initiated
Transaction: 5nNamBZK8h...
Amount: 5 SOL
Status: Confirmed
Block: #128,392,048`,
    demoImage: "final.png"
  },
];

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

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('how-it-works');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsVisible(rect.top <= window.innerHeight * 0.75);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const section = document.getElementById('how-it-works');
      if (section) {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
      }
    };

    updateCanvasSize();

    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(70, Math.floor(canvas.width / 20));
    const colors = ['#9945FF', '#14F195', '#9945FF80', '#14F19580'];

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
            ctx!.strokeStyle = `rgba(153, 69, 255, ${0.15 - distance/1000})`;
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

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <section
      id="how-it-works"
      className="py-20 bg-[#0E0E12] relative overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E12]/80 via-[#0E0E12]/60 to-[#0E0E12]/80" />
      
      <div className="relative z-10">
        <div className={`text-center mb-10 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            How It Works
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto px-4">
            Our bot seamlessly connects GitHub issues with Solana payments, making it easy to reward contributors in SOL cryptocurrency.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16 px-4">
          <div className="bg-[#1A1A24] rounded-lg border border-[#2D2D3A] overflow-hidden shadow-xl">
            <div className="bg-[#0E0E12] p-3 border-b border-[#2D2D3A] flex items-center">
            
              <div className="mx-auto text-sm text-gray-400">Live Demo</div>
            </div>
            <div className="relative aspect-video">
              <img
                src={steps[activeStep].demoImage}
                alt={steps[activeStep].title}
                className="w-full h-full object-contain transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-transparent to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#14F195]"></div>
                  <span className="text-[#14F195] text-sm">Live</span>
                </div>
                <span className="text-gray-400 text-sm">Step {activeStep + 1} of {steps.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-[#1A1A24] ml-2.5 mr-2.5 p-6 rounded-lg border transition-all duration-300 cursor-pointer ${
                activeStep === index 
                  ? 'border-[#14F195] shadow-lg shadow-[#14F195]/10' 
                  : 'border-[#2D2D3A] hover:border-[#9945FF]/50'
              }`}
              onClick={() => setActiveStep(index)}
            >
              <div className="flex items-center mb-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  activeStep === index ? 'bg-[#14F195]/20' : 'bg-[#2D2D3A]'
                } mr-4`}>
                  {activeStep === index ? (
                    <CheckCircle2 className="w-6 h-6 text-[#14F195]" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div>
                  <span className={`text-sm font-medium ${
                    activeStep === index ? 'text-[#14F195]' : 'text-[#9945FF]'
                  }`}>
                    Step {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-4">{step.description}</p>
              <div className="bg-[#0E0E12] rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="flex items-center mb-2">
                  <Code className="w-4 h-4 text-[#9945FF] mr-2" />
                  <span className="text-gray-500">Example</span>
                </div>
                <pre className="text-[#14F195] whitespace-pre-wrap">{step.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;