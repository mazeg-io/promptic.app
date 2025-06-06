# Promptic Web Canvas

The visual editor component of Promptic - a collaborative workspace for creating, managing, and implementing AI agent prompts.

## Overview

Promptic Web Canvas is a FigJam-inspired interface that allows teams to:

- Visually design complex prompt structures
- Collaborate in real-time
- Version and iterate on prompts
- Test prompts directly in the interface
- Export prompts for use with the Promptic API and client library

## Features

- **Interactive Canvas** - Drag, drop, and connect prompt components
- **Real-time Collaboration** - Work together with your team simultaneously
- **AI Chat Assistant** - Refine and improve your prompts with AI-powered suggestions

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 9.x or later (or equivalent package manager)

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```
   # InstantDB Configuration
   NEXT_PUBLIC_INSTANT_APP_ID=your-instant-app-id

   # OpenAI Configuration
   NEXT_OPENAI_API_KEY=your-openai-api-key

   # Authentication
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_GOOGLE_CLIENT_NAME=google-web
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Architecture

Promptic Web Canvas is built with:

- **React** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **react-flow** - Canvas and node system
- **[InstantDB](https://www.instantdb.com/)** - Real-time database for collaboration features

### Real-time Collaboration

The collaborative features in Promptic Web Canvas are powered by [InstantDB](https://www.instantdb.com/), a modern real-time database solution. InstantDB provides:

- Multiplayer editing capabilities
- Instant updates across all connected clients
- Offline support with automatic synchronization
- Presence indicators and cursor tracking

This allows multiple team members to work on prompts simultaneously, see each other's changes in real-time, and collaborate effectively even across different locations.

## Project Structure

```
web/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API and external services
│   ├── store/        # State management
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
├── .env.example      # Example environment variables
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite configuration
```

## Deployment

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will generate optimized static files in the `dist` directory that can be deployed to any static hosting service.

### Recommended Hosting

#### Vercel

[Vercel](https://vercel.com/) is recommended for deploying this application, as it offers seamless integration with React projects and provides a generous free tier:

## Contributing

Please refer to the main [Contributing Guidelines](../CONTRIBUTING.md) for information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
