/**
 * Expert Review Card
 *
 * Shows Dr. Angel's personal review in the chat.
 * Two states:
 * - Pending: "Dr. Angel is reviewing your treatment plan..."
 * - Completed: Shows Dr. Angel's personal response with a premium look
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, borderRadius, spacing, fontSize, shadows } from '../constants/theme';
import type { ExpertReview } from '../services/expertReviewService';

interface ExpertReviewCardProps {
  review: ExpertReview;
  onViewFull?: () => void;
}

export function ExpertReviewCard({ review, onViewFull }: ExpertReviewCardProps) {
  if (review.status === 'completed' && review.drAngelResponse) {
    return <CompletedReview review={review} onViewFull={onViewFull} />;
  }

  return <PendingReview review={review} />;
}

/**
 * Pending state — Dr. Angel hasn't responded yet
 */
function PendingReview({ review }: { review: ExpertReview }) {
  const hoursAgo = Math.floor((Date.now() - review.requestedAt) / (1000 * 60 * 60));
  const hoursRemaining = Math.max(0, 24 - hoursAgo);

  return (
    <View style={styles.pendingCard}>
      <View style={styles.pendingHeader}>
        <View style={styles.pendingIconContainer}>
          <Ionicons name="time-outline" size={24} color={COLORS.primary500} />
        </View>
        <View style={styles.pendingHeaderText}>
          <Text style={styles.pendingTitle}>Dr. Angel Is Reviewing Your Case</Text>
          <Text style={styles.pendingSubtitle}>Personal educational review</Text>
        </View>
      </View>

      <View style={styles.pendingBody}>
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, styles.timelineDotComplete]} />
          <Text style={styles.timelineText}>Your treatment plan was submitted</Text>
        </View>
        <View style={styles.timelineConnector} />
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, styles.timelineDotActive]} />
          <Text style={styles.timelineText}>Dr. Angel is reviewing your case</Text>
        </View>
        <View style={styles.timelineConnector} />
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <Text style={[styles.timelineText, styles.timelineTextPending]}>
            Personal review delivered
          </Text>
        </View>
      </View>

      <View style={styles.pendingFooter}>
        <Ionicons name="notifications-outline" size={16} color={COLORS.primary500} />
        <Text style={styles.pendingFooterText}>
          {hoursRemaining > 0
            ? `Expected within ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}`
            : 'Coming very soon'}
        </Text>
      </View>

      <Text style={styles.pendingNote}>
        You'll get a notification when Dr. Angel's review is ready. In the meantime, feel free to
        keep chatting with the AI!
      </Text>
    </View>
  );
}

/**
 * Completed state — Dr. Angel's personal review
 */
function CompletedReview({
  review,
  onViewFull,
}: {
  review: ExpertReview;
  onViewFull?: () => void;
}) {
  const completedDate = review.completedAt
    ? new Date(review.completedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Show first 400 chars in the card, full response when tapped
  const isLong = (review.drAngelResponse?.length || 0) > 400;
  const displayText = isLong
    ? review.drAngelResponse!.substring(0, 400) + '...'
    : review.drAngelResponse!;

  return (
    <View style={styles.completedCard}>
      <View style={styles.completedBadge}>
        <Ionicons name="star" size={14} color="#FFFFFF" />
        <Text style={styles.completedBadgeText}>Dr. Angel's Personal Review</Text>
      </View>

      <View style={styles.completedHeader}>
        <View style={styles.drAngelAvatar}>
          <Text style={styles.drAngelAvatarText}>🦷</Text>
        </View>
        <View style={styles.completedHeaderText}>
          <Text style={styles.completedName}>Dr. Angel</Text>
          <Text style={styles.completedDate}>{completedDate}</Text>
        </View>
      </View>

      <Text style={styles.completedBody}>{displayText}</Text>

      {isLong && onViewFull && (
        <TouchableOpacity style={styles.readMoreButton} onPress={onViewFull}>
          <Text style={styles.readMoreText}>Read Full Review</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary500} />
        </TouchableOpacity>
      )}

      <View style={styles.completedFooter}>
        <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.neutral500} />
        <Text style={styles.completedFooterText}>
          Educational review — always consult your own dentist for specific advice
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Pending state styles
  pendingCard: {
    backgroundColor: COLORS.primary50,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: COLORS.primary200,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.card,
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pendingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.soft,
  },
  pendingHeaderText: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: COLORS.neutral800,
  },
  pendingSubtitle: {
    fontSize: fontSize.small,
    color: COLORS.primary500,
    marginTop: 2,
  },
  pendingBody: {
    paddingLeft: spacing.sm,
    marginBottom: spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.neutral300,
    borderWidth: 2,
    borderColor: COLORS.neutral200,
  },
  timelineDotComplete: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.successLight,
  },
  timelineDotActive: {
    backgroundColor: COLORS.primary500,
    borderColor: COLORS.primary200,
  },
  timelineConnector: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.neutral200,
    marginLeft: 5,
  },
  timelineText: {
    fontSize: fontSize.small,
    color: COLORS.neutral700,
  },
  timelineTextPending: {
    color: COLORS.neutral400,
  },
  pendingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.white,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  pendingFooterText: {
    fontSize: fontSize.small,
    fontWeight: '500',
    color: COLORS.primary500,
  },
  pendingNote: {
    fontSize: fontSize.label,
    color: COLORS.neutral500,
    lineHeight: 20,
  },

  // Completed state styles
  completedCard: {
    backgroundColor: COLORS.white,
    borderRadius: borderRadius.card,
    borderWidth: 2,
    borderColor: '#A876D0', // Purple accent for premium feel
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.medium,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#7C4FBD', // Purple for premium (muted)
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  completedBadgeText: {
    fontSize: fontSize.label,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  drAngelAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: '#A876D0',
  },
  drAngelAvatarText: {
    fontSize: 24,
  },
  completedHeaderText: {
    flex: 1,
  },
  completedName: {
    fontSize: fontSize.bodyLg,
    fontWeight: '700',
    color: COLORS.neutral800,
  },
  completedDate: {
    fontSize: fontSize.label,
    color: COLORS.neutral500,
    marginTop: 2,
  },
  completedBody: {
    fontSize: fontSize.body,
    lineHeight: 26,
    color: COLORS.neutral700,
    marginBottom: spacing.md,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral200,
    marginBottom: spacing.md,
  },
  readMoreText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: COLORS.primary500,
  },
  completedFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral200,
  },
  completedFooterText: {
    fontSize: fontSize.label,
    color: COLORS.neutral500,
    lineHeight: 18,
    flex: 1,
  },
});
