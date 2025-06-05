# Promptic Client

A lightweight JavaScript/TypeScript client for interacting with the Promptic API. This client allows you to easily retrieve and format prompts stored in your Promptic application.

## Installation

```bash
npm install promptic-client
```

or with yarn:

```bash
yarn add promptic-client
```

## Quick Start

```typescript
import { PrompticClient } from "promptic-client";

// Initialize the client with your Promptic base URL
const client = new PrompticClient({
  baseUrl: "https://your-promptic-api-url.com",
});

// Basic usage
async function getFormattedPrompt() {
  try {
    // Get a prompt by its key and format it with variables
    const formattedPrompt = await client.getPrompt("your-prompt-key").format({
      variable1: "value1",
      variable2: "value2",
    });

    console.log(formattedPrompt);
    // Use the formatted prompt in your application
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Alternative usage pattern
async function getAndFormatPrompt() {
  try {
    // First get the prompt
    const prompt = await client.getPrompt("your-prompt-key");

    // Then format it
    const formatted = prompt.format({
      variable1: "value1",
      variable2: "value2",
    });

    console.log(formatted);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

## API Reference

### `PrompticClient`

The main client class for interacting with the Promptic API.

#### Constructor

```typescript
constructor(config: PrompticClientConfig)
```

- `config.baseUrl` (string): The base URL of your Promptic API

#### Methods

##### `getPrompt(promptKey: string): Promise<Prompt> & { format: Function }`

Retrieves a prompt by its key from the Promptic API.

- `promptKey` (string): The unique identifier for the prompt
- Returns: A Promise that resolves to a Prompt object with an additional format method

##### `Prompt.format(values: Record<string, string>): string`

Formats a prompt by replacing variables with provided values.

- `values` (object): An object mapping variable names to their values
- Returns: The formatted prompt string with all variables replaced

## Error Handling

The client throws errors in the following cases:

- Network errors when connecting to the Promptic API
- Missing required variables when formatting a prompt

Example error handling:

```typescript
try {
  const formatted = await client.getPrompt("example-prompt").format({
    // Missing some required variables
    partial: "data",
  });
} catch (error) {
  // Handle missing variables error
  console.error(error.message);
  // Example: "Missing required variables: variable2. All required variables: variable1, variable2"
}
```

## TypeScript Support

This package includes TypeScript definitions and can be used in both JavaScript and TypeScript projects.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
