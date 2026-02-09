# Architecture Insights

Learnings from the Architect review. File organization, patterns, and quality standards.

---

## File Organization Standard

The app follows React Native best practices:

```
the-dental-angel/
├── App.tsx                 # ~300 lines - navigation setup only
├── src/
│   ├── screens/           # One file per screen (~200-400 lines each)
│   │   ├── WelcomeScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── PlansScreen.tsx
│   │   ├── VideosScreen.tsx
│   │   ├── TranslatorScreen.tsx
│   │   ├── BuddiesScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── DecisionTreeScreen.tsx
│   ├── components/        # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── FamilyShareButton.tsx
│   │   ├── NetworkStatusBanner.tsx
│   │   ├── SecondOpinionScoreCard.tsx
│   │   ├── QuestionsToAskCard.tsx
│   │   └── TreatmentPlanCard.tsx
│   ├── services/          # Business logic and API calls
│   │   ├── aiService.ts
│   │   ├── conversationService.ts
│   │   ├── shareService.ts
│   │   └── supabase.ts
│   ├── constants/         # Static data and configuration
│   │   ├── theme.ts        # COLORS, spacing, fonts
│   │   ├── angelPersonality.ts
│   │   ├── videoLibrary.ts
│   │   ├── decisionTrees.ts
│   │   └── treatmentBuddies.ts
│   └── types/             # TypeScript type definitions
│       ├── navigation.ts
│       ├── chat.ts
│       └── index.ts
```

---

## When to Create a New File

| Situation | Action |
|-----------|--------|
| Screen is 400+ lines | Split into smaller components |
| Component used in 2+ places | Move to `components/` |
| Logic shared across screens | Move to `services/` |
| Static data or config | Move to `constants/` |
| Types used in 2+ files | Move to `types/` |

---

## Error Boundary Pattern

Every major section of the app is wrapped in an ErrorBoundary:

```typescript
// For stack navigators:
function HomeStackNavigator() {
  return (
    <ErrorBoundary fallbackTitle="Something went wrong with Chat">
      <HomeStack.Navigator>
        {/* screens */}
      </HomeStack.Navigator>
    </ErrorBoundary>
  );
}

// For standalone screens in tab navigator:
<Tab.Screen name="Videos">
  {() => (
    <ErrorBoundary fallbackTitle="Something went wrong with Videos">
      <VideosScreen />
    </ErrorBoundary>
  )}
</Tab.Screen>
```

**Why this matters:**
- If VideosScreen crashes, only Videos tab shows error
- Other tabs (Chat, Plans, Settings) continue working
- Users can still use most of the app while you fix the bug

---

## Single Source of Truth Pattern

**Problem:** Colors defined in multiple places leads to inconsistencies

**Before (Bad):**
```typescript
// App.tsx
const COLORS = { primary500: '#3B82F6', ... };

// theme.ts
export const COLORS = { primary500: '#3B82F6', ... };
```

**After (Good):**
```typescript
// Only in theme.ts
export const COLORS = { primary500: '#3B82F6', ... };

// Everywhere else
import { COLORS } from '../constants/theme';
```

**Apply this to:**
- Colors → `theme.ts`
- Spacing/sizing → `theme.ts`
- AI personality text → `angelPersonality.ts`
- Static content → appropriate `constants/` file

---

## Dependency Flow

Clean dependencies go one direction:

```
App.tsx
  ↓
Screens
  ↓
Components ← Services ← Constants
  ↓           ↓
Types       Types
```

**Rules:**
- Services never import from screens
- Components never import from screens
- Constants never import from anywhere (they're pure data)
- Types are leaf nodes (imported everywhere, import nothing)

---

## Architecture Quality Checklist

Before adding new features:

- [ ] Screens are under 400 lines (split if larger)
- [ ] Reusable components are in `components/`
- [ ] No duplicate definitions (colors, strings, etc.)
- [ ] Error boundary wraps any new tab/stack
- [ ] Dependencies flow downward (no circular imports)
