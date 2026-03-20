import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/appConfig';
import { CLERK_ENABLED } from '@/constants/clerk';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useAppStore } from '@/store/useAppStore';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

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
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: onPress && pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceContainerHigh }]}>
        {icon}
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {trailing || (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2}>
          <Path d="M9 18l6-6-6-6" />
        </Svg>
      )}
    </Pressable>
  );
}

async function openUrl(url: string) {
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error(`Cannot open URL: ${url}`);
  }

  await Linking.openURL(url);
}

function SettingsBody({
  accountSubtitle,
  premiumSubtitle,
  accountRoute,
}: {
  accountSubtitle: string;
  premiumSubtitle: string;
  accountRoute: '/account' | '/sign-in';
}) {
  const router = useRouter();
  const { colors, appearanceMode, systemScheme } = useTheme();
  const setAppearanceMode = useAppStore((state) => state.setAppearanceMode);

  const handleRateApp = async () => {
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
        return;
      }

      if (Platform.OS === 'android') {
        await openUrl(APP_CONFIG.playStoreUrl);
        return;
      }

      if (APP_CONFIG.iosAppStoreId) {
        await openUrl(
          `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${APP_CONFIG.iosAppStoreId}?action=write-review`
        );
        return;
      }

      Alert.alert(
        'Store review is not configured',
        'Add your App Store ID in constants/appConfig.ts to enable the iOS review fallback.'
      );
    } catch (error) {
      Alert.alert('Unable to open the rating flow', 'Please try again after the app is published.');
    }
  };

  const handleSendFeedback = async () => {
    try {
      await openUrl(
        `mailto:${APP_CONFIG.supportEmail}?subject=${encodeURIComponent('FinCalc India feedback')}`
      );
    } catch (error) {
      Alert.alert(
        'No mail app available',
        `Send your feedback manually to ${APP_CONFIG.supportEmail}.`
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
        <Text style={[styles.statusEyebrow, { color: colors.textMuted }]}>ACCOUNT & ACCESS</Text>
        <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>Settings</Text>
        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
          Appearance stays on this device. Account and premium access are read from Clerk, not from local client state.
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>APPEARANCE</Text>
      <View style={[styles.appearanceCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
        <Text style={[styles.appearanceTitle, { color: colors.textPrimary }]}>Theme</Text>
        <Text style={[styles.appearanceSubtitle, { color: colors.textSecondary }]}>
          {appearanceMode === 'system'
            ? `Following device theme (${systemScheme})`
            : `App theme locked to ${appearanceMode}`}
        </Text>
        <SegmentedControl
          label="Appearance"
          options={[
            { label: 'System', value: 'system' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
          selectedValue={appearanceMode}
          onSelect={(value) => setAppearanceMode(value as 'system' | 'light' | 'dark')}
        />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCESS</Text>
      <View style={styles.group}>
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M20 21a8 8 0 10-16 0" />
              <Path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </Svg>
          }
          title="Account"
          subtitle={accountSubtitle}
          onPress={() => router.push(accountRoute)}
        />
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M3 7h18" />
              <Path d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
              <Path d="M12 11v6" />
              <Path d="M9 14h6" />
            </Svg>
          }
          title="Premium access"
          subtitle={premiumSubtitle}
          onPress={() => router.push('/subscription')}
        />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SUPPORT</Text>
      <View style={styles.group}>
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M12 17.75l-6.17 3.24 1.18-6.88L2 9.51l6.91-1 3.09-6.26 3.09 6.26 6.91 1-5 4.6 1.18 6.88z" />
            </Svg>
          }
          title="Rate App"
          subtitle="Open the in-app review prompt or store page"
          onPress={() => {
            void handleRateApp();
          }}
        />
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <Path d="M22 6l-10 7L2 6" />
            </Svg>
          }
          title="Send Feedback"
          subtitle={APP_CONFIG.supportEmail}
          onPress={() => {
            void handleSendFeedback();
          }}
        />
        <SettingsRow
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2}>
              <Path d="M12 1l9 4v6c0 5-3.8 9.7-9 11-5.2-1.3-9-6-9-11V5l9-4z" />
            </Svg>
          }
          title="Privacy"
          subtitle="Read the in-app privacy summary"
          onPress={() => router.push('/privacy')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          FinCalc India v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Built for India
        </Text>
      </View>
    </ScrollView>
  );
}

function SettingsWithoutClerk() {
  return (
    <SettingsBody
      accountSubtitle="Clerk is not configured yet. Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to enable authentication."
      premiumSubtitle="Premium access is disabled until Clerk is configured."
      accountRoute="/sign-in"
    />
  );
}

function SettingsWithClerk() {
  const { isSignedIn, email, tier } = usePremiumAccess();

  return (
    <SettingsBody
      accountSubtitle={
        isSignedIn && email
          ? `Signed in as ${email}`
          : 'Sign in with Clerk to manage account access'
      }
      premiumSubtitle={
        isSignedIn
          ? `Server-managed tier: ${tier}`
          : 'Sign in first. Premium status is read from Clerk metadata.'
      }
      accountRoute={isSignedIn ? '/account' : '/sign-in'}
    />
  );
}

export default function SettingsScreen() {
  return CLERK_ENABLED ? <SettingsWithClerk /> : <SettingsWithoutClerk />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 112,
  },
  statusCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusEyebrow: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  statusTitle: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  appearanceCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  appearanceTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  appearanceSubtitle: {
    fontSize: FontSize.body,
    marginBottom: Spacing.md,
    lineHeight: 21,
  },
  group: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
  },
  rowSubtitle: {
    fontSize: FontSize.caption,
    marginTop: 4,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: FontSize.caption,
  },
});
