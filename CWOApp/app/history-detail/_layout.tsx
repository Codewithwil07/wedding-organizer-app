import React from 'react';
import { Stack } from 'expo-router';

// Ini 'bungkus' buat halaman detail history
// Biar punya header dan tombol 'back' (modal)
export default function HistoryDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}