# Simple LangChain Application

This is a demonstration application for LangChain, showcasing basic concepts including prompt templates, chains, conversation management, and streaming responses. It is designed for educational purposes in a webinar setting.

## What the Application Does

The application demonstrates how to use LangChain to interact with Google's Gemini AI model. It includes examples of:

- Simple chain execution for answering questions
- Conversation management with context
- Streaming responses for real-time output
- Basic prompt engineering techniques

The code creates a conversational AI assistant that can answer questions about TypeScript and related programming concepts.

## Services Used

- **LangChain**: A framework for building applications with large language models
- **Google Generative AI (Gemini)**: The underlying AI model for generating responses
- **Node.js**: Runtime environment for executing the TypeScript code
- **TypeScript**: Programming language for type-safe development

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (version 18 or higher)
- pnpm package manager

## Installation

1. Clone or download the project files to your local machine.

2. Navigate to the project directory in your terminal.

3. Install the dependencies using pnpm:
   ```
   pnpm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.

2. Add your Google API key to the `.env` file:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

   You can obtain a Google API key from the Google AI Studio console.

## Running the Application

To start the application in development mode, run the following command:

```
pnpm run dev
```

This will execute the main application file and demonstrate the LangChain examples in the console.

## Project Structure

- `src/app.ts`: Main entry point of the application
- `src/services/langchainService.ts`: Service class handling LangChain operations
- `src/config/config.ts`: Configuration constants and environment validation
- `src/models/types.ts`: TypeScript type definitions
- `src/utils/logger.ts`: Logging utility

## Usage

The application runs automatically when started and outputs examples to the console. It demonstrates:

1. Simple chain execution
2. Conversation with context
3. Streaming responses
4. Conversation history display

## Troubleshooting

- Ensure your Google API key is valid and has the necessary permissions.
- Check that all dependencies are installed correctly.
- Verify that Node.js and pnpm are up to date.