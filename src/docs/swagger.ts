import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger configuration options for OpenAPI documentation generation
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NPC-LLM API',
      version: '1.0.0',
      description: 'API for interacting with non-player characters (NPCs) powered by large language models',
      contact: {
        name: 'Support',
        url: 'https://github.com/yourusername/npc-llm',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.yourdomain.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Conversation',
        description: 'Endpoints for interacting with NPCs',
      },
    ],
    components: {
      schemas: {
        ConversationNode: {
          type: 'object',
          required: ['id', 'content', 'intents'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier of the conversation node',
            },
            content: {
              type: 'string',
              description: 'Text content of the conversation node (NPC response)',
            },
            intents: {
              type: 'array',
              description: 'List of possible intents for this node',
              items: {
                $ref: '#/components/schemas/ConversationIntent',
              },
            },
            global: {
              type: 'boolean',
              description: 'Flag indicating if the node is accessible from anywhere in the conversation',
            },
            action: {
              type: 'string',
              description: 'Action or context instruction for the LLM',
            },
            chatSummary: {
              type: 'string',
              description: 'Updated summary of the conversation including the current exchange',
            },
          },
        },
        ConversationIntent: {
          type: 'object',
          required: ['content', 'targetNodeId'],
          properties: {
            content: {
              type: 'string',
              description: 'Text content of the intent',
            },
            targetNodeId: {
              type: 'string',
              description: 'ID of the target node linked to this intent',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          required: ['error'],
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        ChatRequest: {
          type: 'object',
          required: ['message', 'node_id'],
          properties: {
            message: {
              type: 'string',
              description: 'User message to process',
            },
            node_id: {
              type: 'string',
              description: 'ID of the current conversation node',
            },
            previousMessage: {
              type: 'string',
              description: 'Previous message in the conversation for context',
            },
            chatSummary: {
              type: 'string',
              description: 'Summary of the conversation history used for context',
            },
            characterId: {
              type: 'integer',
              description: 'ID of the character to use (1 or 2) - determines which persona/conversation files to use',
              enum: [1, 2]
            }
          },
        },
      },
    },
  },
  apis: ['./src/**/*.ts'], // Path to files containing documentation comments
};

export const specs = swaggerJsdoc(options);