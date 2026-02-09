import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import type { HomeScreenProps } from '../types/navigation';

const DentalAngelImage = require('../../assets/dental-angel.jpg');

/**
 * Home Screen
 * Main entry point after welcome screen
 * Shows chat, upload, and history options
 */
export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={styles.homeHeader}>
        <Image source={DentalAngelImage} style={styles.dentalAngelImage} resizeMode="cover" />
        <Text style={styles.homeTitle}>The Dental Angel</Text>
        <Text style={styles.homeSubtitle}>How can I help you today?</Text>
      </View>

      <View style={styles.homeActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles" size={24} color="white" />
          <Text style={styles.primaryButtonText}>Ask a Question</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={24} color={COLORS.primary500} />
          <Text style={styles.secondaryButtonText}>Upload X-Ray or Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time" size={24} color={COLORS.neutral500} />
          <Text style={styles.historyButtonText}>Your Conversations</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        For educational purposes only. Always consult your own dentist.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
    padding: 24,
  },
  homeHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  dentalAngelImage: {
    width: 120,
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.primary200,
    backgroundColor: COLORS.neutral200,
  },
  homeTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary700,
    marginBottom: 8,
    marginTop: 8,
  },
  homeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
  },
  homeActions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary500,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
    minHeight: 48,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary500,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary500,
    minHeight: 48,
  },
  secondaryButtonText: {
    color: COLORS.primary500,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  historyButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    minHeight: 48,
  },
  historyButtonText: {
    color: COLORS.neutral500,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
});
