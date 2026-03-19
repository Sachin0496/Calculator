// EMI Calculator — Pure functions
// EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)

export interface EMIInput {
  principal: number;    // Loan amount in ₹
  annualRate: number;   // Annual interest rate (e.g. 8.5)
  tenureMonths: number; // Loan tenure in months
}

export interface EMIResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  principalPercent: number;
  interestPercent: number;
}

export interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export function calculateEMI(input: EMIInput): EMIResult {
  const { principal, annualRate, tenureMonths } = input;

  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalAmount: 0, principalPercent: 0, interestPercent: 0 };
  }

  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const rPowN = Math.pow(1 + r, n);

  const emi = (principal * r * rPowN) / (rPowN - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    principalPercent: Math.round((principal / totalAmount) * 100),
    interestPercent: Math.round((totalInterest / totalAmount) * 100),
  };
}

export function generateAmortization(input: EMIInput): AmortizationRow[] {
  const { principal, annualRate, tenureMonths } = input;
  const r = annualRate / 12 / 100;
  const { emi } = calculateEMI(input);

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      emi: Math.round(emi),
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  return schedule;
}
