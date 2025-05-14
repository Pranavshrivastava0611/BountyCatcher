import React from 'react';
import { Check, Code, Wallet, Award } from 'lucide-react';

const Contributors: React.FC = () => {
  return (
    <section
      id="contributors"
      className="py-20 bg-[#0E0E12] relative overflow-hidden"
    >
      {/* Background decoration - abstract grid */}
      <div className="absolute inset-0 opacity-9">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(#9945FF 1px, transparent 1px), linear-gradient(to right, #9945FF 1px, transparent 1px)',
          backgroundSize: '50px 50px' 
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            For Contributors
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Contribute to open source projects on GitHub and get rewarded with SOL. Here's how to get started.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1A1A24] rounded-lg p-6 md:p-8 border border-[#2D2D3A] mb-10">
            <h3 className="text-2xl font-bold text-white mb-6">How to Earn SOL</h3>
            
            <ul className="space-y-6">
              <li className="flex">
                <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-full bg-[#9945FF]/20 mr-4 mt-1">
                  <Check className="w-5 h-5 text-[#9945FF]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Find Bounties</h4>
                  <p className="text-gray-400">Browse through available bounties and find issues that match your expertise.</p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-full bg-[#9945FF]/20 mr-4 mt-1">
                  <Code className="w-5 h-5 text-[#9945FF]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Solve the Issue</h4>
                  <p className="text-gray-400">Work on the issue locally, following the project's contribution guidelines.</p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-full bg-[#9945FF]/20 mr-4 mt-1">
                  <Wallet className="w-5 h-5 text-[#9945FF]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Add Your Wallet</h4>
                  <p className="text-gray-400">Include your Solana wallet address in your profile or in the PR description.</p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-full bg-[#9945FF]/20 mr-4 mt-1">
                  <Award className="w-5 h-5 text-[#9945FF]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Get Paid</h4>
                  <p className="text-gray-400">When your PR is merged, the bot automatically sends SOL to your wallet.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="text-center">
            <a
              href="#bounties"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-black bg-[#14F195] hover:bg-[#14F195]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14F195] transition-all transform hover:scale-105 duration-200"
            >
              Start Contributing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contributors;