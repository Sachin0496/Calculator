// FD/RD Calculator Screen
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { calculateFD, calculateRD } from '@/lib/calculators/fd';
import { formatINR } from '@/lib/formatters';
import { NumericInput } from '@/components/ui/NumericInput';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ResultCard } from '@/components/ui/ResultCard';
import { DonutChart } from '@/components/charts/DonutChart';
import { Spacing } from '@/constants/theme';

export default function FDScreen() {
  const { colors } = useTheme();
  const { fdPrincipal, fdRate, fdTenure, fdCompounding, setField } = useCalculatorStore();
  const [mode, setMode] = useState<'fd' | 'rd'>('fd');

  const fdResult = useMemo(
    () =>
      calculateFD({
        principal: parseFloat(fdPrincipal) || 0,
        annualRate: parseFloat(fdRate) || 0,
        tenureMonths: parseInt(fdTenure) || 0,
        compoundingFrequency: fdCompounding,
      }),
    [fdPrincipal, fdRate, fdTenure, fdCompounding]
  );

  const rdResult = useMemo(
    () =>
      calculateRD({
        monthlyDeposit: parseFloat(fdPrincipal) || 0,
        annualRate: parseFloat(fdRate) || 0,
        tenureMonths: parseInt(fdTenure) || 0,
      }),
    [fdPrincipal, fdRate, fdTenure]
  );

  const result = mode === 'fd' ? fdResult : rdResult;
  const invested = mode === 'fd' ? fdResult.investedAmount : rdResult.totalDeposited;
  const interest = mode === 'fd' ? fdResult.totalInterest : rdResult.totalInterest;
  const maturity = mode === 'fd' ? fdResult.maturityAmount : rdResult.maturityAmount;

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
