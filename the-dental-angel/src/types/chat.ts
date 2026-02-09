/**
 * Chat Type Definitions
 *
 * Types for messages displayed in the chat interface.
 */

import type { SecondOpinionScore } from '../services/aiService';

/**
 * A message displayed in the chat UI
 */
export interface DisplayMessage {
  id: string;
  text: string;
  isUser: boolean;
  imageUri?: string;
  secondOpinionScore?: SecondOpinionScore;
}

/**
 * Parsed questions extracted from AI response
 */
export interface ParsedQuestions {
  questions: string[];
  topic?: string;
}

/**
 * Chat history message format for AI API
 */
export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}
