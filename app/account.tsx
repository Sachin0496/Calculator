import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useClerk } from '@clerk/expo';
import { useTheme } from '@/hooks/useTheme';
import { CLERK_ENABLED } from '@/constants/clerk';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { BorderRadius, FontSize, FontWeight, Shadows, Spacing } from '@/constants/theme';

function AccountWithClerk() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { colors } = useTheme();
  const { isLoaded, isSignedIn, email, user, tier } = usePremiumAccess();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You are signed out. Use Clerk sign-in to attach premium access and account management to this app.
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
        <Text style={[styles.title, { color: colors.textPrimary }]}>Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This app now reads identity and premium access directly from Clerk.
        </Text>

        <View style={styles.detailList}>
          <Text style={[styles.detailItem, { color: colors.textPrimary }]}>Email: {email ?? 'Unavailable'}</Text>
          <Text style={[styles.detailItem, { color: colors.textPrimary }]}>User ID: {user?.id ?? 'Unavailable'}</Text>
          <Text style={[styles.detailItem, { color: colors.textPrimary }]}>Plan: {tier}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => {
          void signOut().then(() => router.replace('/'));
        }}
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.primaryButtonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

export default function AccountScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  if (!CLERK_ENABLED) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Clerk is not configured yet. Add your publishable key to enable authentication and account management.
          </Text>
          <Pressable onPress={() => router.push('/sign-in')} style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.primaryButtonText}>Open setup hint</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return <AccountWithClerk />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
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
  detailList: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  detailItem: {
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
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
});
