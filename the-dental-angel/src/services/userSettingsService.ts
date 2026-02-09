import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export type SubscriptionTier = 'free' | 'quick_answers' | 'full_prep' | 'expert';

export interface UserSettings {
  firstName: string | null; // Patient's first name for personalization
  state: string | null; // US state abbreviation or 'international'
  zipCode: string | null; // US zip code for local pricing context
  country: string; // Country code, defaults to 'US'
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: number | null; // Timestamp when subscription expires
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = 'dental_angel_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  firstName: null,
  state: null,
  zipCode: null,
  country: 'US',
  subscriptionTier: 'free',
  subscriptionExpiresAt: null,
  hasCompletedOnboarding: false,
};

// US States list
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'Washington D.C.' },
];

// Pricing tiers
export const PRICING_TIERS = {
  free: {
    name: 'Free Preview',
    price: 0,
    description: 'Sample conversations and video library',
    features: ['Sample AI conversations', 'Video library access', 'General dental information'],
  },
  quick_answers: {
    name: 'Quick Answers',
    price: 29,
    duration: 7, // days
    description: 'AI chat about YOUR treatment plan',
    features: [
      'AI chat for 7 days',
      'Treatment plan analysis',
      'Plain-language explanations',
      'Basic questions to ask',
    ],
  },
  full_prep: {
    name: 'Full Prep',
    price: 49,
    duration: 14, // days
    description: 'Everything you need to feel confident',
    features: [
      'Everything in Quick Answers',
      '14 days access',
      'Cost comparison data',
      'Printable questions sheet',
      'Treatment summary PDF',
      'Red flags checklist',
    ],
    recommended: true,
  },
  expert: {
    name: 'Expert Review',
    price: 149,
    duration: 14,
    description: 'Personal educational review from Dr. Angel',
    features: [
      'Everything in Full Prep',
      'Personal review by Dr. Angel',
      '40 years of dental expertise applied to your case',
      'Educational insights on your situation',
      'Tailored questions for your dentist',
      'Limited availability',
    ],
  },
};

export const userSettingsService = {
  // Get current settings
  async get(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (error) {
      console.error('Error loading user settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  // Save settings
  async save(settings: Partial<UserSettings>): Promise<void> {
    try {
      const current = await this.get();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  },

  // Set user's state
  async setState(state: string): Promise<void> {
    await this.save({ state });
  },

  // Set user's first name
  async setFirstName(firstName: string): Promise<void> {
    await this.save({ firstName });
  },

  // Set user's zip code
  async setZipCode(zipCode: string | null): Promise<void> {
    await this.save({ zipCode });
  },

  // Get state label from abbreviation
  getStateLabel(stateCode: string | null): string {
    if (!stateCode) return 'Not set';
    if (stateCode === 'international') return 'Outside USA';
    const state = US_STATES.find((s) => s.value === stateCode);
    return state ? state.label : stateCode;
  },

  // Check if subscription is active
  async isSubscriptionActive(): Promise<boolean> {
    const settings = await this.get();
    if (settings.subscriptionTier === 'free') return true; // Free is always active
    if (!settings.subscriptionExpiresAt) return false;
    return settings.subscriptionExpiresAt > Date.now();
  },

  // Get days remaining on subscription
  async getDaysRemaining(): Promise<number> {
    const settings = await this.get();
    if (!settings.subscriptionExpiresAt) return 0;
    const remaining = settings.subscriptionExpiresAt - Date.now();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  },
};
