import axios from "axios";

// Load environment variables from a .env file into process.env
import dotenv from "dotenv";
import { prepareSystemPrompt } from "./promptUtils";
import {
  IntentClassificationRequest,
  IntentClassificationResponse,
  ChatCompletionOptions,
} from "./types/api";
import { ConversationNodeMinimal } from "./types";

dotenv.config();

// Define the base URL for the Mistral API
const MISTRAL_API_BASE_URL =
  process.env.MISTRAL_API_BASE_URL || "https://api.mistral.ai";
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  throw new Error(
    "MISTRAL_API_KEY is not defined in the environment variables."
  );
}

// Create an Axios instance for the Mistral API
const mistralApiClient = axios.create({
  baseURL: MISTRAL_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${MISTRAL_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Function to call the Chat Completions API
/* export async function getChatCompletion(message: string) {
  try {
    const systemPrompt = prepareSystemPrompt();
    const response = await mistralApiClient.post("/v1/chat/completions", {
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });
    return response.data;
  } catch (error) {
    console.error("Error calling Mistral Chat Completions API:", error);
    throw error;
  }
} */

/**
 * Classifies the user's message into one of the provided intents using the Mistral Intent Classifier API.
 * @param message The user's message to classify
 * @param previousPhrase The previous message in the conversation
 * @param intents An array of possible intents to classify the message against
 * @param chatSummary The summary of the chat context
 * @param characterId The character ID to use (defaults to 1)
 * @returns A promise that resolves to the classified intent
 */
export async function classifyIntent(
  message: string,
  previousPhrase: string,
  intents: ConversationNodeMinimal[],
  chatSummary: string,
  characterId: number = 1
): Promise<IntentClassificationResponse> {
  const agentId = process.env.MISTRAL_AGENT_INTENT_CLASSIFIER;

  if (!agentId) {
    throw new Error(
      "MISTRAL_AGENT_INTENT_CLASSIFIER is not defined in the environment variables."
    );
  }

  const systemPrompts = prepareSystemPrompt(chatSummary, characterId).map((prompt) => ({
    role: "system",
    content: prompt,
  }));

  const messageContent: IntentClassificationRequest = {
    previousPhrase,
    message: message,
    intents: intents,
  };

  try {
    const response = await mistralApiClient.post(`/v1/agents/completions`, {
      agent_id: agentId,
      response_format: {
        type: "json_object",
      },
      messages: [
        ...systemPrompts,
        {
          role: "user",
          content: JSON.stringify(messageContent),
        },
      ],
    } as ChatCompletionOptions);

    console.log(
      "Request to Mistral Intent Classifier API:",
      JSON.stringify({
        messages: [
          ...systemPrompts,
          {
            role: "user",
            content: messageContent,
          },
        ],
      })
    );

    console.log(
      "Response from Mistral Intent Classifier API:",
      response.data.choices[0].message
    );
    const responseMessage = response.data.choices[0].message.content;
    const parsedMessage = JSON.parse(
      responseMessage
    ) as IntentClassificationResponse;

    return parsedMessage;
  } catch (error) {
    console.error("Error classifying intent:", error);
    throw error;
  }
}
