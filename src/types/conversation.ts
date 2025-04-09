/**
 * Types related to conversations and the dialogue system
 */

/**
 * Represents a conversation node in the dialogue system
 */
export interface ConversationNode {
  id: string;
  content: string;
  intents: ConversationIntent[];
  global: boolean;
  action: string;
}

/**
 * Represents a possible intent in a conversation node
 */
export interface ConversationIntent {
  content: string;
  targetNodeId: string;
}

export type ConversationNodeMinimal = Pick<
    ConversationNode,
    'id' | 'action'
>;