import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors } from '../constants/theme';

type ThemeContextValue = { colors: ThemeColors; isDark: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);
  const isDark = manualOverride !== null ? manualOverride : systemScheme !== 'light';
  const colors = isDark ? darkColors : lightColors;
  const toggleTheme = () => setManualOverride(!isDark);
  return <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};