import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { formatTime } from '../utils/dateUtils';

const DEFAULT_DURATION_MINUTES = 25;

/**
 * Custom hook for managing focus timer with AppState tracking
 */
export const useFocusTimer = (onSessionComplete) => {
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_DURATION_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [distractionCount, setDistractionCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [initialDuration, setInitialDuration] = useState(DEFAULT_DURATION_MINUTES * 60);
  const [wasPausedByAppState, setWasPausedByAppState] = useState(false);

  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds, handleTimerComplete]);

  // AppState listener for distraction tracking
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isRunning, wasPausedByAppState]);

  const handleAppStateChange = useCallback((nextAppState) => {
    if (
      appStateRef.current.match(/active|foreground/) &&
      nextAppState.match(/inactive|background/)
    ) {
      // App went to background
      if (isRunning) {
        setIsRunning(false);
        setWasPausedByAppState(true);
        setDistractionCount((prev) => prev + 1);
      }
    } else if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App came to foreground
      if (wasPausedByAppState) {
        // Don't auto-resume, user needs to manually resume
        setWasPausedByAppState(false);
      }
    }

    appStateRef.current = nextAppState;
  }, [isRunning, wasPausedByAppState]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    const end = new Date();
    setEndTime(end);

    if (onSessionComplete && startTime) {
      // Calculate duration using initialDuration since remainingSeconds will be 0
      // Timer completed means all initialDuration seconds were used
      const durationMinutes = Math.floor(initialDuration / 60);
      onSessionComplete({
        category: selectedCategory,
        startTime: startTime.toISOString(),
        endTime: end.toISOString(),
        durationMinutes,
        distractionCount,
        createdAt: new Date().toISOString(),
      });
    }

    // Reset timer
    resetTimer();
  }, [startTime, selectedCategory, distractionCount, initialDuration, onSessionComplete, resetTimer]);

  const startTimer = useCallback(() => {
    if (!selectedCategory) {
      return false; // Category required
    }

    if (!startTime) {
      setStartTime(new Date());
    }

    setIsRunning(true);
    setWasPausedByAppState(false);
    return true;
  }, [selectedCategory, startTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setWasPausedByAppState(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(initialDuration);
    setSelectedCategory(null);
    setDistractionCount(0);
    setStartTime(null);
    setEndTime(null);
    setWasPausedByAppState(false);
  }, [initialDuration]);

  const setDuration = useCallback((minutes) => {
    const seconds = minutes * 60;
    setInitialDuration(seconds);
    if (!isRunning) {
      setRemainingSeconds(seconds);
    }
  }, [isRunning]);

  const formattedTime = formatTime(remainingSeconds);

  return {
    remainingSeconds,
    formattedTime,
    isRunning,
    selectedCategory,
    setSelectedCategory,
    distractionCount,
    startTime,
    endTime,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
    initialDurationMinutes: Math.floor(initialDuration / 60),
  };
};

