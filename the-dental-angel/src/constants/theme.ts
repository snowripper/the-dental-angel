/**
 * The Dental Angel - Theme Configuration
 * Calming, soft blue palette designed to put patients at ease
 */

export const colors = {
  // Primary blues - soft, calming, trustworthy
  primary: {
    lightest: '#E8F4FC', // Very soft blue for backgrounds
    light: '#B8DCF0', // Light blue for cards/sections
    main: '#6BB3D9', // Main brand blue
    dark: '#4A9BC7', // Darker blue for emphasis
    darkest: '#2D7BA8', // Deep blue for headers
  },

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F8FAFC',
    lightGray: '#E2E8F0',
    gray: '#94A3B8',
    darkGray: '#64748B',
    charcoal: '#334155',
    black: '#1E293B',
  },

  // Accent colors
  accent: {
    success: '#10B981', // Green for positive feedback
    warning: '#F59E0B', // Amber for notices
    error: '#EF4444', // Red for errors (used sparingly)
  },

  // Special
  angel: {
    glow: '#E0F2FE', // Soft angelic glow
    halo: '#BAE6FD', // Halo effect
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 34,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  soft: {
    shadowColor: colors.primary.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.primary.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};
