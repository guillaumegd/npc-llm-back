# NPC-LLM: Natural and Immersive NPCs with LLMs

## Description
This project is a research initiative focused on leveraging Large Language Models (LLMs) to create more natural and immersive Non-Player Characters (NPCs) in interactive environments. The goal is to enable NPCs to exhibit controlled behavior, personality traits, and key conversational points, enhancing the overall user experience.

The project explores techniques to:
- Define and control the character and role of NPCs.
- Guide conversations with key points while maintaining natural dialogue flow.
- Utilize LLMs to generate dynamic and contextually relevant responses.

## Features
- **Dynamic Conversations**: NPCs can engage in fluid and context-aware dialogues.
- **Character Control**: Define specific traits and roles for NPCs to ensure consistency.
- **Key Point Integration**: Seamlessly incorporate predefined conversational points into interactions.

## Technical Implementation

### Persona System
The project implements a persona-based approach through dedicated character files:
- Each NPC has a `persona.txt` file defining their name, role, tone, traits, motivation, and context.
- The persona file serves as a system prompt to the LLM, ensuring consistent character portrayal.
- Example for "Alaric" (a former royal guard) includes traits like cheerful, loyal, and protective.

### Structured Dialogue System
Conversations follow a node-based architecture:
- Each conversation is defined in a JSON file containing multiple nodes.
- Nodes include:
  - `id`: Unique identifier for the conversation node
  - `content`: The NPC's dialogue text
  - `action`: Context instruction for the LLM to understand the purpose
  - `intents`: Array of possible user responses with target nodes
  - `global`: Flag for nodes accessible from anywhere in conversation

### Intent Classification via LLM
Advanced natural language understanding through:
- LLM-powered intent classification system (`classifyIntent` function)
- System determines which conversation node to activate based on user input
- Global nodes allow flexible conversation flows beyond predetermined paths
- Supports both guided dialogue paths and free-form conversations

### Context Awareness
Conversation history is maintained and utilized:
- A chat summary is continually updated during conversations
- This summary is included in prompts to the LLM, providing context
- Enables NPCs to recall previous interactions and maintain coherent dialogues

### API Integration
The system leverages the Mistral AI API:
- Communication with Mistral's LLM through REST endpoints
- Custom agents for intent classification
- JSON-formatted communication for structured responses
- System prompts combine persona definition and chat context

### Intent Classification Agent
The project uses a specialized Mistral AI agent for intent classification. The [AGENT.md](./AGENT.md) file contains the complete definition, configuration, and examples needed to create this agent in the Mistral AI platform. This document serves as a reference for understanding the intent classification system and provides detailed instructions for agent deployment.

### Hybrid Approach to NPC Behavior
The implementation balances structure and flexibility:
- Predefined conversation trees guide key narrative points
- LLM provides natural formulations and variations in responses
- Free-form dialogue capabilities through "global" nodes
- Consistent character portrayal enforced by persona system prompts

## Project Structure
```
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── AGENT.md              # Intent classification agent instructions
├── data/                 # Data files for conversations and personas
│   ├── conversation*.json  # Structured dialogue nodes for NPCs
│   └── persona*.txt        # Character definitions for NPCs
└── src/                  # Source code
    ├── mistralApi.ts     # API integration with Mistral
    ├── promptUtils.ts    # Utilities for prompt management
    ├── server.ts         # Main server file
    ├── docs/             # Documentation files
    └── types/            # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js (>=14.x)
- npm or yarn
- Mistral AI API key (set in environment variables)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd npc-llm/back
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   ```
   MISTRAL_API_KEY=your_api_key
   MISTRAL_API_BASE_URL=https://api.mistral.ai
   MISTRAL_AGENT_INTENT_CLASSIFIER=your_agent_id
   ```

### Running the Project
1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Access the server at `http://localhost:3000` (default port).

### Project Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run start`: Start the production server.

## How It Works
The project integrates LLMs to simulate NPC behavior. Here's an overview of the workflow:

1. **Data Preparation**: 
   - Define persona traits in `data/persona*.txt` files
   - Create conversation structures in `data/conversation*.json`

2. **Conversation Flow**:
   - Conversation starts with the "initial" node
   - User input is processed through intent classification
   - LLM determines the appropriate response and next node
   - Conversation summary is updated for context tracking

3. **Prompt Engineering**: 
   - `promptUtils.ts` crafts prompts that guide the LLM's responses
   - Combines persona definition with conversation context
   - Enables natural yet controlled NPC behavior

4. **API Integration**: 
   - `mistralApi.ts` handles communication with the LLM backend
   - Intent classification and response generation are processed through API calls

5. **Server Logic**: 
   - `server.ts` manages incoming requests and routes them to the appropriate handlers
   - Maintains conversation state and history

## Future Improvements

The current implementation provides a solid foundation for creating natural and immersive NPCs with LLMs. However, there are several enhancements that could further improve the system:

### Database Integration
- **Replace Text-Based Storage**: Move from static JSON and TXT files to a proper database system
- **Dynamic Character Management**: Enable runtime updates to character personas and conversation trees
- **Conversation History**: Store and retrieve user-NPC interaction history efficiently
- **Scalability**: Handle a larger number of NPCs and concurrent conversations

### Selective Context Injection via RAG
- **Retrieval-Augmented Generation (RAG)**: Implement a RAG system to selectively provide relevant context
- **Knowledge Base**: Create a dedicated knowledge base for NPCs to access factual information
- **Dynamic Memory**: Enable NPCs to retrieve only the most relevant past interactions
- **World Knowledge**: Allow NPCs to reference world-building elements contextually

### Backend Conversation State Management
- **Server-Side State Management**: Move conversation context tracking from frontend to backend
- **Session-Based Context**: Implement session management to maintain conversation state
- **Redis Integration**: Use Redis as a fast, in-memory data store for conversation contexts
- **Security Improvement**: Prevent context manipulation by not trusting user-provided conversation history
- **Authentication Flow**: Tie conversation sessions to authenticated users for personalized experiences
- **Stateless API with Secure State**: Maintain RESTful API principles while securely managing state

### Token Optimization and Control
- **Token Count Monitoring**: Implement real-time tracking of token usage
- **Context Window Management**: Intelligently manage the context window to avoid truncation
- **Summarization Techniques**: Apply automatic summarization to keep conversation history concise
- **Cost Optimization**: Reduce API costs through efficient prompt engineering and caching

### Other Enhancements
- **Emotion and Tone Control**: Add parameters to control emotional responses and conversation tone
- **Multi-modal Interactions**: Extend the system to support image or audio inputs
- **Conversation Analytics**: Track engagement metrics and conversation effectiveness
- **Localization Support**: Enable multilingual NPC conversations through translation layers
- **Backend assets storage**: Store and manage assets (images, sounds) related to NPCs backend instead of static frontend files

These improvements would enhance the system's flexibility, scalability, and cost-effectiveness while maintaining the core goal of creating natural and immersive NPC interactions.

## Acknowledgments
This research is part of an initiative to explore the potential of LLMs in creating more engaging and lifelike NPCs.