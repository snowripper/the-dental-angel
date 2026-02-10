/**
 * Navigation Type Definitions
 *
 * Centralized types for all navigation in the app.
 * This provides type safety for screen props and navigation actions.
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// ============ PARAM LISTS ============

/**
 * Root Stack - Welcome flow before main app
 */
export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
};

/**
 * Home Stack - Chat and related screens
 */
export type HomeStackParamList = {
  HomeMain: undefined;
  Chat:
    | {
        conversationId?: string;
        imageUri?: string;
        initialAnalysis?: string;
        initialMessage?: string;
      }
    | undefined;
  Camera: undefined;
  History: undefined;
};

/**
 * Plans Stack - Treatment plans and decision trees
 */
export type PlansStackParamList = {
  PlansMain: undefined;
  DecisionTree:
    | {
        treeType?: 'crown' | 'rootCanal' | 'extraction';
      }
    | undefined;
};

/**
 * Learn Stack - Educational resources hub
 */
export type LearnStackParamList = {
  LearnMain: undefined;
  Translate: undefined;
  Videos: undefined;
  Buddies: undefined;
};

/**
 * Main Tab Navigator — 4 tabs: Chat, My Plan, Learn, Settings
 */
export type MainTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Plans: NavigatorScreenParams<PlansStackParamList> | undefined;
  Learn: NavigatorScreenParams<LearnStackParamList> | undefined;
  Settings: undefined;
};

// ============ SCREEN PROPS ============

/**
 * Welcome Screen
 */
export type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

/**
 * Home Screen (main chat entry point)
 */
export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabsParamList>
>;

/**
 * Chat Screen
 */
export type ChatScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Chat'>,
  BottomTabScreenProps<MainTabsParamList>
>;

/**
 * Camera Screen (image upload)
 */
export type CameraScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Camera'>,
  BottomTabScreenProps<MainTabsParamList>
>;

/**
 * History Screen (conversation list)
 */
export type HistoryScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'History'>,
  BottomTabScreenProps<MainTabsParamList>
>;

/**
 * Plans Screen
 */
export type PlansScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PlansStackParamList, 'PlansMain'>,
  BottomTabScreenProps<MainTabsParamList>
>;

/**
 * Decision Tree Screen
 */
export type DecisionTreeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PlansStackParamList, 'DecisionTree'>,
  BottomTabScreenProps<MainTabsParamList>
>;

/**
 * Translator Screen — now inside Learn stack
 */
export type TranslatorScreenProps = CompositeScreenProps<
  NativeStackScreenProps<LearnStackParamList, 'Translate'>,
  BottomTabScreenProps<MainTabsParamList>
>;

/**
 * Videos Screen — now inside Learn stack
 */
export type VideosScreenProps = NativeStackScreenProps<LearnStackParamList, 'Videos'>;

/**
 * Buddies Screen — now inside Learn stack
 */
export type BuddiesScreenProps = NativeStackScreenProps<LearnStackParamList, 'Buddies'>;

/**
 * Settings Screen
 */
export type SettingsScreenProps = BottomTabScreenProps<MainTabsParamList, 'Settings'>;
