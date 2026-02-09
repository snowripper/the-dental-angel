/**
 * Expert Review Banner
 *
 * A banner shown at the top of chat for Expert tier users.
 * Lets them request Dr. Angel's personal review with one tap.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, borderRadius, spacing, fontSize, shadows } from '../constants/theme';

interface ExpertReviewBannerProps {
  /** Whether a review has already been requested for this conversation */
  hasActiveReview: boolean;
  /** Called when the user taps to request a review */
  onRequestReview: () => void;
}

export function ExpertReviewBanner({ hasActiveReview, onRequestReview }: ExpertReviewBannerProps) {
  if (hasActiveReview) {
    return (
      <View style={styles.bannerActive}>
        <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
        <Text style={styles.bannerActiveText}>Dr. Angel's personal review has been requested</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.banner} onPress={onRequestReview} activeOpacity={0.8}>
      <View style={styles.bannerLeft}>
        <View style={styles.starBadge}>
          <Ionicons name="star" size={16} color="#FFFFFF" />
        </View>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Expert Review Available</Text>
          <Text style={styles.bannerSubtitle}>Get Dr. Angel's personal review within 24 hours</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.primary500} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF', // Light purple
    borderWidth: 1,
    borderColor: '#DDD6FE', // Purple border
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    ...shadows.soft,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  starBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B5CF6', // Purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: fontSize.small,
    fontWeight: '600',
    color: COLORS.neutral800,
  },
  bannerSubtitle: {
    fontSize: fontSize.label,
    color: COLORS.neutral500,
    marginTop: 2,
  },
  bannerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.successLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  bannerActiveText: {
    fontSize: fontSize.label,
    fontWeight: '500',
    color: COLORS.neutral700,
  },
});
