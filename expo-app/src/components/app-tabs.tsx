import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Нүүр</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="auctions">
        <NativeTabs.Trigger.Label>Дуудлага</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'flame', selected: 'flame.fill' }}
          md={{ default: 'local_fire_department', selected: 'local_fire_department' }}
        />
      </NativeTabs.Trigger>

      {/* Center action — visually emphasized via a solid filled icon +
          brand-purple selected color. NativeTabs renders a real native
          tab bar (UITabBar / BottomNavigationView), so a floating/raised
          FAB button is not achievable without dropping this navigator —
          see Phase 1 report for details. */}
      <NativeTabs.Trigger name="create">
        <NativeTabs.Trigger.Label selectedStyle={{ color: colors.primary }}>+</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          selectedColor={colors.primary}
          sf="plus.circle.fill"
          md="add_circle"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="watchlist">
        <NativeTabs.Trigger.Label>Миний жагсаалт</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bookmark', selected: 'bookmark.fill' }}
          md={{ default: 'bookmark', selected: 'bookmark' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Миний хуудас</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md={{ default: 'person', selected: 'person' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
