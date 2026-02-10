import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import {
  DECISION_TREES,
  getDecisionTree,
  getRecommendationColor,
  getRecommendationLabel,
  type DecisionTree,
  type DecisionNode,
} from '../constants/decisionTrees';

// Design System Colors — Lux Healthcare Palette
const COLORS = {
  primary50: '#F5F9FD',
  primary100: '#EBF3FA',
  primary500: '#1E6BB8',
  primary600: '#175C9E',
  neutral50: '#F8F9FB',
  neutral100: '#F0F2F5',
  neutral200: '#E8EAF0',
  neutral400: '#B8BCCB',
  neutral500: '#7B7F95',
  neutral600: '#4A4E69',
  neutral700: '#3A3D4E',
  neutral800: '#2D3142',
  white: '#FFFFFF',
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type PlansStackParamList = {
  PlansMain: undefined;
  DecisionTree: { treeId?: string };
};

type DecisionTreeRouteProp = RouteProp<PlansStackParamList, 'DecisionTree'>;
type DecisionTreeNavigationProp = NavigationProp<PlansStackParamList>;

export function DecisionTreeScreen() {
  const route = useRoute<DecisionTreeRouteProp>();
  const treeId = route.params?.treeId;

  const tree = treeId ? getDecisionTree(treeId) : undefined;

  if (!tree) {
    return <DecisionTreeList />;
  }

  return <DecisionTreeFlow tree={tree} />;
}

// ============ DECISION TREE LIST ============
function DecisionTreeList() {
  const navigation = useNavigation<DecisionTreeNavigationProp>();

  const handleTreeSelect = (treeId: string) => {
    navigation.navigate('DecisionTree', { treeId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Decision Guides</Text>
          <Text style={styles.subtitle}>
            Interactive tools to help you understand treatment recommendations
          </Text>
        </View>

        <View style={styles.treeList}>
          {DECISION_TREES.map((tree) => (
            <TouchableOpacity
              key={tree.id}
              style={styles.treeCard}
              onPress={() => handleTreeSelect(tree.id)}
              activeOpacity={0.8}
            >
              <View style={styles.treeIconContainer}>
                <Ionicons name={tree.icon as IconName} size={28} color={COLORS.primary500} />
              </View>
              <View style={styles.treeContent}>
                <Text style={styles.treeTitle}>{tree.title}</Text>
                <Text style={styles.treeDescription} numberOfLines={2}>
                  {tree.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.neutral400} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.neutral500} />
          <Text style={styles.disclaimerText}>
            These guides are for educational purposes only. Always discuss treatment decisions with
            your dentist who knows your specific situation.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ DECISION TREE FLOW ============
interface DecisionTreeFlowProps {
  tree: DecisionTree;
}

function DecisionTreeFlow({ tree }: DecisionTreeFlowProps) {
  const navigation = useNavigation();
  const [history, setHistory] = useState<string[]>([tree.startNodeId]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentNodeId = history[history.length - 1];
  const currentNode = tree.nodes[currentNodeId];
  const progress = Math.min((history.length / 5) * 100, 100); // Estimate ~5 steps

  const handleOptionSelect = useCallback(
    (nextNodeId: string, optionLabel: string) => {
      setAnswers((prev) => ({ ...prev, [currentNodeId]: optionLabel }));
      setHistory((prev) => [...prev, nextNodeId]);
    },
    [currentNodeId]
  );

  const handleBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    } else {
      navigation.goBack();
    }
  }, [history, navigation]);

  const handleRestart = useCallback(() => {
    setHistory([tree.startNodeId]);
    setAnswers({});
  }, [tree.startNodeId]);

  const handleShare = useCallback(async () => {
    if (currentNode.type !== 'outcome' || !currentNode.outcome) return;

    const outcome = currentNode.outcome;
    const answersText = Object.entries(answers)
      .map(([, answer]) => `• ${answer}`)
      .join('\n');

    const message = `🦷 ${tree.title}

My answers:
${answersText}

Result: ${getRecommendationLabel(outcome.recommendation)}
${outcome.title}

${outcome.explanation}

Questions to ask my dentist:
${outcome.questionsToAsk.map((q) => `• ${q}`).join('\n')}

---
From The Dental Angel app - helping patients understand dental care`;

    try {
      await Share.share({ message });
    } catch {
      Alert.alert('Error', 'Could not share results');
    }
  }, [tree.title, currentNode, answers]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.flowHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.neutral700} />
        </TouchableOpacity>
        <View style={styles.flowHeaderContent}>
          <Text style={styles.flowTitle} numberOfLines={1}>
            {tree.subtitle}
          </Text>
        </View>
        {currentNode.type === 'outcome' ? (
          <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
            <Ionicons name="refresh" size={20} color={COLORS.primary500} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentNode.type === 'outcome' ? 'Complete' : `Step ${history.length}`}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentNode.type === 'question' ? (
          <QuestionView node={currentNode} onSelect={handleOptionSelect} />
        ) : (
          <OutcomeView node={currentNode} onShare={handleShare} onRestart={handleRestart} />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ QUESTION VIEW ============
interface QuestionViewProps {
  node: DecisionNode;
  onSelect: (nextNodeId: string, optionLabel: string) => void;
}

function QuestionView({ node, onSelect }: QuestionViewProps) {
  return (
    <View style={styles.questionContainer}>
      <View style={styles.questionIconContainer}>
        <Ionicons name="help-circle" size={40} color={COLORS.primary500} />
      </View>

      <Text style={styles.questionText}>{node.text}</Text>
      {node.subtext && <Text style={styles.questionSubtext}>{node.subtext}</Text>}

      <View style={styles.optionsList}>
        {node.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => onSelect(option.nextNodeId, option.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary500} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ============ OUTCOME VIEW ============
interface OutcomeViewProps {
  node: DecisionNode;
  onShare: () => void;
  onRestart: () => void;
}

function OutcomeView({ node, onShare, onRestart }: OutcomeViewProps) {
  const outcome = node.outcome;
  if (!outcome) return null;

  const colors = getRecommendationColor(outcome.recommendation);
  const label = getRecommendationLabel(outcome.recommendation);

  return (
    <View style={styles.outcomeContainer}>
      {/* Recommendation Badge */}
      <View
        style={[
          styles.recommendationBadge,
          { backgroundColor: colors.bg, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.recommendationLabel, { color: colors.text }]}>{label}</Text>
      </View>

      {/* Title */}
      <Text style={styles.outcomeTitle}>{outcome.title}</Text>

      {/* Explanation */}
      <View style={styles.explanationCard}>
        <Text style={styles.explanationText}>{outcome.explanation}</Text>
      </View>

      {/* Questions to Ask */}
      <View style={styles.questionsSection}>
        <View style={styles.questionsHeader}>
          <Ionicons name="chatbubbles-outline" size={20} color={COLORS.primary600} />
          <Text style={styles.questionsTitle}>Questions to Ask Your Dentist</Text>
        </View>
        {outcome.questionsToAsk.map((question, index) => (
          <View key={index} style={styles.questionItem}>
            <Text style={styles.questionNumber}>{index + 1}</Text>
            <Text style={styles.questionItemText}>{question}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-outline" size={20} color={COLORS.white} />
          <Text style={styles.shareButtonText}>Share Results</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restartFullButton} onPress={onRestart}>
          <Ionicons name="refresh-outline" size={20} color={COLORS.primary500} />
          <Text style={styles.restartButtonText}>Start Over</Text>
        </TouchableOpacity>
      </View>

      {/* Disclaimer */}
      <View style={styles.outcomeDisclaimer}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.neutral500} />
        <Text style={styles.disclaimerText}>
          This is educational guidance based on your answers. Your dentist knows your full situation
          and can provide personalized advice.
        </Text>
      </View>
    </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neutral800,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
  },
  treeList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  treeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  treeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  treeContent: {
    flex: 1,
  },
  treeTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 4,
  },
  treeDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 20,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.neutral100,
    borderRadius: 12,
    gap: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 100,
  },

  // Flow Header
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 4,
  },
  flowHeaderContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  flowTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    textAlign: 'center',
  },
  restartButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary50,
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.neutral200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary500,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral500,
    minWidth: 60,
  },

  // Question View
  questionContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  questionIconContainer: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  questionSubtext: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsList: {
    gap: 12,
    marginTop: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral200,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral700,
    marginRight: 8,
  },

  // Outcome View
  outcomeContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  recommendationBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  recommendationLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  outcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neutral800,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  explanationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  explanationText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    lineHeight: 24,
  },
  questionsSection: {
    backgroundColor: COLORS.primary50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  questionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary600,
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary500,
    color: COLORS.white,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
  },
  questionItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    lineHeight: 22,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary500,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  restartFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.primary500,
    gap: 8,
  },
  restartButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary500,
  },
  outcomeDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: COLORS.neutral100,
    borderRadius: 12,
    gap: 12,
  },
});

export default DecisionTreeScreen;
