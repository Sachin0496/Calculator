import { useEffect } from 'react';
import { useAuth } from '@clerk/expo';
import { useAppStore } from '@/store/useAppStore';

export function ClerkSessionSync() {
  const { userId, isLoaded } = useAuth();
  const historyOwnerId = useAppStore((state) => state.historyOwnerId);
  const setHistoryOwnerId = useAppStore((state) => state.setHistoryOwnerId);
  const clearHistory = useAppStore((state) => state.clearHistory);

  useEffect(() => {
    if (!isLoaded) return;
    if (historyOwnerId === userId) return;

    clearHistory();
    setHistoryOwnerId(userId ?? null);
  }, [clearHistory, historyOwnerId, isLoaded, setHistoryOwnerId, userId]);

  return null;
}
