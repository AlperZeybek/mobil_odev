import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { formatTime } from '../utils/dateUtils';

/**
 * Session summary modal component
 */
export const SessionSummaryModal = ({ visible, session, onClose }) => {
  if (!session) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Session Summary</Text>
          
          <ScrollView style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>Category:</Text>
              <Text style={styles.value}>{session.category}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>
                {formatTime(session.durationMinutes * 60)}
              </Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Distractions:</Text>
              <Text style={[styles.value, session.distractionCount > 0 && styles.warning]}>
                {session.distractionCount}
              </Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Started:</Text>
              <Text style={styles.value}>{formatDateTime(session.startTime)}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Ended:</Text>
              <Text style={styles.value}>{formatDateTime(session.endTime)}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.paddingLarge,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusXL,
    padding: layout.paddingXL,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    ...layout.shadowLarge,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: layout.marginLarge,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  content: {
    marginVertical: layout.marginMD,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  label: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: layout.spacingLarge,
  },
  warning: {
    color: colors.warning,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.paddingMD,
    borderRadius: layout.borderRadius,
    marginTop: layout.marginMD,
    alignItems: 'center',
    ...layout.shadowMedium,
  },
  closeButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

