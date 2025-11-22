# Simple LangChain Application

This is a demonstration application for a webinar on building AI-powered applications using LangChain. The application showcases basic concepts of integrating large language models (LLMs) into Node.js applications.

## What is LangChain?

LangChain is an open-source framework designed to simplify the development of applications that leverage large language models (LLMs). It provides a set of tools, abstractions, and components that make it easier to build, deploy, and manage LLM-powered applications. LangChain supports various LLMs from providers like OpenAI, Google, and others, and includes features for prompt management, chaining operations, memory, and more.

## What is LangGraph?

LangGraph is a library built on top of LangChain that enables the creation of stateful, multi-actor applications with LLMs. It allows developers to model complex workflows and agent interactions as graphs, where nodes represent different actions or agents, and edges define the flow of information and control. This is particularly useful for building sophisticated AI agents that can perform multi-step tasks, maintain context over time, and coordinate between different components.

## What are AI Agents?

AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. In the context of LangChain and LangGraph, AI agents are typically powered by LLMs and can perform tasks such as answering questions, generating content, interacting with APIs, or executing complex workflows. Agents can be designed to be reactive (responding to inputs) or proactive (initiating actions), and they often incorporate memory, reasoning, and tool-using capabilities to enhance their effectiveness.

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (version 18 or higher)
- pnpm package manager

## Installation

1. Clone or download this repository to your local machine.

2. Navigate to the project directory:

   ```
   cd path/to/the/project
   ```

3. Install the dependencies using pnpm:

   ```
   pnpm install
   ```

## Setup

1. Obtain a Google API key from the Google AI Studio (https://makersuite.google.com/app/apikey).

2. Create a `.env` file in the root directory of the project.

3. Add your Google API key to the `.env` file:

   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

## Running the Application

To run the application in development mode:

```
pnpm dev
```

This will start the application using nodemon, which will automatically restart the server when changes are made to the source files.

The application will execute a simple example query and display the response from the LLM, along with conversation history.

## Project Structure

- `src/app.ts`: Main entry point of the application
- `src/services/langchainService.ts`: Contains the LangChain service implementation
- `src/config/config.ts`: Configuration and environment validation
- `src/models/types.ts`: Type definitions
- `src/utils/logger.ts`: Logging utility

## Next Steps

This is a basic demonstration. For more advanced features, consider exploring:

- Building custom chains and agents
- Integrating with different LLMs
- Adding memory and conversation persistence
- Implementing streaming responses
- Creating multi-agent systems with LangGraph

For more information, visit the official LangChain documentation at https://js.langchain.com/.