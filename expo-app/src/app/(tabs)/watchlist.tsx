import { EmptyState } from '@/components/common/empty-state';
import { Screen } from '@/components/common/screen';
import { SectionHeader } from '@/components/common/section-header';

export default function WatchlistScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Миний жагсаалт"
        subtitle="Хадгалсан болон дагаж буй дуудлага худалдаанууд"
      />
      <EmptyState
        icon="🔖"
        title="Жагсаалт хоосон байна"
        description="Дуудлага худалдаан дээр зүрх дүрсийг дарж энд хадгалж болно."
      />
    </Screen>
  );
}
