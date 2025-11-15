import React, { useState } from 'react';
import { 
  View, Text, SafeAreaView, ScrollView, TextInput, Button, 
  ActivityIndicator, Alert 
} from 'react-native';
import tw from 'twrnc';
import { Stack, useRouter } from 'expo-router';
import { useCartStore } from '../store/cart.store'; // <-- Store Keranjang
import api from '../api';

export default function CheckoutScreen() {
  const router = useRouter();
  
  // 1. Ambil state & action dari Zustand
  const { dokumentasi, busana, dekorasi, akadresepsi, totalHarga, clearCart } = useCartStore();
  const total = totalHarga();

  // 2. Form Manual pake 'useState'
  const [alamat, setAlamat] = useState('');
  const [tanggal, setTanggal] = useState(''); // (Kita simpel-in jadi 1 'string' tanggal)
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Fungsi 'onSubmit' manual
  const handleSubmit = async () => {
    setErrors({});
    let isValid = true;
    let localErrors: { [key: string]: string | null } = {};

    // 4. Validasi frontend manual
    if (total <= 0) {
      Alert.alert('Keranjang Kosong', 'Silakan pilih minimal 1 paket.');
      return;
    }
    if (alamat.length < 10) {
      localErrors.alamat = 'Alamat harus lengkap';
      isValid = false;
    }
    if (!tanggal) { // (Nanti lo bisa ganti ini pake 'datepicker')
      localErrors.tanggal = 'Tanggal acara wajib diisi';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(localErrors);
      return;
    }

    // 5. Kalo lolos, siapin payload
    setIsSubmitting(true);
    const payload = {
      id_dokum: dokumentasi?.id || null,
      id_busana: busana?.id || null,
      id_dekorasi: dekorasi?.id || null,
      id_ar: akadresepsi?.id || null,
      
      alamat: alamat,
      // (Kita samain 'waktu_awal' & 'waktu_akhir' biar gampang)
      waktu_awal: tanggal, 
      waktu_akhir: tanggal,
    };

    try {
      // 6. Tembak API Pesanan
      await api.post('/app/pesanan', payload);

      // 7. Kalo sukses
      Alert.alert('Booking Berhasil!', 'Pesanan Anda telah diterima dan menunggu konfirmasi admin.');
      clearCart(); // Kosongin keranjang
      router.replace('/(tabs)/profil'); // Tendang ke 'Profil' (History)
    } catch (err: any) {
      Alert.alert('Booking Gagal', err.response?.data?.message || 'Coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Stack.Screen options={{ title: 'Checkout Pesanan', headerShown: true }} />
      <ScrollView style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold text-black mb-4`}>Ringkasan Pesanan</Text>
        
        {/* Tampilan Keranjang */}
        <View style={tw`bg-gray-100 p-4 rounded-lg mb-4`}>
          {dokumentasi && <Text style={tw`text-base text-gray-700`}>• {dokumentasi.nama}</Text>}
          {busana && <Text style={tw`text-base text-gray-700`}>• {busana.nama}</Text>}
          {dekorasi && <Text style={tw`text-base text-gray-700`}>• {dekorasi.nama}</Text>}
          {akadresepsi && <Text style={tw`text-base text-gray-700`}>• {akadresepsi.nama}</Text>}
          
          {total > 0 ? (
            <Text style={tw`text-xl font-bold text-black mt-4`}>
              Total: Rp {total.toLocaleString('id-ID')}
            </Text>
          ) : (
            <Text style={tw`text-base text-gray-500`}>Keranjang Anda kosong.</Text>
          )}
        </View>

        <Text style={tw`text-2xl font-bold text-black mb-4`}>Detail Acara</Text>
        
        <Text style={tw`text-lg font-semibold text-black mb-2`}>Alamat Lengkap</Text>
        <TextInput
          style={tw`border ${errors.alamat ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg text-lg text-black mb-4 h-24`}
          placeholder="Masukkan alamat lengkap acara..."
          placeholderTextColor={tw.color('gray-400')}
          value={alamat}
          onChangeText={setAlamat}
          multiline
        />
        {errors.alamat && <Text style={tw`text-red-500 mb-4 -mt-2`}>{errors.alamat}</Text>}

        <Text style={tw`text-lg font-semibold text-black mb-2`}>Tanggal Acara</Text>
        <TextInput
          style={tw`border ${errors.tanggal ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg text-lg text-black mb-6`}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={tw.color('gray-400')}
          value={tanggal}
          onChangeText={setTanggal}
        />
        {errors.tanggal && <Text style={tw`text-red-500 mb-6 -mt-4`}>{errors.tanggal}</Text>}

        {isSubmitting ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Pesan Sekarang" onPress={handleSubmit} disabled={total <= 0} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}