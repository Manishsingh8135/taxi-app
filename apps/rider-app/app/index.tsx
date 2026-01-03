import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(main)/home');
      } else {
        router.replace('/(auth)/phone');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚕 TaxiGo</Text>
      <ActivityIndicator size="large" color="#FFD700" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 24,
  },
});
