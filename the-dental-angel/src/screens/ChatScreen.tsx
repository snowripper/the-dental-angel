import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme';
import { INITIAL_GREETING } from '../constants/angelPersonality';
import { sendMessageToAngel, analyzeImage } from '../services/aiService';
import { conversationService, Conversation } from '../services/conversationService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
}

interface ChatScreenProps {
  navigation: any;
  route: {
    params?: {
      imageUri?: string;
      conversationId?: string;
    };
  };
}

const createInitialMessages = (): Message[] => [
  {
    id: '1',
    text: INITIAL_GREETING,
    isUser: false,
    timestamp: new Date(),
  },
];

export default function ChatScreen({ navigation, route }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(createInitialMessages());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const hasInitialized = useRef(false);

  // Initialize conversation on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initConversation = async () => {
      if (route.params?.conversationId) {
        // Load existing conversation
        const existing = await conversationService.get(route.params.conversationId);
        if (existing) {
          setConversation(existing);
          // Convert saved messages to display format
          const displayMessages: Message[] = existing.messages.map((m) => ({
            id: m.id,
            text: m.content,
            isUser: m.role === 'user',
            timestamp: new Date(m.timestamp),
            imageUri: m.imageUri,
          }));
          // Add initial greeting if no messages
          if (displayMessages.length === 0) {
            setMessages(createInitialMessages());
          } else {
            setMessages(displayMessages);
          }
          return;
        }
      }
      // Create new conversation
      const newConversation = conversationService.createConversation();
      setConversation(newConversation);
    };

    initConversation();
  }, []);

  // Handle incoming image from Camera screen
  useEffect(() => {
    if (route.params?.imageUri) {
      handleImageAnalysis(route.params.imageUri);
      // Clear the param so it doesn't re-trigger
      navigation.setParams({ imageUri: undefined });
    }
  }, [route.params?.imageUri]);

  // Save conversation when messages change
  const saveConversation = async (updatedConversation: Conversation) => {
    setConversation(updatedConversation);
    await conversationService.save(updatedConversation);
  };

  const handleImageAnalysis = async (imageUri: string) => {
    if (!conversation) return;

    // Add user message with image
    const userMessage: Message = {
      id: Date.now().toString(),
      text: "I'd like help understanding this image.",
      isUser: true,
      timestamp: new Date(),
      imageUri: imageUri,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Save user message
    let updatedConversation = conversationService.addMessage(
      conversation,
      'user',
      userMessage.text,
      imageUri
    );

    try {
      // Analyze the image
      const response = await analyzeImage(imageUri);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI response
      updatedConversation = conversationService.addMessage(
        updatedConversation,
        'assistant',
        response.message
      );
      await saveConversation(updatedConversation);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I had trouble analyzing that image. Could you try taking another photo with better lighting?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !conversation) return;

    const userMessageText = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Save user message
    let updatedConversation = conversationService.addMessage(conversation, 'user', userMessageText);

    try {
      // Get response from The Dental Angel AI
      const response = await sendMessageToAngel(userMessageText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI response
      updatedConversation = conversationService.addMessage(
        updatedConversation,
        'assistant',
        response.message
      );
      await saveConversation(updatedConversation);
    } catch (error) {
      // Show friendly error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Oops! I had a little hiccup there. Could you try asking again?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.angelBubble]}>
      {!item.isUser && (
        <View style={styles.angelIcon}>
          <Ionicons name="heart" size={16} color={colors.primary.main} />
        </View>
      )}
      <View style={[styles.messageContent, item.isUser ? styles.userContent : styles.angelContent]}>
        {/* Show image if present */}
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.messageImage} resizeMode="cover" />
        )}
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.angelText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.angelIcon}>
              <Ionicons name="heart" size={16} color={colors.primary.main} />
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>The Dental Angel is thinking...</Text>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          {/* Camera button for adding images */}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Ionicons name="camera" size={24} color={colors.primary.main} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about your dental care..."
            placeholderTextColor={colors.neutral.gray}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? colors.neutral.white : colors.neutral.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Educational Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Educational guidance only. Always follow your dentist's personalized advice.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightest,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  angelBubble: {
    justifyContent: 'flex-start',
  },
  angelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.angel.glow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  messageContent: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userContent: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: spacing.xs,
    marginLeft: 'auto',
  },
  angelContent: {
    backgroundColor: colors.neutral.white,
    borderBottomLeftRadius: spacing.xs,
    ...shadows.soft,
  },
  messageImage: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  userText: {
    color: colors.neutral.white,
  },
  angelText: {
    color: colors.neutral.charcoal,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  typingBubble: {
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.soft,
  },
  typingText: {
    color: colors.neutral.darkGray,
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGray,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.angel.glow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.neutral.offWhite,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    maxHeight: 100,
    color: colors.neutral.charcoal,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral.lightGray,
  },
  disclaimer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral.white,
  },
  disclaimerText: {
    fontSize: fontSize.xs,
    color: colors.neutral.gray,
    textAlign: 'center',
  },
});
