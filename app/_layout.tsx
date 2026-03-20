import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ClerkSessionSync } from '@/components/auth/ClerkSessionSync';
import { CLERK_ENABLED, CLERK_PUBLISHABLE_KEY } from '@/constants/clerk';
import { useTheme } from '@/hooks/useTheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  if (CLERK_ENABLED) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <ClerkSessionSync />
        <RootLayoutNav />
      </ClerkProvider>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { colors, isDark } = useTheme();

  const theme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.primary,
        },
      };

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="calculators/emi"
          options={{ title: 'EMI Calculator', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="calculators/gst"
          options={{ title: 'GST Calculator', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="calculators/sip"
          options={{ title: 'SIP Calculator', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="calculators/fd"
          options={{ title: 'FD/RD Calculator', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="calculators/tax"
          options={{ title: 'Income Tax Calculator', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="calculators/compare"
          options={{ title: 'Compare Loans', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="subscription"
          options={{ title: 'FinCalc Pro', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="account"
          options={{ title: 'Account', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="privacy"
          options={{ title: 'Privacy', headerBackTitle: 'Back' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
