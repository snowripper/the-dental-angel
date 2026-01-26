/**
 * AI Service for The Dental Angel
 *
 * Connects to AI (OpenAI GPT-4o) to generate helpful, educational responses
 * about dental care. Supports both text and image analysis.
 */

import * as FileSystem from 'expo-file-system';
import { DENTAL_ANGEL_SYSTEM_PROMPT, IMAGE_ANALYSIS_PROMPT } from '../constants/angelPersonality';

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

interface ChatResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Get API key from environment
 */
const getApiKey = (): string | null => {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY || null;
};

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
  const apiKey = getApiKey();

  // If no API key, return a helpful demo response
  if (!apiKey) {
    return getDemoResponse(userMessage);
  }

  try {
    const messages: Message[] = [
      { role: 'system', content: DENTAL_ANGEL_SYSTEM_PROMPT },
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
      throw new Error(`API error: ${response.status}`);
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
    console.error('AI Service Error:', error);
    return {
      success: false,
      message: "I'm having a little trouble right now. Please try again in a moment!",
      error: error instanceof Error ? error.message : 'Unknown error',
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

    const messages: Message[] = [
      { role: 'system', content: DENTAL_ANGEL_SYSTEM_PROMPT },
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
I can see you've shared a dental-related image. In a full version of the app, I would describe specific features I notice — whether that's areas of the teeth, features on an X-ray, or items listed on a treatment plan document.

**Important note:**
I can describe what I see and educate you about what different things might mean, but I can't diagnose anything from a photo. Only your dentist, who can examine you in person with proper tools and lighting, can give you a real diagnosis.

**Questions to ask your dentist:**
Based on sharing images like this, here are good questions to bring up:
• "Can you show me what you're seeing in this area?"
• "What does this appearance typically indicate?"
• "Is this something we need to address now, or can we monitor it?"
• "What are my options for treatment?"

${userQuestion ? `\nYou asked: "${userQuestion}"\nI'd love to help you understand more about this — in the full version, I'll be able to give you specific educational information based on what I see in your image!` : ''}

**Next steps:**
Would you like to tell me more about what your dentist has already said? I'm happy to help you understand their recommendations and prepare questions for your next visit!`,
  };
}

/**
 * Demo responses when API key is not configured
 */
function getDemoResponse(userMessage: string): ChatResponse {
  const lowerMessage = userMessage.toLowerCase();

  // Check for common topics and provide relevant demo responses
  if (lowerMessage.includes('crown') || lowerMessage.includes('cap')) {
    return {
      success: true,
      message: `That's a great question about crowns!

A crown (sometimes called a "cap") is basically a protective cover that goes over your entire tooth — think of it like a helmet for a tooth that's been weakened or damaged.

**Why dentists recommend crowns:**
• A tooth has a large cavity that's too big for a regular filling
• A tooth has cracked or broken
• After a root canal (to protect the treated tooth)
• A tooth is severely worn down

**Good to know:** Depending on the situation, there are sometimes alternatives worth discussing — like a large filling or an onlay (a partial crown). Each option has different trade-offs in terms of durability, cost, and how much tooth structure is preserved.

**Questions to ask your dentist:**
• "What made you recommend a crown over other options?"
• "Are there alternatives that might work for my situation?"
• "What material do you recommend, and why?"
• "How long should I expect this crown to last?"

Your dentist has examined your tooth and knows things I can't see — these questions will help you understand their thinking!`,
    };
  }

  if (lowerMessage.includes('root canal')) {
    return {
      success: true,
      message: `Ah, root canals! They have quite the reputation, but let me put your mind at ease.

A root canal is actually a tooth-SAVING procedure. When the soft tissue inside your tooth (called the pulp) becomes infected or inflamed, a root canal removes that damaged tissue while keeping your natural tooth.

**Here's what surprises most people:** Modern root canals are usually no more uncomfortable than getting a filling! The scary reputation comes from decades ago when techniques weren't as advanced.

**Signs that might lead to a root canal:**
• Severe tooth pain
• Prolonged sensitivity to hot or cold
• Darkening of the tooth
• Swelling in nearby gums
• Sometimes NO symptoms at all (found on X-rays)

**Questions to ask your dentist:**
• "Can you show me what you see on the X-ray?"
• "What happens if we don't do the root canal?"
• "What's the success rate for this procedure?"
• "Will I need a crown afterward?"

Remember, your dentist has examined you and knows your specific situation. I'm just helping you understand the procedure!`,
    };
  }

  if (lowerMessage.includes('filling')) {
    return {
      success: true,
      message: `Fillings are one of the most common dental procedures — you're in good company!

A filling is exactly what it sounds like: your dentist removes the decayed part of your tooth and "fills" the space with a material to restore its shape and function.

**Types of filling materials:**
• **Composite (tooth-colored)**: Blends in with your tooth, popular for visible areas
• **Amalgam (silver)**: Very durable, often used for back teeth
• **Other options**: Gold, ceramic, glass ionomer

**Questions to ask your dentist:**
• "What type of filling material do you recommend for this tooth?"
• "How large is the cavity?"
• "How can I prevent more cavities in the future?"

The good news: fillings are typically quick procedures, and you'll be back to eating normally before you know it!`,
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
      message: `I understand — dental costs can be a real concern, and it's completely reasonable to want to understand what you're paying for.

**What goes into dental costs:**
• Materials and lab work (especially for crowns, implants, etc.)
• The dentist's training and expertise
• Practice overhead (staff, equipment, sterilization)
• Complexity of your specific case
• Geographic location (prices vary a lot by region)

**Important to know about insurance:**
Dental insurance typically covers a set dollar amount per year — it doesn't necessarily cover "what you need." Many necessary procedures aren't fully covered, and that's an insurance decision, not a reflection of whether you need the work.

**Questions to ask:**
• "Can you break down what's included in this cost?"
• "What's the most important thing to address if I can't do everything at once?"
• "Are there payment plan options available?"
• "What happens if I wait on some of this work?"

Your dentist should be happy to help you understand the costs and prioritize if needed.`,
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
