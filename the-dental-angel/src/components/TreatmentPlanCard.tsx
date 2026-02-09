import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SecondOpinionScore } from './SecondOpinionScore';
import { COLORS } from '../constants/theme';

export interface TreatmentItem {
  id: string;
  code: string; // e.g., "D2740"
  name: string; // e.g., "Crown"
  tooth?: string; // e.g., "Tooth #14"
  cost: number;
  score: number; // 0-100
  explanation?: string;
}

interface TreatmentPlanCardProps {
  treatment: TreatmentItem;
  onAskAbout?: (treatment: TreatmentItem) => void;
  onShare?: (treatment: TreatmentItem) => void;
  expanded?: boolean;
}

export function TreatmentPlanCard({
  treatment,
  onAskAbout,
  onShare,
  expanded = false,
}: TreatmentPlanCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cost);
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.code}>{treatment.code}</Text>
          <Text style={styles.name}>{treatment.name}</Text>
          {treatment.tooth && <Text style={styles.tooth}>{treatment.tooth}</Text>}
        </View>
        <Text style={styles.cost}>{formatCost(treatment.cost)}</Text>
      </View>

      {/* Explanation (if provided) */}
      {treatment.explanation && (
        <TouchableOpacity
          style={styles.explanationContainer}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.explanation} numberOfLines={isExpanded ? undefined : 2}>
            "{treatment.explanation}"
          </Text>
          {!isExpanded && treatment.explanation.length > 80 && (
            <Text style={styles.readMore}>Read more</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Score Section */}
      <View style={styles.scoreSection}>
        <SecondOpinionScore score={treatment.score} size="small" showLabel={false} />
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreInfoLabel}>How common is this?</Text>
          <Text style={styles.scoreInfoMessage}>
            {treatment.score >= 80
              ? 'Most dentists would recommend this'
              : treatment.score >= 60
                ? 'Many dentists would recommend this'
                : treatment.score >= 40
                  ? 'Worth discussing options with your dentist'
                  : 'Consider getting another opinion'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => onAskAbout?.(treatment)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={18} color={COLORS.white} />
          <Text style={styles.primaryActionText}>Ask About This</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryAction}
          onPress={() => onShare?.(treatment)}
          activeOpacity={0.8}
        >
          <Ionicons name="share-outline" size={18} color={COLORS.primary500} />
          <Text style={styles.secondaryActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  code: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral500,
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },
  tooth: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 2,
  },
  cost: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary500,
  },
  explanationContainer: {
    backgroundColor: COLORS.primary50,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  explanation: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.primary500,
    marginTop: 4,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral200,
    marginBottom: 12,
  },
  scoreInfo: {
    marginLeft: 12,
    flex: 1,
  },
  scoreInfoLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginBottom: 2,
  },
  scoreInfoMessage: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary500,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryActionText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary500,
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary500,
  },
});

export default TreatmentPlanCard;
