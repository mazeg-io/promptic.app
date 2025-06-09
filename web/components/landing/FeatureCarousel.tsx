"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    title: "Central source of truth",
    description: "All your AI agent prompts — organized, structured, and easy to find in one place. Never lose track of your team's knowledge.",
    learnMore: "https://discord.gg/zGaUvXy37d"
  },
  {
    title: "Collaborative editing",
    description: "Edit prompts live with your team — no more isolated updates or manual sync. Work together in real time, from anywhere.",
    learnMore: "https://discord.gg/zGaUvXy37d"
  },
  {
    title: "Clear prompt organization",
    description: "Group prompts by agent, app, or use case — stay organized as your projects grow and scale. Find what you need instantly.",
    learnMore: "https://discord.gg/zGaUvXy37d"
  },
  {
    title: "Accessible to everyone",
    description: "Engineers, PMs, researchers — anyone can contribute and improve prompts. Empower your whole team to collaborate.",
    learnMore: "https://discord.gg/zGaUvXy37d"
  },
  {
    title: "Open-source & developer-first",
    description: "Built for the community. Flexible, extensible, and free to self-host. Make it your own and contribute back.",
    learnMore: "https://discord.gg/zGaUvXy37d"
  },
];

export function FeatureCarousel() {
  const [openIdx, setOpenIdx] = useState<number>(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <section className="w-full py-10 px-4 text-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto flex flex-col divide-y divide-slate-300 dark:divide-slate-700">
        {features.map((feature, idx) => {
          const isOpen = openIdx === idx;
          const isHover = hoverIdx === idx;
          const showIndicator = isOpen || isHover;
          const indicatorColor = isHover ? "#6b7280" : "#111";
          const labelX = showIndicator ? 32 : 0;
          return (
            <motion.div
              key={feature.title}
              className={`py-6 text-2xl font-bold text-left transition-colors duration-200 ${isHover ? "bg-slate-200/30 dark:bg-slate-800/20" : ""} cursor-pointer`}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
            >
              <span className="relative inline-flex items-center gap-2 min-h-[32px]">
                <AnimatePresence initial={false}>
                  {showIndicator && (
                    <motion.svg
                      key="flower"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block mr-2"
                      style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.path
                        d="M14 3
                          Q16 7, 19 5
                          Q21 7, 23 9
                          Q21 11, 23 14
                          Q21 16, 19 19
                          Q16 21, 14 25
                          Q12 21, 9 19
                          Q7 16, 5 14
                          Q7 11, 5 9
                          Q7 7, 9 5
                          Q12 7, 14 3
                          Z"
                        fill={indicatorColor}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
                <motion.span
                  animate={{ x: labelX }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="block"
                >
                  {feature.title}
                </motion.span>
              </span>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 text-lg text-slate-700 dark:text-slate-300 font-light">
                      {feature.description}
                      <a
                        href={feature.learnMore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-slate-600 dark:text-slate-300 underline underline-offset-4 hover:text-slate-800 dark:hover:text-slate-100 text-sm font-normal cursor-pointer w-fit"
                      >
                        Learn more
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}