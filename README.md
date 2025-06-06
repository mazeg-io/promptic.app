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

## Quick Start

### Web Canvas

```bash
cd web
npm install
npm run dev
```

### API

```bash
cd promptic-api
npm install
npm run dev
```

### Client Library

```bash
npm install promptic-client
```

```javascript
import { Promptic } from "promptic-client";

// Initialize client
const promptic = new Promptic({
  apiKey: "your-api-key",
  baseUrl: "promptic-api-url",
});

// Fetch a prompt
const prompt = await promptic.getPrompt("prompt-id");
```

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
