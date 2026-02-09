import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export type ShareButtonVariant = 'primary' | 'secondary' | 'minimal' | 'icon-only';
export type ShareButtonSize = 'small' | 'medium' | 'large';

interface FamilyShareButtonProps {
  onPress: () => void;
  variant?: ShareButtonVariant;
  size?: ShareButtonSize;
  label?: string;
  disabled?: boolean;
  showSuccessAlert?: boolean;
}

export function FamilyShareButton({
  onPress,
  variant = 'secondary',
  size = 'medium',
  label = 'Share with Family',
  disabled = false,
  showSuccessAlert = false,
}: FamilyShareButtonProps) {
  const handlePress = async () => {
    // Haptic feedback when pressing share
    if (showSuccessAlert) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onPress();
  };

  // Icon sizes based on button size
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  // Render based on variant
  if (variant === 'icon-only') {
    return (
      <TouchableOpacity
        style={[
          styles.iconOnlyButton,
          size === 'small' && styles.iconOnlySmall,
          size === 'large' && styles.iconOnlyLarge,
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel="Share with family"
        accessibilityRole="button"
      >
        <Ionicons name="people" size={iconSize} color={COLORS.familyPrimary} />
      </TouchableOpacity>
    );
  }

  if (variant === 'minimal') {
    return (
      <TouchableOpacity
        style={[styles.minimalButton, disabled && styles.disabled]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        <Ionicons name="people-outline" size={iconSize} color={COLORS.familyPrimary} />
        <Text style={[styles.minimalText, size === 'small' && styles.textSmall]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[
          styles.primaryButton,
          size === 'small' && styles.buttonSmall,
          size === 'large' && styles.buttonLarge,
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        <Ionicons name="people" size={iconSize} color={COLORS.white} />
        <Text
          style={[
            styles.primaryText,
            size === 'small' && styles.textSmall,
            size === 'large' && styles.textLarge,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  // Default: secondary variant
  return (
    <TouchableOpacity
      style={[
        styles.secondaryButton,
        size === 'small' && styles.buttonSmall,
        size === 'large' && styles.buttonLarge,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Ionicons name="people-outline" size={iconSize} color={COLORS.familyPrimary} />
      <Text
        style={[
          styles.secondaryText,
          size === 'small' && styles.textSmall,
          size === 'large' && styles.textLarge,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * A compact share row that can be placed at the bottom of cards
 */
export function FamilyShareRow({
  onShare,
  hint = 'Help a loved one understand too',
}: {
  onShare: () => void;
  hint?: string;
}) {
  return (
    <View style={styles.shareRow}>
      <View style={styles.shareRowLeft}>
        <Ionicons name="heart-outline" size={16} color={COLORS.familyPrimary} />
        <Text style={styles.shareRowHint}>{hint}</Text>
      </View>
      <TouchableOpacity style={styles.shareRowButton} onPress={onShare}>
        <Ionicons name="share-outline" size={18} color={COLORS.familyPrimary} />
        <Text style={styles.shareRowButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * A prominent share card for conversation summaries
 */
export function FamilyShareCard({
  onShare,
  title = 'Share with Your Family',
  subtitle = 'Help loved ones understand your dental care',
}: {
  onShare: () => void;
  title?: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.shareCard}>
      <View style={styles.shareCardIcon}>
        <Ionicons name="people" size={28} color={COLORS.familyPrimary} />
      </View>
      <View style={styles.shareCardContent}>
        <Text style={styles.shareCardTitle}>{title}</Text>
        <Text style={styles.shareCardSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.shareCardButton} onPress={onShare}>
        <Ionicons name="share-outline" size={20} color={COLORS.white} />
        <Text style={styles.shareCardButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Primary button (solid purple)
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.familyPrimary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.familyPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },

  // Secondary button (outlined)
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.familyLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.familyPrimary,
  },
  secondaryText: {
    color: COLORS.familyPrimary,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },

  // Minimal button (text only with icon)
  minimalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  minimalText: {
    color: COLORS.familyPrimary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Icon only button
  iconOnlyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.familyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOnlySmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconOnlyLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  // Size variants
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 17,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },

  // Share Row (compact)
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    marginTop: 12,
  },
  shareRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  shareRowHint: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    flex: 1,
  },
  shareRowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.familyLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    gap: 6,
  },
  shareRowButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.familyPrimary,
  },

  // Share Card (prominent)
  shareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.familyLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.familyPrimary,
    gap: 12,
  },
  shareCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareCardContent: {
    flex: 1,
  },
  shareCardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral600,
    marginBottom: 2,
  },
  shareCardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
  },
  shareCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.familyPrimary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  shareCardButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
});

export default FamilyShareButton;
