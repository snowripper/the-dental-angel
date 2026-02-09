/**
 * Payment Service
 *
 * Manages access control and purchase flow for The Dental Angel.
 * Currently uses simulated purchases — ready to plug in Stripe/IAP
 * once the business entity and developer accounts are set up.
 *
 * Free users get 3 AI messages to try the app before the paywall appears.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { userSettingsService, PRICING_TIERS, type SubscriptionTier } from './userSettingsService';

const FREE_MESSAGE_LIMIT = 3;
const MESSAGE_COUNT_KEY = 'dental_angel_message_count';

export const paymentService = {
  /**
   * Check if the user can send another message.
   * Free users get 3 messages, paid users have unlimited access during their subscription.
   */
  async canSendMessage(): Promise<{ allowed: boolean; messagesUsed: number; limit: number }> {
    const settings = await userSettingsService.get();

    // Paid users with active subscription have unlimited access
    if (settings.subscriptionTier !== 'free') {
      const isActive = await userSettingsService.isSubscriptionActive();
      if (isActive) {
        return { allowed: true, messagesUsed: 0, limit: Infinity };
      }
      // Subscription expired — treat as free
    }

    // Free users get limited messages
    const count = await this.getMessageCount();
    return {
      allowed: count < FREE_MESSAGE_LIMIT,
      messagesUsed: count,
      limit: FREE_MESSAGE_LIMIT,
    };
  },

  /**
   * Check if the user can upload images for analysis.
   * Only paid tiers include treatment plan analysis.
   */
  async canUploadImage(): Promise<boolean> {
    const settings = await userSettingsService.get();
    if (settings.subscriptionTier === 'free') return false;
    return userSettingsService.isSubscriptionActive();
  },

  /**
   * Increment the message counter (for free users).
   */
  async incrementMessageCount(): Promise<number> {
    const current = await this.getMessageCount();
    const newCount = current + 1;
    await AsyncStorage.setItem(MESSAGE_COUNT_KEY, String(newCount));
    return newCount;
  },

  /**
   * Get the current message count.
   */
  async getMessageCount(): Promise<number> {
    const value = await AsyncStorage.getItem(MESSAGE_COUNT_KEY);
    return value ? parseInt(value, 10) : 0;
  },

  /**
   * Purchase a tier.
   *
   * TODO: Replace this with real Stripe/IAP integration
   * once the business entity and developer accounts are set up.
   *
   * For now, this simulates a purchase by activating the tier locally.
   * In production, the flow will be:
   * 1. User taps buy → Stripe checkout or App Store IAP
   * 2. Payment confirmed → webhook updates our backend
   * 3. App receives confirmation → activates tier
   */
  async purchaseTier(tier: SubscriptionTier): Promise<{ success: boolean; message: string }> {
    if (tier === 'free') {
      return { success: true, message: 'Free tier is always available!' };
    }

    const tierInfo = PRICING_TIERS[tier];
    if (!tierInfo || !('duration' in tierInfo)) {
      return { success: false, message: 'Invalid tier selected.' };
    }

    // Calculate expiry date
    const durationDays = tierInfo.duration;
    const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;

    // Activate the tier
    await userSettingsService.save({
      subscriptionTier: tier,
      subscriptionExpiresAt: expiresAt,
    });

    // Reset message count so they start fresh
    await AsyncStorage.setItem(MESSAGE_COUNT_KEY, '0');

    return {
      success: true,
      message: `${tierInfo.name} activated! You have ${durationDays} days of access.`,
    };
  },

  /**
   * Get info about what the user's current access includes.
   */
  async getAccessInfo(): Promise<{
    tier: SubscriptionTier;
    tierName: string;
    isActive: boolean;
    daysRemaining: number;
    features: string[];
  }> {
    const settings = await userSettingsService.get();
    const isActive = await userSettingsService.isSubscriptionActive();
    const daysRemaining = await userSettingsService.getDaysRemaining();
    const tierInfo = PRICING_TIERS[settings.subscriptionTier];

    return {
      tier: settings.subscriptionTier,
      tierName: tierInfo.name,
      isActive,
      daysRemaining,
      features: tierInfo.features,
    };
  },
};
