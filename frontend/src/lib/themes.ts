export type ThemeName = 'light' | 'dark' | 'luxury' | 'blue' | 'green' | 'brown' | 'custom';

export interface ThemePreset {
  name: string;
  label: string;
  bg: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
}

export const THEMES: Record<ThemeName, ThemePreset> = {
  light: {
    name: 'light', label: 'Цагаан (Light)',
    bg: '#f8f9fa', surface: '#ffffff', text: '#1a1a2e',
    textSecondary: '#6b7280', accent: '#059669', accentHover: '#047857',
    border: '#f3f4f6',
  },
  dark: {
    name: 'dark', label: 'Хар (Dark)',
    bg: '#0a0a0f', surface: '#1a1a2e', text: '#f1f5f9',
    textSecondary: '#94a3b8', accent: '#34d399', accentHover: '#6ee7b7',
    border: '#1e293b',
  },
  luxury: {
    name: 'luxury', label: 'Хар + Алтан (Luxury)',
    bg: '#0c0a09', surface: '#1c1917', text: '#fef3c7',
    textSecondary: '#a8a29e', accent: '#d97706', accentHover: '#f59e0b',
    border: '#292524',
  },
  blue: {
    name: 'blue', label: 'Цэнхэр (Modern)',
    bg: '#eff6ff', surface: '#ffffff', text: '#1e3a5f',
    textSecondary: '#64748b', accent: '#2563eb', accentHover: '#1d4ed8',
    border: '#dbeafe',
  },
  green: {
    name: 'green', label: 'Ногоон (Nature)',
    bg: '#f0fdf4', surface: '#ffffff', text: '#14532d',
    textSecondary: '#65a30d', accent: '#16a34a', accentHover: '#15803d',
    border: '#dcfce7',
  },
  brown: {
    name: 'brown', label: 'Бор (Coffee Shop)',
    bg: '#faf7f2', surface: '#ffffff', text: '#44403c',
    textSecondary: '#78716c', accent: '#a16207', accentHover: '#854d0e',
    border: '#f5f0eb',
  },
  custom: {
    name: 'custom', label: 'Өөрийн өнгө (Custom)',
    bg: '#f8f9fa', surface: '#ffffff', text: '#1a1a2e',
    textSecondary: '#6b7280', accent: '#059669', accentHover: '#047857',
    border: '#f3f4f6',
  },
};

export function buildCustomTheme(primaryColor: string): ThemePreset {
  const isDark = isDarkColor(primaryColor);
  return {
    name: 'custom', label: 'Өөрийн',
    bg: isDark ? '#0f172a' : '#f8f9fa',
    surface: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#1a1a2e',
    textSecondary: isDark ? '#94a3b8' : '#6b7280',
    accent: primaryColor, accentHover: primaryColor,
    border: isDark ? '#334155' : '#f3f4f6',
  };
}

function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return (r*0.299 + g*0.587 + b*0.114) < 128;
}
