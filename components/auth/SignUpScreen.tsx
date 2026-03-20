import React from 'react';
import { Link, type Href, useRouter } from 'expo-router';
import { useAuth, useSignUp } from '@clerk/expo';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CLERK_ENABLED } from '@/constants/clerk';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight } from '@/constants/theme';

export default function SignUpScreen() {
  if (!CLERK_ENABLED) {
    return <SignUpDisabledScreen />;
  }

  return <SignUpWithClerk />;
}

function SignUpDisabledScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Clerk is not configured</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to your env file before using sign up.
      </Text>
    </View>
  );
}

function SignUpWithClerk() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleSubmit = async () => {
    if (!signUp) return;

    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    if (!signUp) return;

    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl('/');
          if (url.startsWith('http')) {
            if (typeof window !== 'undefined') {
              window.location.href = url;
            }
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error('Sign-up attempt not complete:', signUp);
    }
  };

  if (signUp?.status === 'complete' || isSignedIn) {
    return null;
  }

  if (
    signUp?.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Verify your account</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={colors.textMuted}
          onChangeText={(nextCode) => setCode(nextCode)}
          keyboardType="numeric"
        />
        {errors.fields.code ? (
          <Text style={[styles.error, { color: colors.error }]}>{errors.fields.code.message}</Text>
        ) : null}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            fetchStatus === 'fetching' && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>I need a new code</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Sign up</Text>

      <Text style={[styles.label, { color: colors.textPrimary }]}>Email address</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={colors.textMuted}
        onChangeText={(nextEmailAddress) => setEmailAddress(nextEmailAddress)}
        keyboardType="email-address"
      />
      {errors.fields.emailAddress ? (
        <Text style={[styles.error, { color: colors.error }]}>
          {errors.fields.emailAddress.message}
        </Text>
      ) : null}

      <Text style={[styles.label, { color: colors.textPrimary }]}>Password</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={password}
        placeholder="Enter password"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        onChangeText={(nextPassword) => setPassword(nextPassword)}
      />
      {errors.fields.password ? (
        <Text style={[styles.error, { color: colors.error }]}>{errors.fields.password.message}</Text>
      ) : null}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.primary },
          (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === 'fetching'}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
      {errors ? (
        <Text style={[styles.debug, { color: colors.textMuted }]}>
          {JSON.stringify(errors, null, 2)}
        </Text>
      ) : null}

      <View style={styles.linkContainer}>
        <Text style={[styles.linkHint, { color: colors.textSecondary }]}>Already have an account? </Text>
        <Link href="/sign-in">
          <Text style={[styles.linkText, { color: colors.primary }]}>Sign in</Text>
        </Link>
      </View>

      <View nativeID="clerk-captcha" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  label: {
    fontWeight: FontWeight.semibold,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: 12,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: FontWeight.semibold,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    fontWeight: FontWeight.semibold,
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
  },
  linkHint: {
    fontSize: FontSize.body,
  },
  linkText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  error: {
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
});
