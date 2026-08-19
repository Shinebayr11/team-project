import { tokenCache } from '@clerk/expo/token-cache';
import { ClerkProvider } from '@clerk/expo';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  // Fails loudly and early instead of Clerk silently no-op'ing everywhere.
  // See expo-app/.env.example for the variable name to set.
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Copy expo-app/.env.example to expo-app/.env ' +
      'and paste the SAME publishable key the web frontend uses (same Clerk project).',
  );
}

// TS can't narrow `publishableKey` past the throw guard above once it's
// referenced inside a different function scope (RootLayout) — re-bind it to
// an explicitly `string`-typed constant here instead of using a `!` assertion.
const CLERK_PUBLISHABLE_KEY: string = publishableKey;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="sign-in" options={{ presentation: 'modal' }} />
          <Stack.Screen name="sign-up" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </ClerkProvider>
  );
}
