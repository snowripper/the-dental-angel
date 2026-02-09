import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import * as Network from 'expo-network';
import { COLORS } from '../constants/theme';

/**
 * NetworkStatusBanner
 * Shows a subtle banner when the user is offline.
 * Automatically appears/disappears based on network status.
 */
export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-60));

  useEffect(() => {
    let isMounted = true;

    const checkNetwork = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        if (isMounted) {
          setIsOffline(!networkState.isConnected || !networkState.isInternetReachable);
        }
      } catch {
        // If we can't check network, assume we're online
        if (isMounted) {
          setIsOffline(false);
        }
      }
    };

    // Check immediately
    checkNetwork();

    // Check periodically (every 5 seconds)
    const interval = setInterval(checkNetwork, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Animate banner in/out
  useEffect(() => {
    const animation = Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    });
    animation.start();

    // Clean up animation on unmount to prevent memory leak
    return () => animation.stop();
  }, [isOffline, slideAnim]);

  // Don't render anything if online (but keep the component mounted for smooth animation)
  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.text}>You're offline. Messages will send when you reconnect.</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.warning,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral800,
    textAlign: 'center',
  },
});
