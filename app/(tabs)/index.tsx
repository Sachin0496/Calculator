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
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { CALCULATORS, BorderRadius, FontSize, FontWeight, Spacing, Shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_GAP = Spacing.md;
const CARD_WIDTH = (width - Spacing.xl * 2 - CARD_GAP) / 2;

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
  const { colors, isDark } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          Welcome to
        </Text>
        <Text style={[styles.appName, { color: colors.textPrimary }]}>
          FinCalc India 🇮🇳
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Smart financial calculators built for India
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
              },
            ]}
            onPress={() => router.push(calc.route as any)}
          >
            {/* Gradient background using SVG */}
            <Svg style={StyleSheet.absoluteFill} width={CARD_WIDTH} height={150}>
              <Defs>
                <LinearGradient id={`grad-${calc.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={calc.gradient[0]} />
                  <Stop offset="100%" stopColor={calc.gradient[1]} />
                </LinearGradient>
              </Defs>
              <Rect
                width={CARD_WIDTH}
                height={150}
                rx={BorderRadius.md}
                fill={`url(#grad-${calc.id})`}
              />
            </Svg>

            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                {getIcon(calc.icon)}
              </View>
              <Text style={styles.cardName}>{calc.name}</Text>
              <Text style={styles.cardDesc}>{calc.description}</Text>
              {calc.isPremium && (
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </View>

      {/* Bottom info */}
      <View style={styles.infoBar}>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          All calculations are offline · No login required
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
  hero: {
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  greeting: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
  },
  appName: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.body,
    marginTop: Spacing.xs,
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
    overflow: 'hidden',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  cardDesc: {
    fontSize: FontSize.caption,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  proBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  infoBar: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  infoText: {
    fontSize: FontSize.caption,
  },
});
