import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { CLERK_ENABLED } from '@/constants/clerk';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAppStore } from '@/store/useAppStore';

function GateCard({
  title,
  subtitle,
  actionLabel,
  onPress,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.gateCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
      <Text style={[styles.gateTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.gateSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      <Pressable onPress={onPress} style={[styles.gateButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.gateButtonText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

function HistoryList() {
  const { colors } = useTheme();
  const router = useRouter();
  const history = useAppStore((state) => state.history);
  const clearHistory = useAppStore((state) => state.clearHistory);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Calculation history
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Premium history is available on this device for the signed-in Clerk account.
        </Text>
      </View>

      {history.length > 0 ? (
        <>
          {history.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => router.push(entry.route as any)}
              style={({ pressed }) => [
                styles.historyCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.92 : 1,
                },
                Shadows.card,
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                {entry.title}
              </Text>
              <Text style={[styles.cardSummary, { color: colors.textSecondary }]}>
                {entry.inputSummary}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardResult, { color: colors.primary }]}>
                  {entry.resultSummary}
                </Text>
                <Text style={[styles.cardTime, { color: colors.textMuted }]}>
                  {new Date(entry.savedAt).toLocaleString()}
                </Text>
              </View>
            </Pressable>
          ))}

          <Pressable
            onPress={clearHistory}
            style={[styles.clearButton, { borderColor: colors.border, backgroundColor: colors.surfaceContainerLow }]}
          >
            <Text style={[styles.clearButtonText, { color: colors.textPrimary }]}>
              Clear history
            </Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 8v4l3 3" />
              <Path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
            </Svg>
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No premium history yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Once you use a calculator, its latest result will appear here for your signed-in premium account.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function HistoryWithClerk() {
  const router = useRouter();
  const { isLoaded, isSignedIn, hasHistoryAccess } = usePremiumAccess();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <View style={styles.screen}>
        <GateCard
          title="Sign in to view history"
          subtitle="History is a premium feature and is tied to your Clerk account."
          actionLabel="Sign in"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    );
  }

  if (!hasHistoryAccess) {
    return (
      <View style={styles.screen}>
        <GateCard
          title="History is premium"
          subtitle="Grant this account premium access from Clerk metadata to unlock calculation history."
          actionLabel="View premium access"
          onPress={() => router.push('/subscription')}
        />
      </View>
    );
  }

  return <HistoryList />;
}

export default function HistoryScreen() {
  const router = useRouter();

  if (!CLERK_ENABLED) {
    return (
      <View style={styles.screen}>
        <GateCard
          title="Configure Clerk first"
          subtitle="History is now premium-gated through Clerk. Add your Clerk publishable key to enable authentication and premium checks."
          actionLabel="Open settings"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    );
  }

  return <HistoryWithClerk />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 112,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  center: {
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  emptyTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  historyCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  cardSummary: {
    fontSize: FontSize.body,
    lineHeight: 21,
  },
  cardFooter: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  cardResult: {
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.bold,
  },
  cardTime: {
    fontSize: FontSize.caption,
  },
  clearButton: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  clearButtonText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  gateCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  gateTitle: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  gateSubtitle: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  gateButton: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  gateButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.bold,
  },
});
