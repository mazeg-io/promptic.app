"use client";

import React from "react";
import { motion } from "framer-motion";

const problems = [
  "Prompts are buried in code = hard to find, hard to edit",
  "Every change requires a developer & a full redeploy = Slow Updates",
  "No shared space for live collaboration = engineers, PMs, and AI teams work in silos",
];

export function AnimatedQuote({ size = 60, color = "currentColor" }) {
  // SVG path for a stylized double quote
  // You can tweak the path for your preferred style
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{}}
      animate={{}}
    >
      <motion.path
        d="M15 40 Q10 30 20 20 Q30 10 30 25 Q30 40 15 40 Z
           M45 40 Q40 30 50 20 Q60 10 60 25 Q60 40 45 40 Z"
        stroke={color}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function AnimatedDoubleSemicolon({ size = 80, color = "currentColor" }) {
  // SVG for two bold, expressive, left-facing semicolons
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-6"
    >
      {/* Left semicolon */}
      <motion.circle
        cx="40"
        cy="36"
        r="16"
        fill={color}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "backOut" }}
      />
      <motion.path
        d="M40 56 Q60 90 20 90"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeInOut" }}
      />
      {/* Right semicolon */}
      <motion.circle
        cx="90"
        cy="36"
        r="16"
        fill={color}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.3, delay: 0.5, ease: "backOut" }}
      />
      <motion.path
        d="M90 56 Q110 90 70 90"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.7, delay: 0.7, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function ProblemSection() {
  return (
    <section className="w-full py-20 px-4 text-center bg-white">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <AnimatedDoubleSemicolon size={80} color="currentColor" />
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-100 text-center leading-tight mb-10">
          AI Agent prompts weren&apos;t meant to live in your codebase
        </h2>
        <div className="w-full">
          {problems.map((problem, i) => {
            // Split on '=' and render the '=' in red
            const parts = problem.split("=");
            return (
              <motion.div
                key={problem}
                className={`text-2xl font-light text-slate-900 dark:text-slate-100 py-6 text-center ${
                  i !== problems.length - 1 ? "border-b border-slate-300 dark:border-slate-700" : ""
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                {parts.length === 2 ? (
                  <>
                    {parts[0].trim()} <span className="text-red-500 font-bold">=</span> {parts[1].trim()}
                  </>
                ) : (
                  problem
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 