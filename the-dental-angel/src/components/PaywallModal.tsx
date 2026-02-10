/**
 * Paywall Modal
 *
 * Shown when free users have used their trial messages
 * and need to upgrade to continue chatting with Dr. Angel.
 *
 * Designed to be warm and encouraging — not pushy or salesy.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { PRICING_TIERS, type SubscriptionTier } from '../services/userSettingsService';
import { paymentService } from '../services/paymentService';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
  context?: 'chat' | 'upload'; // Where the paywall was triggered
}

export function PaywallModal({
  visible,
  onClose,
  onPurchaseComplete,
  context = 'chat',
}: PaywallModalProps) {
  const [purchasing, setPurchasing] = useState<SubscriptionTier | null>(null);

  const handlePurchase = async (tier: SubscriptionTier) => {
    setPurchasing(tier);
    const result = await paymentService.purchaseTier(tier);
    setPurchasing(null);

    if (result.success) {
      Alert.alert('Welcome!', result.message, [{ text: "Let's Go!", onPress: onPurchaseComplete }]);
    } else {
      Alert.alert('Oops', result.message);
    }
  };

  const contextMessage =
    context === 'upload'
      ? 'Dr. Angel can break down your treatment plan in plain English. Pick the option that fits your situation.'
      : 'Dr. Angel is ready to keep helping you understand your dental care. Pick the option that fits your situation.';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.neutral600} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Personal touch */}
          <View style={styles.heroSection}>
            <Text style={styles.heroEmoji}>🦷</Text>
            <Text style={styles.heroTitle}>Ready for the Full Experience?</Text>
            <Text style={styles.heroSubtitle}>{contextMessage}</Text>
            <Text style={styles.heroNote}>One-time payment — no subscriptions, no surprises.</Text>
          </View>

          {/* Quick Answers — $29 */}
          <View style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{PRICING_TIERS.quick_answers.name}</Text>
              <Text style={styles.tierPrice}>${PRICING_TIERS.quick_answers.price}</Text>
            </View>
            <Text style={styles.tierDuration}>
              {PRICING_TIERS.quick_answers.duration} days of access
            </Text>
            <Text style={styles.tierSolves}>"What does my treatment plan mean?"</Text>
            {PRICING_TIERS.quick_answers.features.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handlePurchase('quick_answers')}
              disabled={purchasing !== null}
            >
              {purchasing === 'quick_answers' ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buyButtonText}>
                  Get Quick Answers — ${PRICING_TIERS.quick_answers.price}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Full Prep — $49 (Recommended) */}
          <View style={[styles.tierCard, styles.tierCardRecommended]}>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>WHAT MOST PATIENTS CHOOSE</Text>
            </View>
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{PRICING_TIERS.full_prep.name}</Text>
              <Text style={styles.tierPrice}>${PRICING_TIERS.full_prep.price}</Text>
            </View>
            <Text style={styles.tierDuration}>
              {PRICING_TIERS.full_prep.duration} days of access
            </Text>
            <Text style={styles.tierSolves}>"I want to walk in fully prepared and confident"</Text>
            {PRICING_TIERS.full_prep.features.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.buyButton, styles.buyButtonRecommended]}
              onPress={() => handlePurchase('full_prep')}
              disabled={purchasing !== null}
            >
              {purchasing === 'full_prep' ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buyButtonText}>
                  Get Full Prep — ${PRICING_TIERS.full_prep.price}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Expert Review — $149 */}
          <View style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{PRICING_TIERS.expert.name}</Text>
              <Text style={styles.tierPrice}>${PRICING_TIERS.expert.price}</Text>
            </View>
            <Text style={styles.tierDuration}>{PRICING_TIERS.expert.duration} days of access</Text>
            <Text style={styles.tierSolves}>"I want an experienced dentist's perspective"</Text>
            {PRICING_TIERS.expert.features.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handlePurchase('expert')}
              disabled={purchasing !== null}
            >
              {purchasing === 'expert' ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buyButtonText}>
                  Get Expert Review — ${PRICING_TIERS.expert.price}
                </Text>
              )}
            </TouchableOpacity>
            <Text style={styles.expertNote}>
              Dr. Angel personally reviews your case with 40 years of expertise
            </Text>
          </View>

          {/* Trust & Value Messaging */}
          <View style={styles.trustSection}>
            <Text style={styles.trustTitle}>Why patients choose us</Text>
            <View style={styles.trustRow}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.primary500} />
              <Text style={styles.trustText}>One-time payment — no recurring charges</Text>
            </View>
            <View style={styles.trustRow}>
              <Ionicons name="school" size={20} color={COLORS.primary500} />
              <Text style={styles.trustText}>40 years of real dental experience</Text>
            </View>
            <View style={styles.trustRow}>
              <Ionicons name="lock-closed" size={20} color={COLORS.primary500} />
              <Text style={styles.trustText}>Your information stays private</Text>
            </View>
          </View>

          <Text style={styles.disclaimer}>
            All content is educational only. Always discuss treatment decisions with your own
            dentist.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
  },
  closeButton: {
    padding: 12,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary700,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  heroNote: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.primary500,
    textAlign: 'center',
  },
  tierCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tierCardRecommended: {
    borderWidth: 2,
    borderColor: COLORS.primary500,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -90,
    backgroundColor: COLORS.primary500,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierName: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },
  tierPrice: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary500,
  },
  tierDuration: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginBottom: 8,
  },
  tierSolves: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    color: COLORS.neutral600,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    lineHeight: 20,
  },
  buyButton: {
    backgroundColor: COLORS.primary500,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 52,
    justifyContent: 'center',
  },
  buyButtonRecommended: {
    backgroundColor: COLORS.primary600,
  },
  buyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  expertNote: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  trustSection: {
    backgroundColor: COLORS.primary50,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  trustTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary700,
    marginBottom: 12,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  trustText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    lineHeight: 20,
  },
});
