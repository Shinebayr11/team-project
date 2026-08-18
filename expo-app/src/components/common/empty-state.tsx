import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function EmptyState({
  icon,
  title,
  description,
}: {
  /** A single emoji or short glyph — keeps this component asset-free. */
  icon?: string;
  title: string;
  description?: string;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.backgroundSelected }]}>
      {icon ? <ThemedText style={styles.icon}>{icon}</ThemedText> : null}
      <ThemedText type="smallBold">{title}</ThemedText>
      {description ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
          {description}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Spacing.four,
  },
  icon: {
    fontSize: 28,
  },
  description: {
    textAlign: 'center',
  },
});
