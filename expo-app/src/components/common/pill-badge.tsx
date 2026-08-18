import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export function PillBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'primary' | 'live';
}) {
  const theme = useTheme();

  const background =
    tone === 'primary' ? theme.primaryMuted : tone === 'live' ? theme.danger : theme.backgroundElement;
  const color = tone === 'primary' ? theme.primary : tone === 'live' ? '#FFFFFF' : theme.textSecondary;

  return (
    <View style={[styles.pill, { backgroundColor: background }]}>
      {tone === 'live' ? <View style={styles.dot} /> : null}
      <ThemedText type="smallBold" style={{ color, fontSize: 11 }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
});
