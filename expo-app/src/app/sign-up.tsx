import { useSignUp } from '@clerk/expo';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Input } from '@/components/common/input';
import { PrimaryButton } from '@/components/common/primary-button';
import { Screen } from '@/components/common/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const submitting = fetchStatus === 'fetching';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onCreate = async () => {
    setError(null);

    const { error: passwordError } = await signUp.password({ emailAddress: email, password });
    if (passwordError) {
      setError(passwordError.longMessage ?? passwordError.message);
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.longMessage ?? sendError.message);
      return;
    }

    setPendingVerification(true);
  };

  const onVerify = async () => {
    setError(null);
    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });

    if (verifyError) {
      setError(verifyError.longMessage ?? verifyError.message);
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize();
      router.replace('/(tabs)');
    } else {
      setError('Баталгаажуулалт бүрэн дуусаагүй байна.');
    }
  };

  if (pendingVerification) {
    return (
      <Screen>
        <View style={styles.header}>
          <ThemedText type="subtitle">Имэйлээ баталгаажуулах</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {email} хаяг руу илгээсэн 6 оронтой кодыг оруулна уу
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Input
            label="Баталгаажуулах код"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            maxLength={6}
          />
          {error ? (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          ) : null}
          <PrimaryButton label="Баталгаажуулах" onPress={onVerify} disabled={submitting || code.length < 6} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      
      <View style={styles.header}>
        
        <ThemedText type="subtitle">Бүртгүүлэх</ThemedText>
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
          placeholder="Хамгийн багадаа 8 тэмдэгт"
        />

        {error ? (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        ) : null}

                <PrimaryButton label="Бүртгүүлэх" onPress={onCreate} disabled={submitting || !email || !password} />

        {Platform.OS === 'web' ? <View nativeID="clerk-captcha" /> : null}
      
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="textSecondary">
          Бүртгэлтэй юу?{' '}
        </ThemedText>
        <Link href="/sign-in" replace>
          <ThemedText type="small" themeColor="primary">
            Нэвтрэх
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
