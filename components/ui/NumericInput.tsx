// Reusable numeric input field component
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontFamily, FontSize, FontWeight, Spacing } from '@/constants/theme';

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace('#', '').trim();
  const normalized = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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
  const [focused, setFocused] = useState(false);

  const ghostBorderColor = useMemo(() => {
    // "Ghost border" fallback: a faint outline without visually sectioning the page.
    const base = error ? colors.error : colors.border;
    const alpha = error ? 0.25 : 0.2;
    return hexToRgba(base, alpha);
  }, [colors.border, colors.error, error]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: focused ? colors.surfaceContainerHighest : colors.inputBg,
            borderColor: ghostBorderColor,
          },
        ]}
      >
        {prefix && (
          <Text style={[styles.prefix, { color: colors.primary }]}>{prefix}</Text>
        )}
        <TextInput
          style={[styles.input, { color: colors.textPrimary, fontFamily: FontFamily.headline }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          inputMode="decimal"
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {suffix && (
          <Text style={[styles.suffix, { color: colors.textSecondary }]}>{suffix}</Text>
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
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontFamily: FontFamily.label,
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
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.semibold,
    marginRight: Spacing.sm,
    fontFamily: FontFamily.headline,
  },
  input: {
    flex: 1,
    fontSize: FontSize.bodyMedium,
    fontWeight: FontWeight.medium,
    height: '100%',
    fontFamily: FontFamily.headline,
  },
  suffix: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    marginLeft: Spacing.sm,
    fontFamily: FontFamily.label,
  },
  hint: {
    fontSize: FontSize.caption,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
    fontFamily: FontFamily.body,
  },
});
