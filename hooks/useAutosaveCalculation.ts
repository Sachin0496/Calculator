import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface AutosaveDraft {
  calculatorId: string;
  title: string;
  inputSummary: string;
  resultSummary: string;
  route: string;
}

export function useAutosaveCalculation(draft: AutosaveDraft | null) {
  const saveHistoryEntry = useAppStore((state) => state.saveHistoryEntry);

  const fingerprint = useMemo(() => {
    if (!draft) return '';
    return [
      draft.calculatorId,
      draft.inputSummary,
      draft.resultSummary,
      draft.route,
    ].join('|');
  }, [draft]);

  useEffect(() => {
    if (!draft) return;

    const timeout = setTimeout(() => {
      saveHistoryEntry(draft);
    }, 450);

    return () => clearTimeout(timeout);
  }, [draft, fingerprint, saveHistoryEntry]);
}
