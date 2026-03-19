// Custom hook to use color scheme
import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export function useTheme() {
  const rawScheme = useRNColorScheme();
  const colorScheme: 'light' | 'dark' = rawScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  return { colors, isDark, colorScheme };
}
