import { conversationService } from '../services/conversationService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('conversationService', () => {
  describe('createConversation', () => {
    it('creates a new conversation with correct defaults', () => {
      const conversation = conversationService.createConversation();

      expect(conversation.id).toBeDefined();
      expect(conversation.title).toBe('New Conversation');
      expect(conversation.preview).toBe('');
      expect(conversation.messages).toEqual([]);
      expect(conversation.createdAt).toBeDefined();
      expect(conversation.updatedAt).toBeDefined();
    });

    it('creates unique IDs for each conversation', () => {
      const conv1 = conversationService.createConversation();
      const conv2 = conversationService.createConversation();

      expect(conv1.id).not.toBe(conv2.id);
    });
  });

  describe('addMessage', () => {
    it('adds a user message to conversation', () => {
      const conversation = conversationService.createConversation();
      const updated = conversationService.addMessage(
        conversation,
        'user',
        'What is a dental crown?'
      );

      expect(updated.messages).toHaveLength(1);
      expect(updated.messages[0].role).toBe('user');
      expect(updated.messages[0].content).toBe('What is a dental crown?');
      expect(updated.title).toBe('What is a dental crown?');
    });

    it('adds an assistant message to conversation', () => {
      let conversation = conversationService.createConversation();
      conversation = conversationService.addMessage(conversation, 'user', 'What is a root canal?');
      conversation = conversationService.addMessage(
        conversation,
        'assistant',
        'A root canal is a dental procedure to save a badly damaged tooth.'
      );

      expect(conversation.messages).toHaveLength(2);
      expect(conversation.preview).toContain('root canal');
    });

    it('truncates long titles', () => {
      const conversation = conversationService.createConversation();
      const longMessage =
        'This is a very long message that exceeds the fifty character limit for conversation titles';
      const updated = conversationService.addMessage(conversation, 'user', longMessage);

      expect(updated.title.length).toBeLessThanOrEqual(50);
    });

    it('includes imageUri when provided', () => {
      const conversation = conversationService.createConversation();
      const updated = conversationService.addMessage(
        conversation,
        'user',
        'Here is my x-ray',
        'file:///path/to/image.jpg'
      );

      expect(updated.messages[0].imageUri).toBe('file:///path/to/image.jpg');
    });
  });

  describe('formatDate', () => {
    it('returns "Today" for current date', () => {
      const now = Date.now();
      expect(conversationService.formatDate(now)).toBe('Today');
    });

    it('returns "Yesterday" for previous day', () => {
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
      expect(conversationService.formatDate(yesterday)).toBe('Yesterday');
    });

    it('returns weekday name for recent dates', () => {
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      const result = conversationService.formatDate(threeDaysAgo);
      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      expect(weekdays).toContain(result);
    });
  });
});
