import fs from "fs";
import path from "path";
import { classifyIntent } from "./mistralApi";
import { ConversationNode, ConversationIntent } from "./types/conversation";

// Function to prepare the system prompt based on persona.txt
function preparePersonaSystemPrompt(characterId: number = 1): string {
  const personaFilePath = path.join(__dirname, `../data/persona${characterId}.txt`);

  try {
    const personaContent = fs.readFileSync(personaFilePath, "utf-8");
    return `You are an NPC character in a role-playing game. Your behavior and responses must strictly adhere to the following persona: \n\n${personaContent}\n\nStay in character at all times and provide immersive, engaging, and contextually appropriate responses.`;
  } catch (error) {
    console.error(`Error reading persona${characterId}.txt:`, error);
    throw new Error("Failed to prepare system prompt.");
  }
}

/**
 * Prepares the system prompt for the chat summary
 * @param context The chat summary
 */
function prepareChatSummarySystemPrompt(chatSummary: string): string {
  return `Here is the summary of the conversation so far: \n\n${chatSummary}\n\nUse this context to provide a more relevant and engaging response.`;
}

/**
 * Prepares the system prompt for the intent classification
 * @param chatSummary The summary of the chat
 * @param characterId The character ID to use (defaults to 1)
 */
export function prepareSystemPrompt(chatSummary: string, characterId: number = 1): string[] {
  const personaPrompt = preparePersonaSystemPrompt(characterId);
  const chatSummaryPrompt = prepareChatSummarySystemPrompt(chatSummary);
  return [personaPrompt, chatSummaryPrompt];
}
  

export async function answerTo(
  message: string,
  nodeId: string,
  previousMessage: string,
  chatSummary: string,
  characterId: number = 1
): Promise<ConversationNode & { chatSummary: string }> {
  const conversationNode = getConversationNode(nodeId, characterId);
  if (!conversationNode) {
    throw new Error(`No conversation node found with ID: ${nodeId}`);
  }
  const answers = conversationNode?.intents;
  const globalIntents = getGlobalNodes(characterId);

  const allIntentsIds = [...new Set([...answers.map((intent) => intent.targetNodeId), ...globalIntents.map((intent) => intent.id)])];
  const allIntents = getConversationNodes(allIntentsIds, characterId);
  if (!allIntents || allIntents.length === 0) {
    throw new Error(`No intents found for node ID: ${nodeId}`);
  }
  const minimalIntents = allIntents.map((intent) => ({
    id: intent.id,
    action: intent.action,
  }));

  try {
    const intent = await classifyIntent(
      message,
      previousMessage,
      minimalIntents,
      chatSummary,
      characterId
    );
    const matchingIntent = allIntents.find(
      (answer) => answer.id === intent.intent
    );
    if (!matchingIntent) {
      throw new Error(`No matching answer found for intent: ${intent}`);
    }
    // Return the target node
    return {...matchingIntent, content: intent.message, chatSummary: `${chatSummary}\n${intent.chatSummary}`};
  } catch (error) {
    console.error("Error classifying intent:", error);
    throw new Error("Failed to classify intent.");
  }
}

/**
 * Loads and parses the conversation JSON file
 * @param characterId The character ID to use (defaults to 1)
 * @returns Array of conversation nodes
 * @throws Error if file cannot be read or parsed
 */
function loadConversationNodes(characterId: number = 1): ConversationNode[] {
  // Validate characterId
  if (characterId !== 1 && characterId !== 2) {
    characterId = 1; // Default to 1 if invalid
  }
  
  const conversationFilePath = path.join(
    __dirname,
    `../data/conversation${characterId}.json`
  );
  try {
    const conversationData = fs.readFileSync(conversationFilePath, "utf-8");
    return JSON.parse(conversationData) as ConversationNode[];
  } catch (error) {
    console.error(`Error reading conversation${characterId}.json:`, error);
    throw new Error("Failed to load conversation nodes.");
  }
}

export function getConversationNode(nodeId: string, characterId: number = 1): ConversationNode | null {
  try {
    const conversationNodes = loadConversationNodes(characterId);
    // Find the node with the matching ID
    const node = conversationNodes.find(item => item.id === nodeId);
    // Return the node if found, otherwise return null
    return node ?? null;
  } catch (error) {
    throw error; // Re-throw the error from loadConversationNodes
  }
}

/**
 * Get all conversation nodes from the JSON file
 * @param nodeIds Array of node IDs to retrieve
 * @param characterId The character ID to use (defaults to 1)
 * @returns Array of conversation nodes
 */
export function getConversationNodes(nodeIds: string[], characterId: number = 1): ConversationNode[] {
  try {
    const conversationNodes = loadConversationNodes(characterId);
    // Filter nodes based on provided IDs
    return conversationNodes.filter(item => nodeIds.includes(item.id));
  } catch (error) {
    throw error; // Re-throw the error from loadConversationNodes
  }
}

export function getGlobalNodes(characterId: number = 1): ConversationNode[] {
  try {
    const conversationNodes = loadConversationNodes(characterId);
    // Find nodes with global flag set to true
    return conversationNodes.filter(item => item.global === true);
  } catch (error) {
    throw error; // Re-throw the error from loadConversationNodes
  }
}

/**
 * Get the first conversation node from the list
 * Used as a starting point for conversations
 * @param characterId The character ID to use (defaults to 1)
 * @returns The first conversation node or null if none exists
 */
export function getFirstConversationNode(characterId: number = 1): ConversationNode | null {
  return getConversationNode("initial", characterId);
}
