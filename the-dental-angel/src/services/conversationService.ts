import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUri?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'dental_angel_conversations';

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate conversation title from first message
const generateTitle = (firstMessage: string): string => {
  const cleaned = firstMessage.replace(/\n/g, ' ').trim();
  if (cleaned.length <= 50) return cleaned;

  const firstSentence = cleaned.split(/[.!?]/)[0];
  if (firstSentence.length <= 50) return firstSentence;

  return cleaned.substring(0, 47) + '...';
};

// Generate preview from last message
const generatePreview = (lastMessage: string): string => {
  const cleaned = lastMessage.replace(/\n/g, ' ').trim();
  if (cleaned.length <= 80) return cleaned;
  return cleaned.substring(0, 77) + '...';
};

// Local storage functions
const localStore = {
  async getAll(): Promise<Conversation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const conversations = JSON.parse(data) as Conversation[];
      return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  },

  async save(conversation: Conversation): Promise<void> {
    try {
      const conversations = await this.getAll();
      const existingIndex = conversations.findIndex((c) => c.id === conversation.id);

      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.unshift(conversation);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  },

  async delete(conversationId: string): Promise<void> {
    try {
      const conversations = await this.getAll();
      const filtered = conversations.filter((c) => c.id !== conversationId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  },

  async get(conversationId: string): Promise<Conversation | null> {
    try {
      const conversations = await this.getAll();
      return conversations.find((c) => c.id === conversationId) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  },
};

// Main service - uses local storage only
export const conversationService = {
  // Create a new conversation
  createConversation(): Conversation {
    const now = Date.now();
    return {
      id: generateId(),
      title: 'New Conversation',
      preview: '',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
  },

  // Add a message to a conversation
  addMessage(
    conversation: Conversation,
    role: 'user' | 'assistant',
    content: string,
    imageUri?: string
  ): Conversation {
    const message: Message = {
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
      imageUri,
    };

    const messages = [...conversation.messages, message];

    // Update title from first user message
    const firstUserMessage = messages.find((m) => m.role === 'user');
    const title = firstUserMessage ? generateTitle(firstUserMessage.content) : 'New Conversation';

    // Update preview from last assistant message
    const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
    const preview = lastAssistantMessage ? generatePreview(lastAssistantMessage.content) : '';

    return {
      ...conversation,
      title,
      preview,
      messages,
      updatedAt: Date.now(),
    };
  },

  // Save conversation
  async save(conversation: Conversation): Promise<void> {
    await localStore.save(conversation);
  },

  // Get all conversations
  async getAll(): Promise<Conversation[]> {
    return localStore.getAll();
  },

  // Get single conversation
  async get(id: string): Promise<Conversation | null> {
    return localStore.get(id);
  },

  // Delete conversation
  async delete(id: string): Promise<void> {
    await localStore.delete(id);
  },

  // Format date for display
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  },
};
