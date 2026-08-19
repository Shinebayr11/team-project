import * as React from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type InputProps = TextInputProps & {
  label?: string;
};

export const Input = React.forwardRef<TextInput, InputProps>(({ label, style, ...rest }, ref) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText type="smallBold" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: theme.border,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
});
Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  input: {
    height: 48,
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
});
