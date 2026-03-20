import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { CLERK_ENABLED } from '@/constants/clerk';

function AuthRoutesLayoutWithClerk() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack />;
}

export default function AuthRoutesLayout() {
  if (!CLERK_ENABLED) {
    return <Stack />;
  }

  return <AuthRoutesLayoutWithClerk />;
}
