const { PrompticClient } = require("./dist");

const client = new PrompticClient({
  baseUrl: "",
  projectKey: ''
});

// Function to get a prompt
async function getPromptExample() {
  try {
    const startTime = performance.now();
    const prompt = await client.getPrompt("BLA").format({
      var1: "aaaa",
      var2: "vllaaaa",
    });
    const endTime = performance.now();
    console.log(`Prompt retrieval took ${endTime - startTime}ms`);


    console.log("Prompt retrieved successfully:");
    console.log("Value:", prompt);

    return prompt;
  } catch (error) {
    console.error("Error retrieving prompt:", error.message);
  }
}

getPromptExample();
