import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { conversationService, Conversation } from '../services/conversationService';
import type { HistoryScreenProps } from '../types/navigation';

/**
 * History Screen
 * Shows list of past conversations
 * Allows users to resume or delete conversations
 */
export function HistoryScreen({ navigation }: HistoryScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadConversations();
    });
    return unsubscribe;
  }, [navigation]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const convos = await conversationService.getAll();
      setConversations(convos);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    Alert.alert('Delete Conversation', 'Are you sure you want to delete this conversation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await conversationService.delete(id);
          loadConversations();
        },
      },
    ]);
  };

  const openConversation = (conversation: Conversation) => {
    navigation.navigate('Chat', { conversationId: conversation.id });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.historyContainer}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={COLORS.primary500} />
          <Text style={styles.loadingCenterText}>Loading your conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (conversations.length === 0) {
    return (
      <SafeAreaView style={styles.historyContainer}>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={60} color={COLORS.primary300} />
          <Text style={styles.emptyTitle}>No Conversations Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your chats with The Dental Angel will appear here
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Ionicons name="chatbubbles" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Start a Chat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.historyContainer}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.historyList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationCard}
            onPress={() => openConversation(item)}
            onLongPress={() => deleteConversation(item.id)}
          >
            <View style={styles.conversationHeader}>
              <Text style={styles.conversationTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.conversationDate}>
                {conversationService.formatDate(item.updatedAt)}
              </Text>
            </View>
            <Text style={styles.conversationPreview} numberOfLines={2}>
              {item.preview || 'No messages yet'}
            </Text>
            <View style={styles.conversationFooter}>
              <Text style={styles.messageCount}>
                {item.messages.length} {item.messages.length === 1 ? 'message' : 'messages'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.neutral400} />
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.historyHint}>Tip: Press and hold a conversation to delete it</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  historyList: {
    padding: 16,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCenterText: {
    marginTop: 12,
    color: COLORS.neutral500,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginBottom: 24,
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
  conversationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    flex: 1,
    marginRight: 8,
  },
  conversationDate: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral400,
  },
  conversationPreview: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 20,
    marginBottom: 8,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageCount: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral400,
  },
  historyHint: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral400,
    textAlign: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral200,
  },
});
