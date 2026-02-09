/**
 * The Dental Angel - Theme Configuration
 * Updated to match IdeaRalph Design Spec v2.0
 * Calming blues with warm neutrals - designed for 45-65 year old patients
 */

export const colors = {
  // Primary blues - calming, trustworthy (Tailwind blue scale)
  primary: {
    50: '#EFF6FF', // Lightest backgrounds
    100: '#DBEAFE', // Hover backgrounds
    200: '#BFDBFE', // Subtle borders
    300: '#93C5FD', // Secondary elements
    400: '#60A5FA', // Interactive
    500: '#3B82F6', // Primary buttons - MAIN
    600: '#2563EB', // Hover states
    700: '#1D4ED8', // Active states
    // Legacy mappings for backwards compatibility
    lightest: '#EFF6FF',
    light: '#BFDBFE',
    main: '#3B82F6',
    dark: '#2563EB',
    darkest: '#1D4ED8',
  },

  // Warm neutral grays (Tailwind stone scale) - NOT clinical
  neutral: {
    50: '#FAFAF9', // Page background
    100: '#F5F5F4', // Card backgrounds
    200: '#E7E5E4', // Borders
    300: '#D6D3D1', // Disabled
    400: '#A8A29E', // Placeholder text
    500: '#78716C', // Secondary text
    600: '#57534E', // Body text
    700: '#44403C', // Headings
    800: '#292524', // Primary text
    900: '#1C1917', // Darkest
    // Legacy mappings
    white: '#FFFFFF',
    offWhite: '#FAFAF9',
    lightGray: '#E7E5E4',
    gray: '#A8A29E',
    darkGray: '#78716C',
    charcoal: '#44403C',
    black: '#292524',
  },

  // Semantic colors
  accent: {
    success: '#22C55E', // Green for positive feedback
    successLight: '#DCFCE7', // Success backgrounds
    warning: '#F59E0B', // Amber for notices
    warningLight: '#FEF3C7', // Warning backgrounds
    error: '#EF4444', // Red for errors (used sparingly)
    errorLight: '#FEE2E2', // Error backgrounds
  },

  // Special Dr. Angel colors
  angel: {
    gradientStart: '#60A5FA', // Gradient start
    gradientEnd: '#818CF8', // Gradient end (purple tint)
    glow: 'rgba(96, 165, 250, 0.2)', // Avatar glow
    halo: '#93C5FD', // Halo effect
  },

  // Family share colors - warm purple for "family" feel
  family: {
    primary: '#8B5CF6', // Purple
    light: '#F3E8FF',
  },

  // Convenience aliases for common use
  white: '#FFFFFF',
  transparent: 'transparent',
};

/**
 * Flat COLORS object for backwards compatibility
 * Use this when you need simple color access like COLORS.primary500
 */
export const COLORS = {
  // Primary blues
  primary50: colors.primary[50],
  primary100: colors.primary[100],
  primary200: colors.primary[200],
  primary300: colors.primary[300],
  primary400: colors.primary[400],
  primary500: colors.primary[500],
  primary600: colors.primary[600],
  primary700: colors.primary[700],

  // Neutrals
  neutral50: colors.neutral[50],
  neutral100: colors.neutral[100],
  neutral200: colors.neutral[200],
  neutral300: colors.neutral[300],
  neutral400: colors.neutral[400],
  neutral500: colors.neutral[500],
  neutral600: colors.neutral[600],
  neutral700: colors.neutral[700],
  neutral800: colors.neutral[800],
  neutral900: colors.neutral[900],

  // Semantic
  success: colors.accent.success,
  successLight: colors.accent.successLight,
  warning: colors.accent.warning,
  warningLight: colors.accent.warningLight,
  error: colors.accent.error,
  errorLight: colors.accent.errorLight,

  // Family share
  familyPrimary: colors.family.primary,
  familyLight: colors.family.light,

  // Basics
  white: colors.white,
  transparent: colors.transparent,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Typography scale (1.25 ratio - larger for older users)
// ACCESSIBILITY: Minimum 14px for all readable text (per WCAG & Nielsen Norman Group)
export const fontSize = {
  label: 14, // Form labels, tags - increased from 12 for accessibility
  small: 15, // Captions, timestamps - increased from 14
  body: 16, // Secondary content, user messages
  bodyLg: 18, // Dr. Angel messages (important!)
  h3: 22, // Card titles
  h2: 28, // Section headers
  h1: 36, // Page titles
  hero: 48, // Hero title
  // Legacy mappings - also updated for accessibility
  xs: 14, // Increased from 12
  sm: 15, // Increased from 14
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 36,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  label: 16,
  small: 20,
  body: 24,
  bodyLg: 28,
  h3: 28,
  h2: 36,
  h1: 44,
  hero: 52,
};

export const borderRadius = {
  button: 8, // Buttons - updated from 16
  input: 8, // Input fields
  card: 12, // Cards
  bubble: 16, // Chat bubbles base
  avatar: 9999, // Full round
  // Legacy mappings
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nav: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  // Legacy
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
};

// Touch target minimum (for accessibility)
export const touchTarget = {
  min: 44,
  recommended: 48,
};
