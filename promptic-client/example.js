// Example of using the Promptic client

// In a real application, you would import the package like this:
// const { PrompticClient } = require('promptic-client');
// For TypeScript:
// import { PrompticClient } from 'promptic-client';

// But for this example, we'll import directly from our local files
const { PrompticClient } = require("./dist");

// Initialize the client with your Promptic App ID
// Replace with an actual App ID when testing
const client = new PrompticClient({
  baseUrl: "http://localhost:5001",
});

// Function to get a prompt
async function getPromptExample() {
  try {
    // Replace with an actual prompt key when testing
    const prompt = await client.getPrompt("BLA").format({
      var1: "aaaa",
      var2: "vllaaaa",
    });

    console.log("Prompt retrieved successfully:");
    console.log("Value:", prompt);

    return prompt;
  } catch (error) {
    console.error("Error retrieving prompt:", error.message);
  }
}

// Execute the example
getPromptExample();
