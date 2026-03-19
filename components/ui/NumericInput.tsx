// Reusable numeric input field component
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';

interface NumericInputProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  error?: string;
}

export function NumericInput({
  label,
  value,
  onChangeText,
  prefix = '₹',
  suffix,
  hint,
  error,
  ...rest
}: NumericInputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        {prefix && (
          <Text style={[styles.prefix, { color: colors.textMuted }]}>{prefix}</Text>
        )}
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholderTextColor={colors.textMuted}
          {...rest}
        />
        {suffix && (
          <Text style={[styles.suffix, { color: colors.textMuted }]}>{suffix}</Text>
        )}
      </View>
      {error ? (
        <Text style={[styles.hint, { color: colors.error }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    height: 56,
    paddingHorizontal: Spacing.md,
  },
  prefix: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    height: '100%',
  },
  suffix: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    marginLeft: Spacing.sm,
  },
  hint: {
    fontSize: FontSize.caption,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
