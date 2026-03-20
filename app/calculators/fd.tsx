// FD/RD Calculator Screen
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAutosaveCalculation } from '@/hooks/useAutosaveCalculation';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { calculateFD, calculateRD } from '@/lib/calculators/fd';
import { formatINR, parseNumericInput } from '@/lib/formatters';
import { NumericInput } from '@/components/ui/NumericInput';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ResultCard } from '@/components/ui/ResultCard';
import { DonutChart } from '@/components/charts/DonutChart';
import { Spacing } from '@/constants/theme';

export default function FDScreen() {
  const { colors } = useTheme();
  const { fdPrincipal, fdRate, fdTenure, fdCompounding, setField } = useCalculatorStore();
  const [mode, setMode] = useState<'fd' | 'rd'>('fd');
  const principal = parseNumericInput(fdPrincipal);
  const annualRate = parseNumericInput(fdRate);
  const tenureMonths = Math.max(0, Math.round(parseNumericInput(fdTenure)));

  const fdResult = useMemo(
    () =>
      calculateFD({
        principal,
        annualRate,
        tenureMonths,
        compoundingFrequency: fdCompounding,
      }),
    [annualRate, fdCompounding, principal, tenureMonths]
  );

  const rdResult = useMemo(
    () =>
      calculateRD({
        monthlyDeposit: principal,
        annualRate,
        tenureMonths,
      }),
    [annualRate, principal, tenureMonths]
  );

  const result = mode === 'fd' ? fdResult : rdResult;
  const invested = mode === 'fd' ? fdResult.investedAmount : rdResult.totalDeposited;
  const interest = mode === 'fd' ? fdResult.totalInterest : rdResult.totalInterest;
  const maturity = mode === 'fd' ? fdResult.maturityAmount : rdResult.maturityAmount;

  useAutosaveCalculation(
    maturity > 0
      ? {
          calculatorId: 'fd',
          title: mode === 'fd' ? 'Fixed Deposit Calculator' : 'Recurring Deposit Calculator',
          inputSummary:
            mode === 'fd'
              ? `${formatINR(principal)} for ${tenureMonths} months at ${annualRate}%`
              : `${formatINR(principal)}/month for ${tenureMonths} months at ${annualRate}%`,
          resultSummary: `Maturity ${formatINR(maturity)}`,
          route: '/calculators/fd',
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
      <SegmentedControl
        label="Deposit Type"
        options={[
          { label: 'Fixed Deposit', value: 'fd' },
          { label: 'Recurring Deposit', value: 'rd' },
        ]}
        selectedValue={mode}
        onSelect={(v) => setMode(v as 'fd' | 'rd')}
      />

      <NumericInput
        label={mode === 'fd' ? 'Deposit Amount' : 'Monthly Deposit'}
        value={fdPrincipal}
        onChangeText={(v) => setField('fdPrincipal', v)}
      />
      <NumericInput
        label="Interest Rate"
        value={fdRate}
        onChangeText={(v) => setField('fdRate', v)}
        prefix=""
        suffix="% p.a."
      />
      <NumericInput
        label="Tenure"
        value={fdTenure}
        onChangeText={(v) => setField('fdTenure', v)}
        prefix=""
        suffix="months"
      />

      {mode === 'fd' && (
        <SegmentedControl
          label="Compounding"
          options={[
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Yearly', value: 'yearly' },
          ]}
          selectedValue={fdCompounding}
          onSelect={(v) => setField('fdCompounding', v)}
        />
      )}

      {maturity > 0 && (
        <>
          <DonutChart
            data={[
              { value: invested, color: colors.primary, label: mode === 'fd' ? 'Deposit' : 'Deposited' },
              { value: interest, color: colors.success, label: 'Interest Earned' },
            ]}
            centerValue={formatINR(maturity)}
            centerLabel="maturity"
          />

          <ResultCard
            title={`${mode === 'fd' ? 'FD' : 'RD'} Summary`}
            mainLabel="Maturity Amount"
            mainValue={formatINR(maturity)}
            items={[
              { label: mode === 'fd' ? 'Deposit Amount' : 'Total Deposited', value: formatINR(invested) },
              { label: 'Interest Earned', value: formatINR(interest), color: colors.success },
            ]}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing['2xl'] },
});
