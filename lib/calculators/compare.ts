import { calculateEMI } from '@/lib/calculators/emi';

export interface LoanOfferInput {
  annualRate: number;
  tenureMonths: number;
  processingFee: number;
}

export interface LoanOfferResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  totalCost: number;
  annualRate: number;
  tenureMonths: number;
  processingFee: number;
}

export interface LoanComparisonInput {
  loanAmount: number;
  offerA: LoanOfferInput;
  offerB: LoanOfferInput;
}

export interface LoanComparisonResult {
  offerA: LoanOfferResult;
  offerB: LoanOfferResult;
  cheaperOffer: 'a' | 'b' | 'tie';
  savings: number;
  lowerEmiOffer: 'a' | 'b' | 'tie';
  emiGap: number;
}

function calculateOffer(loanAmount: number, offer: LoanOfferInput): LoanOfferResult {
  const emiResult = calculateEMI({
    principal: loanAmount,
    annualRate: offer.annualRate,
    tenureMonths: offer.tenureMonths,
  });

  return {
    emi: emiResult.emi,
    totalInterest: emiResult.totalInterest,
    totalAmount: emiResult.totalAmount,
    totalCost: emiResult.totalAmount + Math.max(0, offer.processingFee),
    annualRate: offer.annualRate,
    tenureMonths: offer.tenureMonths,
    processingFee: Math.max(0, offer.processingFee),
  };
}

export function compareLoans(input: LoanComparisonInput): LoanComparisonResult {
  const offerA = calculateOffer(input.loanAmount, input.offerA);
  const offerB = calculateOffer(input.loanAmount, input.offerB);

  const savings = Math.abs(offerA.totalCost - offerB.totalCost);
  const emiGap = Math.abs(offerA.emi - offerB.emi);

  const cheaperOffer =
    offerA.totalCost === offerB.totalCost
      ? 'tie'
      : offerA.totalCost < offerB.totalCost
        ? 'a'
        : 'b';

  const lowerEmiOffer =
    offerA.emi === offerB.emi ? 'tie' : offerA.emi < offerB.emi ? 'a' : 'b';

  return {
    offerA,
    offerB,
    cheaperOffer,
    savings,
    lowerEmiOffer,
    emiGap,
  };
}
