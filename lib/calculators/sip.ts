// SIP & Lumpsum Calculator — Pure functions
// SIP Maturity = P × ((1 + r)^n − 1) / r × (1 + r)

export interface SIPInput {
  monthlyAmount: number;
  annualReturn: number;  // Expected return in %
  years: number;
}

export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  investedPercent: number;
  returnsPercent: number;
}

export interface SIPYearlyRow {
  year: number;
  invested: number;
  value: number;
}

export function calculateSIP(input: SIPInput): SIPResult {
  const { monthlyAmount, annualReturn, years } = input;

  if (monthlyAmount <= 0 || years <= 0) {
    return { investedAmount: 0, estimatedReturns: 0, totalValue: 0, investedPercent: 0, returnsPercent: 0 };
  }

  const n = years * 12;
  if (annualReturn <= 0) {
    const investedAmount = monthlyAmount * n;
    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: 0,
      totalValue: Math.round(investedAmount),
      investedPercent: 100,
      returnsPercent: 0,
    };
  }

  const r = annualReturn / 12 / 100;
  const rPowN = Math.pow(1 + r, n);

  const totalValue = monthlyAmount * ((rPowN - 1) / r) * (1 + r);
  const investedAmount = monthlyAmount * n;
  const estimatedReturns = totalValue - investedAmount;

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    investedPercent: Math.round((investedAmount / totalValue) * 100),
    returnsPercent: Math.round((estimatedReturns / totalValue) * 100),
  };
}

export function calculateLumpsum(principal: number, annualReturn: number, years: number): SIPResult {
  if (principal <= 0 || years <= 0) {
    return { investedAmount: 0, estimatedReturns: 0, totalValue: 0, investedPercent: 0, returnsPercent: 0 };
  }

  if (annualReturn <= 0) {
    return {
      investedAmount: Math.round(principal),
      estimatedReturns: 0,
      totalValue: Math.round(principal),
      investedPercent: 100,
      returnsPercent: 0,
    };
  }

  const r = annualReturn / 100;
  const totalValue = principal * Math.pow(1 + r, years);
  const estimatedReturns = totalValue - principal;

  return {
    investedAmount: Math.round(principal),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    investedPercent: Math.round((principal / totalValue) * 100),
    returnsPercent: Math.round((estimatedReturns / totalValue) * 100),
  };
}

export function generateSIPYearlyData(input: SIPInput): SIPYearlyRow[] {
  const data: SIPYearlyRow[] = [];
  for (let year = 1; year <= input.years; year++) {
    const result = calculateSIP({ ...input, years: year });
    data.push({
      year,
      invested: result.investedAmount,
      value: result.totalValue,
    });
  }
  return data;
}
