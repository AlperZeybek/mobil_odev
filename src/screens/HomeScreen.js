import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ImageBackground,
} from 'react-native';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { TimerDisplay } from '../components/TimerDisplay';
import { CategoryPicker } from '../components/CategoryPicker';
import { SessionSummaryModal } from '../components/SessionSummaryModal';
import { saveSession } from '../data/database';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../styles/layout';

/**
 * Home screen with focus timer
 */
export const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
    remainingSeconds,
    formattedTime,
    isRunning,
    selectedCategory,
    setSelectedCategory,
    distractionCount,
    startTime,
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

  const handleReset = () => {
    // Eğer hiç başlamamışsa veya kategori yoksa sadece sıfırla
    if (!selectedCategory || !startTime) {
      resetTimer();
      return;
    }

    // Kullanıcı seansı erken bitiriyor → kullanılan süreyi hesapla
    const totalSeconds = initialDurationMinutes * 60;
    const usedSeconds = Math.max(0, totalSeconds - remainingSeconds);

    // Hiç süre geçmediyse normal reset davranışı
    if (usedSeconds === 0) {
      resetTimer();
      return;
    }

    const now = new Date();
    const durationMinutes = Math.max(1, Math.floor(usedSeconds / 60));

    const session = {
      category: selectedCategory,
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
      durationMinutes,
      distractionCount,
      createdAt: now.toISOString(),
    };

    handleSessionComplete(session);
    resetTimer();
  };

  const handleCloseModal = () => {
    setShowSummaryModal(false);
    setCompletedSession(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ImageBackground
        source={require('../../assets/background-timer.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
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

        <View style={styles.buttonSection}>
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
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
      </ImageBackground>

      <SessionSummaryModal
        visible={showSummaryModal}
        session={completedSession}
        onClose={handleCloseModal}
      />
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: layout.padding,
      paddingBottom: layout.paddingLarge,
      flexGrow: 1,
    },
    backgroundImage: {
      width: '100%',
      minHeight: '100%',
    },
    backgroundImageStyle: {
      opacity: 0.12,
      resizeMode: 'cover',
    },
    timerSection: {
      alignItems: 'center',
      width: '100%',
    },
    durationInputContainer: {
      width: '100%',
      marginBottom: layout.margin,
      alignItems: 'center',
      paddingVertical: layout.paddingXS,
    },
    durationLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: layout.marginXS,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    durationInput: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: layout.borderRadius,
      paddingVertical: layout.paddingMD,
      paddingHorizontal: layout.paddingLarge,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      width: 120,
      color: colors.text,
      ...layout.shadow,
    },
    distractionBadge: {
      backgroundColor: colors.warningLight,
      paddingHorizontal: layout.paddingMD,
      paddingVertical: layout.paddingXS,
      borderRadius: layout.borderRadiusRound,
      marginTop: layout.marginXS,
      marginBottom: layout.marginXS,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.warning + '40',
      alignSelf: 'center',
    },
    distractionText: {
      color: colors.warning,
      fontWeight: '700',
      fontSize: 13,
      letterSpacing: 0.3,
    },
    buttonSection: {
      width: '100%',
      marginTop: layout.margin,
      paddingTop: layout.padding,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      marginLeft: layout.spacing,
      marginRight: layout.spacing,
      paddingVertical: layout.paddingLarge,
      paddingHorizontal: layout.padding,
      borderRadius: layout.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      ...layout.shadowMedium,
      minHeight: 56,
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
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });

