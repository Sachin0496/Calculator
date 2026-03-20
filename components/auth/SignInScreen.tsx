import React from 'react';
import { Link, type Href, useRouter } from 'expo-router';
import { useSignIn } from '@clerk/expo';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CLERK_ENABLED } from '@/constants/clerk';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';

export default function SignInScreen() {
  if (!CLERK_ENABLED) {
    return <SignInDisabledScreen />;
  }

  return <SignInWithClerk />;
}

function SignInDisabledScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Clerk is not configured</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to your env file before using sign in.
      </Text>
    </View>
  );
}

function SignInWithClerk() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const { colors } = useTheme();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleSubmit = async () => {
    if (!signIn) return;

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
    } else if (signIn.status === 'needs_second_factor') {
      // See Clerk's MFA guides for non-email second factor flows.
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code'
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  const handleVerify = async () => {
    if (!signIn) return;

    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  if (signIn?.status === 'needs_client_trust') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, styles.verifyTitle, { color: colors.textPrimary }]}>
          Verify your account
        </Text>
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
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>I need a new code</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.reset()}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Start over</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Sign in</Text>

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
      {errors.fields.identifier ? (
        <Text style={[styles.error, { color: colors.error }]}>
          {errors.fields.identifier.message}
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
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
      {errors ? (
        <Text style={[styles.debug, { color: colors.textMuted }]}>
          {JSON.stringify(errors, null, 2)}
        </Text>
      ) : null}

      <View style={styles.linkContainer}>
        <Text style={[styles.linkHint, { color: colors.textSecondary }]}>Don't have an account? </Text>
        <Link href="/sign-up">
          <Text style={[styles.linkText, { color: colors.primary }]}>Sign up</Text>
        </Link>
      </View>
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
  verifyTitle: {
    fontSize: 24,
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
