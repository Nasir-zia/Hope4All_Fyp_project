/**
 * Hope4All Theme Colors - Orphanage Aid App
 * Primary: Orange for hope/charity (#FF6B35)
 * Accent: Teal/Green for growth/trust (#4ECDC4, #45B7D1)
 * Neutrals adjusted for light/dark.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF6B35';
const tintColorDark = '#FFD1B3';  // Lighter orange variant for dark

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    primary: '#FF6B35',
    accent: '#4ECDC4',
    secondary: '#45B7D1',
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    card: '#F9FAFB',
    border: '#E5E7EB',
  },
  dark: {
    text: '#F3F4F6',
    background: '#111827',
    tint: tintColorDark,
    primary: '#F97316',
    accent: '#2DD4BF',
    secondary: '#0EA5E9',
    icon: '#D1D5DB',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    card: '#1F2937',
    border: '#374151',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

