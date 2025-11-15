import React, { useState, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/auth.store';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await useAuthStore.persist.rehydrate();
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return; 
    const inAppGroup = segments.length > 0 ? segments[0] !== '(auth)' : false;

    if (token && !inAppGroup) {
      router.replace('/(tabs)/'); // Tendang ke Home
    } else if (!token && inAppGroup) {
      router.replace('/(auth)/login'); // Tendang ke Login
    }
  }, [isLoading, token, segments, router]); 

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="paket-list" options={{ presentation: 'modal' }} />
      <Stack.Screen name="history-detail" options={{ presentation: 'modal' }} />
      <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default RootLayoutNav;