# Promptic

Collaborative Workspace For AI Agent Prompts

Design and manage your agent prompts in one place — with a FigJam inspired workspace built for AI native teams.

## Overview

Promptic provides a complete ecosystem for prompt engineering:

- **Visual Canvas Editor** - Create and iterate on prompts with a FigJam-like interface
- **REST API** - Access and manage your prompts programmatically
- **Client Library** - Integrate prompts into your applications with minimal code

## Repository Structure

This repository contains three main components:

- [`/web`](./web) - Figma-like canvas interface for visually creating and editing prompts
- [`/promptic-api`](./promptic-api) - REST API for accessing and managing prompts
- [`/promptic-client`](./promptic-client) - NPM library for easy prompt integration

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  Promptic   │ ──► │  Promptic   │ ──► │  InstantDB  │
│   Client    │     │     API     │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             ▲
                                             │
                                      ┌─────────────┐
                                      │             │
                                      │  Promptic   │
                                      │     Web     │
                                      │ Application │
                                      │             │
                                      └─────────────┘
```

The Promptic system uses the following architecture:

- **Promptic Client** connects to the Promptic API to access prompts
- **Promptic API** serves as the intermediary between the client and InstantDB
- **Web Application** connects directly to InstantDB without going through the API
- **InstantDB** stores all prompt data with real-time capabilities

## Key Technologies

- **[InstantDB](https://www.instantdb.com/)** - Powers real-time collaboration in the canvas editor
- **React & TypeScript** - Frontend development
- **Node.js** - Backend API
- **OpenAI** - LLM integration for prompt refinement

## Demo

[![Promptic Demo](https://cdn.loom.com/sessions/thumbnails/199a0e490fa2462f820526026521de2e-with-play.gif)](https://www.loom.com/share/199a0e490fa2462f820526026521de2e?sid=ec6f4973-67f8-4be1-bffd-18fc49eeecdb)
_Click to watch a quick demo of Promptic in action_

## Quick Start

```bash
npm install promptic-client
```

```javascript
import { PrompticClient } from "promptic-client";

// Initialize the client with your Promptic base URL
const client = new PrompticClient({
  baseUrl: "promptic-api-base-url",
  projectKey: "promptic-project-key",
});

const prompt = await client.getPrompt("your-prompt-key");
```

For detailed setup instructions for each component, please refer to their respective documentation.

## Documentation

- [Web Canvas Documentation](./web/README.md)
- [API Documentation](./promptic-api/README.md)
- [Client Library Documentation](./promptic-client/README.md)

## Contributing

We welcome contributions to Promptic! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for more details.

## License

Promptic is open-source software licensed under the [MIT license](./LICENSE).

## Community & Support

- [Discord Community](https://discord.com/invite/zGaUvXy37d) - Get help and discuss with other users

---

Built with ❤️ by [Mazeg](https://mazeg.com)
