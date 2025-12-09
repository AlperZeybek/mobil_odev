import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';

const CATEGORIES = ['Studying', 'Coding', 'Project', 'Reading'];

/**
 * Category picker component
 */
export const CategoryPicker = ({ selectedCategory, onSelectCategory }) => {
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

const styles = StyleSheet.create({
  container: {
    marginVertical: layout.marginLarge,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: layout.spacing,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.spacing,
  },
  categoryButton: {
    paddingHorizontal: layout.paddingLarge,
    paddingVertical: layout.padding,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 100,
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryTextSelected: {
    color: colors.surface,
  },
});

