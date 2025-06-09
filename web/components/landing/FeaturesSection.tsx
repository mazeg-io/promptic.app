import React from "react";

const features = [
  {
    title: "Real-time Collaboration",
    description: "Edit prompts live with your team — no more async merges."
  },
  {
    title: "Version Control",
    description: "See history, compare versions, and roll back safely."
  },
  {
    title: "Structured Prompt Management",
    description: "Organize prompts by project, app, or agent for clarity."
  },
  {
    title: "Production-ready APIs",
    description: "Serve prompts dynamically to your apps via robust APIs."
  },
  {
    title: "Developer & PM Friendly",
    description: "Designed for engineers, accessible to product teams."
  },
  {
    title: "Open Source",
    description: "Built on a modern OSS stack — flexible, extensible, and free to self-host."
  }
];

export default function FeaturesSection() {
  return (
    <section className="w-full max-w-5xl mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-6 shadow text-left">
            <div className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">{feature.title}</div>
            <div className="text-slate-600 dark:text-slate-400">{feature.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 