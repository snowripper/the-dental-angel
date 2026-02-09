/**
 * AI Service for The Dental Angel
 *
 * Connects to AI (OpenAI GPT-4o) to generate helpful, educational responses
 * about dental care. Supports both text and image analysis.
 */

import * as FileSystem from 'expo-file-system';
import { DENTAL_ANGEL_SYSTEM_PROMPT, IMAGE_ANALYSIS_PROMPT } from '../constants/angelPersonality';
import {
  DENTIST_PROFILE,
  FAVORITE_ANALOGIES,
  TREATMENT_OPINIONS,
  QUESTIONS_BY_SITUATION,
  PERSONAL_TOUCHES,
  RED_FLAGS_TO_MENTION,
  COMMUNICATION_STYLE,
} from '../constants/drKnowledge';
import { userSettingsService } from './userSettingsService';
import { buildFeeContext } from '../constants/dentalFees';

// Configuration
const AI_CONFIG = {
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini', // Cost-effective and vision-capable
  visionModel: 'gpt-4o', // Full vision model for image analysis
  maxTokens: 1500,
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | MessageContent[];
}

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

export interface SecondOpinionScore {
  score: number;
  label: string;
  reason: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  error?: string;
  secondOpinionScore?: SecondOpinionScore;
}

/**
 * Build Dr. Angel's personal knowledge context
 *
 * This transforms the dentist's 40 years of real clinical expertise
 * into context that makes every AI response feel genuinely expert.
 */
function buildKnowledgeContext(): string {
  const analogies = Object.entries(FAVORITE_ANALOGIES)
    .map(([procedure, texts]) => `${procedure}: ${texts.join(' ')}`)
    .join('\n');

  const opinions = Object.entries(TREATMENT_OPINIONS)
    .map(([topic, data]) => {
      const questions = data.whatToAsk.map((q) => `  - ${q}`).join('\n');
      return `${topic}:\nPerspective: ${data.perspective}\nQuestions to suggest:\n${questions}`;
    })
    .join('\n\n');

  const redFlagsPlan = RED_FLAGS_TO_MENTION.inTreatmentPlans.map((r) => `- ${r}`).join('\n');
  const redFlagsBehavior = RED_FLAGS_TO_MENTION.inDentistBehavior.map((r) => `- ${r}`).join('\n');
  const redFlagsSymptoms = RED_FLAGS_TO_MENTION.inPatientSymptoms.map((r) => `- ${r}`).join('\n');

  const costQuestions = QUESTIONS_BY_SITUATION.aboutCost.map((q) => `- ${q}`).join('\n');

  const misconceptions = PERSONAL_TOUCHES.commonMisconceptions.map((m) => `- ${m}`).join('\n');

  return `
DR. ANGEL'S PERSONAL CLINICAL KNOWLEDGE
(Use this expertise naturally in your responses — this is what makes you uniquely helpful)

ABOUT YOU:
- Name: ${DENTIST_PROFILE.displayName}
- ${DENTIST_PROFILE.yearsOfExperience} years of clinical experience (1983-2022)
- UCLA Dental School graduate, advanced training at Las Vegas Institute
- Specialties: ${DENTIST_PROFILE.specialties.join(', ')}
- Philosophy: "${DENTIST_PROFILE.philosophy}"
- Style: "${DENTIST_PROFILE.practiceStyle}"

YOUR SIGNATURE PHRASES (use these naturally):
${COMMUNICATION_STYLE.signaturePhrases.map((p) => `- "${p}"`).join('\n')}

YOUR APPROACH:
- Trust-building: "${COMMUNICATION_STYLE.trustBuildingApproach}"
- Difficult news: ${COMMUNICATION_STYLE.difficultNewsApproach}
- Comfort style: ${COMMUNICATION_STYLE.comfortStyle}
- Cost concerns: ${COMMUNICATION_STYLE.costConcernsApproach}

YOUR EXPLANATIONS FOR COMMON PROCEDURES (use YOUR words, not generic ones):
${analogies}

YOUR TREATMENT OPINIONS (share these perspectives when relevant):
${opinions}

COST-RELATED QUESTIONS TO SUGGEST:
${costQuestions}

RED FLAGS IN TREATMENT PLANS (mention when relevant):
${redFlagsPlan}

RED FLAGS IN DENTIST BEHAVIOR (mention when relevant):
${redFlagsBehavior}

SYMPTOMS THAT NEED PROMPT ATTENTION (flag these):
${redFlagsSymptoms}

COMMON PATIENT MISCONCEPTIONS TO ADDRESS:
${misconceptions}

IMPORTANT: Weave this knowledge naturally into your responses. Don't dump everything at once.
Reference "in my experience" or "in my 40 years of practice" when sharing these perspectives.
This knowledge is what makes you different from a generic AI — USE IT.`;
}

/**
 * Build location context so the AI can give area-appropriate fee guidance
 */
async function buildPatientContext(): Promise<string> {
  const settings = await userSettingsService.get();
  const parts: string[] = [];

  if (settings.firstName) {
    parts.push('\nPATIENT NAME:');
    parts.push(
      `- The patient's first name is ${settings.firstName}. Use their name naturally in conversation to make it personal and warm.`
    );
    parts.push(
      `- Don't overuse it — sprinkle it in occasionally, especially at the start and end of responses.`
    );
  }

  if (settings.zipCode) {
    // Include full fee reference data for their area
    parts.push(buildFeeContext(settings.zipCode));
  } else if (settings.state && settings.state !== 'international') {
    const stateLabel = userSettingsService.getStateLabel(settings.state);
    parts.push('\nPATIENT LOCATION CONTEXT:');
    parts.push(`- State: ${stateLabel}`);
    parts.push(
      '- When the patient asks about fees or costs, note that you can give better estimates if they add their zip code in Settings.',
      '- Dental fees vary significantly by region. Urban and coastal areas tend to be higher than rural and midwest areas.',
      '- Still remind them that fees vary by practice and to ask their dentist for a full breakdown.'
    );
  } else if (settings.state === 'international' || !settings.state) {
    parts.push(`
INTERNATIONAL PATIENT — FEE GUIDANCE:
This patient may be located outside the United States. You do not have specific fee data for their country.

When they ask about fees or costs:
- Acknowledge that dental fees vary enormously from country to country
- Do NOT quote US dollar ranges — those would be misleading
- Instead, help them evaluate whether a fee is reasonable by suggesting they:
  1. Ask other local dentists for a comparison quote (this is normal and expected everywhere)
  2. Ask their dentist to break down what's included in the fee (materials, follow-ups, warranty)
  3. Check if their country has a dental association that publishes fee guidelines
  4. Ask if the fee includes everything or if there will be additional charges
- You can mention general patterns that apply worldwide:
  - Specialists typically charge more than general dentists
  - Larger cities tend to be more expensive than smaller towns
  - More experienced dentists may charge more
  - Higher-quality materials (e.g. zirconia vs. metal crowns) cost more
  - Multiple procedures done together sometimes get a discount
- Be encouraging: "Getting a fee comparison from another dentist in your area is a smart move and completely normal"
- Remember to respond in whatever language the patient uses`);
  }

  return parts.join('\n');
}

/**
 * Get API key from environment
 */
const getApiKey = (): string | null => {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY || null;
};

/**
 * Parse Second Opinion Score from AI response
 */
function parseSecondOpinionScore(response: string): {
  cleanMessage: string;
  score?: SecondOpinionScore;
} {
  const scoreRegex =
    /---SECOND_OPINION_SCORE---\s*SCORE:\s*(\d+)\s*LABEL:\s*"?([^"\n]+)"?\s*REASON:\s*([^\n]+)\s*---END_SCORE---/i;
  const match = response.match(scoreRegex);

  if (match) {
    const cleanMessage = response.replace(scoreRegex, '').trim();
    return {
      cleanMessage,
      score: {
        score: parseInt(match[1], 10),
        label: match[2].trim(),
        reason: match[3].trim(),
      },
    };
  }

  return { cleanMessage: response };
}

/**
 * Convert a local image URI to base64
 */
async function imageToBase64(imageUri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

/**
 * Send a message to The Dental Angel and get a response
 */
export async function sendMessageToAngel(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<ChatResponse> {
  // Prevent empty messages from wasting API calls
  if (!userMessage.trim()) {
    return {
      success: false,
      message: 'Please type a message first!',
    };
  }

  const apiKey = getApiKey();

  // If no API key, return a helpful demo response
  if (!apiKey) {
    return getDemoResponse(userMessage);
  }

  try {
    const patientContext = await buildPatientContext();
    const messages: Message[] = [
      { role: 'system', content: DENTAL_ANGEL_SYSTEM_PROMPT },
      { role: 'system', content: buildKnowledgeContext() + patientContext },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(AI_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // Provide user-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('API_KEY_INVALID');
      } else if (response.status === 429) {
        throw new Error('RATE_LIMITED');
      } else if (response.status >= 500) {
        throw new Error('SERVICE_UNAVAILABLE');
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    // Parse out the Second Opinion Score if present
    const { cleanMessage, score } = parseSecondOpinionScore(assistantMessage);

    return {
      success: true,
      message: cleanMessage,
      secondOpinionScore: score,
    };
  } catch (error) {
    console.error('AI Service Error:', error);

    // Provide specific, user-friendly error messages
    let userMessage = "I'm having a little trouble right now. Please try again in a moment!";
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage === 'API_KEY_INVALID') {
      userMessage =
        "There's a configuration issue on our end. Please contact support if this continues.";
    } else if (errorMessage === 'RATE_LIMITED') {
      userMessage = "I'm getting a lot of questions right now! Please wait a moment and try again.";
    } else if (errorMessage === 'SERVICE_UNAVAILABLE') {
      userMessage = 'The service is temporarily unavailable. Please try again in a few minutes.';
    } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      userMessage =
        'It looks like you might be offline. Please check your internet connection and try again.';
    }

    return {
      success: false,
      message: userMessage,
      error: errorMessage,
    };
  }
}

/**
 * Analyze an image (photo of teeth, X-ray, or treatment plan document)
 */
export async function analyzeImage(imageUri: string, userQuestion?: string): Promise<ChatResponse> {
  const apiKey = getApiKey();

  // If no API key, return demo response for image analysis
  if (!apiKey) {
    return getDemoImageResponse(userQuestion);
  }

  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);

    // Determine image type from URI
    const imageType = imageUri.toLowerCase().includes('.png') ? 'png' : 'jpeg';
    const dataUrl = `data:image/${imageType};base64,${base64Image}`;

    // Build the user message with image
    const userContent: MessageContent[] = [
      {
        type: 'text',
        text: userQuestion
          ? `${IMAGE_ANALYSIS_PROMPT}\n\nThe patient asks: "${userQuestion}"`
          : IMAGE_ANALYSIS_PROMPT,
      },
      {
        type: 'image_url',
        image_url: {
          url: dataUrl,
          detail: 'high', // High detail for dental images
        },
      },
    ];

    const patientContext = await buildPatientContext();
    const messages: Message[] = [
      { role: 'system', content: DENTAL_ANGEL_SYSTEM_PROMPT },
      { role: 'system', content: buildKnowledgeContext() + patientContext },
      { role: 'user', content: userContent },
    ];

    const response = await fetch(AI_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.visionModel, // Use vision model for images
        messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    return {
      success: true,
      message: assistantMessage,
    };
  } catch (error) {
    console.error('Image Analysis Error:', error);
    return {
      success: false,
      message:
        'I had trouble analyzing that image. Could you try taking another photo with better lighting? Make sure the image is clear and in focus.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Demo response for image analysis when no API key is configured
 */
function getDemoImageResponse(userQuestion?: string): ChatResponse {
  return {
    success: true,
    message: `Thanks for sharing that image! Let me take a look...

**What I observe:**
This looks like a treatment plan document from your dentist. Let me break down each item for you in plain English:

**1. Crown - Porcelain/Ceramic (D2740) — Tooth #14 — $1,200**
${FAVORITE_ANALOGIES.crown[0]} This is one of the more common procedures I saw in my 40 years of practice.

**2. Root Canal - Molar (D3330) — Tooth #14 — $1,500**
${FAVORITE_ANALOGIES.rootCanal[0]} When a tooth's nerve is infected or dying, this is the standard treatment to save it.

**3. Bitewing X-rays (D0274) — $65**
These X-rays help your dentist see between your teeth where cavities like to hide. A routine part of checkups — nothing to worry about!

**Total estimate: $2,765**

**Important note:**
I can't give specific advice since I haven't examined you, but I can tell you these are all very common procedures. The key is making sure you understand WHY each one is recommended.

**Questions to ask your dentist:**
• "Can you show me exactly what you're seeing that leads to the crown recommendation?"
• "Are there alternatives to the crown, like an onlay?"
• "What happens if I wait on any of these?"
• "What's the most important to address first?"

${userQuestion ? `\nYou asked: "${userQuestion}"\nGreat question! Your dentist can give you the specific answer, but I'm happy to help you understand the general concepts.` : ''}

I've got your back! Take these questions to your next appointment.

---TREATMENT_ITEMS---
ITEM: D2740 | Crown - Porcelain/Ceramic | Tooth #14 | 1200 | A protective cover that strengthens a weakened or damaged tooth | 6
ITEM: D3330 | Root Canal - Molar | Tooth #14 | 1500 | Removes infection from inside the tooth to save it rather than extract it | 9
ITEM: D0274 | Bitewing X-rays (4 films) | | 65 | Routine X-rays that help spot cavities hiding between teeth | 10
---END_TREATMENT_ITEMS---`,
  };
}

/**
 * Demo responses when API key is not configured
 */
function getDemoResponse(userMessage: string): ChatResponse {
  const lowerMessage = userMessage.toLowerCase();

  // Check for common topics and provide relevant demo responses using Dr. Angel's real expertise
  if (lowerMessage.includes('crown') || lowerMessage.includes('cap')) {
    return {
      success: true,
      message: `That's a great question about crowns! Let me break this down in plain English...

${FAVORITE_ANALOGIES.crown[0]}

**Here's what I've learned in my 40 years of practice:**

${TREATMENT_OPINIONS.crownVsFillingDecision.perspective}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.crownVsFillingDecision.whatToAsk.map((q) => `• "${q}"`).join('\n')}

And here's something important to keep in mind: ${PERSONAL_TOUCHES.commonMisconceptions[0]}

I've got your back on this. Your dentist has examined your tooth and knows things I can't see — these questions will help you have a great conversation with them!`,
      secondOpinionScore: {
        score: 6,
        label: 'Situational',
        reason:
          'Crowns are common but alternatives like onlays or large fillings may work depending on the extent of damage and remaining tooth structure. Worth discussing options with your dentist.',
      },
    };
  }

  if (lowerMessage.includes('root canal')) {
    return {
      success: true,
      message: `Ah, root canals! They have quite the reputation, but let me put your mind at ease. Here's what I'd want to know if I were in your shoes...

${FAVORITE_ANALOGIES.rootCanal[0]}

**In my 40 years of practice, here's what I've found:**

${TREATMENT_OPINIONS.rootCanalVsExtraction.perspective}

**Signs that might lead to a root canal:**
• Severe tooth pain, especially pain that wakes you up at night
• Prolonged sensitivity to hot or cold that lingers
• Darkening of the tooth
• Swelling in nearby gums
• Sometimes NO symptoms at all (found on X-rays)

Here's something many patients don't realize: ${PERSONAL_TOUCHES.commonMisconceptions[2]}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.rootCanalVsExtraction.whatToAsk.map((q) => `• "${q}"`).join('\n')}
• "Will I need a crown afterward?"

We're in this together. Your dentist has examined you and can give specific guidance — these questions will help you have a great conversation with them!`,
      secondOpinionScore: {
        score: 9,
        label: 'Very Common',
        reason:
          "When a tooth's pulp is infected or dying, a root canal is the standard treatment to save the tooth. Saving your natural tooth is almost always the better choice.",
      },
    };
  }

  if (lowerMessage.includes('filling')) {
    return {
      success: true,
      message: `That's a great question! Fillings are one of the most common dental procedures — let me explain this in plain English...

${FAVORITE_ANALOGIES.filling[0]}

**Silver vs. white fillings — here's what I tell my patients:**

${TREATMENT_OPINIONS.amalgamVsComposite.perspective}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.amalgamVsComposite.whatToAsk.map((q) => `• "${q}"`).join('\n')}
• "How can I prevent more cavities in the future?"

The good news: fillings are typically quick procedures, and you'll be back to eating normally before you know it! I've got your back.`,
      secondOpinionScore: {
        score: 10,
        label: 'Very Common',
        reason:
          'Filling a cavity is the standard of care to prevent decay from spreading deeper into the tooth.',
      },
    };
  }

  if (
    lowerMessage.includes('hurt') ||
    lowerMessage.includes('pain') ||
    lowerMessage.includes('scared') ||
    lowerMessage.includes('nervous') ||
    lowerMessage.includes('afraid') ||
    lowerMessage.includes('anxiety')
  ) {
    return {
      success: true,
      message: `I hear you, and those feelings are completely valid! Dental anxiety is incredibly common — you're definitely not alone.

**Good news:** Dentistry has come a LONG way. Modern techniques, better anesthetics, and more awareness about patient comfort mean that most procedures today are much more comfortable than you might expect.

**Things that might help:**
• **Tell your dentist how you feel** — Good dentists want to know so they can help
• **Agree on a signal** — Like raising your hand if you need a break
• **Ask about options** — Sedation or nitrous oxide (laughing gas) are available for many procedures
• **Bring headphones** — Music or podcasts can help you relax
• **Start with something small** — Build positive experiences

**Questions to ask your dental office:**
• "What do you do to help nervous patients?"
• "Can you explain each step before you do it?"
• "Can we take breaks if I need them?"

You're taking a great step just by asking about this. Your comfort matters!`,
    };
  }

  if (
    lowerMessage.includes('cost') ||
    lowerMessage.includes('expensive') ||
    lowerMessage.includes('price') ||
    lowerMessage.includes('afford')
  ) {
    return {
      success: true,
      message: `I completely understand — dental costs can feel overwhelming, and it's completely reasonable to want to understand what you're paying for. There's no rush — let's make sure you understand your options.

**Here's what I always told my patients about costs:**

${COMMUNICATION_STYLE.costConcernsApproach}

**Something important about dental insurance:**
${PERSONAL_TOUCHES.commonMisconceptions[1]}

**Questions to ask your dentist:**
${QUESTIONS_BY_SITUATION.aboutCost.map((q) => `• "${q}"`).join('\n')}

And here's a red flag to be aware of: ${RED_FLAGS_TO_MENTION.inDentistBehavior[0]}

I've got your back on this. A good dentist will work with you to find a path forward that makes sense for your situation.`,
    };
  }

  if (lowerMessage.includes('implant')) {
    return {
      success: true,
      message: `Great question about implants! Let me explain this in plain English...

${FAVORITE_ANALOGIES.implant[0]}

**Here's what I'd want you to know from my experience:**

${TREATMENT_OPINIONS.implantVsBridge.perspective}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.implantVsBridge.whatToAsk.map((q) => `• "${q}"`).join('\n')}

We're in this together — these questions will help you have a really productive conversation with your dentist!`,
      secondOpinionScore: {
        score: 8,
        label: 'Commonly Recommended',
        reason:
          "Implants have become the standard of care for replacing missing teeth because they are self-supporting and don't affect adjacent teeth.",
      },
    };
  }

  if (lowerMessage.includes('bridge')) {
    return {
      success: true,
      message: `Let me explain bridges in plain English...

${FAVORITE_ANALOGIES.bridge[0]}

**Here's what my 40 years of experience has taught me:**

${TREATMENT_OPINIONS.implantVsBridge.perspective}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.implantVsBridge.whatToAsk.map((q) => `• "${q}"`).join('\n')}

I've got your back. Your dentist can help you weigh these options based on your specific situation!`,
      secondOpinionScore: {
        score: 6,
        label: 'Situational',
        reason:
          'Bridges are a valid option but implants have become the standard of care. The best choice depends on the condition of adjacent teeth and your specific situation.',
      },
    };
  }

  if (
    lowerMessage.includes('veneer') ||
    lowerMessage.includes('cosmetic') ||
    lowerMessage.includes('smile')
  ) {
    return {
      success: true,
      message: `Let me tell you about veneers — this was one of my specialties!

${FAVORITE_ANALOGIES.veneer[0]}

**From my experience in cosmetic dentistry:**

${TREATMENT_OPINIONS.cosmeticTreatments.perspective}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.cosmeticTreatments.whatToAsk.map((q) => `• "${q}"`).join('\n')}

The smile is extremely important — it's one of the most powerful forms of communication. I've seen cosmetic work change people's lives, both personally and professionally. Just make sure you understand the long-term commitment involved!`,
      secondOpinionScore: {
        score: 5,
        label: 'Situational',
        reason:
          'Cosmetic procedures are elective and depend entirely on your goals. Multiple options exist with different tradeoffs in cost, durability, and appearance.',
      },
    };
  }

  if (
    lowerMessage.includes('tmj') ||
    lowerMessage.includes('jaw') ||
    lowerMessage.includes('grinding') ||
    lowerMessage.includes('clench')
  ) {
    return {
      success: true,
      message: `This is actually one of my specialties — I did advanced training in TMJ treatment at the Las Vegas Institute. Let me help you understand what might be going on.

${TREATMENT_OPINIONS.tmjTreatment.perspective}

**About night guards:**
${FAVORITE_ANALOGIES.nightGuard[0]}

**Symptoms to pay attention to:**
• ${RED_FLAGS_TO_MENTION.inPatientSymptoms[5]}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.tmjTreatment.whatToAsk.map((q) => `• "${q}"`).join('\n')}

This is an area where expertise really matters. I've got your back — feel free to ask me anything else about this!`,
    };
  }

  if (
    lowerMessage.includes('extraction') ||
    lowerMessage.includes('pull') ||
    lowerMessage.includes('remove')
  ) {
    return {
      success: true,
      message: `I understand — the idea of having a tooth pulled can feel scary. Let me help you understand what's involved.

${FAVORITE_ANALOGIES.extraction[0]}

**From my experience:**
${TREATMENT_OPINIONS.rootCanalVsExtraction.perspective}

**Questions to ask your dentist:**
${TREATMENT_OPINIONS.rootCanalVsExtraction.whatToAsk.map((q) => `• "${q}"`).join('\n')}
${QUESTIONS_BY_SITUATION.beforeExtraction.map((q) => `• "${q}"`).join('\n')}

There's no rush — let's make sure you understand all your options. Your dentist can help you decide what's best for your specific situation.`,
      secondOpinionScore: {
        score: 7,
        label: 'Commonly Recommended',
        reason:
          'Extraction is typically recommended when a tooth cannot be saved. But always ask if there are alternatives to preserve your natural tooth.',
      },
    };
  }

  if (
    lowerMessage.includes('treatment plan') ||
    lowerMessage.includes('second opinion') ||
    lowerMessage.includes('too much') ||
    lowerMessage.includes('trust') ||
    lowerMessage.includes('rip')
  ) {
    return {
      success: true,
      message: `I completely understand why you're feeling uncertain. In my 40 years of practice, I always encouraged patients to ask questions until they felt comfortable. That's exactly what you're doing — and it shows great judgment.

**Here are some red flags I always told my patients to watch for:**
${RED_FLAGS_TO_MENTION.inTreatmentPlans.map((r) => `• ${r}`).join('\n')}

**And about your dentist's approach:**
${RED_FLAGS_TO_MENTION.inDentistBehavior.map((r) => `• ${r}`).join('\n')}

**Questions to ask:**
• "Can we discuss all the possible treatment alternatives?"
• "Can we prioritize so I can do the most important things first?"
• "${QUESTIONS_BY_SITUATION.secondOpinion[0]}"

Remember: a good dentist welcomes your questions. You deserve to feel heard and cared for. I've got your back!`,
    };
  }

  // Default response
  return {
    success: true,
    message: `That's a great question!

I'm here to help you understand your dental care better. While I'd love to give you a detailed answer right now, I want to make sure I give you the best information possible.

**General tips:**
• Write down your questions before your appointment
• Ask your dentist to explain things in simple terms if something's confusing
• Don't be shy about asking "why" — good dentists love explaining their recommendations
• Remember: there are no dumb questions when it comes to your health!

**I can help you understand:**
• Specific procedures (crowns, fillings, root canals, etc.)
• Why something might be recommended
• What questions to ask your dentist
• Anything that's making you nervous

What specifically would you like to know more about?`,
  };
}
