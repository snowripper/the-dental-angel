import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme';
import { conversationService, Conversation } from '../services/conversationService';

interface HistoryScreenProps {
  navigation: any;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load conversations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      const data = await conversationService.getAll();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const handleDelete = (conversation: Conversation) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await conversationService.delete(conversation.id);
            setConversations((prev) => prev.filter((c) => c.id !== conversation.id));
          },
        },
      ]
    );
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
      onLongPress={() => handleDelete(item)}
    >
      <View style={styles.conversationIcon}>
        <Ionicons name="chatbubbles" size={24} color={colors.primary.main} />
      </View>
      <View style={styles.conversationContent}>
        <Text style={styles.conversationTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.conversationPreview} numberOfLines={2}>
          {item.preview || 'No messages yet'}
        </Text>
        <Text style={styles.conversationDate}>
          {conversationService.formatDate(item.updatedAt)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.neutral.gray} />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="chatbubbles-outline" size={64} color={colors.neutral.gray} />
      </View>
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptyText}>
        Start a conversation with The Dental Angel and it will appear here.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="add" size={20} color={colors.neutral.white} />
        <Text style={styles.startButtonText}>Start New Conversation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.darkest} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Conversations</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Conversation List */}
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          conversations.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.main}
          />
        }
      />

      {/* New Conversation Button */}
      {conversations.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="add" size={28} color={colors.neutral.white} />
        </TouchableOpacity>
      )}

      {/* Help Text */}
      {conversations.length > 0 && (
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>Tip: Press and hold a conversation to delete it</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightest,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.lightest,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.primary.darkest,
  },
  headerRight: {
    width: 32,
  },
  listContent: {
    padding: spacing.md,
  },
  listContentEmpty: {
    flex: 1,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  conversationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.angel.glow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary.darkest,
    marginBottom: 2,
  },
  conversationPreview: {
    fontSize: fontSize.sm,
    color: colors.neutral.darkGray,
    marginBottom: 4,
  },
  conversationDate: {
    fontSize: fontSize.xs,
    color: colors.neutral.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.angel.glow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.primary.darkest,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  startButtonText: {
    color: colors.neutral.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl + 40,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  helpContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  helpText: {
    fontSize: fontSize.xs,
    color: colors.neutral.gray,
  },
});
