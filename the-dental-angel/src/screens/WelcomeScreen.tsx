import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme';

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary.lightest} />

      {/* Hero Section with Dental Angel */}
      <View style={styles.heroSection}>
        {/* Dental Angel Figure */}
        <View style={styles.angelFigureContainer}>
          {/* Golden Halo */}
          <View style={styles.halo} />
          {/* Dentist Figure */}
          <View style={styles.dentistContainer}>
            {/* Head */}
            <View style={styles.dentistHead}>
              <Text style={styles.dentistFace}>😊</Text>
            </View>
            {/* Body with dental coat */}
            <View style={styles.dentistBody}>
              <Ionicons name="medical" size={20} color={colors.primary.main} />
            </View>
            {/* Dental tool */}
            <View style={styles.dentalTool}>
              <Text style={styles.toolEmoji}>🦷</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>The Dental Angel</Text>
        <Text style={styles.tagline}>Your friendly guide to understanding dental care</Text>
      </View>

      {/* Value Proposition */}
      <View style={styles.valueSection}>
        <View style={styles.valueItem}>
          <View style={styles.valueIcon}>
            <Ionicons name="chatbubbles" size={24} color={colors.primary.main} />
          </View>
          <View style={styles.valueText}>
            <Text style={styles.valueTitle}>Ask Anything</Text>
            <Text style={styles.valueDescription}>
              Get clear explanations about dental procedures
            </Text>
          </View>
        </View>

        <View style={styles.valueItem}>
          <View style={styles.valueIcon}>
            <Ionicons name="camera" size={24} color={colors.primary.main} />
          </View>
          <View style={styles.valueText}>
            <Text style={styles.valueTitle}>Upload X-Rays & Photos</Text>
            <Text style={styles.valueDescription}>
              Share your x-rays, photos, or treatment plans
            </Text>
          </View>
        </View>

        <View style={styles.valueItem}>
          <View style={styles.valueIcon}>
            <Ionicons name="help-circle" size={24} color={colors.primary.main} />
          </View>
          <View style={styles.valueText}>
            <Text style={styles.valueTitle}>Questions to Ask</Text>
            <Text style={styles.valueDescription}>
              Know exactly what to discuss with your dentist
            </Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Home')}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.neutral.white} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={14} color={colors.neutral.darkGray} />
        <Text style={styles.footerText}>For educational purposes only</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightest,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  angelFigureContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  halo: {
    width: 70,
    height: 24,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#FFD700',
    backgroundColor: 'transparent',
    marginBottom: -12,
    zIndex: 1,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  dentistContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  dentistHead: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.angel.glow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary.light,
    zIndex: 2,
  },
  dentistFace: {
    fontSize: 32,
  },
  dentistBody: {
    width: 70,
    height: 50,
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginTop: -10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary.light,
    ...shadows.soft,
  },
  dentalTool: {
    position: 'absolute',
    bottom: 5,
    right: -15,
    backgroundColor: colors.neutral.white,
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary.light,
    ...shadows.soft,
  },
  toolEmoji: {
    fontSize: 18,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.primary.darkest,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  valueSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.angel.glow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  valueText: {
    flex: 1,
  },
  valueTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary.darkest,
    marginBottom: 2,
  },
  valueDescription: {
    fontSize: fontSize.sm,
    color: colors.neutral.darkGray,
  },
  actionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.medium,
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: 'auto',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: fontSize.xs,
    color: colors.neutral.darkGray,
  },
});
