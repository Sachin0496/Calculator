// Home Screen — Calculator Grid
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { CALCULATORS, BorderRadius, FontFamily, FontSize, FontWeight, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_GAP = Spacing.md;
const CARD_WIDTH = (width - Spacing.lg * 2 - CARD_GAP) / 2;

// Simple SVG icons
function getIcon(name: string, color: string = '#fff') {
  const size = 28;
  const icons: Record<string, React.ReactNode> = {
    home: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <Path d="M9 22V12h6v10" />
      </Svg>
    ),
    receipt: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
        <Path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
        <Path d="M12 17.5v-11" />
      </Svg>
    ),
    'trending-up': (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M22 7l-8.5 8.5-5-5L2 17" />
        <Path d="M16 7h6v6" />
      </Svg>
    ),
    landmark: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 22h18" />
        <Path d="M6 18v-7" />
        <Path d="M10 18v-7" />
        <Path d="M14 18v-7" />
        <Path d="M18 18v-7" />
        <Path d="M12 2L2 8h20L12 2z" />
      </Svg>
    ),
    'file-text': (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <Path d="M14 2v6h6" />
        <Path d="M16 13H8" />
        <Path d="M16 17H8" />
        <Path d="M10 9H8" />
      </Svg>
    ),
    'git-compare-arrows': (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16 3l4 4-4 4" />
        <Path d="M20 7H4" />
        <Path d="M8 21l-4-4 4-4" />
        <Path d="M4 17h16" />
      </Svg>
    ),
  };
  return icons[name] || icons['home'];
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={[styles.appName, { color: colors.textPrimary }]}>
          Financial calculators
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Fast, clean tools for everyday money decisions in India.
        </Text>
      </View>

      {/* Calculator Grid */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Calculators
      </Text>

      <View style={styles.grid}>
        {CALCULATORS.map((calc) => (
          <Pressable
            key={calc.id}
            style={({ pressed }) => [
              styles.card,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                backgroundColor: pressed ? colors.surfaceContainerHighest : colors.surfaceContainerLow,
              },
            ]}
            onPress={() => router.push(calc.route as any)}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.surfaceContainerLowest }]}>
                {getIcon(calc.icon, colors.primary)}
              </View>
              <Text style={[styles.cardName, { color: colors.textPrimary }]}>{calc.name}</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{calc.description}</Text>
              {calc.isPremium && (
                <View style={[styles.proBadge, { backgroundColor: colors.surfaceContainerLowest }]}>
                  <Text style={[styles.proBadgeText, { color: colors.secondary }]}>PRO</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </View>

      {/* Bottom info */}
      <View style={styles.infoBar}>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          Results update instantly and stay on this device
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
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  hero: {
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  appName: {
    fontSize: 26,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.headline,
  },
  subtitle: {
    fontSize: FontSize.body,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: 150,
    borderRadius: BorderRadius.md,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a1c1c',
    shadowOpacity: 0.04,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  cardName: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.headline,
  },
  cardDesc: {
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  proBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  infoBar: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    marginBottom: 92,
  },
  infoText: {
    fontSize: FontSize.caption,
  },
});
