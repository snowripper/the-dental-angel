/**
 * The Dental Angel - Theme Configuration
 * Lux Healthcare Palette — muted blues, cool neutrals, calming semantics
 * Designed for anxious patients aged 45-65+
 */

export const colors = {
  // Primary blues — muted, trustworthy healthcare blues (NOT Tailwind)
  primary: {
    50: '#F5F9FD', // Lightest tint, layered surfaces
    100: '#EBF3FA', // Page backgrounds, subtle differentiation
    200: '#D6E8F5', // Light card backgrounds, selected states
    300: '#5BA3D4', // Links, tertiary elements
    400: '#2D8AC7', // Secondary emphasis, active tab indicators
    500: '#1E6BB8', // Primary action buttons — MAIN
    600: '#175C9E', // Hover/pressed states
    700: '#124A80', // Active/darkest states
    // Legacy mappings
    lightest: '#F5F9FD',
    light: '#D6E8F5',
    main: '#1E6BB8',
    dark: '#175C9E',
    darkest: '#124A80',
  },

  // Cool neutrals — friendly but not clinical
  neutral: {
    50: '#F8F9FB', // Page background
    100: '#F0F2F5', // Card backgrounds
    200: '#E8EAF0', // Borders, separators
    300: '#D0D3DC', // Disabled elements
    400: '#B8BCCB', // Placeholder text, disabled states
    500: '#7B7F95', // Tertiary text, timestamps
    600: '#4A4E69', // Secondary text, descriptions
    700: '#3A3D4E', // Headings
    800: '#2D3142', // Primary text
    900: '#1E2030', // Darkest
    // Legacy mappings
    white: '#FFFFFF',
    offWhite: '#F8F9FB',
    lightGray: '#E8EAF0',
    gray: '#B8BCCB',
    darkGray: '#7B7F95',
    charcoal: '#3A3D4E',
    black: '#2D3142',
  },

  // Semantic colors — muted for healthcare calm
  accent: {
    success: '#2E7D5B', // Muted green for positive feedback
    successLight: '#EEF7F0', // Success backgrounds
    warning: '#C27624', // Warm amber for notices
    warningLight: '#FFF5E6', // Warning backgrounds
    error: '#B84C4C', // Muted red — errors only (never for attention)
    errorLight: '#FBEAEA', // Error backgrounds
  },

  // Special Dr. Angel colors
  angel: {
    gradientStart: '#5BA3D4', // Gradient start (muted)
    gradientEnd: '#7C6DBF', // Gradient end (muted purple)
    glow: 'rgba(30, 107, 184, 0.15)', // Avatar glow
    halo: '#D6E8F5', // Halo effect
  },

  // Family share colors — warm purple for "family" feel
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
