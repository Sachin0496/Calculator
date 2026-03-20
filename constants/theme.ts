// FinCalc India — Design System Tokens

export const Colors = {
  light: {
    // Digital Ledger — "The Digital Ledger" editorial palette
    primary: '#00535b', // Deep teal (authority)
    primaryLight: '#006d77', // primary-container
    primaryBg: '#006d77',

    secondary: '#ae2f34', // Warm coral (action / emphasis)

    // The system prefers teal tones for growth; reserve coral for emphasis/warnings
    success: '#006d77', // primary-container (teal tint)
    successBg: '#e5f4f4',

    warning: '#ae2f34',
    warningBg: '#ffdad6',

    error: '#ba1a1a',
    info: '#006972',

    // Surfaces
    background: '#f9f9f9', // surface
    card: '#ffffff', // surface-container-lowest (default card)
    inputBg: '#f3f3f4', // surface-container-low

    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f3f3f4',
    surfaceContainerHigh: '#e8e8e8',
    surfaceContainerHighest: '#e2e2e2',
    surfaceTint: '#006972',
    surfaceVariant: '#e2e2e2',

    // Typography colors
    textPrimary: '#1a1c1c', // on-surface
    textSecondary: '#3e494a', // on-surface-variant
    textMuted: '#6f797a', // outline-ish

    // Borders / strokes (ghost border fallback)
    border: '#bec8ca', // outline-variant

    // Bottom nav
    tabBar: '#f9f9f9',
    tabIcon: '#64748b',
    tabIconActive: '#ae2f34',

    // Extra tokens used by some components
    outlineVariant: '#bec8ca',
  },
  dark: {
    primary: '#82d3de',
    primaryLight: '#82d3de',
    primaryBg: '#1b3941',

    secondary: '#ff6b6b',

    success: '#82d3de',
    successBg: '#14532D',

    warning: '#ff6b6b',
    warningBg: '#78350F',

    error: '#F87171',
    info: '#7DD3FC',

    background: '#0D0F1A',
    card: '#161827',
    inputBg: '#1E2138',

    surfaceContainerLowest: '#161827',
    surfaceContainerLow: '#1E2138',
    surfaceContainerHigh: '#232a44',
    surfaceContainerHighest: '#2a3356',
    surfaceTint: '#006972',
    surfaceVariant: '#e2e2e2',

    textPrimary: '#F1F5F9',
    textSecondary: '#b6c0d1',
    textMuted: '#94A3B8',

    border: '#2D3154',

    tabBar: '#161827',
    tabIcon: '#a5b1c2',
    tabIconActive: '#82d3de',

    outlineVariant: '#2D3154',
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
  sm: 12, // "rounded-xl" feel
  md: 20, // 20dp editorial cards
  lg: 24, // 24dp large surfaces
  full: 9999,
};

export const FontSize = {
  display: 44, // display-lg for rupee results
  h1: 28,
  h2: 18,
  body: 15,
  bodyMedium: 16,
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
    shadowColor: '#1a1c1c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  button: {
    shadowColor: '#ae2f34',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 2,
  },
};

export const FontFamily = {
  headline: 'Manrope',
  body: 'Inter',
  label: 'Inter',
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
