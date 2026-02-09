import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Import theme (single source of truth for colors)
import { COLORS } from './src/constants/theme';

// Import navigation types
import type {
  RootStackParamList,
  HomeStackParamList,
  PlansStackParamList,
  MainTabsParamList,
} from './src/types/navigation';

// Import screens from their own files
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { PlansScreen } from './src/screens/PlansScreen';
import { VideosScreen } from './src/screens/VideosScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TranslatorScreen } from './src/screens/TranslatorScreen';
import { DecisionTreeScreen } from './src/screens/DecisionTreeScreen';
import { BuddiesScreen } from './src/screens/BuddiesScreen';

// Import Error Boundary for crash protection
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Import Network Status Banner for offline detection
import { NetworkStatusBanner } from './src/components/NetworkStatusBanner';

// Create typed navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const PlansStack = createNativeStackNavigator<PlansStackParamList>();

// ============ LOADING SCREEN ============
function LoadingScreen() {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={COLORS.primary500} />
      <Text style={styles.loadingScreenText}>Loading The Dental Angel...</Text>
    </View>
  );
}

// ============ HOME STACK NAVIGATOR ============
function HomeStackNavigator() {
  return (
    <ErrorBoundary fallbackTitle="Something went wrong with Chat">
      <HomeStack.Navigator
        initialRouteName="Chat"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.neutral50 },
          headerTintColor: COLORS.primary600,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
          contentStyle: { backgroundColor: COLORS.neutral50 },
        }}
      >
        <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
        <HomeStack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            title: 'The Dental Angel',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('History')}
                style={{ padding: 8 }}
              >
                <Ionicons name="time-outline" size={24} color={COLORS.primary600} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Camera')}
                  style={{ padding: 8 }}
                >
                  <Ionicons name="camera-outline" size={24} color={COLORS.primary600} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Chat')} style={{ padding: 8 }}>
                  <Ionicons name="add-circle-outline" size={24} color={COLORS.primary600} />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <HomeStack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Upload Image' }}
        />
        <HomeStack.Screen
          name="History"
          component={HistoryScreen}
          options={({ navigation }) => ({
            title: 'Your Conversations',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={{ padding: 8 }}>
                <Ionicons name="add-circle-outline" size={24} color={COLORS.primary600} />
              </TouchableOpacity>
            ),
          })}
        />
      </HomeStack.Navigator>
    </ErrorBoundary>
  );
}

// ============ PLANS STACK NAVIGATOR ============
function PlansStackNavigator() {
  return (
    <ErrorBoundary fallbackTitle="Something went wrong with Plans">
      <PlansStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.neutral50 },
          headerTintColor: COLORS.primary600,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
          contentStyle: { backgroundColor: COLORS.neutral50 },
        }}
      >
        <PlansStack.Screen
          name="PlansMain"
          component={PlansScreen}
          options={{ title: 'Treatment Plans' }}
        />
        <PlansStack.Screen
          name="DecisionTree"
          component={DecisionTreeScreen}
          options={{ headerShown: false }}
        />
      </PlansStack.Navigator>
    </ErrorBoundary>
  );
}

// ============ TAB NAVIGATOR ============
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
          let iconName: IoniconsName = 'home';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Plans':
              iconName = focused ? 'clipboard' : 'clipboard-outline';
              break;
            case 'Translate':
              iconName = focused ? 'language' : 'language-outline';
              break;
            case 'Videos':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              break;
            case 'Buddies':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary500,
        tabBarInactiveTintColor: COLORS.neutral400,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.neutral200,
          height: 64 + (Platform.OS === 'ios' ? 20 : 0),
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 12,
        },
        headerStyle: { backgroundColor: COLORS.neutral50 },
        headerTintColor: COLORS.primary600,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ headerShown: false, title: 'Chat' }}
      />
      <Tab.Screen
        name="Plans"
        component={PlansStackNavigator}
        options={{ title: 'Plans', headerShown: false }}
      />
      <Tab.Screen
        name="Translate"
        options={{ title: 'Translate', headerTitle: 'Dental Translator' }}
      >
        {(props) => (
          <ErrorBoundary fallbackTitle="Something went wrong with Translate">
            <TranslatorScreen {...props} />
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Videos" options={{ title: 'Videos', headerShown: false }}>
        {() => (
          <ErrorBoundary fallbackTitle="Something went wrong with Videos">
            <VideosScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Buddies" options={{ title: 'Buddies', headerTitle: 'Treatment Buddies' }}>
        {() => (
          <ErrorBoundary fallbackTitle="Something went wrong with Buddies">
            <BuddiesScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ title: 'Settings' }}>
        {(props) => (
          <ErrorBoundary fallbackTitle="Something went wrong with Settings">
            <SettingsScreen {...props} />
          </ErrorBoundary>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ============ MAIN APP ============
const ONBOARDED_KEY = 'dental_angel_onboarded';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => {
      setHasOnboarded(value === 'true');
    });
  }, []);

  if (!fontsLoaded || hasOnboarded === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <NetworkStatusBanner />
      <Stack.Navigator
        initialRouteName={hasOnboarded ? 'MainTabs' : 'Welcome'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.neutral50 },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral50,
  },
  loadingScreenText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral600,
  },
});
