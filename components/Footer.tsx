import React from 'react';
import { Github, Linkedin, Wallet } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#131219] border-t border-[#2D2D3A]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Wallet className="h-6 w-6 text-[#14F195]" />
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
              ForkUp
            </span>
          </div>
        </div>
        
        <div className="text-center sm:text-left mt-4 pt-4 border-t border-[#2D2D3A] flex flex-row justify-between">
          <p className="text-gray-400 text-sm">
            Made with 💚 by <a 
              href="https://github.com/Pranavshrivastava0611"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#14F195] hover:text-[#14F195]/80 transition-colors"
            >PRANAV</a>
          </p>

          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/Pranavshrivastava0611" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-[#14F195] transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://in.linkedin.com/in/pranav-shrivastava-293944295" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-[#14F195] transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;