// FD & RD Calculator — Pure functions

export interface FDInput {
  principal: number;
  annualRate: number;      // Interest rate in %
  tenureMonths: number;
  compoundingFrequency: 'quarterly' | 'monthly' | 'yearly';
}

export interface FDResult {
  maturityAmount: number;
  totalInterest: number;
  investedAmount: number;
}

export interface RDInput {
  monthlyDeposit: number;
  annualRate: number;
  tenureMonths: number;
}

export interface RDResult {
  maturityAmount: number;
  totalDeposited: number;
  totalInterest: number;
}

export function calculateFD(input: FDInput): FDResult {
  const { principal, annualRate, tenureMonths, compoundingFrequency } = input;

  if (principal <= 0 || tenureMonths <= 0) {
    return { maturityAmount: 0, totalInterest: 0, investedAmount: 0 };
  }

  if (annualRate <= 0) {
    return {
      maturityAmount: Math.round(principal),
      totalInterest: 0,
      investedAmount: Math.round(principal),
    };
  }

  let n: number;
  switch (compoundingFrequency) {
    case 'monthly': n = 12; break;
    case 'quarterly': n = 4; break;
    case 'yearly': n = 1; break;
  }

  const r = annualRate / 100;
  const t = tenureMonths / 12;

  // A = P(1 + r/n)^(n*t)
  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const totalInterest = maturityAmount - principal;

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
    investedAmount: principal,
  };
}

export function calculateRD(input: RDInput): RDResult {
  const { monthlyDeposit, annualRate, tenureMonths } = input;

  if (monthlyDeposit <= 0 || tenureMonths <= 0) {
    return { maturityAmount: 0, totalDeposited: 0, totalInterest: 0 };
  }

  const totalDeposited = monthlyDeposit * tenureMonths;
  if (annualRate <= 0) {
    return {
      maturityAmount: Math.round(totalDeposited),
      totalDeposited: Math.round(totalDeposited),
      totalInterest: 0,
    };
  }

  const r = annualRate / 100 / 4; // Quarterly compounding
  const n = tenureMonths;
  let maturityAmount = 0;

  // Each monthly installment earns interest for remaining months
  for (let i = 0; i < n; i++) {
    const monthsRemaining = n - i;
    const quarters = monthsRemaining / 3;
    maturityAmount += monthlyDeposit * Math.pow(1 + r, quarters);
  }

  const totalInterest = maturityAmount - totalDeposited;

  return {
    maturityAmount: Math.round(maturityAmount),
    totalDeposited: Math.round(totalDeposited),
    totalInterest: Math.round(totalInterest),
  };
}
