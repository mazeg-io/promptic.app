import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import DemoSection from "@/components/landing/DemoSection";
import OpenSourceSection from "@/components/landing/OpenSourceSection";
import Footer from "@/components/landing/Footer";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Flow Editor | Promptic",
  description: "Visual prompt flow editor with AI-powered enhancements",
  openGraph: {
    title: "Flow Editor | Promptic",
    description: "Visual prompt flow editor with AI-powered enhancements",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Promptic Flow Editor Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow Editor | Promptic",
    description: "Visual prompt flow editor with AI-powered enhancements",
    images: ["/image.png"],
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Promptic</title>
        <meta property="og:title" content="Promptic" />
        <meta property="og:description" content="AI Prompt Management Platform" />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://promptic.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Promptic" />
        <meta name="twitter:description" content="AI Prompt Management Platform" />
        <meta name="twitter:image" content="/preview.png" />
      </Head>
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
    </>
  );
}
