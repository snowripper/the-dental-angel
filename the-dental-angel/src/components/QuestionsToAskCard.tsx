import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import type { ParsedQuestions } from '../types/chat';

interface QuestionsToAskCardProps {
  questions: ParsedQuestions;
  onCopy: () => void;
  onShare: () => void;
}

/**
 * Questions To Ask Card
 * Displays a list of questions extracted from AI responses
 * with copy and share functionality
 */
export function QuestionsToAskCard({ questions, onCopy, onShare }: QuestionsToAskCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="help-circle" size={22} color={COLORS.primary500} />
          <Text style={styles.title}>Questions to Ask Your Dentist</Text>
        </View>
      </View>

      <View style={styles.questionsList}>
        {questions.questions.map((question, index) => (
          <View key={index} style={styles.questionItem}>
            <Text style={styles.questionNumber}>{index + 1}</Text>
            <Text style={styles.questionText}>{question}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.copyButton} onPress={onCopy}>
          <Ionicons name="copy-outline" size={18} color={COLORS.primary600} />
          <Text style={styles.copyButtonText}>Copy All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-outline" size={18} color={COLORS.white} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Bring these questions to your next appointment!</Text>
    </View>
  );
}

/**
 * Parse questions from AI response text
 * Looks for "Questions to ask" sections and extracts bullet points
 */
export function parseQuestionsFromResponse(text: string): ParsedQuestions | null {
  // Look for "Questions to ask" section patterns
  // Using simple string-based detection for better security and readability
  const lowerText = text.toLowerCase();
  const hasQuestionsSection =
    lowerText.includes('questions to ask') ||
    lowerText.includes('good questions') ||
    lowerText.includes('ask your dentist');

  if (!hasQuestionsSection) {
    return null;
  }

  // Extract bullet points (lines starting with •, -, or *)
  const lines = text.split('\n');
  const questions: string[] = [];
  let inQuestionsSection = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    // Start capturing when we hit a questions header
    if (
      lowerLine.includes('questions to ask') ||
      lowerLine.includes('good questions') ||
      lowerLine.includes('ask your dentist')
    ) {
      inQuestionsSection = true;
      continue;
    }

    // Stop if we hit another section header (bold text or numbered section)
    if (inQuestionsSection && /^\*\*[^*]+\*\*/.test(line) && !lowerLine.includes('question')) {
      break;
    }

    // Capture bullet points in the questions section
    if (inQuestionsSection) {
      const bulletMatch = line.match(/^[\s]*[•\-*]\s*(.+)/);
      if (bulletMatch && bulletMatch[1]) {
        const question = bulletMatch[1].replace(/^["']|["']$/g, '').trim();
        if (question.length > 10) {
          questions.push(question);
        }
      }
    }
  }

  if (questions.length >= 2) {
    return { questions };
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary50,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: COLORS.primary200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary700,
  },
  questionsList: {
    marginBottom: 12,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 4,
  },
  questionNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary500,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 22,
    marginRight: 10,
    overflow: 'hidden',
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary300,
  },
  copyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary600,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary500,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  hint: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.primary600,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
