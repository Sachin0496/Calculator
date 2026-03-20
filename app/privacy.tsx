import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function PrivacyScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>Privacy summary</Text>
      <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
        FinCalc India runs calculations on-device. Your latest results, appearance choice, and preview settings are stored locally on this device.
      </Text>
      <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
        The current preview flow does not upload account data, payment details, or calculator inputs to a server. If you later connect Clerk, RevenueCat, or analytics, update this screen to reflect the new data flow.
      </Text>
      <Text style={[styles.section, { color: colors.textPrimary }]}>What is stored locally</Text>
      <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
        Recent calculator snapshots, appearance mode, subscription preview state, and your selected account provider.
      </Text>
      <Text style={[styles.section, { color: colors.textPrimary }]}>What to update before release</Text>
      <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
        Replace this summary with your final privacy policy, add any analytics or billing disclosures, and link your live support email if it changes.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  section: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  paragraph: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
});
