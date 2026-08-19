import { useAuth, useUser } from '@clerk/expo';
import { router } from 'expo-router';
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
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Хэрэглэгч';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedView type="backgroundElement" style={styles.avatar}>
          <ThemedText type="subtitle" style={{ color: theme.primary }}>
            {isSignedIn ? initial : 'Б'}
          </ThemedText>
        </ThemedView>
        <View style={styles.headerText}>
          <ThemedText type="smallBold">{isSignedIn ? displayName : 'Нэвтрээгүй хэрэглэгч'}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {isSignedIn ? user?.primaryEmailAddress?.emailAddress : 'Нэвтэрч бүх боломжийг ашиглаарай'}
          </ThemedText>
        </View>
      </View>

      {!isLoaded ? null : isSignedIn ? (
        <PrimaryButton label="Гарах" variant="secondary" onPress={() => signOut()} />
      ) : (
        <PrimaryButton label="Нэвтрэх" variant="primary" onPress={() => router.push('/sign-in')} />
      )}

      <View style={styles.section}>
        <SectionHeader title="Миний хуудас" />
        {isSignedIn ? (
          <EmptyState
            icon="🧾"
            title="Захиалга, bid түүх удахгүй"
            description="Backend-ийн order/bid route холбогдсоны дараа энд бодит мэдээлэл харагдана."
          />
        ) : (
          <EmptyState
            icon="👤"
            title="Профайл харахын тулд нэвтэрнэ үү"
            description="Bid хийх, дуудлага худалдаа хийхийн тулд эхлээд бүртгэл шаардлагатай."
          />
        )}
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
    flexShrink: 1,
  },
  section: {
    gap: Spacing.three,
  },
});
