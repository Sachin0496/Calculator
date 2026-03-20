// SIP Calculator Screen
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAutosaveCalculation } from '@/hooks/useAutosaveCalculation';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { calculateSIP } from '@/lib/calculators/sip';
import { formatINR, formatINRShort, parseNumericInput } from '@/lib/formatters';
import { NumericInput } from '@/components/ui/NumericInput';
import { ResultCard } from '@/components/ui/ResultCard';
import { DonutChart } from '@/components/charts/DonutChart';
import { Spacing } from '@/constants/theme';

export default function SIPScreen() {
  const { colors } = useTheme();
  const { sipAmount, sipReturn, sipYears, setField } = useCalculatorStore();
  const monthlyAmount = parseNumericInput(sipAmount);
  const annualReturn = parseNumericInput(sipReturn);
  const years = Math.max(0, Math.round(parseNumericInput(sipYears)));

  const result = useMemo(
    () =>
      calculateSIP({
        monthlyAmount,
        annualReturn,
        years,
      }),
    [annualReturn, monthlyAmount, years]
  );

  useAutosaveCalculation(
    result.totalValue > 0
      ? {
          calculatorId: 'sip',
          title: 'SIP Calculator',
          inputSummary: `${formatINR(monthlyAmount)}/month for ${years} years at ${annualReturn}%`,
          resultSummary: `Value ${formatINR(result.totalValue)}`,
          route: '/calculators/sip',
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
        label="Monthly SIP Amount"
        value={sipAmount}
        onChangeText={(v) => setField('sipAmount', v)}
        hint="Amount you invest every month"
      />
      <NumericInput
        label="Expected Annual Return"
        value={sipReturn}
        onChangeText={(v) => setField('sipReturn', v)}
        prefix=""
        suffix="% p.a."
        hint="Equity averages ~12%, Debt ~7%"
      />
      <NumericInput
        label="Time Period"
        value={sipYears}
        onChangeText={(v) => setField('sipYears', v)}
        prefix=""
        suffix="years"
      />

      {result.totalValue > 0 && (
        <>
          <DonutChart
            data={[
              { value: result.investedAmount, color: colors.primary, label: `Invested (${result.investedPercent}%)` },
              { value: result.estimatedReturns, color: colors.success, label: `Returns (${result.returnsPercent}%)` },
            ]}
            centerValue={formatINRShort(result.totalValue)}
            centerLabel="total value"
          />

          <ResultCard
            title="SIP Summary"
            mainLabel="Total Value"
            mainValue={formatINR(result.totalValue)}
            items={[
              { label: 'Amount Invested', value: formatINR(result.investedAmount) },
              { label: 'Est. Returns', value: formatINR(result.estimatedReturns), color: colors.success },
              { label: 'Wealth Gain', value: `${result.returnsPercent}%`, color: colors.success },
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
