import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PrimaryButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({ label, variant = 'primary', style, ...rest }: PrimaryButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.primary : theme.backgroundElement,
          opacity: pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}>
      <ThemedText
        type="smallBold"
        style={{ color: isPrimary ? theme.onPrimary : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
  },
});
