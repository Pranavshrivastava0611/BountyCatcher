"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { Menu as MenuIcon, X, Github, Wallet, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const {user,logout} = usePrivy();
  const router = useRouter()
 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['hero', 'how-it-works', 'bounties', 'contributors', 'stats', 'faq'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#131219]/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => scrollToSection("hero")}
              >
                <Wallet className="h-8 w-8 text-[#14F195]" />
                <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
                  ForkUp
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {[
                { id: "how-it-works", label: "How It Works" },
                { id: "bounties", label: "Bounties" },
                { id: "contributors", label: "For Contributors" },
                { id: "stats", label: "Stats" },
              ].map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={`nav-link text-gray-300 hover:text-[#14F195] transition-colors px-2 py-1 text-sm font-medium ${
                      activeSection === id ? "text-[#14F195]" : ""
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:block">
            {user ? (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none">
                  <User className="w-5 h-5" />
                  <span>{user.github?.name || user.github?.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-[#1A1A24] border border-[#2D2D3A] shadow-lg focus:outline-none">
                    <div
                      className="py-1"
                      onClick={() => router.push("/Profile")}
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-[#2D2D3A] text-white"
                                : "text-gray-300"
                            } flex w-full items-center px-4 py-2 text-sm`}
                            onClick={() => router.push("/Profile")}
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                      <div className="border-t border-[#2D2D3A]">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                logout();
                                window.location.reload();
                              }}
                              className={`${
                                active
                                  ? "bg-[#2D2D3A] text-red-300"
                                  : "text-red-400"
                              } flex w-full items-center px-4 py-2 text-sm`}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-[#14F195] hover:bg-[#14F195]/90 transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                Connect GitHub
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#0E0E12] border-t border-[#2D2D3A]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { id: "how-it-works", label: "How It Works" },
              { id: "bounties", label: "Bounties" },
              { id: "contributors", label: "For Contributors" },
              { id: "faq", label: "FAQ" },
              { id: "stats", label: "Stats" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#2D2D3A] transition-colors"
              >
                {label}
              </button>
            ))}

            {user ? (
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => router.push("/Profile")}
                  className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-[#2D2D3A] transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-red-400 hover:bg-[#2D2D3A] transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-black bg-[#14F195] hover:bg-[#14F195]/90"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Connect GitHub
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;