// Zustand store for calculator state
import { create } from 'zustand';

interface CalculatorState {
  // EMI
  emiPrincipal: string;
  emiRate: string;
  emiTenure: string;

  // GST
  gstAmount: string;
  gstRate: number;
  gstMode: 'add' | 'remove';

  // SIP
  sipAmount: string;
  sipReturn: string;
  sipYears: string;

  // FD
  fdPrincipal: string;
  fdRate: string;
  fdTenure: string;
  fdCompounding: 'quarterly' | 'monthly' | 'yearly';

  // Tax
  taxIncome: string;
  tax80C: string;
  tax80D: string;
  taxHRA: string;
  taxOther: string;

  // Actions
  setField: (field: string, value: string | number) => void;
  resetAll: () => void;
}

const initialState = {
  emiPrincipal: '2500000',
  emiRate: '8.5',
  emiTenure: '240',

  gstAmount: '10000',
  gstRate: 18,
  gstMode: 'add' as const,

  sipAmount: '5000',
  sipReturn: '12',
  sipYears: '10',

  fdPrincipal: '100000',
  fdRate: '7',
  fdTenure: '12',
  fdCompounding: 'quarterly' as const,

  taxIncome: '1000000',
  tax80C: '150000',
  tax80D: '25000',
  taxHRA: '0',
  taxOther: '0',
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  ...initialState,

  setField: (field, value) => set({ [field]: value } as any),

  resetAll: () => set(initialState),
}));
