import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const handleInfoPress = () => {
    Alert.alert(
      'About The Dental Angel',
      'Your friendly guide to understanding dental care.\n\nFor educational purposes only. Always consult with your own dentist for personalized care.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary.lightest} />

      {/* Top Bar Buttons */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarButton}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time-outline" size={28} color={colors.primary.main} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBarButton} onPress={handleInfoPress}>
          <Ionicons name="information-circle-outline" size={28} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Header with Dental Angel Figure */}
      <View style={styles.header}>
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
            {/* Dental mirror in hand */}
            <View style={styles.dentalTool}>
              <Text style={styles.toolEmoji}>🦷</Text>
            </View>
          </View>
        </View>
        <Text style={styles.title}>The Dental Angel</Text>
        <Text style={styles.subtitle}>Your friendly guide to understanding dental care</Text>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Hi there!</Text>
        <Text style={styles.welcomeText}>
          Got a treatment plan you're not sure about? I'm here to help you understand what's being
          recommended and give you great questions to ask your dentist.
        </Text>
        <Text style={styles.welcomeNote}>
          Think of me as an angel sitting on your shoulder, whispering the dental information you
          need to help you understand and make an informed decision.
        </Text>
      </View>

      {/* Main Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles" size={24} color={colors.neutral.white} />
          <Text style={styles.primaryButtonText}>Ask a Question</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={24} color={colors.primary.dark} />
          <Text style={styles.secondaryButtonText}>Upload X-Ray, Photos, or Treatment Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Educational Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Ionicons name="information-circle-outline" size={16} color={colors.neutral.darkGray} />
        <Text style={styles.disclaimerText}>
          For educational purposes only. Always consult with your own dentist for personalized care.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightest,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  topBarButton: {
    padding: spacing.xs,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.sm,
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
  subtitle: {
    fontSize: fontSize.md,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  welcomeCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.soft,
  },
  welcomeTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.primary.darkest,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    fontSize: fontSize.md,
    color: colors.neutral.charcoal,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  welcomeNote: {
    fontSize: fontSize.sm,
    color: colors.primary.dark,
    fontStyle: 'italic',
  },
  actionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
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
  secondaryButton: {
    backgroundColor: colors.neutral.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.light,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.primary.dark,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    marginTop: 'auto',
    gap: spacing.xs,
  },
  disclaimerText: {
    fontSize: fontSize.xs,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    flex: 1,
  },
});
