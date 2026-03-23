/**
 * Full Patient Journey Test
 *
 * Simulates the complete experience a real patient would have:
 *
 * 1. New patient opens app (no name, no settings)
 * 2. Enters their name and zip code
 * 3. Gets a personalized greeting
 * 4. Asks questions about dental care (free messages)
 * 5. Hits the paywall after 3 free messages
 * 6. Purchases "Quick Answers" tier
 * 7. Can send messages again
 * 8. Upgrades to "Expert Review" tier
 * 9. Requests Dr. Angel's personal review
 * 10. Dr. Angel completes the review
 * 11. Patient sees the completed review
 */

import { conversationService } from '../services/conversationService';
import { paymentService } from '../services/paymentService';
import { userSettingsService } from '../services/userSettingsService';
import { expertReviewService } from '../services/expertReviewService';
import { sendMessageToAngel } from '../services/aiService';
import { getPersonalizedGreeting } from '../constants/angelPersonality';

// Mock AsyncStorage with a real in-memory store so data persists across calls
const mockStore: Record<string, string> = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(mockStore[key] || null)),
  setItem: jest.fn((key: string, value: string) => {
    mockStore[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStore[key];
    return Promise.resolve();
  }),
}));

// Mock expo-file-system (needed by aiService for image analysis)
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
}));

describe('Full Patient Journey', () => {
  beforeEach(() => {
    // Clear the mock store before each test
    Object.keys(mockStore).forEach((key) => delete mockStore[key]);
  });

  // ─────────────────────────────────────────────
  // STEP 1: Brand new patient opens the app
  // ─────────────────────────────────────────────
  it('Step 1: New patient has default settings (no name, free tier)', async () => {
    const settings = await userSettingsService.get();

    expect(settings.firstName).toBeNull();
    expect(settings.zipCode).toBeNull();
    expect(settings.subscriptionTier).toBe('free');
    expect(settings.hasCompletedOnboarding).toBe(false);
  });

  // ─────────────────────────────────────────────
  // STEP 2: Patient enters their name and zip
  // ─────────────────────────────────────────────
  it('Step 2: Patient enters name and zip code', async () => {
    await userSettingsService.setFirstName('Susan');
    await userSettingsService.setZipCode('90210');

    const settings = await userSettingsService.get();
    expect(settings.firstName).toBe('Susan');
    expect(settings.zipCode).toBe('90210');
  });

  // ─────────────────────────────────────────────
  // STEP 3: Personalized greeting uses their name
  // ─────────────────────────────────────────────
  it('Step 3: Gets a personalized greeting with their name', () => {
    const greeting = getPersonalizedGreeting('Susan');

    expect(greeting).toContain('Susan');
    expect(greeting.length).toBeGreaterThan(10);
  });

  // ─────────────────────────────────────────────
  // STEP 4: First conversation is created and messages work
  // ─────────────────────────────────────────────
  it('Step 4: Creates a conversation and exchanges messages', async () => {
    const conversation = conversationService.createConversation();
    expect(conversation.messages).toHaveLength(0);

    // AI greeting
    let updated = conversationService.addMessage(
      conversation,
      'assistant',
      getPersonalizedGreeting('Susan')
    );
    expect(updated.messages).toHaveLength(1);

    // Patient asks a question
    updated = conversationService.addMessage(updated, 'user', 'What is a dental crown?');
    expect(updated.messages).toHaveLength(2);
    expect(updated.title).toBe('What is a dental crown?');

    // AI responds (using demo mode since no API key)
    const aiResponse = await sendMessageToAngel('What is a dental crown?');
    expect(aiResponse.success).toBe(true);
    expect(aiResponse.message.length).toBeGreaterThan(50);
    expect(aiResponse.message.toLowerCase()).toContain('crown');

    updated = conversationService.addMessage(updated, 'assistant', aiResponse.message);
    expect(updated.messages).toHaveLength(3);

    // Save and retrieve
    await conversationService.save(updated);
    const loaded = await conversationService.get(updated.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.messages).toHaveLength(3);
  });

  // ─────────────────────────────────────────────
  // STEP 5: Free tier allows 3 messages, then blocks
  // ─────────────────────────────────────────────
  it('Step 5: Free tier allows 3 messages then shows paywall', async () => {
    // First 3 messages should be allowed
    for (let i = 0; i < 3; i++) {
      const access = await paymentService.canSendMessage();
      expect(access.allowed).toBe(true);
      expect(access.limit).toBe(3);
      await paymentService.incrementMessageCount();
    }

    // 4th message should be blocked
    const blocked = await paymentService.canSendMessage();
    expect(blocked.allowed).toBe(false);
    expect(blocked.messagesUsed).toBe(3);
  });

  // ─────────────────────────────────────────────
  // STEP 6: Patient purchases Quick Answers ($29)
  // ─────────────────────────────────────────────
  it('Step 6: Purchases Quick Answers tier successfully', async () => {
    const result = await paymentService.purchaseTier('quick_answers');

    expect(result.success).toBe(true);
    expect(result.message).toContain('Quick Answers');
    expect(result.message).toContain('7 days');

    // Verify settings updated
    const settings = await userSettingsService.get();
    expect(settings.subscriptionTier).toBe('quick_answers');
    expect(settings.subscriptionExpiresAt).toBeGreaterThan(Date.now());
  });

  // ─────────────────────────────────────────────
  // STEP 7: Paid user can send unlimited messages
  // ─────────────────────────────────────────────
  it('Step 7: Paid user can send messages without limits', async () => {
    // Purchase first
    await paymentService.purchaseTier('quick_answers');

    const access = await paymentService.canSendMessage();
    expect(access.allowed).toBe(true);
    expect(access.limit).toBe(Infinity);
  });

  // ─────────────────────────────────────────────
  // STEP 8: Image upload requires paid tier
  // ─────────────────────────────────────────────
  it('Step 8: Free users cannot upload images, paid users can', async () => {
    // Free user can't upload
    const freeCan = await paymentService.canUploadImage();
    expect(freeCan).toBe(false);

    // Purchase a tier
    await paymentService.purchaseTier('full_prep');

    // Now they can
    const paidCan = await paymentService.canUploadImage();
    expect(paidCan).toBe(true);
  });

  // ─────────────────────────────────────────────
  // STEP 9: Upgrade to Expert tier and request review
  // ─────────────────────────────────────────────
  it('Step 9: Expert tier patient requests Dr. Angel review', async () => {
    // Purchase Expert tier
    await paymentService.purchaseTier('expert');

    const settings = await userSettingsService.get();
    expect(settings.subscriptionTier).toBe('expert');

    // Create a conversation with some messages
    let conversation = conversationService.createConversation();
    conversation = conversationService.addMessage(
      conversation,
      'user',
      'I need a crown on tooth #14 and my dentist quoted $1,500'
    );
    conversation = conversationService.addMessage(
      conversation,
      'assistant',
      'Let me help you understand what goes into a crown procedure...'
    );
    await conversationService.save(conversation);

    // Request expert review
    const review = await expertReviewService.requestReview({
      conversationId: conversation.id,
      patientSummary: 'I need a crown on tooth #14 and my dentist quoted $1,500',
      conversationMessages: conversation.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    expect(review.id).toBeDefined();
    expect(review.conversationId).toBe(conversation.id);
    expect(review.status).toBe('in_review');
    expect(review.patientSummary).toContain('crown');
    expect(review.aiConversationSummary).toContain("PATIENT'S QUESTIONS");
  });

  // ─────────────────────────────────────────────
  // STEP 10: Dr. Angel completes the review
  // ─────────────────────────────────────────────
  it('Step 10: Dr. Angel submits his educational review', async () => {
    // Set up: create conversation and request review
    let conversation = conversationService.createConversation();
    conversation = conversationService.addMessage(conversation, 'user', 'Crown on tooth #14');
    await conversationService.save(conversation);

    const review = await expertReviewService.requestReview({
      conversationId: conversation.id,
      patientSummary: 'Crown on tooth #14',
      conversationMessages: [{ role: 'user', content: 'Crown on tooth #14' }],
    });

    // Dr. Angel responds
    const drResponse =
      'Based on my 40 years of experience, a crown on tooth #14 is a very standard procedure...';
    const completed = await expertReviewService.submitResponse(review.id, drResponse);

    expect(completed).not.toBeNull();
    expect(completed!.status).toBe('completed');
    expect(completed!.drAngelResponse).toContain('40 years');
    expect(completed!.completedAt).toBeDefined();
  });

  // ─────────────────────────────────────────────
  // STEP 11: Patient sees the completed review
  // ─────────────────────────────────────────────
  it('Step 11: Patient can see the completed review in their conversation', async () => {
    // Set up the full flow
    let conversation = conversationService.createConversation();
    conversation = conversationService.addMessage(conversation, 'user', 'Root canal question');
    await conversationService.save(conversation);

    const review = await expertReviewService.requestReview({
      conversationId: conversation.id,
      patientSummary: 'Root canal question',
      conversationMessages: [{ role: 'user', content: 'Root canal question' }],
    });

    // Check: active review exists
    const hasActive = await expertReviewService.hasActiveReview(conversation.id);
    expect(hasActive).toBe(true);

    // Dr. Angel completes it
    await expertReviewService.submitResponse(review.id, 'Here is my educational review...');

    // Patient retrieves the completed review
    const completedReview = await expertReviewService.getCompletedReview(conversation.id);
    expect(completedReview).not.toBeNull();
    expect(completedReview!.status).toBe('completed');
    expect(completedReview!.drAngelResponse).toBe('Here is my educational review...');
  });

  // ─────────────────────────────────────────────
  // STEP 12: AI knows about different dental topics
  // ─────────────────────────────────────────────
  it('Step 12: AI gives relevant responses for different dental topics', async () => {
    // Crown question
    const crownResponse = await sendMessageToAngel('Tell me about dental crowns');
    expect(crownResponse.success).toBe(true);
    expect(crownResponse.secondOpinionScore).toBeDefined();

    // Root canal question
    const rootCanalResponse = await sendMessageToAngel('I need a root canal');
    expect(rootCanalResponse.success).toBe(true);
    expect(rootCanalResponse.message.toLowerCase()).toContain('root canal');

    // Cost question
    const costResponse = await sendMessageToAngel('Is this too expensive?');
    expect(costResponse.success).toBe(true);
    expect(costResponse.message.toLowerCase()).toContain('cost');

    // Anxiety question
    const anxietyResponse = await sendMessageToAngel("I'm scared of the dentist");
    expect(anxietyResponse.success).toBe(true);
    expect(anxietyResponse.message.toLowerCase()).toContain('anxiety');
  });

  // ─────────────────────────────────────────────
  // STEP 13: Subscription expiry works correctly
  // ─────────────────────────────────────────────
  it('Step 13: Expired subscription reverts to free behavior', async () => {
    // Set an expired subscription
    await userSettingsService.save({
      subscriptionTier: 'quick_answers',
      subscriptionExpiresAt: Date.now() - 1000, // expired 1 second ago
    });

    const isActive = await userSettingsService.isSubscriptionActive();
    expect(isActive).toBe(false);

    const daysLeft = await userSettingsService.getDaysRemaining();
    expect(daysLeft).toBe(0);

    // Should not be able to upload images
    const canUpload = await paymentService.canUploadImage();
    expect(canUpload).toBe(false);
  });

  // ─────────────────────────────────────────────
  // STEP 14: Access info reflects current tier
  // ─────────────────────────────────────────────
  it('Step 14: Access info shows correct tier details', async () => {
    await paymentService.purchaseTier('full_prep');

    const info = await paymentService.getAccessInfo();
    expect(info.tier).toBe('full_prep');
    expect(info.tierName).toBe('Full Prep');
    expect(info.isActive).toBe(true);
    expect(info.daysRemaining).toBeGreaterThan(0);
    expect(info.features).toContain('Cost comparison data');
  });

  // ─────────────────────────────────────────────
  // STEP 15: Demo simulate review (for testing in-app)
  // ─────────────────────────────────────────────
  it('Step 15: Simulated review works for demo/testing', async () => {
    let conversation = conversationService.createConversation();
    conversation = conversationService.addMessage(conversation, 'user', 'Demo question');
    await conversationService.save(conversation);

    // Request review
    await expertReviewService.requestReview({
      conversationId: conversation.id,
      patientSummary: 'Demo question',
      conversationMessages: [{ role: 'user', content: 'Demo question' }],
    });

    // Simulate Dr. Angel responding (built-in demo response)
    const simulated = await expertReviewService.simulateResponse(conversation.id);
    expect(simulated).not.toBeNull();
    expect(simulated!.status).toBe('completed');
    expect(simulated!.drAngelResponse).toContain('Dr. Angel');
    expect(simulated!.drAngelResponse).toContain('40 years');
  });
});
