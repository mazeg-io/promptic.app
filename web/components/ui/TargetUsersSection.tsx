import React from "react";

const personas = [
  {
    title: "AI Engineers",
    description: "Ship LLM-powered apps faster with a collaborative prompt workflow."
  },
  {
    title: "Product Managers",
    description: "Work closely with engineers to design and iterate on AI UX."
  },
  {
    title: "ML Researchers",
    description: "Experiment, test, and evolve prompts in a shared workspace."
  },
  {
    title: "Prompt Engineers",
    description: "Collaborate across teams to build robust, production-ready prompts."
  }
];

export default function TargetUsersSection() {
  return (
    <section className="w-full max-w-4xl mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">Built for modern AI teams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {personas.map((persona) => (
          <div key={persona.title} className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-6 shadow text-left">
            <div className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">{persona.title}</div>
            <div className="text-slate-600 dark:text-slate-400">{persona.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 