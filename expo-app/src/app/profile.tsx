import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/empty-state';
import { PrimaryButton } from '@/components/common/primary-button';
import { Screen } from '@/components/common/screen';
import { SectionHeader } from '@/components/common/section-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedView type="backgroundElement" style={styles.avatar}>
          <ThemedText type="subtitle" style={{ color: theme.primary }}>
            Б
          </ThemedText>
        </ThemedView>
        <View style={styles.headerText}>
          <ThemedText type="smallBold">Нэвтрээгүй хэрэглэгч</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Нэвтэрч бүх боломжийг ашиглаарай
          </ThemedText>
        </View>
      </View>

      <PrimaryButton label="Нэвтрэх" variant="primary" />

      <View style={styles.section}>
        <SectionHeader title="Миний хуудас" />
        <EmptyState
          icon="👤"
          title="Профайл холбогдоогүй байна"
          description="Clerk нэвтрэлт холбогдсоны дараа энд бодит хэрэглэгчийн мэдээлэл харагдана."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    gap: 2,
  },
  section: {
    gap: Spacing.three,
  },
});
