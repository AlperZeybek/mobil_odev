import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

/**
 * Tab Navigator component
 */
export const TabNavigator = () => {
  const { colors, mode, toggleMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          letterSpacing: -0.3,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleMode}
            style={{
              marginRight: 16,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: colors.surfaceElevated,
              borderWidth: 1,
              borderColor: colors.borderLight,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.textSecondary,
              }}
            >
              {mode === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="Timer"
        component={HomeScreen}
        options={{
          title: 'Focus Timer',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="timer" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="bar-chart" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Simple icon component (using text as placeholder)
const TabIcon = ({ name, color, size }) => {
  const iconMap = {
    timer: '⏱️',
    'bar-chart': '📊',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '•'}
    </Text>
  );
};

