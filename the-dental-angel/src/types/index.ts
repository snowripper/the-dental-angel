/**
 * Central Type Exports
 *
 * Import all types from this file for consistency across the app.
 */

// Navigation types
export * from './navigation';

// Chat types
export * from './chat';

// Re-export service types for convenience
export type { SecondOpinionScore } from '../services/aiService';
export type { Message, Conversation } from '../services/conversationService';
