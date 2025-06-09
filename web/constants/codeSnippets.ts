// Client code snippets
export const CLIENT_INSTALL_CODE = "npm install promptic-client";

export const CLIENT_USAGE_CODE = `import { PrompticClient } from "promptic-client";

// Initialize the client with your Promptic base URL
const client = new PrompticClient({
  baseUrl: "https://api.promptic.app",
  projectKey: "YOUR_PROJECT_KEY", // Get this from the Settings tab
});

const prompt = await client.getPrompt("your-prompt-key");`;

// Function to generate code with the actual project key
export const generateClientCodeWithKey = (projectKey: string) => {
  return `import { PrompticClient } from "promptic-client";

// Initialize the client with your Promptic base URL
const client = new PrompticClient({
  baseUrl: "https://api.promptic.app",
  projectKey: "${projectKey}",
});

const prompt = await client.getPrompt("your-prompt-key").format({});`;
};
