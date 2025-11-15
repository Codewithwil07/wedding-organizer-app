import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Alert, Pressable,
  SafeAreaView, ActivityIndicator, ScrollView
} from 'react-native';
import tw from 'twrnc'; // Tailwind
import api from '../../api'; // Axios kita
import { useAuthStore } from '../../store/auth.store'; // Zustand kita
import { Link } from 'expo-router'; 

export default function LoginScreen() {
  const { setToken } = useAuthStore();
  
  // PAKE 'useState' MANUAL
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi 'onSubmit' manual
  const onSubmit = async () => {
    // 1. Validasi 'frontend'
    setApiError(null);
    setEmailError(null);
    setPasswordError(null);

    let isValid = true;
    if (!email) {
      setEmailError('Email wajib diisi');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password wajib diisi');
      isValid = false;
    }
    if (!isValid) return; 

    // 2. Kalo lolos, baru tembak API
    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      setToken(token, user); // (Layout bakal nanganin sisanya)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login gagal, coba lagi';
      setApiError(message);
      Alert.alert('Login Gagal', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-8`}>
        <Text style={tw`text-4xl font-bold text-black mb-10 text-center`}>
          LOGIN
        </Text>
        
        {apiError && (<Text style={tw`text-red-500 text-center mb-4`}>{apiError}</Text>)}

        <TextInput
          style={tw`border ${emailError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg text-lg text-black mb-4`}
          placeholder="Email"
          placeholderTextColor={tw.color('gray-400')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError && (<Text style={tw`text-red-500 mb-4 -mt-2`}>{emailError}</Text>)}

        <TextInput
          style={tw`border ${passwordError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg text-lg text-black mb-6`}
          placeholder="Password"
          placeholderTextColor={tw.color('gray-400')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {passwordError && (<Text style={tw`text-red-500 mb-6 -mt-4`}>{passwordError}</Text>)}

        {isSubmitting ? (
          <ActivityIndicator size="large" style={tw`mb-4`} />
        ) : (
          <Button title="Login" onPress={onSubmit} />
        )}

        <Link href="/(auth)/register" asChild>
          <Pressable style={tw`mt-8`}>
            <Text style={tw`text-blue-500 text-center text-base`}>
              Belum punya akun? <Text style={tw`font-bold`}>Sign Up</Text>
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}