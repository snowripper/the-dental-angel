import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Animated,
  ListRenderItemInfo,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { COLORS, spacing, fontSize, borderRadius } from '../constants/theme';
import { sendMessageToAngel } from '../services/aiService';
import { conversationService, Conversation } from '../services/conversationService';
import { shareService } from '../services/shareService';
import { INITIAL_GREETING, getPersonalizedGreeting } from '../constants/angelPersonality';
import { FamilyShareRow } from '../components/FamilyShareButton';
import { SecondOpinionScoreCard } from '../components/SecondOpinionScoreCard';
import { QuestionsToAskCard, parseQuestionsFromResponse } from '../components/QuestionsToAskCard';
import { paymentService } from '../services/paymentService';
import { PaywallModal } from '../components/PaywallModal';
import { ExpertReviewBanner } from '../components/ExpertReviewBanner';
import { ExpertReviewCard } from '../components/ExpertReviewCard';
import { expertReviewService, type ExpertReview } from '../services/expertReviewService';
import { userSettingsService } from '../services/userSettingsService';
import type { ChatScreenProps } from '../types/navigation';
import type { DisplayMessage } from '../types/chat';

/**
 * Typing indicator — three animated dots that pulse sequentially
 * Creates the feeling of a real person composing a response
 */
function TypingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={typingStyles.container}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[typingStyles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7B7F95',
  },
});

/**
 * Chat Screen
 * Main conversation interface with The Dental Angel AI
 */
export function ChatScreen({ navigation, route }: ChatScreenProps) {
  const imageUri = route.params?.imageUri;
  const initialAnalysis = route.params?.initialAnalysis;
  const loadedConversationId = route.params?.conversationId;
  const initialMessage = route.params?.initialMessage;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isFreeTier, setIsFreeTier] = useState(true);
  const [isExpertTier, setIsExpertTier] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [welcomeZip, setWelcomeZip] = useState('');
  const [expertReview, setExpertReview] = useState<ExpertReview | null>(null);
  const [hasActiveReview, setHasActiveReview] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);
  const flatListRef = useRef<FlatList<DisplayMessage>>(null);

  useEffect(() => {
    const initConversation = async () => {
      if (loadedConversationId) {
        const loaded = await conversationService.get(loadedConversationId);
        if (loaded) {
          setConversation(loaded);
          const displayMessages = loaded.messages.map((m) => ({
            id: m.id,
            text: m.content,
            isUser: m.role === 'user',
            imageUri: m.imageUri,
          }));
          setMessages(displayMessages);
          return;
        }
      }

      // Check if user has a name set — if not, show welcome card
      const settings = await userSettingsService.get();
      if (!settings.firstName && !loadedConversationId && !imageUri) {
        setShowWelcome(true);
        return;
      }

      startNewConversation(settings.firstName);
    };

    initConversation();
  }, [loadedConversationId, imageUri, initialAnalysis, initialMessage]);

  const startNewConversation = (firstName: string | null) => {
    const newConvo = conversationService.createConversation();
    setConversation(newConvo);

    if (imageUri && initialAnalysis) {
      const welcomeMsg = {
        id: '1',
        text: "I've analyzed your image. Here's what I can help you understand:",
        isUser: false,
      };
      const analysisMsg = { id: '2', text: initialAnalysis, isUser: false, imageUri: imageUri };
      setMessages([welcomeMsg, analysisMsg]);

      let updated = conversationService.addMessage(newConvo, 'assistant', welcomeMsg.text);
      updated = conversationService.addMessage(updated, 'assistant', initialAnalysis, imageUri);
      setConversation(updated);
      conversationService.save(updated);
    } else {
      const greeting = firstName ? getPersonalizedGreeting(firstName) : INITIAL_GREETING;
      const welcomeMsg = { id: '1', text: greeting, isUser: false };
      setMessages([welcomeMsg]);

      const updated = conversationService.addMessage(newConvo, 'assistant', greeting);
      setConversation(updated);
      conversationService.save(updated);
    }

    // If there's an initial message from Plans screen, send it automatically
    if (initialMessage) {
      setInputText(initialMessage);
    }
  };

  const handleWelcomeComplete = async () => {
    const name = welcomeName.trim();
    if (!name) return;

    // Save the name
    await userSettingsService.setFirstName(name);

    // Save zip if provided
    const zip = welcomeZip.replace(/[^0-9]/g, '').slice(0, 5);
    if (zip.length === 5) {
      await userSettingsService.setZipCode(zip);
    }

    setShowWelcome(false);
    startNewConversation(name);
  };

  // Check if user is on Expert tier and load any existing review
  useEffect(() => {
    const checkExpertStatus = async () => {
      const settings = await userSettingsService.get();
      const isActive = await userSettingsService.isSubscriptionActive();
      setIsFreeTier(settings.subscriptionTier === 'free');
      setIsExpertTier(settings.subscriptionTier === 'expert' && isActive);
    };
    checkExpertStatus();
  }, []);

  // Load expert review for this conversation
  useEffect(() => {
    if (!conversation?.id) return;

    const loadReview = async () => {
      const reviews = await expertReviewService.getForConversation(conversation.id);
      if (reviews.length > 0) {
        setExpertReview(reviews[0]);
        setHasActiveReview(reviews[0].status !== 'completed');
      }
    };
    loadReview();

    // Poll for review completion every 30 seconds
    const interval = setInterval(loadReview, 30000);
    return () => clearInterval(interval);
  }, [conversation?.id]);

  // Request Dr. Angel's personal review
  const handleRequestReview = useCallback(async () => {
    if (!conversation) return;

    Alert.alert(
      "Request Dr. Angel's Review",
      "Dr. Angel will personally review your treatment plan and provide his educational insights within 24 hours.\n\nYou'll get a notification when it's ready. In the meantime, keep chatting with the AI!",
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Request Review',
          onPress: async () => {
            const conversationMessages = messages.map((m) => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.text,
            }));

            const userMessages = messages.filter((m) => m.isUser);
            const patientSummary =
              userMessages.length > 0
                ? userMessages.map((m) => m.text).join('\n')
                : 'Patient requested a general review.';

            const review = await expertReviewService.requestReview({
              conversationId: conversation.id,
              patientSummary,
              conversationMessages,
              treatmentPlanImageUri: messages.find((m) => m.imageUri)?.imageUri,
            });

            setExpertReview(review);
            setHasActiveReview(true);

            // Add a message from the AI acknowledging the review request
            const ackMessage: DisplayMessage = {
              id: Date.now().toString(),
              text: "Great news! I've submitted your case to Dr. Angel for a personal educational review. He'll review everything we've discussed and share his insights within 24 hours.\n\nYou'll get a notification when his review is ready. In the meantime, I'm still here — feel free to keep asking me anything!",
              isUser: false,
            };
            setMessages((prev) => [...prev, ackMessage]);

            const updatedConvo = conversationService.addMessage(
              conversation,
              'assistant',
              ackMessage.text
            );
            setConversation(updatedConvo);
            conversationService.save(updatedConvo);
          },
        },
      ]
    );
  }, [conversation, messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !conversation) return;

    // Check if user can send more messages (paywall for free users)
    const access = await paymentService.canSendMessage();
    if (!access.allowed) {
      setShowPaywall(true);
      return;
    }

    const userText = inputText.trim();
    const userMessage = { id: Date.now().toString(), text: userText, isUser: true };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    let updatedConvo = conversationService.addMessage(conversation, 'user', userText);
    setConversation(updatedConvo);
    conversationService.save(updatedConvo);

    try {
      const history = messages.map((m) => ({
        role: m.isUser ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const response = await sendMessageToAngel(userText, history);

      const aiMessage: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        secondOpinionScore: response.secondOpinionScore,
      };
      setMessages((prev) => [...prev, aiMessage]);

      updatedConvo = conversationService.addMessage(updatedConvo, 'assistant', response.message);
      setConversation(updatedConvo);
      conversationService.save(updatedConvo);

      // Count this message for free-tier tracking
      await paymentService.incrementMessageCount();
    } catch (error) {
      const errorText = 'Oops! I had a little hiccup there. Could you try asking again?';
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);

      updatedConvo = conversationService.addMessage(updatedConvo, 'assistant', errorText);
      setConversation(updatedConvo);
      conversationService.save(updatedConvo);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.chatContainer}>
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchaseComplete={() => setShowPaywall(false)}
        context="chat"
      />

      {/* Full Review Modal */}
      {expertReview?.drAngelResponse && (
        <Modal
          visible={showFullReview}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowFullReview(false)}
        >
          <SafeAreaView style={styles.fullReviewModal}>
            <View style={styles.fullReviewHeader}>
              <Text style={styles.fullReviewTitle}>Dr. Angel's Review</Text>
              <TouchableOpacity onPress={() => setShowFullReview(false)}>
                <Ionicons name="close-circle" size={32} color={COLORS.neutral400} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.fullReviewContent}>
              <View style={styles.fullReviewBadge}>
                <Ionicons name="star" size={14} color="#FFFFFF" />
                <Text style={styles.fullReviewBadgeText}>Personal Educational Review</Text>
              </View>
              <Text style={styles.fullReviewBody}>{expertReview.drAngelResponse}</Text>
              <View style={styles.fullReviewDisclaimer}>
                <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.neutral500} />
                <Text style={styles.fullReviewDisclaimerText}>
                  This is an educational review. Always consult your own dentist for specific advice
                  about your dental care.
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Welcome Card — first-time users */}
      {showWelcome && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.welcomeScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeEmoji}>🦷</Text>
              <Text style={styles.welcomeTitle}>Welcome to The Dental Angel!</Text>
              <Text style={styles.welcomeSubtitle}>
                I'm Dr. Angel — a retired dentist with 40 years of experience. Before I can help,
                I'd love to know who I'm talking to.
              </Text>

              <View style={styles.welcomeInputGroup}>
                <Text style={styles.welcomeLabel}>What's your first name?</Text>
                <TextInput
                  style={styles.welcomeInput}
                  value={welcomeName}
                  onChangeText={setWelcomeName}
                  placeholder="Your first name"
                  placeholderTextColor={COLORS.neutral400}
                  autoFocus
                  returnKeyType="next"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.welcomeInputGroup}>
                <Text style={styles.welcomeLabel}>
                  Your zip code <Text style={styles.welcomeOptional}>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.welcomeInput}
                  value={welcomeZip}
                  onChangeText={(t) => setWelcomeZip(t.replace(/[^0-9]/g, '').slice(0, 5))}
                  placeholder="e.g. 90210"
                  placeholderTextColor={COLORS.neutral400}
                  keyboardType="number-pad"
                  maxLength={5}
                  returnKeyType="done"
                />
                <Text style={styles.welcomeHint}>
                  This helps me give you accurate info about dental costs in your area
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.welcomeButton, !welcomeName.trim() && styles.welcomeButtonDisabled]}
                onPress={handleWelcomeComplete}
                disabled={!welcomeName.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.welcomeButtonText}>Let's figure this out together</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {!showWelcome && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Upgrade banner for free users */}
          {isFreeTier && (
            <TouchableOpacity
              style={styles.upgradeBanner}
              onPress={() => setShowPaywall(true)}
              activeOpacity={0.8}
            >
              <View style={styles.upgradeBannerContent}>
                <Ionicons name="heart-outline" size={18} color={COLORS.primary600} />
                <Text style={styles.upgradeBannerText}>Want help with YOUR treatment plan?</Text>
                <Text style={styles.upgradeBannerCta}>See options</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary500} />
              </View>
            </TouchableOpacity>
          )}

          {/* Expert Review Banner for Expert tier users */}
          {isExpertTier && messages.length > 2 && (
            <ExpertReviewBanner
              hasActiveReview={hasActiveReview}
              onRequestReview={handleRequestReview}
            />
          )}

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={({ item, index }: ListRenderItemInfo<DisplayMessage>) => {
              // Parse questions from AI responses
              const parsedQuestions = !item.isUser ? parseQuestionsFromResponse(item.text) : null;

              const handleCopyQuestions = async () => {
                if (parsedQuestions) {
                  const questionsText = parsedQuestions.questions
                    .map((q, i) => `${i + 1}. ${q}`)
                    .join('\n');
                  const fullText = `Questions to Ask Your Dentist:\n\n${questionsText}\n\n— From The Dental Angel`;
                  await Clipboard.setStringAsync(fullText);
                  Alert.alert('Copied!', 'Questions copied to clipboard. Ready to paste anywhere!');
                }
              };

              const handleShareQuestions = async () => {
                if (parsedQuestions) {
                  await shareService.shareQuestions(parsedQuestions.questions);
                }
              };

              // Share the entire AI message with family
              const handleShareMessage = async () => {
                if (!item.isUser && item.text) {
                  await shareService.shareExplanation(item.text);
                }
              };

              // Share Second Opinion Score
              const handleShareScore = async () => {
                if (item.secondOpinionScore) {
                  const { score, label, reason } = item.secondOpinionScore;
                  await shareService.shareScore(score, label, reason);
                }
              };

              const messageView = (
                <View
                  style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}
                >
                  {!item.isUser && (
                    <View style={styles.chatAngelIcon}>
                      <Text style={styles.chatAngelEmoji}>🦷</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.messageContent,
                      item.isUser ? styles.userContent : styles.aiContent,
                    ]}
                  >
                    {item.imageUri && (
                      <Image source={{ uri: item.imageUri }} style={styles.chatImage} />
                    )}
                    <Text
                      style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}
                    >
                      {item.text}
                    </Text>
                    {item.secondOpinionScore && (
                      <SecondOpinionScoreCard
                        score={item.secondOpinionScore}
                        onUploadPhoto={() => navigation.navigate('Camera')}
                        onShare={handleShareScore}
                      />
                    )}
                    {parsedQuestions && parsedQuestions.questions.length >= 2 && (
                      <QuestionsToAskCard
                        questions={parsedQuestions}
                        onCopy={handleCopyQuestions}
                        onShare={handleShareQuestions}
                      />
                    )}
                    {/* Family Share Row for AI messages */}
                    {!item.isUser && item.text.length > 100 && !parsedQuestions && (
                      <FamilyShareRow
                        onShare={handleShareMessage}
                        hint="Share this with a loved one"
                      />
                    )}
                  </View>
                </View>
              );

              // If this is the last message and there's an expert review, show it
              const isLastMessage = index === messages.length - 1;
              if (isLastMessage && expertReview) {
                return (
                  <View>
                    {messageView}
                    <ExpertReviewCard
                      review={expertReview}
                      onViewFull={() => setShowFullReview(true)}
                    />
                  </View>
                );
              }

              return messageView;
            }}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.chatAngelIcon}>
                <Text style={styles.chatAngelEmoji}>🦷</Text>
              </View>
              <View style={styles.loadingBubble}>
                <TypingDots />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.cameraIconButton}
              onPress={() => navigation.navigate('Camera')}
            >
              <Ionicons name="camera" size={24} color={COLORS.primary600} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask Dr. Angel anything..."
              placeholderTextColor={COLORS.neutral400}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.chatDisclaimer}>
            I'm here to help you understand — always talk to your own dentist too!
          </Text>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  upgradeBanner: {
    backgroundColor: COLORS.primary50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary100,
  },
  upgradeBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  upgradeBannerText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral600,
  },
  upgradeBannerCta: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary600,
    marginLeft: 4,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  chatAngelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#D6E8F5',
  },
  chatAngelEmoji: {
    fontSize: 18,
  },
  messageContent: {
    maxWidth: '75%',
    padding: 14,
    paddingHorizontal: 16,
  },
  aiContent: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  userContent: {
    backgroundColor: COLORS.primary500,
    borderRadius: 18,
    borderBottomRightRadius: 6,
    marginLeft: 'auto',
  },
  messageText: {
    lineHeight: 24,
  },
  aiText: {
    color: COLORS.neutral800,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
  },
  userText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  chatImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral200,
    alignItems: 'flex-end',
  },
  cameraIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.neutral100,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
    minHeight: 48,
    color: COLORS.neutral800,
  },
  sendButton: {
    backgroundColor: COLORS.primary500,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  chatDisclaimer: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  // Welcome Card
  welcomeScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  welcomeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neutral800,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  welcomeInputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  welcomeLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginBottom: 8,
  },
  welcomeOptional: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral400,
    fontSize: 14,
  },
  welcomeInput: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 10, // Input radius per Lux spec
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral800,
    borderWidth: 1,
    borderColor: COLORS.neutral200,
  },
  welcomeHint: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral400,
    marginTop: 6,
    lineHeight: 20,
  },
  welcomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary500,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginTop: 8,
    gap: 8,
  },
  welcomeButtonDisabled: {
    backgroundColor: COLORS.primary300,
  },
  welcomeButtonText: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  // Full Review Modal
  fullReviewModal: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fullReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
  },
  fullReviewTitle: {
    fontSize: fontSize.h2,
    fontWeight: '700',
    color: COLORS.neutral800,
  },
  fullReviewContent: {
    flex: 1,
    padding: spacing.lg,
  },
  fullReviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  fullReviewBadgeText: {
    fontSize: fontSize.label,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fullReviewBody: {
    fontSize: fontSize.bodyLg,
    lineHeight: 30,
    color: COLORS.neutral700,
    marginBottom: spacing.xl,
  },
  fullReviewDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: COLORS.neutral50,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xxxl,
  },
  fullReviewDisclaimerText: {
    fontSize: fontSize.label,
    color: COLORS.neutral500,
    lineHeight: 20,
    flex: 1,
  },
});
