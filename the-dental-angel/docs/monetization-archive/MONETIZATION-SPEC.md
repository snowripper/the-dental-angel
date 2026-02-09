# The Dental Angel — Monetization Specification

**Document Purpose:** Technical specification for implementing the monetization system in The Dental Angel app.

**Last Updated:** February 2026

---

## Overview

The Dental Angel uses a **one-time purchase model** (not subscription) with three paid tiers plus a free preview. This matches the user behavior: patients need help once, then may not return for years.

---

## Tier Structure

### Tier 0: Free Preview
- **Price:** $0
- **Purpose:** Build trust, demonstrate value, drive conversions
- **Access:**
  - Sample AI conversations (pre-recorded examples)
  - Video library with general dental education
  - General information about dental procedures
- **Restrictions:**
  - Cannot chat about their own treatment plan
  - Cannot upload documents
  - No personalized analysis

### Tier 1: Quick Answers
- **Price:** $29 USD (base)
- **Access Duration:** 7 days from purchase
- **Features:**
  - AI chat about user's specific treatment plan
  - Upload treatment plan document (image/PDF)
  - Plain-language explanations of procedures
  - Basic suggested questions for dentist
- **Limitations:**
  - No cost comparison data
  - No printable summary
  - No red flags checklist

### Tier 2: Full Prep (Primary Tier)
- **Price:** $49 USD (base)
- **Access Duration:** 14 days from purchase
- **Features:**
  - Everything in Quick Answers, plus:
  - Cost comparison data for user's region
  - Printable "Questions for Your Dentist" sheet (PDF download)
  - Saveable/shareable treatment summary (PDF download)
  - Red flags checklist (warning signs of unnecessary treatment)
  - Alternative treatment options to ask about
- **UI Note:** Mark as "Most Popular" with visual emphasis

### Tier 3: Expert Review
- **Price:** $149 USD (base)
- **Access Duration:** 14 days from purchase
- **Features:**
  - Everything in Full Prep, plus:
  - Personal review by Dr. Angel
  - Written assessment document (PDF)
  - Direct communication channel with dentist (if implemented)
- **Operational Notes:**
  - Limited availability (capacity constraint)
  - Requires manual fulfillment workflow
  - Estimated turnaround: 24-48 hours

---

## International Pricing

Prices vary by country based on purchasing power and local dental costs.

### Pricing Tiers by Region

#### Premium Markets (+10-20% from base)
| Country | Quick Answers | Full Prep | Expert Review | Currency |
|---------|---------------|-----------|---------------|----------|
| Switzerland | 32 | 54 | 164 | CHF |
| Norway | 319 | 539 | 1,649 | NOK |
| Denmark | 199 | 339 | 1,029 | DKK |
| Australia | 45 | 79 | 239 | AUD |

#### Standard Markets (Base pricing)
| Country | Quick Answers | Full Prep | Expert Review | Currency |
|---------|---------------|-----------|---------------|----------|
| United States | 29 | 49 | 149 | USD |
| UAE | 109 | 179 | 549 | AED |
| Qatar | 109 | 179 | 549 | QAR |
| United Kingdom | 22 | 38 | 112 | GBP |
| Germany | 27 | 45 | 135 | EUR |
| France | 27 | 45 | 135 | EUR |
| Netherlands | 27 | 45 | 135 | EUR |
| Canada | 39 | 65 | 199 | CAD |

#### Moderate Discount Markets (~30% off)
| Country | Quick Answers | Full Prep | Expert Review | Currency |
|---------|---------------|-----------|---------------|----------|
| Spain | 19 | 35 | 99 | EUR |
| Italy | 19 | 35 | 99 | EUR |
| Portugal | 19 | 35 | 99 | EUR |
| Japan | 3500 | 6000 | 18000 | JPY |
| South Korea | 29000 | 49000 | 149000 | KRW |
| Israel | 79 | 139 | 419 | ILS |
| Singapore | 29 | 49 | 149 | SGD |

#### Value Markets (~45% off)
| Country | Quick Answers | Full Prep | Expert Review | Currency |
|---------|---------------|-----------|---------------|----------|
| Brazil | 79 | 129 | 399 | BRL |
| Mexico | 349 | 599 | 1799 | MXN |
| Thailand | 499 | 899 | 2699 | THB |
| South Africa | 299 | 499 | 1499 | ZAR |
| Malaysia | 59 | 99 | 299 | MYR |
| Poland | 79 | 139 | 419 | PLN |

#### Emerging Markets (~65% off)
| Country | Quick Answers | Full Prep | Expert Review | Currency |
|---------|---------------|-----------|---------------|----------|
| India | 799 | 1499 | 4499 | INR |
| Indonesia | 149000 | 249000 | 749000 | IDR |
| Philippines | 499 | 899 | 2699 | PHP |
| Vietnam | 249000 | 449000 | 1349000 | VND |
| Turkey | 299 | 499 | 1499 | TRY |
| Egypt | 449 | 749 | 2249 | EGP |
| Pakistan | 2499 | 4499 | 12999 | PKR |

---

## Payment Implementation

### Recommended Approach
- Use Apple App Store and Google Play in-app purchases
- Both stores handle currency conversion, local payment methods, and tax
- Set prices manually per country (don't rely on automatic conversion)

### Purchase Flow
1. User selects tier
2. Native app store payment dialog
3. On success: unlock features, start access timer
4. Store purchase receipt for verification

### Access Management
- Track purchase date and tier in user account
- Calculate expiration: purchase_date + access_days
- After expiration: revert to Free Preview access
- Allow re-purchase at any time

---

## Feature Flags by Tier

| Feature | Free | Quick ($29) | Full ($49) | Expert ($149) |
|---------|------|-------------|------------|---------------|
| view_sample_conversations | true | true | true | true |
| view_video_library | true | true | true | true |
| ai_chat_personal | false | true | true | true |
| upload_treatment_plan | false | true | true | true |
| basic_questions | false | true | true | true |
| cost_comparison | false | false | true | true |
| printable_questions_pdf | false | false | true | true |
| treatment_summary_pdf | false | false | true | true |
| red_flags_checklist | false | false | true | true |
| alternative_options | false | false | true | true |
| expert_review | false | false | false | true |
| access_days | unlimited | 7 | 14 | 14 |

---

## UI/UX Requirements

### Pricing Page Layout
1. Show all three paid tiers side by side
2. Highlight "Full Prep" as "Most Popular" (green badge/border)
3. Use comparison table showing features per tier
4. Free preview accessible via separate "Try Free" link

### Paywall Triggers
Show upgrade prompt when free user attempts to:
- Start AI chat about their treatment
- Upload a treatment plan document
- Access any personalized feature

### Post-Purchase
- Confirmation screen with access duration
- Clear display of days remaining in app
- Reminder notification at 2 days and 1 day before expiration

---

## Copy/Messaging

### Tier Headlines
- **Free:** "See How It Works"
- **Quick Answers:** "Understand Your Treatment Plan"
- **Full Prep:** "Walk In Prepared, Walk Out Confident"
- **Expert Review:** "A Real Dentist Reviews Your Plan"

### Value Propositions
- **Quick Answers:** "Quick clarity when you just need to understand the basics"
- **Full Prep:** "Anyone facing a big decision who wants to feel fully prepared"
- **Expert Review:** "Complex cases, expensive treatment plans, or anyone who wants human expertise"

### Button Text
- Free: "Explore Free Content"
- Quick Answers: "Get Answers — $29"
- Full Prep: "Get Fully Prepared — $49"
- Expert Review: "Request Expert Review — $149"

---

## Analytics Events to Track

### Conversion Funnel
- `pricing_page_viewed`
- `tier_selected` (with tier_name)
- `purchase_initiated` (with tier_name, price, currency)
- `purchase_completed` (with tier_name, price, currency)
- `purchase_failed` (with tier_name, error_code)

### Usage
- `feature_used` (with feature_name, tier)
- `pdf_downloaded` (with pdf_type)
- `access_expired` (with tier_name)
- `re_purchase` (with previous_tier, new_tier)

### Paywall
- `paywall_shown` (with trigger_feature)
- `paywall_dismissed`
- `paywall_converted` (with tier_name)

---

## Revenue Projections

### Assumptions
- 5% free-to-paid conversion rate
- Tier split: 60% Quick / 30% Full / 10% Expert

### Per 1,000 Free Users (US pricing)
- 30 users × $29 = $870
- 15 users × $49 = $735
- 5 users × $149 = $745
- **Total: $2,350**

### With International (estimated +35%)
- **Total: ~$3,170 per 1,000 free users**

---

## Launch Phases

### Phase 1: English Markets
- United States
- United Kingdom
- Canada
- Australia

### Phase 2: Large International
- India
- Brazil
- Mexico
- Germany

### Phase 3: Expansion
- Rest of Europe
- Middle East
- Southeast Asia

---

## Legal/Compliance Notes

- App is **educational only** — not medical advice
- Include disclaimer on all AI responses
- Expert Review is opinion, not diagnosis
- Terms of service must reflect one-time purchase model
- Refund policy: follow app store guidelines

---

## Document History

| Date | Change |
|------|--------|
| Feb 2026 | Initial specification created |
