// Professional color palettes for light and dark themes
export const lightColors = {
  // Primary brand colors
  primary: '#5B67EA',
  primaryDark: '#4C56D4',
  primaryLight: '#7B85F0',
  secondary: '#8B5CF6',
  secondaryDark: '#7C3AED',

  // Background colors
  background: '#F5F7FA',
  backgroundSecondary: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text colors
  text: '#1A202C',
  textSecondary: '#718096',
  textTertiary: '#A0AEC0',
  textInverse: '#FFFFFF',

  // Semantic colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // UI element colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',

  // Chart colors
  chartColors: ['#5B67EA', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
};

export const darkColors = {
  // Primary brand colors (slightly softened for dark backgrounds)
  primary: '#8187FF',
  primaryDark: '#6366F1',
  primaryLight: '#A5B4FC',
  secondary: '#A855F7',
  secondaryDark: '#7C3AED',

  // Background colors
  background: '#020617', // slate-950
  backgroundSecondary: '#020617',
  surface: '#020617',
  surfaceElevated: '#020617',

  // Text colors
  text: '#E5E7EB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textInverse: '#020617',

  // Semantic colors
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#713F12',
  error: '#F97373',
  errorLight: '#7F1D1D',
  info: '#60A5FA',
  infoLight: '#0B1120',

  // UI element colors
  border: '#1F2937',
  borderLight: '#111827',
  divider: '#111827',
  shadow: 'rgba(15, 23, 42, 0.7)',
  shadowDark: 'rgba(15, 23, 42, 0.9)',

  // Chart colors
  chartColors: ['#8187FF', '#A855F7', '#EC4899', '#FBBF24', '#34D399', '#60A5FA'],
};

// Backwards-compatible default export so existing imports still work
export const colors = lightColors;

