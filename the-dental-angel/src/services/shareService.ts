import { Share } from 'react-native';

// Types for shareable content
export interface ShareableConversation {
  title: string;
  summary: string;
  keyPoints: string[];
  questionsToAsk?: string[];
}

export interface ShareableTreatment {
  name: string;
  explanation: string;
  cost?: number;
  questionsToAsk?: string[];
}

export interface ShareResult {
  success: boolean;
  method?: string;
  error?: string;
}

// App download link
// TODO: Update this URL before app store launch!
// For now, we'll use a placeholder that gracefully handles missing pages
const UNIVERSAL_LINK = 'https://thedentalangel.com/app';

/**
 * ShareService - Handles all sharing functionality for Family Circle
 */
export const shareService = {
  /**
   * Get the appropriate download link based on platform
   */
  getDownloadLink(): string {
    // For sharing, use universal link that redirects appropriately
    return UNIVERSAL_LINK;
  },

  /**
   * Format a dental explanation for sharing
   */
  formatExplanation(content: string, topic?: string): string {
    const header = topic ? `Dental Info: ${topic}` : 'Dental Information';

    return `${header}

${content}

---
Shared from The Dental Angel
Your trusted guide to understanding dental care
${this.getDownloadLink()}`;
  },

  /**
   * Format questions to ask for sharing
   */
  formatQuestions(questions: string[], topic?: string): string {
    const header = topic ? `Questions to Ask About ${topic}` : 'Questions to Ask Your Dentist';

    const numberedQuestions = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');

    return `${header}

${numberedQuestions}

---
Bring these questions to your next dental appointment!

Shared from The Dental Angel
${this.getDownloadLink()}`;
  },

  /**
   * Format a conversation summary for sharing
   */
  formatConversationSummary(conversation: ShareableConversation): string {
    let content = `${conversation.title}

${conversation.summary}`;

    if (conversation.keyPoints.length > 0) {
      content += '\n\nKey Points:';
      conversation.keyPoints.forEach((point, i) => {
        content += `\n${i + 1}. ${point}`;
      });
    }

    if (conversation.questionsToAsk && conversation.questionsToAsk.length > 0) {
      content += '\n\nQuestions to Ask Your Dentist:';
      conversation.questionsToAsk.forEach((q, i) => {
        content += `\n${i + 1}. ${q}`;
      });
    }

    content += `

---
Shared from The Dental Angel
Understanding dental care together
${this.getDownloadLink()}`;

    return content;
  },

  /**
   * Format a treatment plan item for sharing
   */
  formatTreatment(treatment: ShareableTreatment): string {
    let content = `Treatment: ${treatment.name}

${treatment.explanation}`;

    if (treatment.cost) {
      content += `\n\nEstimated Cost: $${treatment.cost.toLocaleString()}`;
    }

    if (treatment.questionsToAsk && treatment.questionsToAsk.length > 0) {
      content += '\n\nQuestions to Ask:';
      treatment.questionsToAsk.forEach((q, i) => {
        content += `\n${i + 1}. ${q}`;
      });
    }

    content += `

---
Shared from The Dental Angel
${this.getDownloadLink()}`;

    return content;
  },

  /**
   * Format a Second Opinion Score for sharing
   */
  formatSecondOpinionScore(
    score: number,
    label: string,
    reason: string,
    procedureName?: string
  ): string {
    const header = procedureName
      ? `Second Opinion Score for ${procedureName}`
      : 'Second Opinion Score';

    return `${header}

Score: ${score}/10 - ${label}

${reason}

---
This is educational information, not medical advice.
Always discuss treatment decisions with your dentist.

Shared from The Dental Angel
${this.getDownloadLink()}`;
  },

  /**
   * Share content using the native share sheet
   */
  async share(content: string, title?: string): Promise<ShareResult> {
    try {
      const result = await Share.share(
        {
          message: content,
          title: title || 'From The Dental Angel',
        },
        {
          dialogTitle: 'Share with Family',
          subject: title || 'Dental Information from The Dental Angel',
        }
      );

      if (result.action === Share.sharedAction) {
        return {
          success: true,
          method: result.activityType || 'unknown',
        };
      } else if (result.action === Share.dismissedAction) {
        return {
          success: false,
          error: 'Share cancelled',
        };
      }

      return { success: false, error: 'Unknown result' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Share failed',
      };
    }
  },

  /**
   * Share an explanation with family
   */
  async shareExplanation(content: string, topic?: string): Promise<ShareResult> {
    const formatted = this.formatExplanation(content, topic);
    return this.share(formatted, topic ? `About ${topic}` : 'Dental Information');
  },

  /**
   * Share questions to ask
   */
  async shareQuestions(questions: string[], topic?: string): Promise<ShareResult> {
    const formatted = this.formatQuestions(questions, topic);
    return this.share(formatted, 'Questions for the Dentist');
  },

  /**
   * Share a conversation summary
   */
  async shareConversation(conversation: ShareableConversation): Promise<ShareResult> {
    const formatted = this.formatConversationSummary(conversation);
    return this.share(formatted, conversation.title);
  },

  /**
   * Share a treatment plan item
   */
  async shareTreatment(treatment: ShareableTreatment): Promise<ShareResult> {
    const formatted = this.formatTreatment(treatment);
    return this.share(formatted, `About ${treatment.name}`);
  },

  /**
   * Share a Second Opinion Score
   */
  async shareScore(
    score: number,
    label: string,
    reason: string,
    procedureName?: string
  ): Promise<ShareResult> {
    const formatted = this.formatSecondOpinionScore(score, label, reason, procedureName);
    return this.share(formatted, 'Second Opinion Score');
  },
};

export default shareService;
