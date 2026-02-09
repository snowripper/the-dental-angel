import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import type { WelcomeScreenProps } from '../types/navigation';

const DentalAngelImage = require('../../assets/dental-angel.jpg');

/**
 * Welcome Screen
 * First screen users see when opening the app
 * Introduces The Dental Angel and its features
 */
export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.welcomeContainer}>
      <Image source={DentalAngelImage} style={styles.welcomeImage} resizeMode="cover" />
      <Text style={styles.welcomeTitle}>The Dental Angel</Text>
      <Text style={styles.welcomeSubtitle}>Understand before you decide</Text>
      <Text style={styles.welcomeCredential}>Powered by 40 years of real dental experience</Text>

      <View style={styles.featuresBox}>
        <Text style={styles.featureItem}>💬 Get clear explanations of any dental procedure</Text>
        <Text style={styles.featureItem}>📷 Upload your treatment plan for a breakdown</Text>
        <Text style={styles.featureItem}>❓ Get the right questions to ask your dentist</Text>
        <Text style={styles.featureItem}>🛡️ Know what to watch out for</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={async () => {
          await AsyncStorage.setItem('dental_angel_onboarded', 'true');
          navigation.replace('MainTabs');
        }}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Trust indicators */}
      <View style={styles.trustIndicators}>
        <Text style={styles.trustItem}>🔒 Your conversations are private</Text>
        <Text style={styles.trustItem}>📱 No account required</Text>
        <Text style={styles.trustItem}>🌍 Works in any language</Text>
      </View>

      <Text style={styles.disclaimer}>
        "I'm going to treat you the way I'd want to be treated — like family."
        {'\n'}— Dr. Angel
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  welcomeImage: {
    width: 180,
    height: 240,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: COLORS.primary200,
    backgroundColor: COLORS.neutral200,
  },
  welcomeTitle: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary700,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeCredential: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.primary500,
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    width: '100%',
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
  featureItem: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    marginBottom: 12,
    lineHeight: 24,
  },
  trustIndicators: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  trustItem: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginBottom: 6,
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
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
    lineHeight: 20,
  },
});
