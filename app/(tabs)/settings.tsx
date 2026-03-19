// Settings Tab
import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

function SettingsRow({ icon, title, subtitle, onPress, trailing }: SettingsRowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.primaryBg }]}>
        {icon}
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        )}
      </View>
      {trailing || (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2}>
          <Path d="M9 18l6-6-6-6" />
        </Svg>
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Pro Banner */}
      <Pressable style={[styles.proBanner, Shadows.button]}>
        <Text style={styles.proBannerTitle}>⭐ Upgrade to FinCalc Pro</Text>
        <Text style={styles.proBannerDesc}>
          No ads · History · Export · Dark Mode
        </Text>
        <View style={styles.proBannerPrice}>
          <Text style={styles.proBannerPriceText}>₹29/month</Text>
        </View>
      </Pressable>

      {/* General */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>GENERAL</Text>
      <View style={[styles.section, { backgroundColor: colors.card }, Shadows.card]}>
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M12 20a8 8 0 100-16 8 8 0 000 16z" />
              <Path d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
              <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </Svg>
          }
          title="Appearance"
          subtitle="System default"
        />
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <Path d="M2 12h20" />
              <Path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
            </Svg>
          }
          title="Language"
          subtitle="English"
        />
      </View>

      {/* Support */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SUPPORT</Text>
      <View style={[styles.section, { backgroundColor: colors.card }, Shadows.card]}>
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </Svg>
          }
          title="Rate App"
          subtitle="Help us improve!"
        />
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <Path d="M22 6l-10 7L2 6" />
            </Svg>
          }
          title="Send Feedback"
          subtitle="fincalc@example.com"
        />
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </Svg>
          }
          title="Privacy Policy"
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          FinCalc India v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Made with ❤️ in India
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  proBanner: {
    backgroundColor: '#4F6EF7',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  proBannerTitle: {
    color: '#FFFFFF',
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },
  proBannerDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.body,
    marginTop: Spacing.xs,
  },
  proBannerPrice: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  proBannerPriceText: {
    color: '#FFFFFF',
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  sectionLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  section: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  rowSubtitle: {
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: FontSize.caption,
  },
});
