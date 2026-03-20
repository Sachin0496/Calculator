// Segmented control component (radio-style toggle)
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontFamily, FontSize, FontWeight, Spacing } from '@/constants/theme';

interface SegmentedControlProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function SegmentedControl({
  label,
  options,
  selectedValue,
  onSelect,
}: SegmentedControlProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.segmentContainer,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.border,
          },
        ]}
      >
        {options.map((option) => {
          const isActive = option.value === selectedValue;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                styles.segment,
                isActive && {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: isActive ? colors.primary : colors.textSecondary },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontFamily: FontFamily.label,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    padding: 3,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.sm - 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.label,
  },
});
