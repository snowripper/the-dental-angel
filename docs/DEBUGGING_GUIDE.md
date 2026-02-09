# Debugging Guide

Learnings from the Debugger review. Common patterns, memory leaks, and quality standards.

---

## Animation Cleanup Pattern

**Problem:** Animations that continue after a component unmounts cause memory leaks

**Before (Leak):**
```typescript
useEffect(() => {
  Animated.timing(slideAnim, {
    toValue: isOffline ? 0 : -60,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, [isOffline]);
```

**After (Fixed):**
```typescript
useEffect(() => {
  const animation = Animated.timing(slideAnim, {
    toValue: isOffline ? 0 : -60,
    duration: 300,
    useNativeDriver: true,
  });
  animation.start();

  return () => animation.stop();  // Clean up!
}, [isOffline]);
```

**Rule:** Always return a cleanup function that stops animations when the component unmounts.

---

## Input Validation at Service Boundaries

**Problem:** Empty or invalid input can waste API calls and cause confusing errors

**Pattern:**
```typescript
export async function sendMessageToAngel(userMessage: string): Promise<ChatResponse> {
  // Validate first, before any API work
  if (!userMessage.trim()) {
    return {
      success: false,
      message: 'Please type a message first!',
    };
  }

  // Now proceed with API call...
}
```

**Rule:** Validate inputs at the entry point of services. Return friendly messages for invalid input.

---

## What Makes Code Debugger-Proof

1. **Error Boundaries** - Isolate crashes to one part of the app
2. **Try/Catch on Async** - Every Promise should have error handling
3. **Cleanup in useEffect** - Return cleanup functions for timers, animations, subscriptions
4. **Defensive Null Checks** - Use optional chaining (`?.`) when accessing nested properties
5. **Typed State** - TypeScript catches many bugs at compile time

---

## Common Bug Patterns to Watch For

| Pattern | Risk | Prevention |
|---------|------|------------|
| Animation without cleanup | Memory leak | Store ref, call `.stop()` on unmount |
| Async setState after unmount | Warning/crash | Use `isMounted` flag pattern |
| Missing error handling | Silent failures | Wrap all async in try/catch |
| Empty input to API | Wasted calls | Validate before calling |
| Object access without null check | Crash | Use optional chaining |

---

## Debugging Quality Checklist

Before any release:

- [ ] All animations have cleanup functions
- [ ] All async functions have try/catch
- [ ] All useEffect hooks return cleanup when needed
- [ ] Input validation happens at service boundaries
- [ ] Error boundaries wrap major app sections
- [ ] User-friendly error messages (no technical jargon)
