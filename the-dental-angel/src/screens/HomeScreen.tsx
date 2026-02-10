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
 * One clear action: Talk to Dr. Angel
 * Simple, warm, zero hesitation
 */
export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={styles.homeHeader}>
        <Image source={DentalAngelImage} style={styles.dentalAngelImage} resizeMode="cover" />
        <Text style={styles.homeTitle}>The Dental Angel</Text>
        <Text style={styles.homeSubtitle}>I'm here to help you understand your dental care.</Text>
      </View>

      <View style={styles.homeActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles" size={24} color="white" />
          <Text style={styles.primaryButtonText}>Talk to Dr. Angel</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.historyLink} onPress={() => navigation.navigate('History')}>
        <Ionicons name="time-outline" size={18} color={COLORS.neutral500} />
        <Text style={styles.historyLinkText}>Your past conversations</Text>
      </TouchableOpacity>

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
    textAlign: 'center',
    lineHeight: 24,
  },
  homeActions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary500,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 56,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginTop: 12,
  },
  historyLinkText: {
    color: COLORS.neutral500,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
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
