import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { layout } from '../styles/layout';
import { useTheme } from '../context/ThemeContext';

/**
 * Timer display component showing remaining time
 */
export const TimerDisplay = ({ formattedTime, isRunning }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={[styles.timerCircle, isRunning && styles.timerCircleActive]}>
        <Text style={[styles.timeText, isRunning && styles.runningText]}>
          {formattedTime}
        </Text>
      </View>
      {isRunning && (
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Focusing</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: layout.paddingXS,
      marginBottom: layout.marginXS,
    },
    timerCircle: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...layout.shadowMedium,
      borderWidth: 3,
      borderColor: colors.borderLight,
    },
    timerCircleActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight + '10',
    },
    timeText: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 1,
      fontFamily: 'System',
    },
    runningText: {
      color: colors.primary,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: layout.marginXS,
      paddingHorizontal: layout.paddingMD,
      paddingVertical: layout.paddingXS,
      backgroundColor: colors.successLight,
      borderRadius: layout.borderRadiusRound,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
      marginRight: layout.spacing,
    },
    statusText: {
      fontSize: 13,
      color: colors.success,
      fontWeight: '600',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
  });

