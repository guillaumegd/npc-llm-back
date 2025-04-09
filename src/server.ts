// Import the 'express' module along with 'Request' and 'Response' types from express
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { classifyIntent } from "./mistralApi";
import { answerTo, getFirstConversationNode } from "./promptUtils";
import { ConversationNode } from "./types/conversation";
import { ErrorResponse } from "./types/response";
import swaggerUi from 'swagger-ui-express';
import { specs } from './docs/swagger';
import redoc from 'redoc-express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

// Load environment variables from a .env file into process.env
dotenv.config();

// Create an Express application
const app = express();

// Add middleware to parse JSON bodies
app.use(express.json());

// Configure CORS middleware
app.use(cors({
  origin: '*', // Autorise toutes les origines - à remplacer par l'URL de votre frontend en production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger UI integration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API NPC-LLM Documentation"
}));

// Endpoint to expose the OpenAPI specification as JSON
app.get('/api-spec.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// ReDoc integration - a more modern alternative to Swagger UI
app.use('/docs', redoc({
  title: 'API NPC-LLM Documentation',
  specUrl: '/api-spec.json',
  redocOptions: {
    hideDownloadButton: false,
    disableSearch: false,
    requiredPropsFirst: true,
    sortPropsAlphabetically: true,
  }
}));

// Specify the port number for the server
const port: number = 3000;

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Process a user message and returns the NPC response
 *     description: Analyzes the user message, identifies the intent and returns the corresponding conversation node. If no message or nodeId is provided, returns the first conversation node as a starter.
 *     tags: [Conversation]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Conversation node corresponding to the detected intent or the first node if starting a conversation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationNode'
 *       400:
 *         description: Invalid request - missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post("/chat", async (req: Request, res: Response<ConversationNode | ErrorResponse>) => {
  try {
    const { message, node_id: nodeId, previousMessage, chatSummary } = req.body;
    // Extraire characterId et le convertir en nombre
    const characterId = req.body.characterId ? parseInt(req.body.characterId, 10) : 1;

    // If message or nodeId is missing, return the first conversation node
    if (!message || !nodeId) {
      const firstNode = getFirstConversationNode(characterId);
      if (!firstNode) {
        res.status(500).json({ error: "No conversation nodes found." });
        return;
      }
      res.json(firstNode);
      return;
    }

    const answer = await answerTo(message, nodeId, previousMessage, chatSummary, characterId);
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: "Failed to answer." });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
  console.log(`ReDoc documentation available at http://localhost:${port}/docs`);
});
