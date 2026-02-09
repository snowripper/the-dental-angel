# Design Insights

Learnings from the UI/UX Designer review. Critical for our target audience of 45-65+ year old users.

---

## Critical for Our Audience

**Our users are 45-65+ years old.** This affects everything:

### 1. Text Size Matters More Than You Think

- 100% of people over 40 have presbyopia (age-related vision decline)
- Nielsen Norman Group recommends 16-18px minimum for older users
- We use 14px minimum, with important text at 16-18px

### 2. Touch Targets Are Accessibility, Not Preference

- Older users may have reduced motor control or tremors
- Fitts's Law: larger targets = faster, more accurate taps
- 44px minimum is a requirement, not a suggestion

### 3. Disclaimers Must Be Readable

- If users can't read the disclaimer, it doesn't protect anyone
- Don't style legal text as "fine print" - make it visible

---

## Research-Backed Design Principles

| Principle | What It Means | How We Apply It |
|-----------|---------------|-----------------|
| **Hick's Law** | More choices = slower decisions | Keep navigation simple (6 tabs is our max) |
| **Fitts's Law** | Bigger targets are easier to hit | 44px minimum for all buttons |
| **Banner Blindness** | Users skip content that looks like ads | Style disclaimers clearly, not as boilerplate |
| **Left-Side Bias** | Users spend 69% more time on left side of screen | Consider left-aligning headers (future improvement) |

---

## Future Design Improvements (Not Blockers)

These came from the review but aren't critical for launch:

### 1. Typography Differentiation

- Inter font is generic (used by every health app)
- Consider switching to more distinctive fonts like Source Sans 3 or Bricolage Grotesque
- Would make the app more memorable in App Store screenshots

### 2. Brand Color Accent

- Current blue palette is calming but forgettable
- Consider adding gold accent (#D4AF37) for "angel" touches
- Use sparingly: avatar borders, success states, halo effects

### 3. Navigation Consolidation

- 6 tabs is at the upper limit of Hick's Law recommendations
- Could combine Translate/Videos/Buddies into a "Learn" section
- Would reduce cognitive load for new users

### 4. Skeleton Loading States

- Add skeleton screens when loading conversations
- Reduces perceived wait time without changing actual speed

---

## Design Testing Checklist

Before adding any new screen or component:

- [ ] All text is 14px or larger
- [ ] All touch targets are 44px or larger
- [ ] Colors meet contrast requirements (use `neutral500`+ for text)
- [ ] Would a 65-year-old find this easy to read and tap?
- [ ] Disclaimers are visible, not hidden as fine print
