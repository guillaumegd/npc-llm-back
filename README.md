# NPC-LLM: Conversational AI Platform with LLMs

## Description
This project is a versatile conversational AI platform that leverages Large Language Models (LLMs) to create natural, context-aware dialogue systems for both entertainment and business applications. The system enables AI agents to exhibit controlled behavior, personality traits, and structured conversational flows while maintaining natural dialogue, making it suitable for:

- **Business Applications**: Customer support automation, HR assistance, sales advisory, and process automation
- **Gaming & Entertainment**: Immersive Non-Player Characters (NPCs) with dynamic personality and quest systems
- **Professional Services**: Domain-specific assistants with expertise in various industries

## Demo
Try the live demo: [https://npc-llm-front.vercel.app/](https://npc-llm-front.vercel.app/)

The project explores techniques to:
- Define and control the character, role, and expertise of conversational agents
- Guide conversations with structured flows while maintaining natural dialogue
- Handle targeted business problems through domain-specific AI agents
- Utilize LLMs to generate dynamic, contextually relevant, and professional responses

## Use Cases

### Business Applications
The platform demonstrates enterprise-ready capabilities for:

**Customer Support Automation**
- Handle order inquiries, returns, and product issues
- Provide 24/7 customer service with consistent quality
- Escalate complex issues to human agents when needed
- Track conversation history and customer satisfaction

**HR & Employee Services**
- Automate onboarding and benefits enrollment
- Answer policy questions and provide guidance
- Handle routine HR inquiries at scale
- Maintain confidentiality and professionalism

**Sales & Advisory**
- Provide product recommendations based on customer needs
- Answer technical questions and pricing inquiries
- Guide customers through decision-making processes
- Build trust through consultative selling approach

### Entertainment Applications
**Interactive Gaming**
- Dynamic NPCs with personality and quest systems
- Context-aware dialogue that responds to player choices
- Immersive storytelling with consistent character portrayal

## Features
- **Dynamic Conversations**: AI agents can engage in fluid and context-aware dialogues
- **Character Control**: Define specific traits, roles, and expertise for consistent agent behavior
- **Structured Dialogue Trees**: Guide conversations through predefined paths while allowing flexibility
- **Multi-Domain Support**: Same architecture supports gaming NPCs, customer support, HR, sales, and more
- **Intent Classification**: LLM-powered understanding of user intent for appropriate responses
- **Context Awareness**: Maintains conversation history for coherent multi-turn dialogues
- **Enterprise-Ready**: Suitable for professional business applications with appropriate tone and handling

## Technical Implementation

### Persona System
The project implements a flexible persona-based approach through dedicated character files:
- Each agent has a `persona.txt` file defining their name, role, tone, traits, motivation, and context
- The persona file serves as a system prompt to the LLM, ensuring consistent character/agent portrayal
- Support for diverse domains:
  - **Business**: Customer support agents, HR specialists, sales consultants
  - **Gaming**: Quest-givers, merchants, companions with unique personalities
  - **Professional Services**: Domain experts, advisors, process automation agents
- Example personas include "Emma" (customer support), "Alex Chen" (HR assistant), "Marcus Rivera" (sales consultant), "Alaric" (fantasy guard), and "Nexus" (cyberpunk operator)

### Structured Dialogue System
Conversations follow a flexible node-based architecture:
- Each conversation is defined in a JSON file containing multiple nodes
- Nodes include:
  - `id`: Unique identifier for the conversation node
  - `content`: The agent's dialogue text (optional for dynamic responses)
  - `action`: Context instruction for the LLM to understand the purpose and generate appropriate responses
  - `intents`: Array of possible user responses with target nodes
  - `global`: Flag for nodes accessible from anywhere in conversation
- Supports both structured flows (customer support workflows, quest chains) and free-form dialogue
- Example conversation trees: order tracking, benefits enrollment, product recommendations, quest dialogues

### Intent Classification via LLM
Advanced natural language understanding through:
- LLM-powered intent classification system (`classifyIntent` function)
- System determines which conversation node to activate based on user input
- Global nodes allow flexible conversation flows beyond predetermined paths
- Supports both guided dialogue paths (support tickets, onboarding flows) and free-form conversations
- Handles business-specific intents (order tracking, benefits questions) and gaming intents (quest acceptance, information gathering)

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

### Hybrid Approach to Agent Behavior
The implementation balances structure and flexibility:
- Predefined conversation trees guide key narrative/business process points
- LLM provides natural formulations and variations in responses
- Free-form dialogue capabilities through "global" nodes
- Consistent agent/character portrayal enforced by persona system prompts
- Adaptable to various domains from customer service to gaming to advisory services

## Project Structure
```
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── AGENT.md              # Intent classification agent instructions
├── data/                 # Data files for conversations and personas
│   ├── conversation*.json  # Structured dialogue nodes for agents
│   │   ├── conversation1-6.json  # Gaming NPCs (fantasy & cyberpunk)
│   │   ├── conversation7.json    # Customer Support (TechShop)
│   │   ├── conversation8.json    # HR Assistant
│   │   └── conversation9.json    # Sales Advisor (SmartHome)
│   └── persona*.txt        # Character/agent definitions
│       ├── persona1-6.txt        # Gaming character personas
│       ├── persona7.txt          # Customer Support specialist
│       ├── persona8.txt          # HR Business Partner
│       └── persona9.txt          # Sales Consultant
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
The project integrates LLMs to simulate conversational agents across multiple domains. Here's an overview of the workflow:

1. **Data Preparation**: 
   - Define persona traits in `data/persona*.txt` files (business agents or game characters)
   - Create conversation structures in `data/conversation*.json` files (support flows, onboarding processes, quest dialogues)

2. **Conversation Flow**:
   - Conversation starts with the "initial" node
   - User input is processed through intent classification
   - LLM determines the appropriate response and next node
   - Conversation summary is updated for context tracking

3. **Prompt Engineering**: 
   - `promptUtils.ts` crafts prompts that guide the LLM's responses
   - Combines persona definition with conversation context
   - Enables natural yet controlled agent behavior appropriate to the domain

4. **API Integration**: 
   - `mistralApi.ts` handles communication with the LLM backend
   - Intent classification and response generation are processed through API calls

5. **Server Logic**: 
   - `server.ts` manages incoming requests and routes them to the appropriate handlers
   - Maintains conversation state and history
   - Supports multiple concurrent conversations with different agents

## Business Applications & Demo Scenarios

This platform demonstrates enterprise-ready conversational AI capabilities across multiple business domains. The following scenarios showcase how the same technical foundation adapts to different professional contexts:

### Customer Support Automation (Character ID: 7 - Emma)
**Scenario**: E-commerce customer service automation
- **Order Management**: Handle order status inquiries, tracking, and modifications
- **Returns & Refunds**: Process return requests with appropriate empathy and efficiency
- **Technical Support**: Provide troubleshooting guidance and escalate when needed
- **24/7 Availability**: Consistent service quality regardless of time or volume

**Business Value**: 
- Reduce support ticket volume by 60-70% through automation
- Provide instant responses for common inquiries
- Maintain customer satisfaction with empathetic, professional communication
- Free human agents to handle complex, high-value interactions

### HR & Employee Services (Character ID: 8 - Alex Chen)
**Scenario**: Employee assistance and onboarding automation
- **Benefits Information**: Answer questions about health insurance, retirement plans, PTO
- **Onboarding Support**: Guide new hires through paperwork and setup processes
- **Policy Clarification**: Provide consistent information about company policies
- **Confidential Handling**: Maintain appropriate professional boundaries

**Business Value**:
- Scale HR support without increasing headcount
- Ensure consistent policy communication across the organization
- Improve employee experience with instant access to information
- Reduce HR administrative burden by 40-50%

### Sales & Product Advisory (Character ID: 9 - Marcus Rivera)
**Scenario**: Smart home product sales consultation
- **Needs Assessment**: Ask qualifying questions to understand customer requirements
- **Product Recommendations**: Suggest appropriate solutions based on budget and needs
- **Technical Guidance**: Provide specifications and compatibility information
- **Consultative Selling**: Build trust through honest, customer-focused advice

**Business Value**:
- Increase conversion rates through personalized recommendations
- Handle multiple customer inquiries simultaneously
- Provide consistent product knowledge across all interactions
- Gather customer preference data for business intelligence

### Gaming & Entertainment (Character IDs: 1-6)
**Scenario**: Immersive video game NPCs
- **Quest Management**: Dynamic quest-givers with personality
- **World Building**: Characters that enhance story immersion
- **Player Engagement**: Natural dialogue that responds to player choices

**Business Value**:
- Reduce narrative design costs for large-scale games
- Create more engaging player experiences
- Enable dynamic storytelling that adapts to player behavior

### Key Differentiators

**1. Domain Flexibility**
- Same architecture supports diverse use cases from customer service to gaming
- Easy to create new personas and conversation flows for any domain
- Demonstrates technical versatility for various client needs

**2. Controlled Intelligence**
- Structured conversation trees ensure agents stay on-topic and on-brand
- Prevents hallucination or inappropriate responses in business contexts
- Balances natural language with business process compliance

**3. Professional Quality**
- Appropriate tone and language for business applications
- Maintains context across multi-turn conversations
- Handles escalations and edge cases gracefully

**4. Cost-Effective Deployment**
- Reduces need for large customer service, HR, or sales teams
- Scales effortlessly to handle peak demand
- Lower operational costs compared to human-only approaches

## Future Improvements

The current implementation provides a solid foundation for creating conversational AI agents across multiple domains. However, there are several enhancements that could further improve the system for enterprise adoption:

### Database Integration
- **Replace Text-Based Storage**: Move from static JSON and TXT files to a proper database system
- **Dynamic Agent Management**: Enable runtime updates to agent personas and conversation trees
- **Conversation History**: Store and retrieve user-agent interaction history efficiently
- **Scalability**: Handle a larger number of agents and concurrent conversations
- **Analytics**: Track conversation metrics, user satisfaction, and business KPIs

### Selective Context Injection via RAG
- **Retrieval-Augmented Generation (RAG)**: Implement a RAG system to selectively provide relevant context
- **Knowledge Base**: Create dedicated knowledge bases for agents to access factual information (product catalogs, policy documents, game lore)
- **Dynamic Memory**: Enable agents to retrieve only the most relevant past interactions
- **Domain Knowledge**: Allow agents to reference domain-specific information contextually (company policies, product specs, world-building elements)

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
- **Emotion and Tone Control**: Add parameters to control emotional responses and conversation tone for different contexts
- **Multi-modal Interactions**: Extend the system to support image or audio inputs (product images, voice support)
- **Conversation Analytics**: Track engagement metrics, conversion rates, and conversation effectiveness
- **Localization Support**: Enable multilingual agent conversations through translation layers
- **Backend Assets Storage**: Store and manage assets (images, documents, sounds) related to agents backend instead of static files
- **A/B Testing**: Enable testing different conversation flows and personas to optimize outcomes
- **Integration Capabilities**: Connect to CRM, ticketing systems, e-commerce platforms, and other business tools

These improvements would enhance the system's flexibility, scalability, and cost-effectiveness while maintaining the core goal of creating natural and effective conversational AI agents for both business and entertainment applications.

## Acknowledgments
This project demonstrates the versatility of LLM-powered conversational AI across multiple domains, from enterprise business applications to interactive entertainment. It serves as both a technical showcase and a foundation for building domain-specific conversational agents.