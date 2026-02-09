import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import type { SecondOpinionScore } from '../services/aiService';

interface SecondOpinionScoreCardProps {
  score: SecondOpinionScore;
  onUploadPhoto?: () => void;
  onShare?: () => void;
}

/**
 * Second Opinion Score Card
 * Displays a visual score rating for treatment plan analysis
 */
export function SecondOpinionScoreCard({
  score,
  onUploadPhoto,
  onShare,
}: SecondOpinionScoreCardProps) {
  // Determine color based on score
  const getScoreColor = (value: number) => {
    if (value >= 8) return { bg: COLORS.successLight, text: COLORS.success, bar: COLORS.success };
    if (value >= 6) return { bg: '#FEF3C7', text: '#D97706', bar: '#F59E0B' }; // Amber
    if (value >= 4) return { bg: '#FEE2E2', text: '#DC2626', bar: '#EF4444' }; // Red light
    return { bg: '#FEE2E2', text: '#DC2626', bar: '#DC2626' }; // Red
  };

  const colors = getScoreColor(score.score);

  const handleUploadPress = () => {
    if (onUploadPhoto) {
      onUploadPhoto();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.bar }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Second Opinion Score</Text>
        <View style={styles.headerRight}>
          {onShare && (
            <TouchableOpacity style={styles.shareIconButton} onPress={onShare}>
              <Ionicons name="share-outline" size={18} color={COLORS.familyPrimary} />
            </TouchableOpacity>
          )}
          <View style={[styles.scoreBadge, { backgroundColor: colors.bar }]}>
            <Text style={styles.scoreNumber}>{score.score}/10</Text>
          </View>
        </View>
      </View>

      {/* Score Bar */}
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View
            style={[styles.barFill, { width: `${score.score * 10}%`, backgroundColor: colors.bar }]}
          />
        </View>
      </View>

      {/* Label */}
      <Text style={[styles.label, { color: colors.text }]}>{score.label}</Text>

      {/* Reason */}
      <Text style={styles.reason}>{score.reason}</Text>

      {/* Photo Upload Prompt - Question about education for their specific case */}
      <View style={styles.uploadPromptContainer}>
        <Text style={styles.uploadQuestion}>Would you like education specific to YOUR case?</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
          <Ionicons name="camera" size={20} color={COLORS.white} />
          <Text style={styles.uploadButtonText}>Upload your X-ray or treatment plan</Text>
        </TouchableOpacity>
      </View>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        This is educational context, not medical advice. Always discuss with your dentist.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.familyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreNumber: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
  },
  barContainer: {
    marginBottom: 10,
  },
  barBackground: {
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 6,
  },
  reason: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    lineHeight: 20,
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    fontStyle: 'italic',
  },
  uploadPromptContainer: {
    marginTop: 12,
    marginBottom: 10,
  },
  uploadQuestion: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginBottom: 10,
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary500,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 10,
  },
  uploadButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
});
