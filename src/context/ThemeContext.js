import React, { createContext, useContext, useState, useMemo } from 'react';
import { Appearance } from 'react-native';
import { lightColors, darkColors } from '../styles/colors';

/**
 * Theme context to manage light / dark mode
 * Does not change any business logic, only provides color tokens.
 */
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const systemScheme = Appearance.getColorScheme?.() || 'light';
  const [mode, setMode] = useState(systemScheme === 'dark' ? 'dark' : 'light');

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => {
    const colors = mode === 'dark' ? darkColors : lightColors;
    return {
      mode,
      colors,
      toggleMode,
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};


