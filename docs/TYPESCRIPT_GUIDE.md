# TypeScript Guide

Learnings from the TypeScript Pro review. Navigation types, patterns, and standards.

---

## Why Typed Navigation Matters

**Before:** Navigation used `any` props everywhere
```typescript
function HomeScreen({ navigation }: any) {
  navigation.navigate('Chat');  // No autocomplete, no error checking
}
```

**After:** Full type safety with autocomplete
```typescript
function HomeScreen({ navigation }: HomeScreenProps) {
  navigation.navigate('Chat');  // Autocomplete for screen names!
  navigation.navigate('Chat', { conversationId: '123' });  // Params validated!
}
```

**Benefits:**
- IDE autocomplete for screen names
- TypeScript catches typos in screen names at compile time
- Route params are validated (can't forget required params)
- Easier refactoring - rename a screen and TypeScript finds all usages

---

## Cross-Navigator Navigation Pattern

When navigating between nested navigators (e.g., from Settings to History):

**Wrong:** Direct navigation to a screen in another stack
```typescript
navigation.navigate('History');  // Error: History is in HomeStack, not MainTabs
```

**Right:** Navigate to the stack, then specify the screen
```typescript
navigation.navigate('Home', { screen: 'History' });  // Correct!
```

---

## Type Organization Best Practice

**Keep types close to where they're used, but centralize shared types:**

| Type | Location | Why |
|------|----------|-----|
| Navigation types | `src/types/navigation.ts` | Used across all screens |
| Chat types | `src/types/chat.ts` | Used by App.tsx and chat components |
| Component props | In the component file | Only used by that component |
| Service interfaces | In the service file | Only used by that service |

**Type files structure:**
```
src/types/
├── index.ts        # Central exports
├── navigation.ts   # All navigation types
└── chat.ts         # Chat-specific types
```

---

## Adding a New Screen

```typescript
// 1. In navigation.ts, add to param list:
export type HomeStackParamList = {
  // ... existing screens
  NewScreen: { someParam?: string } | undefined;
};

// 2. Create screen props type:
export type NewScreenProps = NativeStackScreenProps<HomeStackParamList, 'NewScreen'>;

// 3. Use in component:
function NewScreen({ navigation, route }: NewScreenProps) {
  const someParam = route.params?.someParam;
  // ...
}
```

---

## Ionicons Type Pattern

Instead of `any` for icon names:
```typescript
// Define once per file that uses Ionicons
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// Use with autocomplete
let iconName: IoniconsName = 'home';  // Autocomplete works!
```

---

## Security Warnings Explained

The linter shows "Generic Object Injection Sink" warnings for code like:
```typescript
const currentNode = tree.nodes[currentNodeId];
```

**These are false positives when:**
- The key (`currentNodeId`) comes from your own app state
- The object (`tree.nodes`) is defined in your code
- User input doesn't directly control the key

**Safe to ignore for:** Decision trees, glossary lookups, constant objects

---

## TypeScript Quality Checklist

Before adding new features:

- [ ] New screens have typed props from `src/types/navigation.ts`
- [ ] State uses specific types, not `any` or `any[]`
- [ ] Cross-navigator navigation uses nested params pattern
- [ ] Ionicons names are typed (not `as any`)
- [ ] Run `npm run typecheck` - no errors
