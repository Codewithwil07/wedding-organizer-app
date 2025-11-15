import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCartStore } from '../../store/cart.store';
import api from '../../api';

// Helper untuk bikin URL image full
const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  return `${api.defaults.baseURL?.replace('/api', '')}${url}`;
};

export default function PaketListScreen() {
  const { tipe: tipeParam } = useLocalSearchParams<{ tipe: string | string[] }>();
  const tipe = Array.isArray(tipeParam) ? tipeParam[0] : tipeParam;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addPackage } = useCartStore();

  useEffect(() => {
    console.log('🎯 Tipe parameter:', tipe);
    
    if (!tipe) {
      console.log('⚠️ Tipe kosong, abort fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const url = `/app/paket/${tipe}`;
    console.log('🔍 Fetching:', `${api.defaults.baseURL}${url}`);

    // Gunakan axios agar auto inject token dari interceptor
    api.get(url)
      .then((res) => {
        console.log('✅ Response received:', res.data);
        
        // Handle berbagai format response
        const paketData = res.data.data || res.data || [];
        console.log('📦 Paket data:', paketData);
        
        setData(Array.isArray(paketData) ? paketData : []);
      })
      .catch((err) => {
        console.error('❌ Fetch error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        setError(
          err.response?.data?.message || 
          `Gagal mengambil data paket (${err.response?.status || 'Network Error'})`
        );
      })
      .finally(() => {
        console.log('🏁 Fetch completed');
        setLoading(false);
      });
  }, [tipe]);

  const handleAddToCart = (paket: any) => {
    const paketData = {
      id: paket.id_dokum || paket.id_busana || paket.id_dekorasi || paket.id_ar,
      nama: paket.nama,
      harga: paket.harga,
      image_url: paket.image_url,
      tipe: tipe as string,
    };
    
    console.log('🛒 Adding to cart:', paketData);
    addPackage(paketData);
    Alert.alert('Sukses!', `${paket.nama} berhasil ditambah ke keranjang.`);
  };

  // State: Tipe tidak ada
  if (!tipe) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-gray-500 text-lg`}>Tipe paket tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  // State: Loading
  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={tw`mt-2 text-gray-500`}>Memuat paket...</Text>
      </SafeAreaView>
    );
  }

  // State: Error
  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white px-4`}>
        <Text style={tw`text-red-500 text-lg mb-2 text-center`}>{error}</Text>
        <Button title="Coba Lagi" onPress={() => {
          setError(null);
          setLoading(true);
          // Trigger re-fetch
          api.get(`/app/paket/${tipe}`)
            .then((res) => setData(res.data.data || res.data || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }} />
      </SafeAreaView>
    );
  }

  // State: Data kosong
  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-gray-500 text-lg`}>Belum ada paket untuk kategori ini.</Text>
      </SafeAreaView>
    );
  }

  // State: Tampilkan data
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <Stack.Screen
        options={{
          title: `Paket ${tipe.charAt(0).toUpperCase() + tipe.slice(1)}`,
        }}
      />

      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          String(item.id_dokum || item.id_busana || item.id_dekorasi || item.id_ar || index)
        }
        renderItem={({ item }) => (
          <View style={tw`bg-white m-2 p-4 rounded-lg shadow-md`}>
            <Image
              source={
                item.image_url
                  ? { uri: getFullImageUrl(item.image_url) }
                  : require('../../assets/images/android-icon-background.png')
              }
              style={tw`w-full h-40 rounded-md bg-gray-200 mb-4`}
              resizeMode="cover"
            />
            <Text style={tw`text-xl font-bold text-black`}>{item.nama}</Text>
            <Text style={tw`text-lg text-blue-600 mb-2`}>
              Rp {item.harga?.toLocaleString('id-ID') || '0'}
            </Text>
            <Button title="Tambah ke Keranjang" onPress={() => handleAddToCart(item)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}