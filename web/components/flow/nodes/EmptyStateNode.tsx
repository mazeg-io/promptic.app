import React from "react";

export const EmptyStateNode = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl border border-gray-200 dark:border-gray-700 pointer-events-none">
      <div className="text-gray-700 dark:text-gray-300 space-y-4 text-sm leading-relaxed">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            🎉 Welcome to Promptic!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is your collaborative space for managing system prompts.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Follow these simple steps to get started:
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ✅ Step 1 — Create a Project
            </h3>
            <p className="mb-2">
              Projects help you organize your prompts — one project per app or
              team.
            </p>
            <div className="ml-4 space-y-1 text-gray-600 dark:text-gray-400">
              <p>→ Click [ + New Project ] in the sidebar</p>
              <p>
                → Give it a clear name (ex: &quot;Customer Support Bot&quot; or &quot;AI Chat
                Assistant&quot;)
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ✅ Step 2 — Add Your First Prompt
            </h3>
            <p className="mb-2">Prompts are the heart of your AI system.</p>
            <div className="ml-4 space-y-1 text-gray-600 dark:text-gray-400">
              <p>→ Inside your project, click [ + New Prompt ]</p>
              <p>
                → Give it a name (ex: &quot;System Prompt&quot;, &quot;Planner Agent Prompt&quot;,
                &quot;RAG Retriever Prompt&quot;)
              </p>
              <p>→ Start writing your prompt in the editor</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ✅ Step 3 — Collaborate with Your Team
            </h3>
            <p className="mb-2">
              Anyone can edit prompts — engineers, PMs, AI leads.
            </p>
            <div className="ml-4 space-y-1 text-gray-600 dark:text-gray-400">
              <p>→ Invite your team to collaborate</p>
              <p>→ See live edits</p>
              <p>→ No more digging in code to update prompts!</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ✅ Step 4 — Connect Your App
            </h3>
            <p className="mb-2">
              Use @promptic/client to load prompts dynamically.
            </p>
            <div className="ml-4 space-y-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 font-mono text-xs">
                <div>
                  const &#123; loadPrompt &#125; = require(&apos;@promptic/client&apos;);
                </div>
                <div>
                  const prompt = await loadPrompt(&apos;project-name/prompt-name&apos;);
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400 space-y-1">
                <p>→ Your app always gets the latest version of the prompt</p>
                <p>→ No redeploy needed</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🎁 That&apos;s it!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You&apos;re ready to start building better AI together. 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
