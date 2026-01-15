# Business Use Cases Examples

This document provides examples of how to use the business-focused conversational agents in the NPC-LLM platform.

## Available Business Agents

### Character ID 7: Emma - Customer Support Specialist
**Company**: TechShop Online (E-commerce)  
**Use Case**: Customer service automation for online retail

**Sample Conversation Flows**:
- Order status inquiries
- Package tracking
- Product returns and refunds
- Technical support for purchased items
- Address changes and modifications

**Example API Request**:
```json
POST /chat
{
  "characterId": 7,
  "message": "",
  "node_id": ""
}
```

**Response** (Initial greeting):
```json
{
  "id": "initial",
  "content": "Hi! I'm Emma from TechShop Online customer support. How can I help you today?",
  "action": "Greet the customer warmly and offer assistance.",
  "intents": [
    { "content": "I have a question about my order", "targetNodeId": "order_inquiry" },
    { "content": "I need to return a product", "targetNodeId": "return_request" },
    ...
  ]
}
```

**Sample Interactions**:
1. "I need to track my package" → Provides tracking information and status
2. "The product is defective" → Initiates return process with free shipping label
3. "How long until I get my refund?" → Explains refund timeline clearly

---

### Character ID 8: Alex Chen - HR Business Partner
**Company**: Mid-sized tech company  
**Use Case**: Employee self-service for HR inquiries

**Sample Conversation Flows**:
- Benefits enrollment and information
- New employee onboarding
- PTO policy and requests
- Payroll questions
- Policy clarifications

**Example API Request**:
```json
POST /chat
{
  "characterId": 8,
  "message": "I have questions about my benefits",
  "node_id": "initial",
  "previousMessage": "Welcome! I'm Alex from HR...",
  "chatSummary": "Initial greeting."
}
```

**Sample Interactions**:
1. "What's the 401(k) matching?" → Explains retirement benefits with clear percentages
2. "How do I request time off?" → Guides through PTO request process
3. "I need help with onboarding" → Outlines paperwork and setup steps

---

### Character ID 9: Marcus Rivera - Senior Sales Consultant
**Company**: SmartHome Solutions  
**Use Case**: Product advisory and sales support

**Sample Conversation Flows**:
- Smart home consultation
- Security system recommendations
- Energy efficiency solutions
- Product comparisons and pricing
- Installation guidance

**Example API Request**:
```json
POST /chat
{
  "characterId": 9,
  "message": "I want to upgrade my home security",
  "node_id": "initial",
  "previousMessage": "Hi there! I'm Marcus from SmartHome Solutions...",
  "chatSummary": "Greeted customer."
}
```

**Sample Interactions**:
1. "What's a good starting point?" → Recommends affordable starter package
2. "I want comprehensive monitoring" → Presents premium security system with transparent pricing
3. "That's more than I wanted to spend" → Offers budget-friendly alternatives without pressure

---

## Integration Examples

### Basic Customer Support Bot
```javascript
// Initialize conversation
const response = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    characterId: 7,  // Emma - Customer Support
    message: '',
    node_id: ''
  })
});

// User asks about order
const orderResponse = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    characterId: 7,
    message: 'I want to track my package',
    node_id: 'initial',
    previousMessage: 'Hi! I\'m Emma from TechShop Online...',
    chatSummary: 'Initial greeting. User wants to track package.'
  })
});
```

### HR Self-Service Chatbot
```javascript
// Employee asks about PTO
const ptoResponse = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    characterId: 8,  // Alex Chen - HR
    message: 'How many vacation days do I get?',
    node_id: 'initial',
    previousMessage: 'Welcome! I\'m Alex from HR...',
    chatSummary: 'Employee inquiry started.'
  })
});
```

### Sales Consultation Bot
```javascript
// Customer asks about products
const salesResponse = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    characterId: 9,  // Marcus - Sales
    message: 'I\'m interested in smart home automation',
    node_id: 'initial',
    previousMessage: 'Hi there! I\'m Marcus from SmartHome Solutions...',
    chatSummary: 'Customer showed interest in smart home.'
  })
});
```

---

## Business Value Metrics

### Customer Support (Character 7)
- **Automation Rate**: 60-70% of inquiries handled without human intervention
- **Response Time**: Instant vs. 2-4 hour average for human agents
- **Availability**: 24/7 vs. business hours only
- **Cost Savings**: ~$50K-100K annually per human agent replaced

### HR Assistant (Character 8)
- **Query Resolution**: 40-50% reduction in HR administrative burden
- **Employee Satisfaction**: Improved access to information
- **Onboarding Time**: Reduced from days to hours
- **Consistency**: 100% consistent policy communication

### Sales Advisor (Character 9)
- **Lead Qualification**: Handles initial consultation for 100% of inquiries
- **Conversion Support**: Personalized recommendations increase conversion by 15-25%
- **Scalability**: Handle unlimited concurrent customer conversations
- **Data Collection**: Gather customer preferences for business intelligence

---

## Customization Guide

To create your own business agent:

1. **Create Persona File** (`data/persona10.txt`):
```
Name: [Agent Name]
Role: [Job Title and Company Context]
Age: ~[Age] years
Tone: [Communication style]
Traits: [Key personality traits]
Motivation: [What drives this agent]
Context: [Background and domain expertise]
Distinctive Feature: [What makes this agent unique]
```

2. **Create Conversation Tree** (`data/conversation10.json`):
```json
[
  {
    "id": "initial",
    "global": true,
    "content": "Greeting message",
    "action": "What the agent should do",
    "intents": [
      { "content": "User response option", "targetNodeId": "target_node" }
    ]
  },
  ...
]
```

3. **Update Code** (if adding beyond character 9):
   - Update validation in `src/promptUtils.ts` to support higher character IDs

4. **Test Your Agent**:
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"characterId": 10, "message": "", "node_id": ""}'
```

---

## Best Practices

### For Customer Support Agents:
- Always acknowledge customer frustration with empathy
- Provide clear next steps and timelines
- Escalate to human agents when appropriate
- Use positive, solution-oriented language

### For HR Agents:
- Maintain confidentiality and professionalism
- Simplify complex policies into clear explanations
- Direct to appropriate resources for sensitive topics
- Keep information up-to-date with company policies

### For Sales Agents:
- Ask qualifying questions to understand needs
- Be consultative, not pushy
- Provide honest recommendations
- Focus on value, not just features
- Respect customer budget constraints

---

## Testing Scenarios

### Customer Support Testing
1. Happy path: Order tracking request → Successful tracking info
2. Error handling: Defective product → Return process with empathy
3. Escalation: Complex technical issue → Transfer to specialist

### HR Assistant Testing
1. Benefits inquiry: 401(k) question → Clear explanation with numbers
2. Policy question: PTO rollover → Accurate policy information
3. Onboarding: New hire setup → Step-by-step guidance

### Sales Consultant Testing
1. Budget-conscious: "Too expensive" → Offer alternatives
2. Information gathering: "Just browsing" → Provide value without pressure
3. Ready to buy: "I'll take it" → Smooth checkout process

---

## Troubleshooting

**Issue**: Agent responses seem generic or off-topic
- **Solution**: Check that `characterId` is correct and conversation history is being maintained

**Issue**: Agent doesn't follow business processes
- **Solution**: Review conversation tree structure and ensure all necessary nodes are connected

**Issue**: Tone doesn't match business context
- **Solution**: Update persona file to better define tone, traits, and communication style

---

## API Reference

**Endpoint**: `POST /chat`

**Request Body**:
```json
{
  "characterId": number,      // 1-9 (7-9 for business agents)
  "message": string,          // User's message
  "node_id": string,          // Current conversation node
  "previousMessage": string,  // Agent's previous message
  "chatSummary": string       // Conversation history summary
}
```

**Response**:
```json
{
  "id": string,               // Node ID
  "content": string,          // Agent's response
  "action": string,           // What agent should do
  "intents": [...],          // Possible next user responses
  "chatSummary": string       // Updated conversation summary
}
```

---

## License and Usage

This platform is designed to demonstrate the versatility of LLM-powered conversational AI for business applications. The business agent examples (characters 7-9) showcase professional use cases while the original gaming characters (1-6) demonstrate entertainment applications.

For production deployment, consider:
- Adding authentication and rate limiting
- Implementing conversation persistence
- Integrating with business systems (CRM, ticketing, e-commerce)
- Adding analytics and monitoring
- Compliance with data privacy regulations
