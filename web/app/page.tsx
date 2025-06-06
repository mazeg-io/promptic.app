import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/ui/HeroSection";
import ProblemSection from "@/components/ui/ProblemSection";
import SolutionSection from "@/components/ui/SolutionSection";
import DemoSection from "@/components/ui/DemoSection";
import OpenSourceSection from "@/components/ui/OpenSourceSection";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Flow Editor | Promptic",
  description: "Visual prompt flow editor with AI-powered enhancements",
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <HeroSection />
      <div id="demo"><DemoSection /></div>
      <div id="problem"><ProblemSection /></div>
      <div id="solution"><SolutionSection /></div>
      {/* <div id="features"><FeaturesSection /></div> */}
      {/* <div id="users"><TargetUsersSection /></div> */}
      <div id="opensource"><OpenSourceSection /></div>
      {/* <div id="getstarted"><FinalCTASection /></div> */}
      <Footer />
    </div>
  );
}
