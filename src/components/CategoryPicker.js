import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { layout } from '../styles/layout';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = ['Studying', 'Coding', 'Project', 'Reading', 'Revision', 'Break'];

/**
 * Category picker component
 */
export const CategoryPicker = ({ selectedCategory, onSelectCategory }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const handleSelect = (category) => {
    onSelectCategory(category);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Category</Text>
      <View style={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected,
            ]}
            onPress={() => handleSelect(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginTop: layout.margin,
      marginBottom: layout.margin,
      width: '100%',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: layout.marginXS,
      letterSpacing: 0.3,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
    },
    categoryButton: {
      width: '48%',
      marginBottom: layout.spacing,
      paddingVertical: layout.padding,
      paddingHorizontal: layout.padding,
      borderRadius: layout.borderRadius,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...layout.shadow,
      minHeight: 50,
    },
    categoryButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      ...layout.shadowMedium,
    },
    categoryText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: 0.2,
    },
    categoryTextSelected: {
      color: colors.textInverse,
      fontWeight: '700',
    },
  });

