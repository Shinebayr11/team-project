import { useSignIn } from '@clerk/expo';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Input } from '@/components/common/input';
import { PrimaryButton } from '@/components/common/primary-button';
import { Screen } from '@/components/common/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const submitting = fetchStatus === 'fetching';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    const { error: submitError } = await signIn.password({ emailAddress: email, password });

    if (submitError) {
      setError(submitError.longMessage ?? submitError.message);
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();
      router.replace('/(tabs)');
    } else {
      // Dashboard may require an additional factor (2FA, etc.) not yet handled here.
      setError('Нэвтрэлт бүрэн дуусаагүй байна. Clerk Dashboard-ийн тохиргоог шалгана уу.');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="subtitle">Нэвтрэх</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Имэйл болон нууц үгээ оруулна уу
        </ThemedText>
      </View>

      <View style={styles.form}>
        <Input
          label="Имэйл"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
        />
        <Input
          label="Нууц үг"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        {error ? (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        ) : null}

        <PrimaryButton label="Нэвтрэх" onPress={onSubmit} disabled={submitting || !email || !password} />
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="textSecondary">
          Бүртгэлгүй юу?{' '}
        </ThemedText>
        <Link href="/sign-up" replace>
          <ThemedText type="small" themeColor="primary">
            Бүртгүүлэх
          </ThemedText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.half,
  },
  form: {
    gap: Spacing.three,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  error: {
    color: '#E0363C',
  },
});
