// History Tab — Premium gated
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/theme';

export default function HistoryScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
          <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 8v4l3 3" />
            <Path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
          </Svg>
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Calculation History
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your saved calculations will appear here.
        </Text>
        <View style={[styles.proBanner, { backgroundColor: colors.primaryBg }]}>
          <Text style={[styles.proTitle, { color: colors.primary }]}>
            ⭐ FinCalc Pro
          </Text>
          <Text style={[styles.proDesc, { color: colors.textSecondary }]}>
            Save unlimited calculations, export as PDF, and more — ₹29/month
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  proBanner: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  proTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  proDesc: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});
