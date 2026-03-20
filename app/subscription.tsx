import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { APP_CONFIG } from '@/constants/appConfig';
import { CLERK_ENABLED } from '@/constants/clerk';
import { BorderRadius, FontSize, FontWeight, Shadows, Spacing } from '@/constants/theme';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

async function openUrl(url: string) {
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error(`Cannot open URL: ${url}`);
  }

  await Linking.openURL(url);
}

function SubscriptionWithClerk() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isLoaded, isSignedIn, tier, hasHistoryAccess, hasCompareAccess, billingPortalUrl } =
    usePremiumAccess();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Premium access</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in first. Premium access is read from Clerk user metadata instead of being toggled on the client.
          </Text>
          <Pressable onPress={() => router.push('/sign-in')} style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.primaryButtonText}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
        <Text style={[styles.eyebrow, { color: colors.textMuted }]}>SERVER-MANAGED ACCESS</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>FinCalc Pro</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This screen is read-only. Premium status should be set by Clerk dashboard metadata or your backend/webhooks, not by local app state.
        </Text>

        <View style={styles.statusList}>
          <Text style={[styles.statusItem, { color: colors.textPrimary }]}>Plan: {tier}</Text>
          <Text style={[styles.statusItem, { color: colors.textPrimary }]}>
            History: {hasHistoryAccess ? 'Unlocked' : 'Locked'}
          </Text>
          <Text style={[styles.statusItem, { color: colors.textPrimary }]}>
            Loan comparison: {hasCompareAccess ? 'Unlocked' : 'Locked'}
          </Text>
          <Text style={[styles.statusItem, { color: colors.textPrimary }]}>
            Price reference: {APP_CONFIG.subscriptionPriceLabel}
          </Text>
        </View>

        <Text style={[styles.note, { color: colors.textMuted }]}>
          Clerk metadata keys used by the app: `subscriptionTier`, `historyPremium`, `comparePremium`, and optional `billingPortalUrl`.
        </Text>
      </View>

      {billingPortalUrl ? (
        <Pressable
          onPress={() => {
            void openUrl(billingPortalUrl).catch(() => {
              Alert.alert('Unable to open billing portal', 'Please verify the billingPortalUrl in Clerk metadata.');
            });
          }}
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.primaryButtonText}>Open billing portal</Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => router.push('/account')} style={[styles.secondaryButton, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
          <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>
            Review account details
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  if (!CLERK_ENABLED) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Premium access</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Clerk is not configured yet, so premium access cannot be resolved from the server.
          </Text>
          <Pressable onPress={() => router.push('/sign-in')} style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.primaryButtonText}>Set up Clerk</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return <SubscriptionWithClerk />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  eyebrow: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  statusList: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  statusItem: {
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
  },
  note: {
    fontSize: FontSize.caption,
    lineHeight: 18,
    marginTop: Spacing.lg,
  },
  primaryButton: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.bold,
  },
  secondaryButton: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
  },
});
