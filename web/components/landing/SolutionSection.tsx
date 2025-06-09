"use client";
import React from "react";
import { SparklesText } from "@/components/landing/sparkles-text";
import { FeatureCarousel } from "@/components/landing/FeatureCarousel";
import { motion } from "framer-motion";

export default function SolutionSection() {
  return (
    <section className="w-full py-20 px-4 text-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <SparklesText
          text="Give your team a shared space to design, organize, and refine AI agent prompts — in real time"
          className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-100 text-center leading-tight mb-10"
        />
        <div className="text-2xl font-light text-slate-700 dark:text-slate-300 mb-4 max-w-3xl mx-auto space-y-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
          >
            No more hardcoded strings, scattered docs, or endless message threads. Just clean, collaborative prompt management — built for modern AI teams.
          </motion.p>
        </div>
        <FeatureCarousel/>
        <div className="w-full max-w-4xl mx-auto mt-16 rounded-xl overflow-hidden shadow-2xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          >
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
} 