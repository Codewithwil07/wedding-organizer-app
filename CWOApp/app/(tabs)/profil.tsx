import React from 'react';
import { View, Text, Button, SafeAreaView, Pressable } from 'react-native';
import { useAuthStore } from '../../store/auth.store'; 
import tw from 'twrnc'; 
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilScreen() {
  const { logout, user } = useAuthStore(); 

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        {/* Header Profil */}
        <View style={tw`items-center my-6`}>
          <View style={tw`w-24 h-24 rounded-full bg-blue-600 justify-center items-center mb-4`}>
            <Ionicons name="person" size={60} color="white" />
          </View>
          <Text style={tw`text-2xl font-bold text-black`}>{user?.nama_user}</Text>
          <Text style={tw`text-base text-gray-500`}>{user?.email}</Text>
        </View>
        
        {/* Tombol History */}
        <Link href="/history-detail" asChild>
          <Pressable style={tw`bg-white p-5 rounded-lg shadow-sm mb-4 flex-row items-center`}>
            <Ionicons name="list-outline" size={24} style={tw`mr-4 text-blue-600`} />
            <Text style={tw`text-lg font-semibold text-black flex-1`}>History Pesanan Saya</Text>
            <Ionicons name="chevron-forward-outline" size={24} style={tw`text-gray-400`} />
          </Pressable>
        </Link>
        
        {/* Tombol Logout */}
        <Pressable 
          onPress={logout}
          style={tw`bg-white p-5 rounded-lg shadow-sm mb-4 flex-row items-center`}
        >
          <Ionicons name="log-out-outline" size={24} style={tw`mr-4 text-red-500`} />
          <Text style={tw`text-lg font-semibold text-red-500 flex-1`}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}