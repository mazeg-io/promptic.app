import React from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import {
  CLIENT_INSTALL_CODE,
  CLIENT_USAGE_CODE,
} from "@/constants/codeSnippets";

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
              ✅ Step 1 — Add Your First Prompt
            </h3>
            <p className="mb-2">Prompts are the heart of your AI system.</p>
            <div className="ml-4 space-y-1 text-gray-600 dark:text-gray-400">
              <p>→ Inside your project, click [ + New Prompt ]</p>
              <p>
                → Give it a name by clicking on the name field (ex: &quot;System Prompt&quot;, &quot;Planner
                Agent Prompt&quot;, &quot;RAG Retriever Prompt&quot;)
              </p>
              <p>→ Start writing your prompt in the editor</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ✅ Step 2 — Collaborate with Your Team
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
              ✅ Step 3 — Connect Your App
            </h3>
            <p className="mb-2">
              Use our simple client to connect your app to your prompts.
            </p>
            <div className="ml-4 space-y-1 text-gray-600 dark:text-gray-400">
              <p>→ Install the client:</p>
              <CodeSnippet
                code={CLIENT_INSTALL_CODE}
                language="bash"
                id="install"
              />
              <p>→ Connect to your project:</p>
              <CodeSnippet
                code={CLIENT_USAGE_CODE}
                language="javascript"
                id="usage"
              />
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Note: Get your project key from the Settings tab
              </p>
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
