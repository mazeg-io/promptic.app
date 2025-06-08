import React from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import {
  CLIENT_INSTALL_CODE,
  CLIENT_USAGE_CODE,
  generateClientCodeWithKey,
} from "@/constants/codeSnippets";
import { useGlobal } from "@/lib/context/GlobalContext";

export const ClientDoc: React.FC = () => {
  const { activeProject } = useGlobal();

  // Use the actual project key if available
  const usageCode = activeProject?.key
    ? generateClientCodeWithKey(activeProject.key)
    : CLIENT_USAGE_CODE;

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-lg mb-2">Client Integration Guide</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Follow these steps to integrate Promptic with your application:
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">1. Install the client library</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Add the Promptic client to your project using npm:
          </p>
          <CodeSnippet
            code={CLIENT_INSTALL_CODE}
            language="bash"
            id="install-client"
          />
        </div>

        <div>
          <h4 className="font-semibold mb-2">2. Initialize the client</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Configure the client with your project key:
          </p>
          <CodeSnippet
            code={usageCode}
            language="javascript"
            id="usage-client"
          />
          {!activeProject?.key && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Note: Replace &quot;YOUR_PROJECT_KEY&quot; with your actual
              project key from Settings.
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">3. Use in your application</h4>
          <p className="text-gray-600 dark:text-gray-400">
            You can now use the prompt in your application logic:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4 mt-2 text-gray-600 dark:text-gray-400">
            <li>
              Access your prompt using the{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                getPrompt
              </code>{" "}
              method
            </li>
            <li>Prompts are automatically updated when changed in Promptic</li>
            <li>No need to redeploy your application when prompts change</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          For advanced usage and configuration options, visit our{" "}
          <a
            href="https://github.com/mazeg-io/promptic.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            full documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};
