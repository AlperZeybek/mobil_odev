import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { formatTime } from '../utils/dateUtils';

/**
 * Stat card component for displaying statistics
 */
export const StatCard = ({ title, value, unit, color = colors.primary }) => {
  const displayValue = unit === 'minutes' ? formatTime(value * 60) : value.toString();

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{displayValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: layout.paddingLarge,
    borderRadius: layout.borderRadiusMD,
    marginBottom: layout.marginMD,
    borderLeftWidth: 5,
    ...layout.shadowMedium,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.borderLight,
    borderRightColor: colors.borderLight,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: layout.spacingMD,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});

