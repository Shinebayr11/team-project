import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/common/primary-button';
import { Screen } from '@/components/common/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Center "+" tab. Seller-only actions live here — for Phase 1 this is a
 * placeholder that explains what's coming; no auction creation logic yet
 * (that needs Clerk auth + mounted backend routes first).
 */
export default function CreateScreen() {
  const theme = useTheme();

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <ThemedView
          type="backgroundElement"
          style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
          <ThemedText style={[styles.iconGlyph, { color: theme.primary }]}>+</ThemedText>
        </ThemedView>

        <ThemedText type="subtitle" style={styles.title}>
          Дуудлага худалдаа үүсгэх
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
          Худалдагч болсны дараа энэ хэсгээс шинэ бараа нэмж, дуудлага худалдаа товлож,
          шууд дамжуулалт эхлүүлэх боломжтой болно.
        </ThemedText>

        <View style={styles.actions}>
          <PrimaryButton label="Худалдагч болох" variant="primary" />
          <PrimaryButton label="Дэлгэрэнгүй мэдээлэл" variant="secondary" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '600',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
