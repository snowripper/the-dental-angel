# Data Architecture

Learnings from the Database Architect review. Local storage strategy and future scaling path.

---

## Why Local-First is Right for This App

### 1. Zero Friction Onboarding

- Users can get help immediately without creating accounts
- Critical for stressed patients who just left the dentist's office
- Every extra step = lost users

### 2. Privacy as a Feature

- Health-adjacent data staying on device is a selling point
- No server = nothing to hack
- HIPAA-adjacent concerns avoided entirely

### 3. Offline Capability

- Users can review past conversations without internet
- Useful in dental office waiting rooms with poor signal

---

## Current Data Model

**What Gets Saved (AsyncStorage):**

```
Conversation: id, title, preview, messages[], createdAt, updatedAt
Message: id, role (user/assistant), content, timestamp, imageUri
```

| Data Type | Storage Location | Notes |
|-----------|------------------|-------|
| Conversations | Phone (AsyncStorage) | Persists between app sessions |
| Messages | Phone (AsyncStorage) | Includes text and image references |
| Videos/Buddies/Trees | Built into app | No storage needed |
| User settings | Phone (AsyncStorage) | Future implementation |

---

## Premium Feature Opportunity

**Cloud backup is a natural subscription upsell:**
- "Never lose your dental history" messaging
- Sync across devices (phone + tablet)
- Family sharing could require cloud accounts
- Estimated 2-3 weeks to implement when ready

---

## Future Data Considerations

| Scenario | Solution |
|----------|----------|
| User loses phone | Offer cloud backup as premium |
| Heavy user hits storage limit | Cloud offloading |
| Multiple devices | Sync via Supabase |
| Family sharing | Shared cloud accounts |

---

## What's Already in Place

Supabase integration exists in `/src/services/supabase.ts`:
- Database connection ready
- Just needs environment config to activate
- Auth providers (Apple/Google) supported
- No code rewrite needed - just configuration

---

## Storage Limits to Know

- AsyncStorage: ~6MB default on Android (thousands of conversations)
- Heavy users could hit this eventually
- Cloud backup solves this when implemented
