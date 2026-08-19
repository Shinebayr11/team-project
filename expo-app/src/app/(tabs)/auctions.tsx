import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/common/empty-state';
import { PillBadge } from '@/components/common/pill-badge';
import { Screen } from '@/components/common/screen';
import { SectionHeader } from '@/components/common/section-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const FILTERS = ['Бүгд', 'ШУУД', 'Удахгүй', 'Дууссан'];

export default function AuctionsScreen() {
  return (
    <Screen>
      <SectionHeader title="Дуудлага" subtitle="Бүх дуудлага худалдааг эндээс хайж үзээрэй" />

      <View style={styles.filterRow}>
        {FILTERS.map((label, i) => (
          <PillBadge key={label} label={label} tone={i === 0 ? 'primary' : 'neutral'} />
        ))}
      </View>

      <EmptyState
        icon="🔨"
        title="Дуудлага худалдаа олдсонгүй"
        description={
          'Backend-ийн /liveshow, /productlisting route-ууд холбогдсоны дараа\nэнд бодит дуудлагууд жагсаана.'
        }
      />

      <View style={styles.footNote}>
        <ThemedText type="small" themeColor="textSecondary">
          Одоогийн үнэ, countdown болон bid товч зэрэг нь дараагийн фазуудад нэмэгдэнэ.
        </ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  footNote: {
    paddingHorizontal: Spacing.two,
  },
});
