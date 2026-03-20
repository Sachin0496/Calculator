// Custom hook to use color scheme
import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export function useTheme() {
  const rawScheme = useRNColorScheme();
  const appearanceMode = useAppStore((state) => state.appearanceMode);
  const systemScheme: 'light' | 'dark' = rawScheme === 'dark' ? 'dark' : 'light';
  const colorScheme: 'light' | 'dark' =
    appearanceMode === 'system' ? systemScheme : appearanceMode;
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  return { colors, isDark, colorScheme, appearanceMode, systemScheme };
}
