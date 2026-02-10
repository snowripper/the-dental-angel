import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TreatmentPlanCard, TreatmentItem } from '../components/TreatmentPlanCard';
import { SecondOpinionScore } from '../components/SecondOpinionScore';
import { shareService } from '../services/shareService';
import { getAllTreatmentPlans } from '../services/treatmentPlanService';
import { COLORS } from '../constants/theme';
import type { PlansScreenProps } from '../types/navigation';

export function PlansScreen({ navigation }: PlansScreenProps) {
  const [userTreatments, setUserTreatments] = React.useState<TreatmentItem[]>([]);

  // Reload saved plans every time this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      getAllTreatmentPlans().then((plans) => {
        // Combine all treatments from all saved plans
        const allTreatments = plans.flatMap((plan) => plan.treatments);
        setUserTreatments(allTreatments);
      });
    }, [])
  );

  // Only show real treatments — no sample data
  const treatments = userTreatments;
  const isShowingExamples = false;

  // Calculate totals
  const totalCost = treatments.reduce((sum, t) => sum + t.cost, 0);
  const averageScore = Math.round(
    treatments.reduce((sum, t) => sum + t.score, 0) / treatments.length
  );

  const handleAskAbout = (treatment: TreatmentItem) => {
    // Navigate to chat with pre-filled question about this treatment
    navigation.navigate('Home', {
      screen: 'Chat',
      params: {
        initialMessage: `Can you explain more about the ${treatment.name} (${treatment.code}) that's been recommended for me?`,
      },
    });
  };

  const handleShare = async (treatment: TreatmentItem) => {
    await shareService.shareTreatment({
      name: treatment.name,
      explanation: treatment.explanation || `A dental procedure: ${treatment.name}`,
      cost: treatment.cost,
    });
  };

  const handleShareAll = async () => {
    const treatmentsList = treatments
      .map((t) => `- ${t.name}: $${t.cost.toLocaleString()}`)
      .join('\n');

    const overallLabel =
      averageScore >= 80
        ? 'Very common procedures'
        : averageScore >= 60
          ? 'Commonly recommended'
          : averageScore >= 40
            ? 'Worth discussing with your dentist'
            : 'Consider another opinion';

    const content = `My Dental Treatment Plan

Total Estimate: $${totalCost.toLocaleString()}
Overall: ${overallLabel}

Procedures:
${treatmentsList}

---
I'm using The Dental Angel to understand my dental care.
${shareService.getDownloadLink()}`;

    await shareService.share(content, 'My Treatment Plan');
  };

  const handleUploadPlan = () => {
    // Navigate to Camera screen in Home stack
    navigation.navigate('Home', { screen: 'Camera' });
  };

  // Empty state when no treatments
  if (treatments.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-text-outline" size={60} color={COLORS.primary500} />
          </View>
          <Text style={styles.emptyTitle}>Nothing here yet — and that's fine!</Text>
          <Text style={styles.emptySubtitle}>
            Got a treatment plan from your dentist? Take a photo and I'll break down every item in
            plain English — so you know exactly what's being recommended and why.
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPlan}>
            <Ionicons name="camera" size={24} color={COLORS.white} />
            <Text style={styles.uploadButtonText}>Upload Treatment Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Upload YOUR Plan CTA - Always show at top */}
        <TouchableOpacity style={styles.uploadCTA} onPress={handleUploadPlan}>
          <View style={styles.uploadCTAIcon}>
            <Ionicons name="camera" size={28} color={COLORS.white} />
          </View>
          <View style={styles.uploadCTAContent}>
            <Text style={styles.uploadCTATitle}>Upload YOUR Treatment Plan</Text>
            <Text style={styles.uploadCTASubtitle}>
              Snap a photo and I'll explain every item in plain English
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={32} color={COLORS.white} />
        </TouchableOpacity>

        {/* Example Banner - Only show when viewing examples */}
        {isShowingExamples && (
          <View style={styles.exampleBanner}>
            <Ionicons name="information-circle" size={20} color="#C27624" />
            <Text style={styles.exampleBannerText}>
              This is a <Text style={styles.exampleBannerBold}>sample treatment plan</Text> so you
              can see how I break things down. Upload your own plan above and I'll explain every
              item on it!
            </Text>
          </View>
        )}

        {/* Summary Header */}
        <View style={[styles.summaryCard, isShowingExamples && styles.exampleCard]}>
          {isShowingExamples && (
            <View style={styles.exampleTag}>
              <Text style={styles.exampleTagText}>EXAMPLE</Text>
            </View>
          )}
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Total Estimate</Text>
              <Text style={styles.summaryTotal}>${totalCost.toLocaleString()}</Text>
              <Text style={styles.summaryCount}>
                {treatments.length} {treatments.length === 1 ? 'procedure' : 'procedures'}{' '}
                recommended
              </Text>
            </View>
            <SecondOpinionScore score={averageScore} size="small" showLabel={false} />
          </View>
          <View style={styles.overallScoreRow}>
            <Text style={styles.overallScoreLabel}>Overall:</Text>
            <Text style={styles.overallScoreValue}>
              {averageScore >= 80
                ? 'These are very common procedures'
                : averageScore >= 60
                  ? 'These are commonly recommended'
                  : averageScore >= 40
                    ? 'Worth discussing with your dentist'
                    : 'Consider getting another opinion'}
            </Text>
          </View>
        </View>

        {/* Treatment Cards */}
        <Text style={styles.sectionTitle}>
          {isShowingExamples ? 'Example Treatment Plan' : 'Your Treatment Plan'}
        </Text>
        {treatments.map((treatment) => (
          <TreatmentPlanCard
            key={treatment.id}
            treatment={treatment}
            onAskAbout={handleAskAbout}
            onShare={handleShare}
          />
        ))}

        {/* Decision Guides */}
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('DecisionTree')}
          activeOpacity={0.7}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="git-branch-outline" size={24} color={COLORS.primary500} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Decision Guides</Text>
            <Text style={styles.featureSubtitle}>Interactive help for treatment decisions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.neutral400} />
        </TouchableOpacity>

        {/* Questions Section */}
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => {
            const treatmentNames = treatments.map((t) => t.name).join(', ');
            navigation.navigate('Home', {
              screen: 'Chat',
              params: {
                initialMessage: `What questions should I ask my dentist about these treatments: ${treatmentNames}?`,
              },
            });
          }}
          activeOpacity={0.7}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="help-circle" size={24} color={COLORS.primary500} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Questions to Ask</Text>
            <Text style={styles.featureSubtitle}>
              {treatments.length * 4} questions for your dentist
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.neutral400} />
        </TouchableOpacity>

        {/* Share All Button */}
        <TouchableOpacity style={styles.shareAllButton} onPress={handleShareAll}>
          <Ionicons name="people" size={20} color="#8B5CF6" />
          <Text style={[styles.shareAllText, { color: '#8B5CF6' }]}>Share with Family</Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          This is educational information only. Always discuss treatment decisions with your
          dentist.
        </Text>
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
  },
  // Upload CTA - prominent at top
  uploadCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary500,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  uploadCTAIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  uploadCTAContent: {
    flex: 1,
  },
  uploadCTATitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  uploadCTASubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.9)',
  },
  // Example Banner
  exampleBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5E6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5A83A',
  },
  exampleBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#7A5018',
    lineHeight: 20,
  },
  exampleBannerBold: {
    fontFamily: 'Inter_600SemiBold',
  },
  // Example card styling
  exampleCard: {
    borderWidth: 2,
    borderColor: '#E5A83A',
    borderStyle: 'dashed',
  },
  exampleTag: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: '#C27624',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  exampleTagText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral500,
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary700,
  },
  summaryCount: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 4,
  },
  overallScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral200,
  },
  overallScoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    flex: 1,
  },
  overallScoreValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 12,
  },
  featureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
  },
  questionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  questionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    flex: 1,
  },
  questionsCount: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginLeft: 8,
    color: COLORS.neutral500,
    marginRight: 8,
  },
  shareAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary500,
    gap: 8,
  },
  shareAllText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary500,
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary500,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
});

export default PlansScreen;
