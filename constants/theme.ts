// FinCalc India — Design System Tokens

export const Colors = {
  light: {
    primary: '#4F6EF7',
    primaryLight: '#7189FA',
    primaryBg: '#E8ECFE',
    success: '#22C55E',
    successBg: '#DCFCE7',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    error: '#EF4444',
    info: '#38BDF8',
    background: '#F8F9FF',
    card: '#FFFFFF',
    inputBg: '#F1F3FF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    tabBar: '#FFFFFF',
    tabIcon: '#94A3B8',
    tabIconActive: '#4F6EF7',
  },
  dark: {
    primary: '#7189FA',
    primaryLight: '#96A8FC',
    primaryBg: '#1E2138',
    success: '#4ADE80',
    successBg: '#14532D',
    warning: '#FBBF24',
    warningBg: '#78350F',
    error: '#F87171',
    info: '#7DD3FC',
    background: '#0D0F1A',
    card: '#161827',
    inputBg: '#1E2138',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#2D3154',
    tabBar: '#161827',
    tabIcon: '#64748B',
    tabIconActive: '#7189FA',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 9999,
};

export const FontSize = {
  display: 32,
  h1: 22,
  h2: 18,
  body: 15,
  bodyMedium: 15,
  caption: 12,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Calculator metadata for home screen grid
export interface CalculatorMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  gradient: [string, string];
  isPremium: boolean;
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    id: 'emi',
    name: 'EMI',
    description: 'Home, Car & Personal Loans',
    icon: 'home',
    route: '/calculators/emi',
    gradient: ['#4F6EF7', '#7C3AED'],
    isPremium: false,
  },
  {
    id: 'gst',
    name: 'GST',
    description: 'Add or Remove GST',
    icon: 'receipt',
    route: '/calculators/gst',
    gradient: ['#F59E0B', '#EF4444'],
    isPremium: false,
  },
  {
    id: 'sip',
    name: 'SIP',
    description: 'Mutual Fund Returns',
    icon: 'trending-up',
    route: '/calculators/sip',
    gradient: ['#22C55E', '#14B8A6'],
    isPremium: false,
  },
  {
    id: 'fd',
    name: 'FD / RD',
    description: 'Fixed & Recurring Deposits',
    icon: 'landmark',
    route: '/calculators/fd',
    gradient: ['#8B5CF6', '#EC4899'],
    isPremium: false,
  },
  {
    id: 'tax',
    name: 'Tax',
    description: 'Old vs New Regime',
    icon: 'file-text',
    route: '/calculators/tax',
    gradient: ['#0EA5E9', '#6366F1'],
    isPremium: false,
  },
  {
    id: 'compare',
    name: 'Compare',
    description: 'Loan Comparison Tool',
    icon: 'git-compare-arrows',
    route: '/calculators/compare',
    gradient: ['#64748B', '#334155'],
    isPremium: true,
  },
];

// GST slab rates
export const GST_SLABS = [5, 12, 18, 28];

// Tax slabs FY 2024-25
export const TAX_SLABS_NEW = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
];

export const TAX_SLABS_OLD = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];
