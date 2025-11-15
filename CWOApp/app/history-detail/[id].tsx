import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useApi } from '../../api/useSWR';
import api from '../../api';

// ===================================================
// KOMPONEN STATUS BADGE
// ===================================================
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800',
      icon: '⏳',
      label: 'Menunggu Konfirmasi'
    },
    DITERIMA: { 
      bg: 'bg-green-100', 
      text: 'text-green-800',
      icon: '✅',
      label: 'Pesanan Diterima'
    },
    DITOLAK: { 
      bg: 'bg-red-100', 
      text: 'text-red-800',
      icon: '❌',
      label: 'Pesanan Ditolak'
    },
    DIBATALKAN: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800',
      icon: '🚫',
      label: 'Pesanan Dibatalkan'
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <View style={tw`${config.bg} px-4 py-2 rounded-full flex-row items-center`}>
      <Text style={tw`mr-2`}>{config.icon}</Text>
      <Text style={tw`${config.text} font-bold text-sm`}>{config.label}</Text>
    </View>
  );
};

// ===================================================
// KOMPONEN INFO ROW
// ===================================================
const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => {
  return (
    <View style={tw`flex-row items-start mb-4`}>
      <View style={tw`bg-purple-100 rounded-full w-10 h-10 items-center justify-center mr-3`}>
        <Text style={tw`text-xl`}>{icon}</Text>
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-500 text-xs mb-1`}>{label}</Text>
        <Text style={tw`text-gray-800 text-base font-semibold`}>{value}</Text>
      </View>
    </View>
  );
};

// ===================================================
// KOMPONEN PAKET ITEM
// ===================================================
const PaketItem = ({ icon, nama, tipe }: { icon: string; nama: string; tipe: string }) => {
  return (
    <View style={tw`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-3 flex-row items-center`}>
      <View style={tw`bg-white rounded-full w-12 h-12 items-center justify-center mr-3 shadow-sm`}>
        <Text style={tw`text-2xl`}>{icon}</Text>
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-xs text-purple-600 font-semibold mb-1`}>{tipe}</Text>
        <Text style={tw`text-gray-800 font-semibold`}>{nama}</Text>
      </View>
    </View>
  );
};

// ===================================================
// KOMPONEN EMPTY STATE
// ===================================================
const EmptyState = () => {
  const router = useRouter();
  
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <Stack.Screen options={{ title: 'Detail Pesanan' }} />
      
      <View style={tw`flex-1 justify-center items-center px-8`}>
        <View style={tw`bg-purple-100 rounded-full w-32 h-32 items-center justify-center mb-6`}>
          <Text style={tw`text-6xl`}>📦</Text>
        </View>
        
        <Text style={tw`text-2xl font-bold text-gray-800 mb-3 text-center`}>
          Belum Ada Pesanan
        </Text>
        
        <Text style={tw`text-gray-500 text-center mb-8 leading-6`}>
          Anda belum melakukan pemesanan apapun. {'\n'}
          Yuk, mulai pesan paket pernikahan impian Anda!
        </Text>
        
        <Pressable
          onPress={() => router.push('/(tabs)' as any)}
          style={({ pressed }) => [
            tw`rounded-2xl overflow-hidden shadow-lg`,
            { opacity: pressed ? 0.8 : 1 }
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tw`px-8 py-4 flex-row items-center`}
          >
            <Text style={tw`text-white font-bold text-base mr-2`}>
              Lihat Paket Tersedia
            </Text>
            <Text style={tw`text-white text-xl`}>→</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// ===================================================
// KOMPONEN ERROR STATE
// ===================================================
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <Stack.Screen options={{ title: 'Detail Pesanan' }} />
      
      <View style={tw`flex-1 justify-center items-center px-8`}>
        <View style={tw`bg-red-100 rounded-full w-32 h-32 items-center justify-center mb-6`}>
          <Text style={tw`text-6xl`}>⚠️</Text>
        </View>
        
        <Text style={tw`text-2xl font-bold text-gray-800 mb-3 text-center`}>
          Oops! Ada Kesalahan
        </Text>
        
        <Text style={tw`text-gray-500 text-center mb-8`}>
          {message || 'Gagal mengambil data pesanan'}
        </Text>
        
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            tw`bg-red-500 px-8 py-4 rounded-2xl`,
            { opacity: pressed ? 0.8 : 1 }
          ]}
        >
          <Text style={tw`text-white font-bold text-base`}>Coba Lagi</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// ===================================================
// MAIN SCREEN
// ===================================================
export default function HistoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data, isLoading, isError, mutate, error } = useApi(id ? `/app/pesanan/${id}` : null);

  // Handler untuk batalkan pesanan
  const handleCancel = async () => {
    Alert.alert(
      'Batalkan Pesanan',
      'Apakah Anda yakin ingin membatalkan pesanan ini?',
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.put(`/app/pesanan/${id}/cancel`);
              Alert.alert('Berhasil! 🎉', 'Pesanan Anda telah dibatalkan.', [
                {
                  text: 'OK',
                  onPress: () => {
                    mutate();
                    router.back();
                  }
                }
              ]);
            } catch (err: any) {
              console.error('Cancel error:', err);
              Alert.alert(
                'Gagal Membatalkan',
                err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
              );
            }
          },
        },
      ]
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={tw`text-gray-500 mt-4`}>Memuat detail pesanan...</Text>
      </SafeAreaView>
    );
  }

  // Error State
  if (isError) {
    return (
      <ErrorState 
        message={error?.response?.data?.message || 'Gagal mengambil data pesanan'}
        onRetry={() => mutate()}
      />
    );
  }

  // Empty State - Data tidak ada atau kosong
  if (!data || !data.data) {
    return <EmptyState />;
  }

  const pesanan = data.data;

  // Cek apakah ada paket yang dipesan
  const hasPaket = pesanan.dokumentasi || pesanan.busana || pesanan.dekorasi || pesanan.akadResepsi;

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <Stack.Screen 
        options={{ 
          title: `Pesanan #${pesanan.id_pesan}`,
          headerStyle: tw`bg-white`,
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Card dengan Gradient */}
        <View style={tw`m-4 rounded-2xl overflow-hidden shadow-lg`}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tw`p-6`}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-white text-xl font-bold`}>Pesanan #{pesanan.id_pesan}</Text>
              <View style={tw`bg-white bg-opacity-30 rounded-full px-3 py-1`}>
                <Text style={tw`text-white font-bold`}>
                  {new Date(pesanan.waktu_awal).toLocaleDateString('id-ID')}
                </Text>
              </View>
            </View>
            
            <View style={tw`bg-white bg-opacity-20 rounded-xl p-4`}>
              <Text style={tw`text-white text-sm mb-2`}>Total Pembayaran</Text>
              <Text style={tw`text-white text-3xl font-bold`}>
                Rp {pesanan.harga.toLocaleString('id-ID')}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Status Badge */}
        <View style={tw`px-4 mb-4`}>
          <StatusBadge status={pesanan.status} />
        </View>

        {/* Informasi Pesanan */}
        <View style={tw`bg-white mx-4 p-6 rounded-2xl shadow-md mb-4`}>
          <Text style={tw`text-gray-800 text-xl font-bold mb-4`}>📋 Informasi Pesanan</Text>
          
          <InfoRow 
            icon="📍" 
            label="Alamat Acara" 
            value={pesanan.alamat || 'Tidak ada alamat'}
          />
          
          <InfoRow 
            icon="📅" 
            label="Tanggal Acara" 
            value={new Date(pesanan.waktu_awal).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          />
          
          <InfoRow 
            icon="⏰" 
            label="Waktu Acara" 
            value={new Date(pesanan.waktu_awal).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          />
        </View>

        {/* Paket yang Dipesan */}
        <View style={tw`bg-white mx-4 p-6 rounded-2xl shadow-md mb-4`}>
          <Text style={tw`text-gray-800 text-xl font-bold mb-4`}>📦 Paket yang Dipesan</Text>
          
          {!hasPaket ? (
            <View style={tw`items-center py-8`}>
              <Text style={tw`text-gray-400 text-center`}>
                Tidak ada paket yang dipilih
              </Text>
            </View>
          ) : (
            <>
              {pesanan.dokumentasi && (
                <PaketItem 
                  icon="📸" 
                  nama={pesanan.dokumentasi.nama}
                  tipe="Dokumentasi"
                />
              )}
              {pesanan.busana && (
                <PaketItem 
                  icon="👔" 
                  nama={pesanan.busana.nama}
                  tipe="Busana"
                />
              )}
              {pesanan.dekorasi && (
                <PaketItem 
                  icon="🎨" 
                  nama={pesanan.dekorasi.nama}
                  tipe="Dekorasi"
                />
              )}
              {pesanan.akadResepsi && (
                <PaketItem 
                  icon="✨" 
                  nama={pesanan.akadResepsi.nama}
                  tipe="Alat & Rias"
                />
              )}
            </>
          )}
        </View>

        {/* Tombol Batalkan (Hanya untuk status PENDING) */}
        {pesanan.status === 'PENDING' && (
          <View style={tw`px-4 mb-8`}>
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                tw`bg-red-500 rounded-2xl py-4 shadow-lg`,
                { opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Text style={tw`text-white text-center font-bold text-base`}>
                🚫 Batalkan Pesanan
              </Text>
            </Pressable>
          </View>
        )}

        {/* Info Footer untuk status lain */}
        {pesanan.status !== 'PENDING' && (
          <View style={tw`mx-4 mb-8 p-4 bg-gray-100 rounded-2xl`}>
            <Text style={tw`text-gray-600 text-center text-sm`}>
              {pesanan.status === 'DITERIMA' && '✅ Pesanan Anda telah dikonfirmasi oleh admin'}
              {pesanan.status === 'DITOLAK' && '❌ Pesanan Anda ditolak. Silakan hubungi admin untuk info lebih lanjut'}
              {pesanan.status === 'DIBATALKAN' && '🚫 Pesanan ini telah dibatalkan'}
            </Text>
          </View>
        )}

        {/* Spacer bawah */}
        <View style={tw`h-4`} />
      </ScrollView>
    </SafeAreaView>
  );
}