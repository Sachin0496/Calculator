// GST Calculator — Pure functions

export interface GSTInput {
  amount: number;
  rate: number;        // 5, 12, 18, or 28
  mode: 'add' | 'remove';
}

export interface GSTResult {
  originalAmount: number;
  gstAmount: number;
  finalAmount: number;
  cgst: number;        // Central GST (half of total)
  sgst: number;        // State GST (half of total)
}

export function calculateGST(input: GSTInput): GSTResult {
  const { amount, rate, mode } = input;

  if (amount <= 0 || rate <= 0) {
    return { originalAmount: 0, gstAmount: 0, finalAmount: 0, cgst: 0, sgst: 0 };
  }

  let originalAmount: number;
  let gstAmount: number;
  let finalAmount: number;

  if (mode === 'add') {
    originalAmount = amount;
    gstAmount = amount * (rate / 100);
    finalAmount = amount + gstAmount;
  } else {
    // Remove GST: amount already includes GST
    finalAmount = amount;
    originalAmount = amount / (1 + rate / 100);
    gstAmount = finalAmount - originalAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return {
    originalAmount: Math.round(originalAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
  };
}
