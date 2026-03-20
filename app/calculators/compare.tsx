import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { CLERK_ENABLED } from '@/constants/clerk';
import { BorderRadius, FontSize, FontWeight, Shadows, Spacing } from '@/constants/theme';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAutosaveCalculation } from '@/hooks/useAutosaveCalculation';
import { NumericInput } from '@/components/ui/NumericInput';
import { ResultCard } from '@/components/ui/ResultCard';
import { compareLoans } from '@/lib/calculators/compare';
import { formatINR, formatTenure, parseNumericInput } from '@/lib/formatters';

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

function CompareCalculator() {
  const { colors } = useTheme();
  const [loanAmount, setLoanAmount] = useState('2500000');
  const [rateA, setRateA] = useState('8.1');
  const [tenureA, setTenureA] = useState('240');
  const [feeA, setFeeA] = useState('5000');
  const [rateB, setRateB] = useState('8.45');
  const [tenureB, setTenureB] = useState('216');
  const [feeB, setFeeB] = useState('0');

  const principal = parseNumericInput(loanAmount);
  const parsedRateA = parseNumericInput(rateA);
  const parsedTenureA = Math.max(0, Math.round(parseNumericInput(tenureA)));
  const parsedFeeA = parseNumericInput(feeA);
  const parsedRateB = parseNumericInput(rateB);
  const parsedTenureB = Math.max(0, Math.round(parseNumericInput(tenureB)));
  const parsedFeeB = parseNumericInput(feeB);

  const result = useMemo(
    () =>
      compareLoans({
        loanAmount: principal,
        offerA: {
          annualRate: parsedRateA,
          tenureMonths: parsedTenureA,
          processingFee: parsedFeeA,
        },
        offerB: {
          annualRate: parsedRateB,
          tenureMonths: parsedTenureB,
          processingFee: parsedFeeB,
        },
      }),
    [parsedFeeA, parsedFeeB, parsedRateA, parsedRateB, parsedTenureA, parsedTenureB, principal]
  );

  useAutosaveCalculation(
    principal > 0 && result.offerA.emi > 0 && result.offerB.emi > 0
      ? {
          calculatorId: 'compare',
          title: 'Loan Comparison',
          inputSummary: `${formatINR(principal)} | Offer A ${parsedRateA}% | Offer B ${parsedRateB}%`,
          resultSummary:
            result.cheaperOffer === 'tie'
              ? 'Both offers cost the same'
              : `Offer ${result.cheaperOffer.toUpperCase()} saves ${formatINR(result.savings)}`,
          route: '/calculators/compare',
        }
      : null
  );

  const comparisonText =
    result.cheaperOffer === 'tie'
      ? 'Both offers have the same total cost.'
      : `Offer ${result.cheaperOffer.toUpperCase()} saves ${formatINR(result.savings)} over the full loan.`;

  const emiText =
    result.lowerEmiOffer === 'tie'
      ? 'Both offers have the same EMI.'
      : `Offer ${result.lowerEmiOffer.toUpperCase()} lowers EMI by ${formatINR(result.emiGap)}.`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <NumericInput
        label="Loan Amount"
        value={loanAmount}
        onChangeText={setLoanAmount}
        hint="Common loan amount used for both offers"
      />

      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Offer A</Text>
        <NumericInput label="Interest Rate" value={rateA} onChangeText={setRateA} prefix="" suffix="% p.a." />
        <NumericInput label="Tenure" value={tenureA} onChangeText={setTenureA} prefix="" suffix="months" />
        <NumericInput label="Processing Fee" value={feeA} onChangeText={setFeeA} />
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.card]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Offer B</Text>
        <NumericInput label="Interest Rate" value={rateB} onChangeText={setRateB} prefix="" suffix="% p.a." />
        <NumericInput label="Tenure" value={tenureB} onChangeText={setTenureB} prefix="" suffix="months" />
        <NumericInput label="Processing Fee" value={feeB} onChangeText={setFeeB} />
      </View>

      {principal > 0 && result.offerA.emi > 0 && result.offerB.emi > 0 ? (
        <>
          <View style={[styles.summaryCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
            <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Comparison summary</Text>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>{comparisonText}</Text>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>{emiText}</Text>
          </View>

          <ResultCard
            title="Offer A"
            mainLabel="Monthly EMI"
            mainValue={formatINR(result.offerA.emi)}
            items={[
              { label: 'Rate', value: `${parsedRateA}%` },
              { label: 'Tenure', value: formatTenure(parsedTenureA) },
              { label: 'Processing Fee', value: formatINR(parsedFeeA) },
              { label: 'Total Interest', value: formatINR(result.offerA.totalInterest) },
              { label: 'Total Cost', value: formatINR(result.offerA.totalCost), color: colors.primary },
            ]}
          />

          <ResultCard
            title="Offer B"
            mainLabel="Monthly EMI"
            mainValue={formatINR(result.offerB.emi)}
            items={[
              { label: 'Rate', value: `${parsedRateB}%` },
              { label: 'Tenure', value: formatTenure(parsedTenureB) },
              { label: 'Processing Fee', value: formatINR(parsedFeeB) },
              { label: 'Total Interest', value: formatINR(result.offerB.totalInterest) },
              { label: 'Total Cost', value: formatINR(result.offerB.totalCost), color: colors.primary },
            ]}
          />
        </>
      ) : null}
    </ScrollView>
  );
}

function CompareWithClerk() {
  const router = useRouter();
  const { isLoaded, isSignedIn, hasCompareAccess } = usePremiumAccess();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <View style={styles.screen}>
        <GateCard
          title="Sign in to compare loans"
          subtitle="Loan comparison is a premium feature tied to the signed-in Clerk account."
          actionLabel="Sign in"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    );
  }

  if (!hasCompareAccess) {
    return (
      <View style={styles.screen}>
        <GateCard
          title="Loan comparison is premium"
          subtitle="Unlock this route by setting compare access for the current Clerk user from your backend or Clerk dashboard metadata."
          actionLabel="View premium access"
          onPress={() => router.push('/subscription')}
        />
      </View>
    );
  }

  return <CompareCalculator />;
}

export default function CompareScreen() {
  const router = useRouter();

  if (!CLERK_ENABLED) {
    return (
      <View style={styles.screen}>
        <GateCard
          title="Configure Clerk first"
          subtitle="Loan comparison is now gated by Clerk premium access instead of a client-side toggle."
          actionLabel="Open setup hint"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    );
  }

  return <CompareWithClerk />;
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
    paddingBottom: Spacing['2xl'],
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
  sectionCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  summaryCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  summaryTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  summaryText: {
    fontSize: FontSize.body,
    lineHeight: 21,
    marginBottom: Spacing.xs,
  },
});
