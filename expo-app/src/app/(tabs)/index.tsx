import { useAuth, useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/empty-state';
import { PillBadge } from '@/components/common/pill-badge';
import { PrimaryButton } from '@/components/common/primary-button';
import { Screen } from '@/components/common/screen';
import { SectionHeader } from '@/components/common/section-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const firstName = user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0];

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {isSignedIn && firstName ? `Сайн байна уу, ${firstName} 👋` : 'Нүүр'}
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.searchBar}>
          <ThemedText themeColor="textSecondary">Хайлт хийх...</ThemedText>
        </ThemedView>
        {isLoaded && !isSignedIn ? (
          <View style={styles.signInPrompt}>
            <View style={styles.signInText}>
              <ThemedText type="smallBold">Нэвтэрч бүх боломжийг ашиглаарай</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Bid хийх, дуудлага худалдаа хадгалахын тулд бүртгэл шаардлагатай
              </ThemedText>
            </View>
            <PrimaryButton label="Нэвтрэх" onPress={() => router.push('/sign-in')} />
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <SectionHeader title="Одоо явагдаж буй" subtitle="Шууд дуудлага худалдаа" />
          <PillBadge label="ШУУД" tone="live" />
        </View>
        <EmptyState
          icon="🔴"
          title="Одоогоор шууд дуудлага байхгүй"
          description="Backend-ийн /liveshow route холбогдсоны дараа энд идэвхтэй дуудлагууд харагдана."
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Удахгүй болох дуудлага" />
        <EmptyState
          icon="🕒"
          title="Товлогдсон дуудлага байхгүй"
          description="Дараагийн фазад бодит өгөгдлөөр дүүргэнэ."
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Ангилал" />
        <View style={styles.chipRow}>
          {['Электроник', 'Пүүз', 'Цаг', 'Загвар'].map((label) => (
            <PillBadge key={label} label={label} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Шилдэг худалдагчид" />
        <EmptyState icon="🏬" title="Худалдагчийн жагсаалт удахгүй" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.three,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  searchBar: {
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  signInPrompt: {
    gap: Spacing.two,
  },
  signInText: {
    gap: 2,
  },
  section: {
    gap: Spacing.three,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
