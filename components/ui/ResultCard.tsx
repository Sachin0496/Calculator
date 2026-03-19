// Result card component — displays calculation results
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Shadows, Spacing } from '@/constants/theme';

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
    <View style={[styles.card, { backgroundColor: colors.card }, Shadows.card]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.mainLabel, { color: colors.textMuted }]}>{mainLabel}</Text>
      <Text style={[styles.mainValue, { color: colors.primary }]}>{mainValue}</Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {items.map((item, i) => (
        <View key={i} style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
            {item.label}
          </Text>
          <Text
            style={[
              styles.rowValue,
              { color: item.color || colors.textPrimary },
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  mainLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainValue: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
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
