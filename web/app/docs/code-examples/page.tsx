"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { useRouter, useSearchParams } from "next/navigation";

export default function CodeExamplesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [referrer, setReferrer] = useState<string>("/");
  const [backText, setBackText] = useState<string>("Back to Home");

  // Detect the referrer from URL parameters
  useEffect(() => {
    const from = searchParams.get("from");
    if (from === "canvas") {
      setReferrer("/canvas");
      setBackText("Back to Canvas");
    } else {
      setReferrer("/");
      setBackText("Back to Home");
    }
  }, [searchParams]);

  const prompticCodeExample = `import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


import { PrompticClient } from "promptic-client";

// Initialize the client with your Promptic base URL
const client = new PrompticClient({
  baseUrl: "https://api.promptic.app",
  projectKey: "59e5d2ec-405c-4868-a4f1-701d90fd1e94",
});

async function compareAppleProducts(product1: string, product2: string) {
  try {
    console.log(\`Comparing \${product1} vs \${product2}...\`);

    const prompt = await client.getPrompt("App_Store_System_Prompt")
    .format({
        product1: product1,
        product2: product2,
    });

    console.log("Promptic System Prompt: ", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: "Can you help me decide which one I should buy?",
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Error comparing products:", error.message);
    return "Sorry, I couldn't complete the product comparison at this time.";
  }
}

async function runComparison() {
  const comparison = await compareAppleProducts(
    "iPhone 15 Pro",
    "iPhone 14 Pro"
  );

  console.log("\\n--- Apple Product Comparison ---\\n");
  console.log(comparison);
}

runComparison();`;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="sticky top-0 p-4 h-screen overflow-y-auto">
          <div className="mb-6">
            <Link href={referrer}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {backText}
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Introduction</h3>
              <ul className="space-y-2 pl-4">
                <li className="text-sm text-gray-600 dark:text-gray-400">
                  <Link
                    href={`/docs${
                      searchParams.get("from")
                        ? `?from=${searchParams.get("from")}`
                        : ""
                    }`}
                  >
                    Getting started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2">
                Promptic Code Examples
              </h3>
              <ul className="space-y-2 pl-4">
                <li className="text-sm text-blue-600">
                  <Link
                    href={`/docs/code-examples${
                      searchParams.get("from")
                        ? `?from=${searchParams.get("from")}`
                        : ""
                    }`}
                  >
                    Apple Product Comparison
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Only this should scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div id="client-integration">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Promptic Code Examples
            </p>
            <h1 className="text-3xl font-bold mb-6">
              Apple Product Comparison Example
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This example demonstrates how to use the Promptic client to fetch
              a prompt for comparing Apple products and use it with OpenAI&apos;s
              API.
            </p>

            <div className="space-y-6">
              <div id="initialize-client">
                <h3 className="text-xl font-semibold mb-4">
                  Setting up the environment
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  First, we initialize the OpenAI client and Promptic client.
                  Make sure to create a{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                    .env
                  </code>{" "}
                  file with your OpenAI API key.
                </p>
              </div>

              <div id="use-in-application">
                <h3 className="text-xl font-semibold mb-4">
                  Using Promptic with OpenAI
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The code below shows how to fetch a prompt from Promptic,
                  format it with variables, and use it as a system prompt for
                  OpenAI&apos;s API.
                </p>

                <CodeSnippet
                  code={prompticCodeExample}
                  language="typescript"
                  id="product-comparison-example"
                />

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Key points:</h4>
                  <ul className="list-disc list-inside space-y-1 pl-4 text-gray-600 dark:text-gray-400">
                    <li>
                      Initialize the Promptic client with your project key
                    </li>
                    <li>
                      Use{" "}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                        getPrompt
                      </code>{" "}
                      to fetch your prompt by name
                    </li>
                    <li>
                      Format the prompt with variables using the{" "}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                        format
                      </code>{" "}
                      method
                    </li>
                    <li>
                      Use the formatted prompt as a system message for the AI
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 border-l border-gray-200 dark:border-gray-700">
        <div className="sticky top-0 p-4 h-screen overflow-y-auto">
          <h3 className="text-sm font-medium mb-4">On this page</h3>
          <ul className="space-y-2">
            <li className="text-sm">
              <Link
                href="#client-integration"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Apple Product Comparison
              </Link>
            </li>
            <li className="text-sm">
              <Link
                href="#initialize-client"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Setting up the environment
              </Link>
            </li>
            <li className="text-sm">
              <Link
                href="#use-in-application"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Using Promptic with OpenAI
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
