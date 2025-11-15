import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  Pressable,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { useAuthStore } from '../../store/auth.store';
import { useApi } from '../../api/useSWR';
import api from '../../api';

const { width } = Dimensions.get('window');

// ===================================================
// HELPER FUNCTIONS
// ===================================================
const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return null; 
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  return `${api.defaults.baseURL?.replace('/api', '')}${url}`;
};

// ===================================================
// INTERFACES
// ===================================================
interface PortofolioItem {
  id: number;
  nama: string;
  deskripsi: string;
  image_url: string | null;
  kategori?: string;
}

interface CategoryCardProps {
  icon: string;
  title: string;
  subtitle: string;
  color: string[];
  onPress: () => void;
}

// ===================================================
// KOMPONEN HERO HEADER
// ===================================================
const HeroHeader = ({ userName }: { userName: string }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Pagi' : currentHour < 18 ? 'Siang' : 'Malam';

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`rounded-b-3xl px-6 pt-4 pb-8 shadow-lg`}
    >
      <StatusBar barStyle="light-content" />
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-white text-base opacity-90`}>Selamat {greeting} 👋</Text>
          <Text style={tw`text-white text-3xl font-bold mt-1`}>{userName}</Text>
        </View>
        <View style={tw`bg-white bg-opacity-20 rounded-full p-3`}>
          <Text style={tw`text-3xl`}>🎉</Text>
        </View>
      </View>
      
      {/* Quick Stats */}
      <View style={tw`flex-row justify-around mt-4`}>
        <View style={tw`items-center`}>
          <Text style={tw`text-white text-2xl font-bold`}>24</Text>
          <Text style={tw`text-white text-xs opacity-80`}>Proyek</Text>
        </View>
        <View style={tw`h-full w-px bg-white opacity-30`} />
        <View style={tw`items-center`}>
          <Text style={tw`text-white text-2xl font-bold`}>4.8</Text>
          <Text style={tw`text-white text-xs opacity-80`}>Rating</Text>
        </View>
        <View style={tw`h-full w-px bg-white opacity-30`} />
        <View style={tw`items-center`}>
          <Text style={tw`text-white text-2xl font-bold`}>156</Text>
          <Text style={tw`text-white text-xs opacity-80`}>Klien</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// ===================================================
// KOMPONEN CATEGORY CARD (4 Kategori Paket)
// ===================================================
const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, subtitle, color, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        tw`flex-1 m-2 rounded-2xl overflow-hidden shadow-md`,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <LinearGradient
        colors={color}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tw`p-4 h-32 justify-between`}
      >
        <Text style={tw`text-4xl`}>{icon}</Text>
        <View>
          <Text style={tw`text-white font-bold text-base`}>{title}</Text>
          <Text style={tw`text-white text-xs opacity-90`}>{subtitle}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

// ===================================================
// KOMPONEN PORTOFOLIO CARD (Enhanced)
// ===================================================
const PortofolioCard = ({ item, onPress }: { item: PortofolioItem; onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        tw`bg-white rounded-2xl shadow-lg mb-5 overflow-hidden`,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      {/* Image dengan Overlay Gradient */}
      <View style={tw`relative`}>
        <Image
          source={{ 
            uri: getFullImageUrl(item.image_url) || 
            'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop'
          }}
          style={tw`w-full h-56`}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={tw`absolute bottom-0 left-0 right-0 h-24 justify-end p-4`}
        >
          {item.kategori && (
            <View style={tw`bg-white bg-opacity-30 self-start px-3 py-1 rounded-full mb-2`}>
              <Text style={tw`text-white text-xs font-semibold`}>{item.kategori}</Text>
            </View>
          )}
        </LinearGradient>
      </View>
      
      {/* Content */}
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>{item.nama}</Text>
        <Text style={tw`text-sm text-gray-600 leading-5`} numberOfLines={2}>
          {item.deskripsi}
        </Text>
        
        {/* Action Footer */}
        <View style={tw`flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100`}>
          <Text style={tw`text-purple-600 font-semibold`}>Lihat Detail</Text>
          <Text style={tw`text-2xl`}>→</Text>
        </View>
      </View>
    </Pressable>
  );
};

// ===================================================
// SECTION HEADER
// ===================================================
const SectionHeader = ({ title, actionText, onActionPress }: { 
  title: string; 
  actionText?: string; 
  onActionPress?: () => void 
}) => {
  return (
    <View style={tw`flex-row justify-between items-center mb-4`}>
      <Text style={tw`text-2xl font-bold text-gray-800`}>{title}</Text>
      {actionText && onActionPress && (
        <Pressable onPress={onActionPress}>
          <Text style={tw`text-purple-600 font-semibold`}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

// ===================================================
// MAIN HOME SCREEN
// ===================================================
export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  // Fetch data (masih dummy)
  const { data, isLoading, isError } = useApi(null);
  
  // Data dummy dengan kategori
  const DUMMY_DATA: PortofolioItem[] = [
    {
      id: 1,
      nama: "Pernikahan Budi & Ana",
      deskripsi: "Konsep modern minimalis dengan sentuhan budaya Madura yang elegan dan memukau.",
      image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
      kategori: "Wedding"
    },
    {
      id: 2,
      nama: "Akad Nikah Sarah & Doni",
      deskripsi: "Prosesi akad nikah adat Madura yang sakral dengan dekorasi tradisional.",
      image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop",
      kategori: "Traditional"
    },
    {
      id: 3,
      nama: "Pre-Wedding di Pantai",
      deskripsi: "Sesi foto pre-wedding romantis di pantai dengan golden hour yang sempurna.",
      image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2070&auto=format&fit=crop",
      kategori: "Pre-Wedding"
    }
  ];

  const categories = [
    {
      icon: '📸',
      title: 'Dokumentasi',
      subtitle: 'Foto & Video Pro',
      color: ['#667eea', '#764ba2'],
      route: '/paket-list/dokumentasi'
    },
    {
      icon: '👔',
      title: 'Busana',
      subtitle: 'Rias & Pakaian',
      color: ['#f093fb', '#f5576c'],
      route: '/paket-list/busana'
    },
    {
      icon: '🎨',
      title: 'Dekorasi',
      subtitle: 'Design Interior',
      color: ['#4facfe', '#00f2fe'],
      route: '/paket-list/dekorasi'
    },
    {
      icon: '✨',
      title: 'Akad & Resepsi',
      subtitle: 'Full Packagae Akad & Resepsi',
      color: ['#43e97b', '#38f9d7'],
      route: '/paket-list/akadresepsi'
    }
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={tw`py-20 items-center`}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={tw`text-gray-500 mt-4`}>Memuat portofolio...</Text>
        </View>
      );
    }
    
    if (DUMMY_DATA.length === 0) {
      return (
        <View style={tw`py-20 items-center`}>
          <Text style={tw`text-6xl mb-4`}>📂</Text>
          <Text style={tw`text-gray-500 text-center`}>Belum ada portofolio.</Text>
        </View>
      );
    }
    
    return DUMMY_DATA.map(item => (
      <PortofolioCard 
        key={item.id} 
        item={item}
        onPress={() => console.log('Detail:', item.nama)}
      />
    ));
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Hero Header */}
        <HeroHeader userName={user?.nama_user || 'Guest'} />

        {/* 2. Categories Grid */}
        <View style={tw`px-4 mt-10`}>
          <View style={tw`bg-white rounded-2xl shadow-lg p-4 mb-6`}>
            <SectionHeader title="Layanan Kami" />
            <View style={tw`flex-row flex-wrap -m-2`}>
              {categories.map((cat, idx) => (
                <View key={idx} style={tw`w-1/2`}>
                  <CategoryCard
                    icon={cat.icon}
                    title={cat.title}
                    subtitle={cat.subtitle}
                    color={cat.color}
                    onPress={() => router.push(cat.route as any)}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 3. Portofolio Section */}
        <View style={tw`px-4 mb-6`}>
          <SectionHeader 
            title="Portofolio Terbaru" 
            actionText="Lihat Semua"
            onActionPress={() => console.log('Show all')}
          />
          {renderContent()}
        </View>

        {/* 4. CTA Banner */}
        <View style={tw`px-4 mb-8`}>
          <Pressable
            onPress={() => router.push('/paket-list/dokumentasi' as any)}
            style={({ pressed }) => [
              tw`rounded-2xl overflow-hidden shadow-lg`,
              { opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <LinearGradient
              colors={['#ff6b6b', '#ee5a6f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={tw`p-6 flex-row items-center justify-between`}
            >
              <View style={tw`flex-1`}>
                <Text style={tw`text-white text-xl font-bold mb-2`}>
                  Pesan Sekarang! 🎊
                </Text>
                <Text style={tw`text-white opacity-90`}>
                  Dapatkan diskon 20% untuk pemesanan hari ini
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}