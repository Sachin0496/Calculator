import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAutosaveCalculation } from '@/hooks/useAutosaveCalculation';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { calculateEMI } from '@/lib/calculators/emi';
import { formatINR, formatTenure, parseNumericInput } from '@/lib/formatters';
import { NumericInput } from '@/components/ui/NumericInput';
import { ResultCard } from '@/components/ui/ResultCard';
import { DonutChart } from '@/components/charts/DonutChart';
import { Spacing } from '@/constants/theme';

export default function EMIScreen() {
  const { colors } = useTheme();
  const { emiPrincipal, emiRate, emiTenure, setField } = useCalculatorStore();
  const principal = parseNumericInput(emiPrincipal);
  const annualRate = parseNumericInput(emiRate);
  const tenureMonths = Math.max(0, Math.round(parseNumericInput(emiTenure)));

  const result = useMemo(
    () =>
      calculateEMI({
        principal,
        annualRate,
        tenureMonths,
      }),
    [annualRate, principal, tenureMonths]
  );

  useAutosaveCalculation(
    result.emi > 0
      ? {
          calculatorId: 'emi',
          title: 'EMI Calculator',
          inputSummary: `${formatINR(principal)} at ${annualRate}% for ${formatTenure(tenureMonths)}`,
          resultSummary: `EMI ${formatINR(result.emi)}`,
          route: '/calculators/emi',
        }
      : null
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <NumericInput
        label="Loan Amount"
        value={emiPrincipal}
        onChangeText={(v) => setField('emiPrincipal', v)}
        prefix="₹"
        hint="e.g. ₹25,00,000 for a home loan"
      />
      <NumericInput
        label="Interest Rate (Annual)"
        value={emiRate}
        onChangeText={(v) => setField('emiRate', v)}
        prefix=""
        suffix="% p.a."
        hint="e.g. 8.5% for home loan"
      />
      <NumericInput
        label="Loan Tenure"
        value={emiTenure}
        onChangeText={(v) => setField('emiTenure', v)}
        prefix=""
        suffix="months"
        hint={`= ${formatTenure(tenureMonths)}`}
      />

      {result.emi > 0 && (
        <>
          <DonutChart
            data={[
              { value: principal, color: colors.primary, label: `Principal (${result.principalPercent}%)` },
              { value: result.totalInterest, color: colors.warning, label: `Interest (${result.interestPercent}%)` },
            ]}
            centerValue={formatINR(result.emi)}
            centerLabel="per month"
          />

          <ResultCard
            title="EMI Summary"
            mainLabel="Monthly EMI"
            mainValue={formatINR(result.emi)}
            items={[
              { label: 'Principal Amount', value: formatINR(principal) },
              { label: 'Total Interest', value: formatINR(result.totalInterest), color: colors.warning },
              { label: 'Total Amount', value: formatINR(result.totalAmount) },
            ]}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing['2xl'] },
});
