import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TabNavigator } from './src/navigation/TabNavigator';
import { initDatabase } from './src/data/database';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { colors as staticColors } from './src/styles/colors';

/**
 * Inner app component that has access to theme context
 */
const ThemedApp = () => {
  const { colors, mode } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize database on app start
    const initializeApp = async () => {
      try {
        await initDatabase();
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>
          Please restart the app
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <TabNavigator />
    </NavigationContainer>
  );
};

/**
 * Main App component
 */
export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: staticColors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: staticColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: staticColors.background,
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: staticColors.error,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: staticColors.textSecondary,
    textAlign: 'center',
  },
});

