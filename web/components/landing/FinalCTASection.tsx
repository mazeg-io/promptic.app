import React from "react";
import { Github, BookOpen } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="w-full max-w-2xl mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
        Ready to bring clarity to your AI prompts?
      </h2>
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <a href="https://github.com/mazeg-io/promptic.app" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-base hover:bg-slate-700 dark:hover:bg-slate-200 transition flex items-center gap-2">
          <Github size={18} />
          Star on GitHub
        </a>
        <a href="#" className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-base hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2">
          <BookOpen size={18} />
          View Docs
        </a>
        <a href="#" className="px-4 py-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-base hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center gap-2">
          Join Discord
        </a>
      </div>
    </section>
  );
} 