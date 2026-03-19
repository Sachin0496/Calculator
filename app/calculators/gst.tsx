// GST Calculator Screen
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { calculateGST } from '@/lib/calculators/gst';
import { formatINR } from '@/lib/formatters';
import { NumericInput } from '@/components/ui/NumericInput';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ResultCard } from '@/components/ui/ResultCard';
import { GST_SLABS, Spacing } from '@/constants/theme';

export default function GSTScreen() {
  const { colors } = useTheme();
  const { gstAmount, gstRate, gstMode, setField } = useCalculatorStore();

  const result = useMemo(
    () =>
      calculateGST({
        amount: parseFloat(gstAmount) || 0,
        rate: gstRate,
        mode: gstMode,
      }),
    [gstAmount, gstRate, gstMode]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <SegmentedControl
        label="Calculation Mode"
        options={[
          { label: 'Add GST', value: 'add' },
          { label: 'Remove GST', value: 'remove' },
        ]}
        selectedValue={gstMode}
        onSelect={(v) => setField('gstMode', v)}
      />

      <NumericInput
        label={gstMode === 'add' ? 'Amount (Excl. GST)' : 'Amount (Incl. GST)'}
        value={gstAmount}
        onChangeText={(v) => setField('gstAmount', v)}
      />

      <SegmentedControl
        label="GST Rate"
        options={GST_SLABS.map((rate) => ({ label: `${rate}%`, value: String(rate) }))}
        selectedValue={String(gstRate)}
        onSelect={(v) => setField('gstRate', parseInt(v))}
      />

      {result.finalAmount > 0 && (
        <ResultCard
          title="GST Summary"
          mainLabel={gstMode === 'add' ? 'Total (incl. GST)' : 'Base Amount (excl. GST)'}
          mainValue={gstMode === 'add' ? formatINR(result.finalAmount, 2) : formatINR(result.originalAmount, 2)}
          items={[
            { label: 'Base Amount', value: formatINR(result.originalAmount, 2) },
            { label: `GST @ ${gstRate}%`, value: formatINR(result.gstAmount, 2), color: colors.warning },
            { label: `CGST @ ${gstRate / 2}%`, value: formatINR(result.cgst, 2) },
            { label: `SGST @ ${gstRate / 2}%`, value: formatINR(result.sgst, 2) },
            { label: 'Final Amount', value: formatINR(result.finalAmount, 2) },
          ]}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing['2xl'] },
});
