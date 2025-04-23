"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does the SOL payment work?',
    answer:
      'When a contributor\'s pull request is merged, our bot automatically transfers the specified SOL amount to their wallet address. The payment happens on-chain and typically completes within seconds.',
  },
  {
    question: 'How much does it cost to use the bounty bot?',
    answer:
      'We charge a 5% fee on each bounty payment. This fee helps maintain the service and infrastructure. There are no monthly subscription fees or hidden charges.',
  },
  {
    question: 'Can I fund bounties from my project\'s treasury?',
    answer:
      'Yes! You can connect your project\'s treasury wallet to automatically fund bounties. This is especially useful for DAOs and community-governed projects.',
  },
  {
    question: 'Do contributors need to have a Solana wallet?',
    answer:
      'Yes, contributors need a Solana wallet to receive payments. We recommend Phantom, Solflare, or any other Solana-compatible wallet. Contributors can add their wallet address to their GitHub profile or include it in their PR description.',
  },
  {
    question: 'What happens if multiple people solve the same issue?',
    answer:
      'Only the first merged pull request receives the bounty. That\'s why we recommend contributors to comment on issues they\'re working on to avoid duplicate work.',
  },
  {
    question: 'Can I set different bounty amounts for different issues?',
    answer:
      'Absolutely! You can set custom bounty amounts for each issue based on its complexity and importance. Just use different labels like bounty:1SOL, bounty:5SOL, or bounty:10SOL.',
  },
  {
    question: 'How do I know a contributor won\'t take the money and run?',
    answer:
      'The beauty of our system is that payment happens only after a pull request is approved and merged. This ensures that you\'re satisfied with the solution before any payment is made.',
  },
  {
    question: 'Can I use this bot with private repositories?',
    answer:
      'Yes, the bot works with both public and private repositories. You\'ll need to install the GitHub app with appropriate permissions for private repos.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#0E0E12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Got questions about how our GitHub bounty bot works? Find answers to the most common questions below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1A1A24] rounded-lg border border-[#2D2D3A] overflow-hidden"
              >
                <button
                  className="w-full text-left p-6 focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                    <div className="ml-2 flex-shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-[#14F195]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-[#2D2D3A] pt-4">
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-6">
              Still have questions? Reach out to our team.
            </p>
            <a
              href="mailto:support@solanabounty.io"
              className="inline-flex items-center justify-center px-6 py-3 border border-[#9945FF] text-base font-medium rounded-md text-white bg-transparent hover:bg-[#9945FF]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9945FF] transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;