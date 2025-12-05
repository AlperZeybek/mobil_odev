import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { TimerDisplay } from '../components/TimerDisplay';
import { CategoryPicker } from '../components/CategoryPicker';
import { SessionSummaryModal } from '../components/SessionSummaryModal';
import { saveSession } from '../data/database';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';

/**
 * Home screen with focus timer
 */
export const HomeScreen = () => {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);
  const [durationInput, setDurationInput] = useState('25');

  const handleSessionComplete = async (session) => {
    try {
      await saveSession(session);
      setCompletedSession(session);
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session');
    }
  };

  const {
    formattedTime,
    isRunning,
    selectedCategory,
    setSelectedCategory,
    distractionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
    initialDurationMinutes,
  } = useFocusTimer(handleSessionComplete);

  const handleStart = () => {
    if (!selectedCategory) {
      Alert.alert('Category Required', 'Please select a category before starting the timer.');
      return;
    }

    const success = startTimer();
    if (!success) {
      Alert.alert('Error', 'Please select a category before starting.');
    }
  };

  const handleDurationChange = (text) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0 && num <= 120) {
      setDurationInput(text);
      setDuration(num);
    } else if (text === '') {
      setDurationInput('');
    }
  };

  const handleCloseModal = () => {
    setShowSummaryModal(false);
    setCompletedSession(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.timerSection}>
        <TimerDisplay formattedTime={formattedTime} isRunning={isRunning} />
        
        {!isRunning && !selectedCategory && (
          <View style={styles.durationInputContainer}>
            <Text style={styles.durationLabel}>Duration (minutes):</Text>
            <TextInput
              style={styles.durationInput}
              value={durationInput}
              onChangeText={handleDurationChange}
              keyboardType="numeric"
              placeholder="25"
              maxLength={3}
            />
          </View>
        )}

        <CategoryPicker
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {distractionCount > 0 && (
          <View style={styles.distractionBadge}>
            <Text style={styles.distractionText}>
              Distractions: {distractionCount}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {!isRunning ? (
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={handleStart}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={pauseTimer}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetTimer}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SessionSummaryModal
        visible={showSummaryModal}
        session={completedSession}
        onClose={handleCloseModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: layout.paddingLarge,
  },
  timerSection: {
    alignItems: 'center',
  },
  durationInputContainer: {
    width: '100%',
    marginBottom: layout.margin,
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: layout.spacing,
  },
  durationInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius,
    padding: layout.padding,
    fontSize: 16,
    textAlign: 'center',
    width: 100,
    color: colors.text,
  },
  distractionBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: layout.padding,
    paddingVertical: layout.spacing,
    borderRadius: layout.borderRadius,
    marginTop: layout.margin,
  },
  distractionText: {
    color: colors.warning,
    fontWeight: '600',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: layout.spacing,
    marginTop: layout.marginLarge,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: layout.paddingLarge,
    paddingHorizontal: layout.paddingLarge * 2,
    borderRadius: layout.borderRadius,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.success,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  resetButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

