"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Bounties from "./bounties/_components/Bounties";
import Contributors from "@/components/Contributors";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import {usePrivy} from "@privy-io/react-auth"


export default function Home() {

  return (
    <div className="min-h-screen bg-[#0E0E12]">
    <Header/>
    <main>
      <Hero />
      <HowItWorks />
      <Bounties />
      <Contributors />
      <Stats />
    </main>
    <Footer />
  </div>
  );
}
