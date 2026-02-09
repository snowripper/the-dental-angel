import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  PROCEDURES,
  getBuddiesByProcedure,
  getBuddyCount,
  getAllProceduresWithBuddies,
  type Buddy,
  type ProcedureType,
  type ProcedureInfo,
} from '../constants/treatmentBuddies';
import { COLORS } from '../constants/theme';

export function BuddiesScreen() {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureType | null>(null);
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);

  const proceduresWithBuddies = getAllProceduresWithBuddies();

  const handleProcedureSelect = (procedure: ProcedureType) => {
    setSelectedProcedure(procedure);
  };

  const handleBack = () => {
    if (selectedBuddy) {
      setSelectedBuddy(null);
    } else {
      setSelectedProcedure(null);
    }
  };

  // Show buddy detail view
  if (selectedBuddy) {
    return <BuddyDetailView buddy={selectedBuddy} onClose={() => setSelectedBuddy(null)} />;
  }

  // Show buddies for selected procedure
  if (selectedProcedure) {
    const buddies = getBuddiesByProcedure(selectedProcedure);
    const procedureInfo = PROCEDURES.find((p) => p.id === selectedProcedure);

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.neutral700} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>{procedureInfo?.icon}</Text>
            <Text style={styles.headerTitle}>{procedureInfo?.name} Buddies</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionSubtitle}>
            Real stories from people who have been through it
          </Text>

          <View style={styles.buddyList}>
            {buddies.map((buddy) => (
              <BuddyCard key={buddy.id} buddy={buddy} onPress={() => setSelectedBuddy(buddy)} />
            ))}
          </View>

          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.neutral500} />
            <Text style={styles.disclaimerText}>
              These are shared experiences, not medical advice. Everyone's situation is different.
            </Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show procedure list
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>Treatment Buddies</Text>
          <Text style={styles.subtitle}>
            Connect with others who have had the same procedure. Read their stories, tips, and
            advice.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Choose a Procedure</Text>

        <View style={styles.procedureGrid}>
          {proceduresWithBuddies.map((procedure) => (
            <ProcedureCard
              key={procedure.id}
              procedure={procedure}
              buddyCount={getBuddyCount(procedure.id)}
              onPress={() => handleProcedureSelect(procedure.id)}
            />
          ))}
        </View>

        <View style={styles.comingSoon}>
          <Ionicons name="people-circle-outline" size={32} color={COLORS.primary500} />
          <Text style={styles.comingSoonTitle}>More Buddies Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            We are building a community of dental patients helping each other. Share your story to
            help others!
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ PROCEDURE CARD ============
interface ProcedureCardProps {
  procedure: ProcedureInfo;
  buddyCount: number;
  onPress: () => void;
}

function ProcedureCard({ procedure, buddyCount, onPress }: ProcedureCardProps) {
  return (
    <TouchableOpacity style={styles.procedureCard} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.procedureEmoji}>{procedure.icon}</Text>
      <Text style={styles.procedureName}>{procedure.name}</Text>
      <Text style={styles.procedureBuddyCount}>
        {buddyCount} {buddyCount === 1 ? 'story' : 'stories'}
      </Text>
    </TouchableOpacity>
  );
}

// ============ BUDDY CARD ============
interface BuddyCardProps {
  buddy: Buddy;
  onPress: () => void;
}

function BuddyCard({ buddy, onPress }: BuddyCardProps) {
  return (
    <TouchableOpacity style={styles.buddyCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.buddyHeader}>
        <Text style={styles.buddyAvatar}>{buddy.avatar}</Text>
        <View style={styles.buddyInfo}>
          <Text style={styles.buddyName}>{buddy.name}</Text>
          <Text style={styles.buddyMeta}>
            {buddy.age} · {buddy.location} · {buddy.procedureDate}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color={COLORS.warning} />
          <Text style={styles.ratingText}>{buddy.rating}/5</Text>
        </View>
      </View>
      <Text style={styles.buddyStoryPreview} numberOfLines={3}>
        "{buddy.story}"
      </Text>
      <View style={styles.buddyFooter}>
        <View style={styles.wouldDoAgain}>
          <Ionicons
            name={buddy.wouldDoAgain ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={buddy.wouldDoAgain ? COLORS.success : COLORS.neutral400}
          />
          <Text
            style={[
              styles.wouldDoAgainText,
              { color: buddy.wouldDoAgain ? COLORS.success : COLORS.neutral500 },
            ]}
          >
            {buddy.wouldDoAgain ? 'Would do it again' : 'Has reservations'}
          </Text>
        </View>
        <Text style={styles.readMore}>Read full story →</Text>
      </View>
    </TouchableOpacity>
  );
}

// ============ BUDDY DETAIL VIEW ============
interface BuddyDetailViewProps {
  buddy: Buddy;
  onClose: () => void;
}

function BuddyDetailView({ buddy, onClose }: BuddyDetailViewProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.neutral700} />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Buddy Story</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Buddy Profile */}
        <View style={styles.detailProfile}>
          <Text style={styles.detailAvatar}>{buddy.avatar}</Text>
          <Text style={styles.detailName}>{buddy.name}</Text>
          <Text style={styles.detailMeta}>
            {buddy.age} years old · {buddy.location}
          </Text>
          <View style={styles.detailBadges}>
            <View style={styles.detailBadge}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.primary600} />
              <Text style={styles.detailBadgeText}>{buddy.procedureDate}</Text>
            </View>
            <View style={styles.detailBadge}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.detailBadgeText}>{buddy.rating}/5 experience</Text>
            </View>
          </View>
        </View>

        {/* Story */}
        <View style={styles.storySection}>
          <Text style={styles.storySectionTitle}>My Story</Text>
          <Text style={styles.storyText}>"{buddy.story}"</Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsTitleRow}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.primary500} />
            <Text style={styles.storySectionTitle}>My Tips</Text>
          </View>
          {buddy.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipNumber}>{index + 1}</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Would Do Again */}
        <View
          style={[
            styles.wouldDoAgainCard,
            { backgroundColor: buddy.wouldDoAgain ? '#DCFCE7' : COLORS.neutral100 },
          ]}
        >
          <Ionicons
            name={buddy.wouldDoAgain ? 'checkmark-circle' : 'help-circle'}
            size={24}
            color={buddy.wouldDoAgain ? COLORS.success : COLORS.neutral500}
          />
          <View style={styles.wouldDoAgainContent}>
            <Text style={styles.wouldDoAgainTitle}>
              {buddy.wouldDoAgain ? 'Would do it again' : 'Mixed feelings'}
            </Text>
            <Text style={styles.wouldDoAgainSubtitle}>
              {buddy.wouldDoAgain
                ? 'This buddy recommends the procedure'
                : 'This buddy has some reservations'}
            </Text>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.neutral500} />
          <Text style={styles.disclaimerText}>
            This is one person's experience. Your results may vary. Always consult with your
            dentist.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  procedureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  procedureCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  procedureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  procedureName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    textAlign: 'center',
    marginBottom: 4,
  },
  procedureBuddyCount: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.primary500,
  },
  comingSoon: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 24,
    backgroundColor: COLORS.primary50,
    borderRadius: 16,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 12,
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 28,
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },

  // Buddy List
  buddyList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  buddyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  buddyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  buddyAvatar: {
    fontSize: 36,
    marginRight: 12,
  },
  buddyInfo: {
    flex: 1,
  },
  buddyName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },
  buddyMeta: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#92400E',
  },
  buddyStoryPreview: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  buddyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral100,
  },
  wouldDoAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wouldDoAgainText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  readMore: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary500,
  },

  // Detail View
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
    backgroundColor: COLORS.white,
  },
  detailHeaderTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },
  detailProfile: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  detailAvatar: {
    fontSize: 64,
    marginBottom: 12,
  },
  detailName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neutral800,
  },
  detailMeta: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 4,
  },
  detailBadges: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  detailBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.primary600,
  },
  storySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  storySectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 12,
  },
  storyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary500,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    overflow: 'hidden',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    lineHeight: 22,
  },
  wouldDoAgainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  wouldDoAgainContent: {
    flex: 1,
  },
  wouldDoAgainTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },
  wouldDoAgainSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    marginTop: 2,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 8,
    padding: 16,
    backgroundColor: COLORS.neutral100,
    borderRadius: 12,
    gap: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});

export default BuddiesScreen;
