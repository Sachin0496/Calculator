import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppearanceMode = 'system' | 'light' | 'dark';

export interface HistoryEntry {
  id: string;
  calculatorId: string;
  title: string;
  inputSummary: string;
  resultSummary: string;
  route: string;
  savedAt: string;
}

interface HistoryDraft {
  calculatorId: string;
  title: string;
  inputSummary: string;
  resultSummary: string;
  route: string;
}

interface AppState {
  appearanceMode: AppearanceMode;
  historyOwnerId: string | null;
  history: HistoryEntry[];
  setAppearanceMode: (mode: AppearanceMode) => void;
  setHistoryOwnerId: (ownerId: string | null) => void;
  saveHistoryEntry: (draft: HistoryDraft) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      appearanceMode: 'system',
      historyOwnerId: null,
      history: [],
      setAppearanceMode: (appearanceMode) => set({ appearanceMode }),
      setHistoryOwnerId: (historyOwnerId) => set({ historyOwnerId }),
      saveHistoryEntry: (draft) =>
        set((state) => {
          const entry: HistoryEntry = {
            ...draft,
            id: draft.calculatorId,
            savedAt: new Date().toISOString(),
          };

          return {
            history: [
              entry,
              ...state.history.filter((item) => item.calculatorId !== draft.calculatorId),
            ].slice(0, 12),
          };
        }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'fincalc-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        appearanceMode: state.appearanceMode,
        historyOwnerId: state.historyOwnerId,
        history: state.history,
      }),
    }
  )
);
