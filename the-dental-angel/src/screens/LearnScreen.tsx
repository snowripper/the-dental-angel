import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LearnStackParamList } from '../types/navigation';

type LearnScreenProps = NativeStackScreenProps<LearnStackParamList, 'LearnMain'>;

/**
 * Learn Screen
 * Hub for all educational resources: Translator, Videos, Treatment Buddies
 * Designed as a warm, simple menu for patients who want to explore and learn
 */
export function LearnScreen({ navigation }: LearnScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>
            Explore dental topics at your own pace — no pressure, no jargon.
          </Text>
        </View>

        {/* Dental Translator */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Translate')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#F5F9FD' }]}>
            <Ionicons name="language" size={28} color={COLORS.primary500} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Dental Translator</Text>
            <Text style={styles.cardDescription}>
              Look up any dental term and see it explained in plain English
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.neutral400} />
        </TouchableOpacity>

        {/* Video Library */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Videos')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#FBEAEA' }]}>
            <Ionicons name="play-circle" size={28} color="#B84C4C" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Video Library</Text>
            <Text style={styles.cardDescription}>
              Watch short videos about common dental procedures
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.neutral400} />
        </TouchableOpacity>

        {/* Treatment Buddies */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Buddies')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#EEF7F0' }]}>
            <Ionicons name="people" size={28} color="#2E7D5B" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Treatment Buddies</Text>
            <Text style={styles.cardDescription}>
              Read stories from patients who've been through it
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.neutral400} />
        </TouchableOpacity>

        {/* Encouragement */}
        <View style={styles.encouragement}>
          <Ionicons name="heart-outline" size={20} color={COLORS.primary500} />
          <Text style={styles.encouragementText}>
            The more you understand, the more confident you'll feel at your next appointment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neutral800,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
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
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 22,
  },
  encouragement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary50,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    gap: 10,
  },
  encouragementText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.primary700,
    lineHeight: 22,
  },
});

export default LearnScreen;
