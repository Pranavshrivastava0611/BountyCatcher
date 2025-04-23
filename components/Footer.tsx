"use client"

import React from 'react';
import { Github, Twitter, Wallet, BookOpen, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#131219] border-t border-[#2D2D3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Wallet className="h-8 w-8 text-[#14F195]" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
                SolanaBounty
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Incentivizing open source contributions with automated SOL rewards.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#14F195] transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#14F195] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  GitHub App
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#14F195] text-sm">
                  Terms & Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#2D2D3A] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 SolanaBounty. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <BookOpen className="h-4 w-4 text-[#14F195]" />
              <span>Documentation</span>
              <span className="mx-2">•</span>
              <Heart className="h-4 w-4 text-[#9945FF]" />
              <span>Built for the Solana community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;