"use client";

import React, { useEffect, useState } from "react";
import { Particles } from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <section className="w-full flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Animated particles background */}
      <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color={color} />
      <div className="flex flex-col items-center w-full relative z-10">
        <motion.h1 
          className="text-4xl  md:text-7xl font-bold font-black text-slate-900 dark:text-slate-100 text-center leading-[1.2] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <span className="relative inline-block pb-0 overflow-visible">
            Collaborative
            <span className="absolute left-0 right-0 bottom-[-2px] h-6 pointer-events-none select-none flex items-end justify-center overflow-visible">
              <svg width="100%" height="24" viewBox="0 0 320 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 overflow-visible">
                <motion.path
                  d="M8 20 Q 40 28, 80 20 Q 120 12, 160 20 Q 200 28, 240 20 Q 280 12, 312 20"
                  stroke="#6366f1" strokeWidth="4" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </svg>
            </span>
          </span> Workspace<br />
          For <span className="relative inline-block pb-0 overflow-visible">
            AI Agent
            <span className="absolute left-0 right-0 bottom-[-2px] h-6 pointer-events-none select-none flex items-end justify-center overflow-visible">
              <svg width="100%" height="24" viewBox="0 0 260 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 overflow-visible">
                <motion.path
                  d="M8 20 Q 40 12, 80 20 Q 120 28, 160 20 Q 200 12, 252 20"
                  stroke="#e11d48" strokeWidth="4" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </svg>
            </span>
          </span> Prompts
        </motion.h1>
        <motion.p 
          className="text-2xl font-normal text-slate-700 dark:text-slate-300 text-center mb-12 max-w-3xl leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
        >
          Design and manage your agent prompts in one place — with a FigJam inspired workspace built for AI native teams
        </motion.p>
        <div className="flex gap-4 justify-center">
          <a href="https://github.com/mazeg-io/promptic.app" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-md hover:bg-slate-700 dark:hover:bg-slate-200 transition shadow">
             <Github className="inline-block mr-2" size={18} /> Star on GitHub
          </a>
          <a href="/login" className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-md hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow font-semibold">
            Get Started
          </a>
        </div>
        <div className="mt-16 mb-0 text-center w-full">
          <span className="text-base text-slate-400 dark:text-slate-500">
            Built with <motion.span
              className="inline-block mx-1"
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
              role="img"
              aria-label="love"
            >
              ❤️
            </motion.span> by <span className="text-orange-500 font-semibold">Mazeg</span>.
          </span>
        </div>
      </div>
    </section>
  );
} 