export const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

export const CLERK_ENABLED = CLERK_PUBLISHABLE_KEY.trim().length > 0;
