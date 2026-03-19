// Income Tax Calculator — FY 2024-25 (India)
import { TAX_SLABS_NEW, TAX_SLABS_OLD } from '@/constants/theme';

export interface TaxInput {
  annualIncome: number;
  deductions80C: number;     // Section 80C (old regime only)
  deductions80D: number;     // Section 80D (old regime only)
  otherDeductions: number;   // HRA, LTA, etc. (old regime only)
  hra: number;               // House Rent Allowance (old regime only)
}

export interface TaxResult {
  taxableIncome: number;
  tax: number;
  cess: number;       // 4% Health & Education Cess
  totalTax: number;
  effectiveRate: number;
  slabBreakdown: SlabRow[];
}

export interface SlabRow {
  range: string;
  rate: number;
  tax: number;
}

export interface TaxComparison {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  betterRegime: 'old' | 'new';
  savings: number;
}

function calculateTaxForSlabs(
  taxableIncome: number,
  slabs: { min: number; max: number; rate: number }[],
  rebateLimit: number,
  rebateAmount: number
): TaxResult {
  let tax = 0;
  const slabBreakdown: SlabRow[] = [];

  for (const slab of slabs) {
    if (taxableIncome <= slab.min) break;

    const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
    const slabTax = taxableInSlab * (slab.rate / 100);

    const maxLabel = slab.max === Infinity
      ? '+'
      : `- ₹${(slab.max / 100000).toFixed(1)}L`;
    const minLabel = `₹${(slab.min / 100000).toFixed(1)}L`;

    slabBreakdown.push({
      range: `${minLabel} ${maxLabel}`,
      rate: slab.rate,
      tax: Math.round(slabTax),
    });

    tax += slabTax;
  }

  // Apply rebate
  if (taxableIncome <= rebateLimit) {
    tax = Math.max(0, tax - rebateAmount);
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    taxableIncome: Math.round(taxableIncome),
    tax: Math.round(tax),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax),
    effectiveRate: taxableIncome > 0 ? Math.round((totalTax / taxableIncome) * 10000) / 100 : 0,
    slabBreakdown,
  };
}

export function calculateTax(input: TaxInput): TaxComparison {
  const { annualIncome, deductions80C, deductions80D, otherDeductions, hra } = input;

  // New Regime: Standard deduction of ₹75,000, no other deductions
  const newRegimeTaxable = Math.max(0, annualIncome - 75000);
  const newRegime = calculateTaxForSlabs(newRegimeTaxable, TAX_SLABS_NEW, 700000, 25000);

  // Old Regime: Apply all deductions
  const totalOldDeductions = Math.min(deductions80C, 150000) + deductions80D + otherDeductions + hra + 50000; // 50K standard deduction
  const oldRegimeTaxable = Math.max(0, annualIncome - totalOldDeductions);
  const oldRegime = calculateTaxForSlabs(oldRegimeTaxable, TAX_SLABS_OLD, 500000, 12500);

  const betterRegime = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old';
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return { oldRegime, newRegime, betterRegime, savings };
}
