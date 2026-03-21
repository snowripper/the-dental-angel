/**
 * Expert Review Service
 *
 * Manages the Expert Review ($149) flow:
 * 1. Patient submits their treatment plan for Dr. Angel's personal review
 * 2. Email notification sent to dentalangel@mail.com
 * 3. Dr. Angel reviews and responds via web form
 * 4. Patient sees the personal review in their chat
 *
 * Currently stores reviews locally (AsyncStorage).
 * Ready to plug into Supabase when cloud backend is configured.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendEmail, isEmailConfigured } from './emailService';

const STORAGE_KEY = 'dental_angel_expert_reviews';

export type ReviewStatus = 'pending' | 'in_review' | 'completed';

export interface ExpertReview {
  id: string;
  conversationId: string;
  status: ReviewStatus;
  /** What the patient wants reviewed */
  patientSummary: string;
  /** Key topics from the AI conversation */
  aiConversationSummary: string;
  /** Treatment plan image URI if uploaded */
  treatmentPlanImageUri?: string;
  /** Dr. Angel's personal educational response */
  drAngelResponse?: string;
  /** When the review was requested */
  requestedAt: number;
  /** When Dr. Angel completed the review */
  completedAt?: number;
  /** Patient email for notification (optional) */
  patientEmail?: string;
}

/** Email address for Dr. Angel review notifications */
const DR_ANGEL_EMAIL = 'dentalangel@mail.com';

/** Promise of review completion: 24 hours */
const REVIEW_PROMISE_HOURS = 24;

const generateId = () => {
  return 'er_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Build a summary of the AI conversation for Dr. Angel to review.
 * Pulls out the key details so he doesn't have to read the whole chat.
 */
function buildConversationSummary(messages: Array<{ role: string; content: string }>): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const lastAiMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  const topics = userMessages.map((m) => m.content).join('\n- ');
  const aiSummary = lastAiMessage
    ? lastAiMessage.content.substring(0, 500) + (lastAiMessage.content.length > 500 ? '...' : '')
    : 'No AI response yet.';

  return `PATIENT'S QUESTIONS:\n- ${topics}\n\nAI'S MOST RECENT RESPONSE:\n${aiSummary}`;
}

/**
 * Format a clean HTML email for Dr. Angel with all the review details.
 */
function formatEmailForDrAngel(review: ExpertReview): {
  to: string;
  subject: string;
  html: string;
} {
  const requestDate = new Date(review.requestedAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const deadlineDate = new Date(
    review.requestedAt + REVIEW_PROMISE_HOURS * 60 * 60 * 1000
  ).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const escapedSummary = review.patientSummary
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
  const escapedContext = review.aiConversationSummary
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D3142;">
  <div style="background: #F5F9FD; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #1E6BB8; margin: 0 0 4px 0; font-size: 22px;">New Expert Review Request</h1>
    <p style="color: #7B7F95; margin: 0; font-size: 14px;">Review #${review.id.slice(-6).toUpperCase()}</p>
  </div>

  <div style="background: #FFF5E6; border-left: 4px solid #C27624; padding: 12px 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
    <strong style="color: #C27624;">Please respond by:</strong>
    <span style="color: #2D3142;"> ${deadlineDate}</span>
  </div>

  <p style="color: #7B7F95; font-size: 14px; margin-bottom: 4px;">Requested on ${requestDate}</p>

  <h2 style="color: #2D3142; font-size: 18px; margin-top: 24px; border-bottom: 1px solid #E8EAF0; padding-bottom: 8px;">Patient's Situation</h2>
  <div style="background: #F8F9FB; border-radius: 8px; padding: 16px; line-height: 1.6;">${escapedSummary}</div>

  <h2 style="color: #2D3142; font-size: 18px; margin-top: 24px; border-bottom: 1px solid #E8EAF0; padding-bottom: 8px;">AI Conversation Context</h2>
  <div style="background: #F8F9FB; border-radius: 8px; padding: 16px; line-height: 1.6; font-size: 14px;">${escapedContext}</div>

  ${review.treatmentPlanImageUri ? '<p style="background: #EEF7F0; color: #2E7D5B; padding: 12px 16px; border-radius: 8px; margin-top: 16px;">📷 Patient uploaded a treatment plan image (available in the app).</p>' : ''}

  <div style="margin-top: 32px; padding-top: 16px; border-top: 2px solid #E8EAF0; text-align: center; color: #7B7F95; font-size: 13px;">
    <p>Reply to this email with your educational review, or use the review dashboard.</p>
    <p style="margin-top: 8px;">🦷 The Dental Angel</p>
  </div>
</body>
</html>`;

  return {
    to: DR_ANGEL_EMAIL,
    subject: `New Expert Review Request — #${review.id.slice(-6).toUpperCase()}`,
    html,
  };
}

// Local storage for expert reviews
const localStore = {
  async getAll(): Promise<ExpertReview[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as ExpertReview[];
    } catch (error) {
      console.error('Error loading expert reviews:', error);
      return [];
    }
  },

  async save(review: ExpertReview): Promise<void> {
    try {
      const reviews = await this.getAll();
      const existingIndex = reviews.findIndex((r) => r.id === review.id);
      if (existingIndex >= 0) {
        reviews[existingIndex] = review;
      } else {
        reviews.unshift(review);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Error saving expert review:', error);
    }
  },
};

export const expertReviewService = {
  /**
   * Request a new Expert Review from Dr. Angel.
   * Called when an Expert tier patient wants a personal review.
   */
  async requestReview(params: {
    conversationId: string;
    patientSummary: string;
    conversationMessages: Array<{ role: string; content: string }>;
    treatmentPlanImageUri?: string;
    patientEmail?: string;
  }): Promise<ExpertReview> {
    const review: ExpertReview = {
      id: generateId(),
      conversationId: params.conversationId,
      status: 'pending',
      patientSummary: params.patientSummary,
      aiConversationSummary: buildConversationSummary(params.conversationMessages),
      treatmentPlanImageUri: params.treatmentPlanImageUri,
      requestedAt: Date.now(),
      patientEmail: params.patientEmail,
    };

    await localStore.save(review);

    // Send notification email to Dr. Angel
    await this.sendNotification(review);

    return review;
  },

  /**
   * Send email notification to Dr. Angel about a new review request.
   * Uses Resend API when configured, falls back to console logging.
   */
  async sendNotification(review: ExpertReview): Promise<void> {
    const email = formatEmailForDrAngel(review);

    const sent = await sendEmail({
      to: email.to,
      subject: email.subject,
      html: email.html,
    });

    if (sent) {
      console.log(`[ExpertReview] Email sent to ${email.to} for review ${review.id}`);
    } else if (!isEmailConfigured()) {
      console.log('[ExpertReview] Email service not configured — review saved locally only');
    }

    // Mark as in_review once notification is processed
    review.status = 'in_review';
    await localStore.save(review);
  },

  /**
   * Submit Dr. Angel's response to a review.
   * Called from the response web page or admin interface.
   */
  async submitResponse(reviewId: string, response: string): Promise<ExpertReview | null> {
    const reviews = await localStore.getAll();
    const review = reviews.find((r) => r.id === reviewId);

    if (!review) return null;

    review.drAngelResponse = response;
    review.status = 'completed';
    review.completedAt = Date.now();

    await localStore.save(review);
    return review;
  },

  /**
   * Get all reviews for a specific conversation.
   */
  async getForConversation(conversationId: string): Promise<ExpertReview[]> {
    const reviews = await localStore.getAll();
    return reviews.filter((r) => r.conversationId === conversationId);
  },

  /**
   * Get a specific review by ID.
   */
  async getReview(reviewId: string): Promise<ExpertReview | null> {
    const reviews = await localStore.getAll();
    return reviews.find((r) => r.id === reviewId) || null;
  },

  /**
   * Get all pending reviews (for Dr. Angel's dashboard).
   */
  async getPendingReviews(): Promise<ExpertReview[]> {
    const reviews = await localStore.getAll();
    return reviews.filter((r) => r.status !== 'completed');
  },

  /**
   * Check if there's an active review for a conversation.
   */
  async hasActiveReview(conversationId: string): Promise<boolean> {
    const reviews = await this.getForConversation(conversationId);
    return reviews.some((r) => r.status !== 'completed');
  },

  /**
   * Check if a completed review exists that hasn't been seen yet.
   */
  async getCompletedReview(conversationId: string): Promise<ExpertReview | null> {
    const reviews = await this.getForConversation(conversationId);
    return reviews.find((r) => r.status === 'completed') || null;
  },

  /** The email address for Dr. Angel notifications */
  DR_ANGEL_EMAIL,

  /** How many hours patients are promised for a response */
  REVIEW_PROMISE_HOURS,

  /** For testing: simulate Dr. Angel completing a review */
  async simulateResponse(conversationId: string): Promise<ExpertReview | null> {
    const reviews = await this.getForConversation(conversationId);
    const pending = reviews.find((r) => r.status !== 'completed');

    if (!pending) return null;

    const demoResponse = `Thank you for sharing your treatment plan with me. I've looked over everything carefully, and here are my thoughts:

**Overall Assessment:**
The treatment plan your dentist has put together looks thorough and well-considered. These are all standard procedures that I performed regularly during my 40 years of practice.

**What stands out to me:**
Based on what you've described and what I can see, your dentist appears to be taking a conservative, appropriate approach. The recommended procedures align with what I would expect for your situation.

**A few things I'd want you to know:**
- Don't feel rushed into any decisions. A good treatment plan can usually wait a week or two while you think it over.
- The procedures listed are all very common — I probably performed thousands of each during my career.
- Ask your dentist to explain the urgency level for each item. Some things need attention soon, others can be scheduled over months.

**Questions I'd encourage you to ask at your next visit:**
1. "Which of these items is most time-sensitive?"
2. "Can we phase this work over several appointments?"
3. "Are there any alternatives for the most expensive items?"
4. "What happens if I delay any of these procedures?"

Remember — your dentist has examined you in person and knows things I can't see from here. This review is educational to help you have a better conversation with your dental team. You're doing the right thing by taking the time to understand your options.

I'm here if you have any other questions!

— Dr. Angel`;

    return this.submitResponse(pending.id, demoResponse);
  },
};
