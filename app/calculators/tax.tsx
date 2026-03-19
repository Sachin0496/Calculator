// Income Tax Calculator Screen — Old vs New Regime
import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { calculateTax } from '@/lib/calculators/tax';
import { formatINR } from '@/lib/formatters';
import { NumericInput } from '@/components/ui/NumericInput';
import { ResultCard } from '@/components/ui/ResultCard';
import { BorderRadius, FontSize, FontWeight, Spacing, Shadows } from '@/constants/theme';

export default function TaxScreen() {
  const { colors } = useTheme();
  const { taxIncome, tax80C, tax80D, taxHRA, taxOther, setField } = useCalculatorStore();

  const comparison = useMemo(
    () =>
      calculateTax({
        annualIncome: parseFloat(taxIncome) || 0,
        deductions80C: parseFloat(tax80C) || 0,
        deductions80D: parseFloat(tax80D) || 0,
        hra: parseFloat(taxHRA) || 0,
        otherDeductions: parseFloat(taxOther) || 0,
      }),
    [taxIncome, tax80C, tax80D, taxHRA, taxOther]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <NumericInput
        label="Annual Income"
        value={taxIncome}
        onChangeText={(v) => setField('taxIncome', v)}
        hint="Your total gross income"
      />

      {/* Old Regime Deductions */}
      <View style={[styles.deductionSection, { backgroundColor: colors.card }, Shadows.card]}>
        <Text style={[styles.deductionTitle, { color: colors.textPrimary }]}>
          Old Regime Deductions
        </Text>
        <Text style={[styles.deductionHint, { color: colors.textMuted }]}>
          These deductions apply only under the old tax regime
        </Text>
        <NumericInput
          label="Section 80C"
          value={tax80C}
          onChangeText={(v) => setField('tax80C', v)}
          hint="PPF, ELSS, LIC, etc. (max ₹1.5L)"
        />
        <NumericInput
          label="Section 80D"
          value={tax80D}
          onChangeText={(v) => setField('tax80D', v)}
          hint="Medical insurance premium"
        />
        <NumericInput
          label="HRA Exemption"
          value={taxHRA}
          onChangeText={(v) => setField('taxHRA', v)}
          hint="House Rent Allowance"
        />
        <NumericInput
          label="Other Deductions"
          value={taxOther}
          onChangeText={(v) => setField('taxOther', v)}
          hint="NPS (80CCD), home loan interest, etc."
        />
      </View>

      {/* Regime Comparison */}
      {comparison.newRegime.totalTax > 0 || comparison.oldRegime.totalTax > 0 ? (
        <>
          {/* Winner Banner */}
          <View style={[styles.winnerBanner, { backgroundColor: colors.successBg }]}>
            <Text style={[styles.winnerText, { color: colors.success }]}>
              ✅ {comparison.betterRegime === 'new' ? 'New' : 'Old'} Regime saves you {formatINR(comparison.savings)}
            </Text>
          </View>

          {/* New Regime */}
          <ResultCard
            title="New Regime (FY 2024-25)"
            mainLabel="Total Tax"
            mainValue={formatINR(comparison.newRegime.totalTax)}
            items={[
              { label: 'Taxable Income', value: formatINR(comparison.newRegime.taxableIncome) },
              { label: 'Income Tax', value: formatINR(comparison.newRegime.tax) },
              { label: 'Cess (4%)', value: formatINR(comparison.newRegime.cess) },
              { label: 'Effective Rate', value: `${comparison.newRegime.effectiveRate}%` },
            ]}
          />

          {/* Old Regime */}
          <ResultCard
            title="Old Regime"
            mainLabel="Total Tax"
            mainValue={formatINR(comparison.oldRegime.totalTax)}
            items={[
              { label: 'Taxable Income', value: formatINR(comparison.oldRegime.taxableIncome) },
              { label: 'Income Tax', value: formatINR(comparison.oldRegime.tax) },
              { label: 'Cess (4%)', value: formatINR(comparison.oldRegime.cess) },
              { label: 'Effective Rate', value: `${comparison.oldRegime.effectiveRate}%` },
            ]}
          />

          {/* Slab Breakdown — New */}
          <View style={[styles.slabCard, { backgroundColor: colors.card }, Shadows.card]}>
            <Text style={[styles.slabTitle, { color: colors.textPrimary }]}>
              New Regime — Slab Breakdown
            </Text>
            {comparison.newRegime.slabBreakdown.map((slab, i) => (
              <View key={i} style={styles.slabRow}>
                <Text style={[styles.slabRange, { color: colors.textSecondary }]}>
                  {slab.range}
                </Text>
                <Text style={[styles.slabRate, { color: colors.textMuted }]}>
                  {slab.rate}%
                </Text>
                <Text style={[styles.slabTax, { color: colors.textPrimary }]}>
                  {formatINR(slab.tax)}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing['2xl'] },
  deductionSection: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  deductionTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  deductionHint: {
    fontSize: FontSize.caption,
    marginBottom: Spacing.md,
  },
  winnerBanner: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  winnerText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  slabCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  slabTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
  },
  slabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  slabRange: {
    flex: 2,
    fontSize: FontSize.caption,
  },
  slabRate: {
    flex: 1,
    fontSize: FontSize.caption,
    textAlign: 'center',
  },
  slabTax: {
    flex: 1,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    textAlign: 'right',
  },
});
