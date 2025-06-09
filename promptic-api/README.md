# Promptic API

A backend server that provides access to prompts stored in InstantDB for the Promptic client application.

## Overview

Promptic API serves as the intermediary between the Promptic client and InstantDB. It handles:

- Fetching prompts from InstantDB
- Providing an API for the Promptic client to access prompt values
- Managing prompt-related operations

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

### Installation

1. Install dependencies

```bash
npm install
# or
yarn install
```

2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your InstantDB credentials
```

### Running the API

Development mode:

```bash
npm run dev
# or
yarn dev
```

Production mode:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## API Endpoints

### GET /health

Health check endpoint to verify the API is running.

### POST /api/prompt

Retrieves a specific prompt by key and project.

Request body:

```json
{
  "promptKey": "your-prompt-key",
  "projectKey": "your-project-key"
}
```

## Configuration

Configure the API by setting the following environment variables:

- `PORT`: The port on which the API will run (default: 3000)
- `INSTANTDB_APP_ID`: Your InstantDB application ID
- `INSTANTDB_ADMIN_TOKEN`: Your InstantDB admin token for authentication

## Development

### Running Tests

```bash
npm test
# or
yarn test
```

## License

[MIT](LICENSE)
