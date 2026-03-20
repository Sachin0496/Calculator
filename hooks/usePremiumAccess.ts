import { useAuth, useUser } from '@clerk/expo';

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function readBoolean(value: unknown): boolean {
  return value === true;
}

export function usePremiumAccess() {
  const auth = useAuth();
  const { user } = useUser();

  const rawTier =
    readString(user?.publicMetadata?.subscriptionTier) ??
    readString(user?.publicMetadata?.plan) ??
    'free';
  const tier = rawTier.toLowerCase();

  const hasPremiumTier = tier === 'pro' || tier === 'premium';
  const hasHistoryAccess =
    hasPremiumTier || readBoolean(user?.publicMetadata?.historyPremium);
  const hasCompareAccess =
    hasPremiumTier || readBoolean(user?.publicMetadata?.comparePremium);
  const billingPortalUrl = readString(user?.publicMetadata?.billingPortalUrl);
  const email =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? null;

  return {
    ...auth,
    user,
    email,
    tier,
    hasPremiumTier,
    hasHistoryAccess,
    hasCompareAccess,
    billingPortalUrl,
  };
}
