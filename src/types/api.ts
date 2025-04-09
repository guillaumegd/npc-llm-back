/**
 * Types related to external APIs (Mistral)
 */

import { ConversationNodeMinimal } from "./conversation";

/**
 * Structure of the request to classify an intent
 */
export interface IntentClassificationRequest {
  previousPhrase: string;
  message: string;
  intents: ConversationNodeMinimal[];
}

/**
 * Structure of the intent classification response
 */
export interface IntentClassificationResponse {
  intent: string;
  message: string;
  chatSummary: string;
}

/**
 * Mistral API client configuration
 */
export interface MistralApiConfig {
  baseURL: string;
  apiKey: string;
}

/**
 * Options for completion API calls
 */
export interface ChatCompletionOptions {
  agent_id?: string; 
  model?: string;
  response_format?: {
    type: string;
  };
  messages: Array<{
    role: string;
    content: string;
  }>;
}