import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenProps = ViewProps & {
  /** Renders children in a ScrollView instead of a static View. Default: true. */
  scroll?: boolean;
};

/**
 * Common full-screen wrapper: safe area + theme background + max content
 * width (matches the web-inspired constraint already used by the default
 * template screens) + consistent horizontal padding.
 */
export function Screen({ scroll = true, style, children, ...rest }: ScreenProps) {
  const theme = useTheme();
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false }
    : { style: styles.content };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Container {...containerProps} {...rest} style={style}>
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.five,
  },
});
