export const darkColors = {
  background: '#3A3A32', surface: '#4A4A3E', primary: '#F0E68C',
  income: '#7FBF7F', expense: '#E08D6D', savings: '#6FBFBF',
  warning: '#E8B84B', textPrimary: '#F5F0DC', textSecondary: '#A8A895',
  border: '#5A5A4C',
};
export const lightColors = {
  background: '#F7F5EC', surface: '#FFFFFF', primary: '#C9A227',
  income: '#3E8E3E', expense: '#C1502E', savings: '#2E8E8E',
  warning: '#B8860B', textPrimary: '#2A2A22', textSecondary: '#6B6B5C',
  border: '#DDD9C8',
};
export const typography = {
  display: { fontSize: 40, fontWeight: '700' as const },
  h1: { fontSize: 22, fontWeight: '700' as const },
  h2: { fontSize: 18, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, fontWeight: '500' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  micro: { fontSize: 10, fontWeight: '500' as const },
};

export const radii = { card: 12, pill: 999, progressBar: 8 };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export type ThemeColors = typeof darkColors;