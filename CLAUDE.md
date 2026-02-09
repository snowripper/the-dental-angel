# Project: The Dental Angel

## Who I'm Building For

The creator is a 68-year-old retired dentist who practiced for 40 years (1983-2022). He graduated from UCLA Dental School and received advanced training at the Las Vegas Institute for Advanced Dental Education in cosmetic dentistry, reconstructive dentistry, and TMJ treatment.

He was a high-quality practitioner who saw one patient at a time, ensuring each person had the best possible experience. He's warm, conversational, friendly, and uses humor to connect with patients.

Now retired, he wants to help patients worldwide understand their dental treatment plans — not by giving second opinions, but by educating and empowering them to make informed decisions and ask the right questions.

**His goals:**
- Impact: Help thousands of patients feel confident about their dental care
- Income: Build a real business that generates meaningful revenue
- Legacy: His 40 years of knowledge lives on and helps people long after he's gone
- Lifestyle: Part-time involvement (a few hours per week), enjoys retirement

**How he prefers updates:** Working demos he can click around and try. Check-ins daily.

**What would stress him out:** Being challenged by dental societies or the California Dental Board. This is a serious concern we must address through careful positioning.

## Communication Rules

- Never ask technical questions — make the decision yourself
- Never use jargon — explain like talking to a smart non-tech friend
- Only involve him in decisions that affect what he sees or experiences
- When presenting options, give your recommendation and make it easy to say "go with that"

## Decision Authority

- Full authority over all technical choices: languages, frameworks, architecture, libraries, hosting, file structure
- Choose boring, reliable, well-supported technologies
- Optimize for maintainability and simplicity

## When to Ask the User

Only for things that affect their experience. Frame it like:
- "This can load instantly but look simpler, or look richer but take 2 seconds. Which matters more?"
- "I can make this work on phones too, but it adds a day. Worth it?"

Never ask about: databases, APIs, frameworks, libraries, file organization, implementation details

---

## This Project: The Dental Angel

A mobile app that helps patients understand their dental treatment plans. When a patient receives a treatment plan they're unsure about, they can open the app and get clear, friendly explanations — powered by Dr. Angel's 40 years of dental expertise.

### CRITICAL: Legal Positioning

**This is EDUCATION, not dental advice.**

**Note:** Malpractice insurance for teledentistry second opinions was not obtainable (confirmed Feb 2026). The app is 100% educational.

The app must ALWAYS:
- Position itself as educational only
- Include clear disclaimers ("This is not dental advice. Always consult with your own dentist.")
- Never diagnose or recommend against treatment
- Never say "your dentist is wrong"
- Always encourage patients to discuss with their own dentist
- Frame responses as "here's what to understand" and "here's what to ask" — never "here's what to do"

**The tone:** "I can't tell you what to do since I haven't examined you, but here's what I'd want to know if I were in your shoes..."

### Target Users

- Patients anywhere in the world who receive dental treatment plans
- People who want to understand before making decisions
- May include older users (45-65+) who aren't tech-savvy — simplicity is essential

### Look and Feel

- **Colors:** Soft, light, muted shades of blue (calming)
- **Personality:** Warm, approachable, trustworthy, friendly, human touch
- **Usability:** Super simple, clear large text, obvious next steps

---

## Memory Commitments

**ALWAYS REMEMBER:**
1. The user is a non-technical retired dentist — never use jargon
2. Legal positioning is CRITICAL — **100% educational, no second opinions**
3. The AI personality should discuss treatment alternatives while never telling patients what to do
4. Simplicity is essential — users may not be tech-savvy (45-65+ years old)
5. Warm, friendly, human touch in everything
6. Accessibility: 14px minimum text, 44px minimum touch targets
7. **Persona is "Dr. Angel"** — never use real name, ties into app branding
8. **Malpractice insurance for teledentistry not obtainable** — stay educational only

---

## Current Status

### ALL FEATURES COMPLETE

**App Structure (6 Tabs):**
1. **Home** - AI Chat with The Dental Angel
2. **Plans** - Treatment plan viewer with Second Opinion Score + Decision Trees
3. **Translate** - Dental Dialect Translator
4. **Videos** - Dr. Angel Video Library (26 topics)
5. **Buddies** - Treatment Buddies Network (patient stories)
6. **Settings** - App settings and preferences

**What's Working:**
- AI Chat (OpenAI GPT-4o connected)
- Treatment plan photo upload and analysis
- Second Opinion Score, Dental Translator, Video Library
- Decision Trees (Crown, Root Canal, Extraction)
- Treatment Buddies (17 patient stories)
- Family sharing, conversation history
- State selection with location-aware pricing
- Pricing tiers UI with CA/non-CA Expert options
- **Expert Review flow ($149 tier)** (NEW Feb 6)
- **Competitive messaging on App Store & landing page** (NEW Feb 6)
- **Welcome card — asks for name + zip code on first use** (NEW Feb 7)
- **Personalized greetings — "What's on your mind, Susan?"** (NEW Feb 7)
- **Zip code-based dental fee reference — 30+ procedures, regional pricing** (NEW Feb 7)
- **International patient fee guidance — works for patients worldwide** (NEW Feb 7)
- **Plain-English treatment scores — "Very Common" instead of "91/100"** (NEW Feb 7)
- **Upgrade banner on chat screen — gentle "Free Preview → Unlock Full Access"** (NEW Feb 7)
- All tests passing, TypeScript clean

### ALL 8 AGENT REVIEWS COMPLETE

| Agent | Rating | Verdict |
|-------|--------|---------|
| fullstack-developer | Excellent | Ready for launch |
| ui-ux-designer | Solid | Accessibility fixes applied |
| database-architect | Excellent | Data storage validated |
| typescript-pro | 8.5/10 | Navigation types added |
| architect-reviewer | 7.5/10 | App.tsx split, error boundaries added |
| mobile-developer | 8.5/10 | Polish fixes applied |
| debugger | 8.5/10 | No critical bugs |
| code-reviewer | Good | Issues fixed |

See `docs/AGENT_REVIEW_SUMMARIES.md` for full details.

---

## NEXT ACTIONS

**BUSINESS FORMATION (in progress Feb 7, 2026):**
1. **EIN** — Done
2. **California LLC** — Applied, waiting for state approval
3. **Open business checking account** — After LLC is approved
4. **Apple Developer ($99/year)** — Apply as Company/Organization after LLC approved. Will need D-U-N-S number (free, Apple walks you through it).
5. **Google Play Developer ($25 one-time)** — Apply anytime

**AFTER BUSINESS ACCOUNT + DEVELOPER ACCOUNTS READY:**
6. **Set up Stripe**
   - Connect to business bank account
   - Configure for one-time payments

7. **Connect Payment System in App**
   - Replace simulated purchases in paymentService.ts with real Stripe/IAP
   - See `the-dental-angel/MONETIZATION_STRATEGY.md`

8. **Connect Expert Review Email System**
   - Fix Supabase connection (project may need to be unpaused)
   - Create expert_reviews table in Supabase
   - Set up email API (SendGrid/Resend) to send notifications to dentalangel@mail.com
   - Connect dr-angel-review dashboard to Supabase for real review storage
   - Wire up push notifications for patients when review is ready

9. **Submit to App Stores**

---

## Monetization Strategy

**Document:** `the-dental-angel/MONETIZATION_STRATEGY.md`

| Tier | Price | What's Included |
|------|-------|-----------------|
| **Free Preview** | $0 | Sample conversations, video library |
| **Quick Answers** | $29 | AI chat, treatment plan analysis (7 days) |
| **Full Prep** ⭐ | $49 | Above + cost comparison + PDF + red flags (14 days) |
| **Expert Review** | $149 | Above + Dr. Angel's personal educational review (14 days) |

**All tiers are educational.** No licensed second opinions (malpractice insurance not obtainable for teledentistry).

---

## Key Insights (Valuable Learnings)

### Legal/Business Insights (Feb 3, 2026)
| Insight | What It Means |
|---------|---------------|
| **Teledentistry malpractice insurance not obtainable** | Cannot offer licensed second opinions — app is 100% educational |
| **Education can be provided anywhere** | No licensing restrictions for educational content |
| **One Expert tier for everyone** | $149 Expert Review is educational, available worldwide |
| **Simpler is better** | Single pricing structure, no location-based complexity |
| **LLC before payments** | Form "The Dental Angel LLC" → EIN → Business bank account → Stripe |

### Competitor Review Research (Feb 6, 2026)
Researched actual user reviews of competitor apps. Key findings:

| Competitor | User Complaints | Our Advantage |
|------------|----------------|---------------|
| **Toothpic** | "Didn't read what I wrote," generic "brush and floss" advice, no follow-ups, called it a "scam" | Real conversation, reads their situation, follow-up questions |
| **Dentulu** | Broken technology, no customer support, random impersonal dentists | One trusted persona (Dr. Angel), reliable, warm |
| **DentiCalc** | Outdated design, aggressive subscription popups, built for dentists not patients | Clean simple UI, transparent pricing, built for patients |
| **Dental AI Chatbots** | "I don't understand" responses, rigid scripts, lose context | Natural conversation, remembers context, no scripts |

This research was used to update:
- App Store description (`the-dental-angel/APP_STORE_CONTENT.md`)
- Landing page (`landing-page/index.html`) — new "Sound Familiar?" section, updated hero/features/FAQs
- Competitive positioning throughout all marketing copy

### Expert Review Flow (Feb 6, 2026)
| Decision | Details |
|----------|---------|
| **Dr. Angel's email** | dentalangel@mail.com |
| **Response time promise** | 24 hours (covers international time zones) |
| **Dr. Angel's workflow** | Check email morning + evening, ~15-20 min each |
| **Patient experience** | AI helps immediately, Dr. Angel's review is bonus layer on top |
| **Review dashboard** | `the-dental-angel/dr-angel-review/index.html` |

### Competitive Landscape
| Competitor | What They Do | Our Advantage |
|------------|--------------|---------------|
| Dentulu | Teledentistry platform, random dentists | Personal expertise, education focus |
| Toothapps | Dental records access | Treatment understanding, not just records |
| Chapter2Dental | 3D animations for dentists | Direct to patients, AI-powered |

### Persona Decision
- **Dr. Angel** chosen as persona name
- Ties into "The Dental Angel" branding
- Provides anonymity while maintaining personal connection
- Warm, approachable, trustworthy

### UX/Personalization Insights (Feb 7, 2026)
| Insight | What It Means |
|---------|---------------|
| **Asking for first name makes it personal** | Welcome card collects name + zip before chat starts. "What's on your mind, Susan?" feels human, not robotic |
| **Zip code enables real fee guidance** | 30+ common procedures with regional pricing. AI says "In the LA area, a root canal typically runs $1,260–$2,660" instead of vague national averages |
| **Scores need plain English, not numbers** | Patients don't understand "91/100". Changed to "Very Common — Most dentists would recommend this" |
| **Pricing shouldn't hide in Settings** | Patients won't look in Settings to buy. Added gentle upgrade banner on the chat screen where they're already engaged |
| **International patients need fee help too** | Can't give specific numbers outside US, but AI gives universal advice: get a comparison quote, ask what's included, check dental association guidelines |
| **App Store: apply as Company/Organization** | Use LLC (not sole proprietor). Need D-U-N-S number. Apply after LLC is approved for clean setup |
| **Supabase project may be paused** | Free tier pauses after inactivity. Will need to unpause before connecting Expert Review email system |

### Dental Fee Reference (Feb 7, 2026)
| Detail | Info |
|--------|------|
| **Data source** | Public ADA survey data + FAIR Health benchmarks |
| **Coverage** | 30+ common procedures (cleanings through implants) |
| **Regions** | 16 US regions mapped by zip code prefix (first 3 digits) |
| **Multiplier range** | 0.85x (Midwest) to 1.45x (Hawaii) vs. national average |
| **International** | No specific fees — AI gives universal comparison-shopping guidance |
| **File** | `src/constants/dentalFees.ts` |

---

## Code Status

- TypeScript: Clean
- Tests: All 9 passing
- Lint: 0 errors
- Accessibility: 14px+ text, 44px+ touch targets
- Architecture: App.tsx split, error boundaries added
- Mobile UX: Keyboard dismiss, offline banner, optimized images
- **State selection & pricing UI** (added Feb 3)
- **Welcome card, personalized greetings, zip-based fee data, upgrade banner** (added Feb 7)

**Quick check:** `cd the-dental-angel && npm run typecheck && npm run lint && npm test`

### New Files (Feb 3, 2026)
- `src/services/userSettingsService.ts` - User location/state storage, pricing tier definitions

### New/Modified Files (Feb 7, 2026)
- `src/constants/dentalFees.ts` - Regional dental fee reference (30+ procedures, 16 US regions)
- `src/constants/angelPersonality.ts` - Added `getPersonalizedGreeting()` for name-based greetings
- `src/services/aiService.ts` - Patient context (name, zip, fees), international guidance
- `src/services/userSettingsService.ts` - Added `firstName`, `zipCode` fields + setters
- `src/screens/ChatScreen.tsx` - Welcome card, upgrade banner, personalized flow
- `src/screens/SettingsScreen.tsx` - Zip code input in Location section
- `src/screens/PlansScreen.tsx` - Plain-English scores instead of numbers
- `src/components/SecondOpinionScore.tsx` - "Very Common" labels instead of "/100"
- `src/components/TreatmentPlanCard.tsx` - "How common is this?" with plain-English answers

---

## Available Agent Templates

| Agent | Use For |
|-------|---------|
| `code-reviewer` | Review code for issues, bugs, best practices |
| `fullstack-developer` | General full-stack development tasks |
| `ui-ux-designer` | User interface and experience design |
| `debugger` | Track down and fix bugs |
| `database-architect` | Database design and optimization |
| `typescript-pro` | TypeScript-specific development |
| `architect-review` | Review overall architecture decisions |
| `mobile-developer` | React Native / mobile app development |

---

## Key Technical Standards

### Theme System
All colors centralized in `src/constants/theme.ts`. Use `import { COLORS } from '../constants/theme'`.

### Accessibility
- Minimum text: 14px
- Minimum touch target: 44x44px
- Use `neutral500` or darker for body text

### TypeScript
- All screens use typed props from `src/types/navigation.ts`
- Use `DisplayMessage` type for chat messages
- Cross-navigator: `navigation.navigate('Home', { screen: 'History' })`

### Data Storage
Local-first (AsyncStorage). Supabase installed for future cloud backup.

---

## Reference Documentation

For detailed guidance, see these docs:

| Document | What's In It |
|----------|--------------|
| `docs/SESSION_HISTORY.md` | Past sessions, files added, skills log |
| `docs/AGENT_REVIEW_SUMMARIES.md` | Full details from all 8 reviews |
| `docs/DESIGN_INSIGHTS.md` | UI/UX principles for older users |
| `docs/ARCHITECTURE_INSIGHTS.md` | File organization, error boundaries |
| `docs/TYPESCRIPT_GUIDE.md` | Navigation types, patterns |
| `docs/MOBILE_DEVELOPMENT_GUIDE.md` | iOS/Android patterns, checklists |
| `docs/DATA_ARCHITECTURE.md` | Local storage rationale, scaling path |
| `docs/DEBUGGING_GUIDE.md` | Bug patterns, cleanup checklist |

---

## Essential Skills

| Skill | When to Load |
|-------|--------------|
| **react-native-specialist** | UI work, screens, navigation |
| **ai-integration** | AI chat, prompt engineering |
| **llm-architect** | AI personality, conversation design |
| **auth-specialist** | User accounts (future) |
| **stripe-integration** | Payments (next phase) |
| **growth-strategy** | Launch planning |
