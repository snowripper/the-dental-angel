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
- Document technical decisions in TECHNICAL.md (for future developers, not the user)

## When to Ask the User

Only for things that affect their experience. Frame it like:
- "This can load instantly but look simpler, or look richer but take 2 seconds. Which matters more?"
- "I can make this work on phones too, but it adds a day. Worth it?"

Never ask about: databases, APIs, frameworks, libraries, file organization, implementation details

## Engineering Standards (Apply Automatically)

- Clean, maintainable code
- Automated testing (unit, integration, e2e as appropriate)
- Self-verification — the system checks itself
- Friendly, non-technical error messages
- Input validation and security best practices
- Clear commit messages
- Dev/production environment separation

## Before Completing Any Task (Security Checklist)

Run these checks before marking work complete:

1. **Secrets Check**: Scan for hardcoded API keys, passwords, tokens, or credentials
2. **Injection Check**: Verify no SQL, shell, or path traversal vulnerabilities
3. **Input Validation**: Ensure all user inputs are validated and sanitized
4. **Type Safety**: Run `npm run typecheck` — no type errors allowed
5. **Linting**: Run `npm run lint` — no security warnings allowed
6. **Tests**: Run `npm test` — all tests must pass

**Quick command:** `cd the-dental-angel && npm run typecheck && npm run lint && npm test`

## Quality Assurance

- Test everything before showing the user
- Never show something broken
- Fix problems — don't explain technical issues
- Everything demonstrated should work

## Showing Progress

- Working demos he can click around and try (preferred)
- Screenshots or recordings when demos aren't practical
- Describe changes in terms of his experience
- Celebrate milestones in terms he cares about ("Patients can now upload their treatment plan and get an explanation" not "Implemented OCR and GPT integration")

---

## This Project: The Dental Angel

### What It Is

A mobile app that helps patients understand their dental treatment plans. When a patient receives a treatment plan they're unsure about, they can open the app and get clear, friendly explanations — powered by Dr. [Name]'s 40 years of dental expertise.

### The Problem It Solves

Patients often:
- Don't understand their treatment plan
- Feel they don't need certain treatments
- Wonder if they're being oversold
- Don't trust what the dentist says

They leave the office confused and uncertain, unsure whether to proceed.

### The Solution

A warm, friendly AI "dental angel" that:
- Explains procedures in plain language
- Helps patients understand why treatments might be recommended
- Suggests good questions to ask their dentist
- Empowers informed decision-making
- Available 24/7 in any language

### CRITICAL: Legal Positioning

**This is EDUCATION, not dental advice.**

The app must ALWAYS:
- Position itself as educational only
- Include clear disclaimers ("This is not dental advice. Always consult with your own dentist.")
- Never diagnose or recommend against treatment
- Never say "your dentist is wrong"
- Always encourage patients to discuss with their own dentist
- Frame responses as "here's what to understand" and "here's what to ask" — never "here's what to do"

**The tone:** "I can't tell you what to do since I haven't examined you, but here's what I'd want to know if I were in your shoes..."

This careful positioning protects against regulatory challenges from dental boards.

### Target Users

- Patients anywhere in the world who receive dental treatment plans
- People who want to understand before making decisions
- May include older users who aren't tech-savvy — simplicity is essential

### Look and Feel

**Colors:**
- Soft, light, muted shades of blue (calming, like a dental office should feel)
- Clean and uncluttered

**Personality:**
- Warm and approachable (most important)
- Trustworthy and professional
- Friendly, like talking to a knowledgeable friend
- Uses appropriate humor to put people at ease
- Human touch always present — never feels robotic

**Usability:**
- Super simple — even someone who struggles with apps should find it easy
- Clear, large text
- Obvious what to do next
- Minimal steps to get help

### Core Features (Must-Have)

1. **Conversational AI** — Patients can describe their situation or ask questions in plain language
2. **Treatment Plan Upload** — Take a photo or upload a treatment plan document
3. **Plain-Language Explanations** — Break down dental terminology and procedures
4. **Questions to Ask** — Suggest what to discuss with their dentist
5. **Multi-Language Support** — Works in any language automatically
6. **Mobile App** — Available on phones (iOS and Android)

### Nice-to-Have (Later)

- Save conversation history
- Share explanations with family members
- Common procedure library/glossary
- Cost transparency information
- Find a dentist feature

### The Personality (Voice of the AI)

The AI speaks like The Dental Angel — warm, friendly, conversational, with occasional gentle humor. It's like having a retired dentist uncle who you can call anytime.

Example response style:
"Ah, a crown on tooth #14! Let me help you understand what's going on there. A crown is basically a cap that covers and protects a tooth that's been damaged or weakened. Think of it like a helmet for your tooth. Now, there are several reasons your dentist might recommend one — let me walk you through the most common ones, and then I'll give you some great questions to ask at your next visit..."

### Success Metrics

- Number of patients helped
- User satisfaction/reviews
- Revenue generated
- International reach
- Zero regulatory issues

### Timeline

No rush. Get it right. Quality over speed.

---

## Technical Decisions (For Reference)

See TECHNICAL.md for implementation details. The user does not need to be consulted on technical architecture.

Key constraints that drive technical decisions:
- Must be a mobile app (iOS and Android)
- Must handle image uploads (treatment plan photos)
- Must support real-time AI conversation
- Must support multiple languages
- Must be extremely simple to use
- Must scale internationally
- Must be reliable and secure (health-adjacent data)

---

## Essential Skills for The Dental Angel

**IMPORTANT: At the start of each major building or brainstorming step, load the relevant skills listed below.**

### Core Development Skills (Always Relevant)

| Skill | Purpose | When to Load |
|-------|---------|--------------|
| **react-native-specialist** | Mobile app development with React Native/Expo | Any UI work, screen building, navigation, mobile-specific features |
| **ai-integration** | Connecting to AI services (OpenAI/Claude) | AI chat functionality, prompt engineering, response handling |
| **llm-architect** | Designing AI personality and conversation flow | Refining The Dental Angel's responses, conversation design |

### Feature-Specific Skills

| Skill | Purpose | When to Load |
|-------|---------|--------------|
| **auth-specialist** | User accounts and login systems | Setting up patient accounts, saving conversations |
| **stripe-integration** | Payment processing | Implementing subscriptions, payment tiers |
| **growth-strategy** | Marketing and user acquisition | Launch planning, user acquisition strategy |

### Future Skills (Load When Needed)

| Skill | Purpose | When to Load |
|-------|---------|--------------|
| **landing-page-design** | Marketing website | Building the promotional website |
| **ux-design** | User experience refinement | Polish phase, improving user flows |
| **pricing-strategy** | Monetization planning | Designing subscription tiers |
| **app-store-optimization** | App store listings | Preparing for iOS/Android launch |
| **analytics-integration** | Tracking success metrics | After launch, measuring impact |
| **localization** | Multi-language support | International expansion |
| **image-processing** | Treatment plan photo analysis | Enhancing photo upload feature |

### Skills by Development Phase

**Phase 1: Foundation (Current)**
- react-native-specialist
- ai-integration
- llm-architect

**Phase 2: Full AI Connection**
- ai-integration
- llm-architect
- react-native-specialist

**Phase 3: User Accounts**
- auth-specialist
- react-native-specialist

**Phase 4: Monetization**
- stripe-integration
- pricing-strategy

**Phase 5: Launch Preparation**
- landing-page-design
- growth-strategy
- app-store-optimization

**Phase 6: Polish & Scale**
- ux-design
- analytics-integration
- localization

---

## Skills Tracking Log

### Currently Loaded Skills
- react-native-specialist
- llm-architect
- ai-integration
- auth-specialist
- stripe-integration
- growth-strategy

### Skills Added History
| Date | Skill Added | Reason |
|------|-------------|--------|
| Session 1 | react-native-specialist | Core mobile development |
| Session 1 | llm-architect | AI personality design |
| Session 1 | ai-integration | Chat functionality |
| Session 1 | auth-specialist | Future user accounts |
| Session 1 | stripe-integration | Future payments |
| Session 1 | growth-strategy | Launch planning |

---

## Memory Commitments

**ALWAYS REMEMBER:**
1. At each new major building step, check this Skills section and load relevant skills
2. Update the Skills Tracking Log when new skills are added
3. The user is a non-technical retired dentist — never use jargon
4. Legal positioning is CRITICAL — education only, never dental advice
5. The AI personality should discuss treatment alternatives while never telling patients what to do
6. Simplicity is essential — users may not be tech-savvy
7. Warm, friendly, human touch in everything

---

## Current Status & Decisions

### Landing Page: SHELVED
The landing page (`landing-page/` folder) is on hold. Full focus is on the mobile app.

### Authentication: Simplified (No Account Required)
- Users tap "Get Started" and use the app immediately
- No email/password, no sign-up required
- Conversations saved locally on the phone
- Future: Add "Sign in with Apple/Google" when ready for cloud backup

### What's Working Now
- Welcome screen → Home screen flow
- Chat with AI (OpenAI GPT-4o connected)
- Treatment plan photo upload and analysis
- Conversation history (saved locally)
- AI personality with legal safeguards
- All tests passing
- TypeScript type checking clean
- EAS Build configured for app store deployment
- Camera and photo permissions configured for iOS/Android

### Ready for Testing
The app is ready to test on real phones! See `the-dental-angel/TESTING_GUIDE.md` for step-by-step instructions.

### Next Steps
1. **Test on real phones** - Use Expo Go to test all features
2. **Fix any issues found** - Polish based on real device testing
3. **Build preview apps** - Create installable APK/IPA files
4. **App store submission** - Submit to Apple App Store and Google Play

### Upcoming Features (After Testing)
1. Second Opinion Score - Confidence rating for treatments
2. Enhanced "Questions to Ask" - Copyable/shareable question lists
3. Premium tier with Stripe - $9.99/month for unlimited usage
4. Family Sharing - Share explanations via text/email/WhatsApp
