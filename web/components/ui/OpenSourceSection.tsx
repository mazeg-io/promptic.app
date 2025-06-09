"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function OpenSourceSection() {
  return (
    <section className="w-full py-16 px-4 text-center bg-white dark:bg-slate-900">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="flex items-center justify-center mb-1"
        >
          <Github size={36} className="text-slate-900 dark:text-slate-100" />
        </motion.div>
        <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full text-xs font-semibold mb-1">
          OSS
        </span>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
          Open Source, Community-Driven
        </h2>
        <div className="flex flex-row gap-3 mb-2">
          <a
            href="https://github.com/mazeg-io/promptic.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-base hover:bg-slate-700 dark:hover:bg-slate-200 transition shadow"
          >
            Star on GitHub
          </a>
          <a
            href="https://discord.gg/zGaUvXy37d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 font-bold text-base hover:bg-blue-50 dark:hover:bg-blue-900 transition shadow"
          >
            Join Discord
          </a>
        </div>
        <p className="text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
          Promptic is fully open source — built to serve the community. We
          believe in developer extensibility, transparent infrastructure, and a
          community-driven roadmap. Join us, contribute, and help shape the
          future of prompt management.
        </p>
      </div>
    </section>
  );
}
