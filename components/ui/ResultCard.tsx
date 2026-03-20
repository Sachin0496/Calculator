// Result card component — displays calculation results
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontFamily, FontSize, FontWeight, Shadows, Spacing } from '@/constants/theme';

interface ResultItem {
  label: string;
  value: string;
  color?: string;
}

interface ResultCardProps {
  title: string;
  mainValue: string;
  mainLabel: string;
  items: ResultItem[];
}

export function ResultCard({ title, mainValue, mainLabel, items }: ResultCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceContainerHighest,
          borderColor: colors.border,
        },
        Shadows.card,
      ]}
    >
      <Text style={[styles.title, { color: colors.textSecondary, fontFamily: FontFamily.headline }]}>{title}</Text>

      <Text style={[styles.mainLabel, { color: colors.textSecondary }]}>{mainLabel}</Text>
      <Text style={[styles.mainValue, { color: colors.primary }]}>{mainValue}</Text>

      <View
        style={[
          styles.itemsWrap,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.border,
          },
        ]}
      >
        {items.map((item, i) => (
          <View
            key={i}
            style={[
              styles.row,
              i < items.length - 1 ? { marginBottom: Spacing.sm } : null,
            ]}
          >
            <Text style={[styles.rowLabel, { color: colors.textSecondary, fontFamily: FontFamily.body }]}>
              {item.label}
            </Text>
            <Text
              style={[
                styles.rowValue,
                { color: item.color || colors.textPrimary, fontFamily: FontFamily.headline },
              ]}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    borderWidth: 1,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  mainLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  mainValue: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
    fontFamily: FontFamily.headline,
  },
  itemsWrap: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
  },
  rowValue: {
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
  },
});
