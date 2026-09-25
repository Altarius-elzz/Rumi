import { ThemeMode } from './types';

// Brand purple used across both themes
export const PRIMARY = '#6C5CE7';
export const PRIMARY_LIGHT = '#A78BFA';

// A friendly palette for user-created categories.
export const categoryPalette = [
  '#6C5CE7',
  '#00B894',
  '#0984E3',
  '#E17055',
  '#E84393',
  '#FDCB6E',
  '#00CEC9',
  '#FF7675',
  '#A29BFE',
  '#55EFC4',
];

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primarySoft: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  borderSoft: string;
  danger: string;
  success: string;
  overlay: string;
  gradientFrom: string;
  gradientTo: string;
  chipBg: string;
}

const light: ThemeColors = {
  primary: PRIMARY,
  primaryLight: PRIMARY_LIGHT,
  primarySoft: '#EDE9FF',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F9F9FB',
  text: '#1F2233',
  textMuted: '#6B7280',
  textFaint: '#9CA3AF',
  border: '#EEF0F5',
  borderSoft: '#E5E7EB',
  danger: '#FF6B6B',
  success: '#00B894',
  overlay: 'rgba(0,0,0,0.4)',
  gradientFrom: '#EDE9FF',
  gradientTo: '#F3E8FF',
  chipBg: '#F3F4F6',
};

const dark: ThemeColors = {
  primary: PRIMARY,
  primaryLight: PRIMARY_LIGHT,
  primarySoft: '#2D2455',
  background: '#111827',
  surface: '#1F2937',
  surfaceAlt: '#1A2130',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  textFaint: '#6B7280',
  border: '#374151',
  borderSoft: '#374151',
  danger: '#FF6B6B',
  success: '#00B894',
  overlay: 'rgba(0,0,0,0.55)',
  gradientFrom: '#1a1335',
  gradientTo: '#1e1040',
  chipBg: '#374151',
};

export function getColors(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? dark : light;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
  pill: 999,
};

export function cardShadow(mode: ThemeMode) {
  return mode === 'dark'
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 4,
      }
    : {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 3,
      };
}
