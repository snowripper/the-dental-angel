# Mobile Development Guide

Learnings from the Mobile Developer review. iOS/Android patterns, permissions, and app store readiness.

---

## What Makes a Mobile App Feel Professional

### 1. Keyboard Behavior Matters

- Users expect keyboard to hide when scrolling through content
- Use `keyboardDismissMode="on-drag"` on FlatLists with text input
- Small detail, but feels wrong without it

### 2. Proactive Offline Detection

- Don't wait for users to discover they're offline when something fails
- Show a gentle banner immediately when connection drops
- Message should be friendly: "You're offline. Messages will send when you reconnect."

### 3. Image Optimization for Mobile Networks

- 70% quality is the sweet spot for documents/photos
- Users on cellular data will thank you
- Visually identical, but much smaller file sizes

---

## Permission Handling Best Practices

**What We Did Right:**
- Request permissions only when needed (not at app launch)
- Clear explanation of why permission is needed
- Graceful handling when user denies

**iOS Permission Strings (app.json):**
```json
"NSCameraUsageDescription": "Take photos of treatment plans for analysis"
"NSPhotoLibraryUsageDescription": "Upload treatment plan images for explanation"
```

**Runtime Flow:**
1. User taps "Take Photo" or "Choose from Gallery"
2. App requests permission with clear purpose
3. If denied, show friendly alert explaining how to enable
4. Never block the entire app - offer alternatives

---

## Platform-Specific Patterns

**Always Handle Separately:**

| Feature | iOS | Android |
|---------|-----|---------|
| Tab bar height | Add safe area inset (~20px) | Standard height |
| Shadows | `shadowColor`, `shadowOffset`, etc. | `elevation` property |
| Keyboard behavior | `behavior="padding"` | `behavior="height"` |
| Back button | Swipe gesture | Hardware button |

**Pattern Used in App:**
```typescript
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
})
```

---

## Network Detection Pattern

**How to detect offline status:**
```typescript
import * as Network from 'expo-network';

const checkNetwork = async () => {
  const state = await Network.getNetworkStateAsync();
  const isOffline = !state.isConnected || !state.isInternetReachable;
  // Update UI accordingly
};

// Check periodically (every 5 seconds is reasonable)
setInterval(checkNetwork, 5000);
```

**Key Insight:** `expo-network` is better than `@react-native-community/netinfo` for Expo managed workflow - fewer native dependencies, simpler setup.

---

## Mobile Performance Guidelines

| Area | Guideline | Why |
|------|-----------|-----|
| Image quality | 70% for documents, 80% for photos | Saves bandwidth, looks the same |
| FlatList | Always use `keyExtractor` | Prevents re-renders |
| Animations | Use `useNativeDriver: true` | Runs on native thread |
| State updates | Batch when possible | Fewer re-renders |

---

## App Store Readiness Checklist

### iOS App Store

- [ ] Bundle ID configured (`com.dentalangel.app`)
- [ ] Icons at all required sizes
- [ ] Launch screen configured
- [ ] Privacy policy URL ready
- [ ] Camera/photo permission descriptions
- [ ] No calls to private APIs

### Google Play Store

- [ ] Package name configured
- [ ] Adaptive icon for Android 8+
- [ ] App bundle format (not APK)
- [ ] Privacy policy URL ready
- [ ] All permissions justified in console

---

## Mobile UX Quality Checklist

Before any release:

- [ ] Keyboard hides when scrolling (`keyboardDismissMode="on-drag"`)
- [ ] Offline state is visible to users
- [ ] Images are optimized (70-80% quality)
- [ ] Touch targets are 44px minimum
- [ ] Platform-specific UI (shadows vs elevation)
- [ ] Error states show "Try Again" buttons
- [ ] Loading states are visible during API calls
- [ ] Back navigation works on Android hardware button

---

## Future Mobile Enhancements (Not Blockers)

| Enhancement | Benefit | Effort |
|-------------|---------|--------|
| Haptic feedback on key actions | Tactile confirmation | Low |
| Pull-to-refresh on lists | Expected mobile pattern | Low |
| In-app browser for videos | Better user flow | Medium |
| Analytics/crash reporting | Visibility into production | Medium |
| Voice input option | Easier for older users | Medium |
