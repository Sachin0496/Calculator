// Indian number formatting utilities

/**
 * Format a number in Indian numbering system (lakhs, crores)
 * e.g. 1234567 → ₹12,34,567
 */
export function formatINR(amount: number, decimals: number = 0): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const fixed = absAmount.toFixed(decimals);
  const [whole, decimal] = fixed.split('.');

  // Indian grouping: last 3 digits, then groups of 2
  let formatted = '';
  const len = whole.length;
  if (len <= 3) {
    formatted = whole;
  } else {
    formatted = whole.slice(-3);
    let remaining = whole.slice(0, -3);
    while (remaining.length > 2) {
      formatted = remaining.slice(-2) + ',' + formatted;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      formatted = remaining + ',' + formatted;
    }
  }

  const sign = isNegative ? '-' : '';
  const dec = decimal ? '.' + decimal : '';
  return `${sign}₹${formatted}${dec}`;
}

/**
 * Format to short form: ₹1.2L, ₹2.5Cr
 */
export function formatINRShort(amount: number): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (absAmount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  if (absAmount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatINR(amount);
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format months into years and months string
 */
export function formatTenure(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} mo`;
  if (remainingMonths === 0) return `${years} yr`;
  return `${years} yr ${remainingMonths} mo`;
}

/**
 * Parse a string currency input to number (removes commas, ₹ etc.)
 */
export function parseAmount(input: string): number {
  const cleaned = input.replace(/[₹,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function parseNumericInput(input: string): number {
  const cleaned = input.replace(/[₹,%\s,]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}
