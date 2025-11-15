import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Alert, Pressable,
  SafeAreaView, ActivityIndicator, ScrollView
} from 'react-native';
import tw from 'twrnc';
import api from '../../api';
import { Link, useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [namaUser, setNamaUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setApiError(null);
    setErrors({});

    let localErrors: { [key: string]: string | null } = {};

    if (!namaUser) localErrors.username = 'Nama wajib diisi';
    if (!email) localErrors.email = 'Email wajib diisi';
    if (password.length < 6) localErrors.password = 'Password minimal 6 karakter';
    if (password !== confirmPassword) localErrors.confirmPassword = 'Password tidak cocok';

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/register', {
        username: namaUser,
        email: email,
        password: password,
      });

      Alert.alert(
        'Registrasi Berhasil',
        'Akun Anda berhasil dibuat. Silakan login.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );

    } catch (err: any) {
      const message = err.response?.data?.message || 'Registrasi gagal, Coba lagi';
      setApiError(message);
      Alert.alert('Registrasi Gagal', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center p-8`}>

        <Text style={tw`text-4xl font-bold text-black mb-10 text-center`}>
          REGISTER
        </Text>

        {apiError && (
          <Text style={tw`text-red-500 text-center mb-4`}>{apiError}</Text>
        )}

        {/* Input Nama */}
        <TextInput
          style={[
            tw`p-3 rounded-lg text-lg text-black mb-4 border`,
            { borderColor: errors.username ? 'red' : '#d1d5db' }
          ]}
          placeholder="Nama Lengkap"
          placeholderTextColor={tw.color('gray-400')}
          value={namaUser}
          onChangeText={setNamaUser}
        />
        {errors.username && (
          <Text style={tw`text-red-500 mb-2 -mt-2`}>{errors.username}</Text>
        )}

        {/* Input Email */}
        <TextInput
          style={[
            tw`p-3 rounded-lg text-lg text-black mb-4 border`,
            { borderColor: errors.email ? 'red' : '#d1d5db' }
          ]}
          placeholder="Email"
          placeholderTextColor={tw.color('gray-400')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text style={tw`text-red-500 mb-2 -mt-2`}>{errors.email}</Text>
        )}

        {/* Input Password */}
        <TextInput
          style={[
            tw`p-3 rounded-lg text-lg text-black mb-4 border`,
            { borderColor: errors.password ? 'red' : '#d1d5db' }
          ]}
          placeholder="Password (minimal 6 karakter)"
          placeholderTextColor={tw.color('gray-400')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password && (
          <Text style={tw`text-red-500 mb-2 -mt-2`}>{errors.password}</Text>
        )}

        {/* Konfirmasi Password */}
        <TextInput
          style={[
            tw`p-3 rounded-lg text-lg text-black mb-6 border`,
            { borderColor: errors.confirmPassword ? 'red' : '#d1d5db' }
          ]}
          placeholder="Konfirmasi Password"
          placeholderTextColor={tw.color('gray-400')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {errors.confirmPassword && (
          <Text style={tw`text-red-500 mb-4 -mt-4`}>{errors.confirmPassword}</Text>
        )}

        {isSubmitting ? (
          <ActivityIndicator size="large" style={tw`mb-4`} />
        ) : (
          <Button title="Register" onPress={onSubmit} />
        )}

        <Link href="/(auth)/login" asChild>
          <Pressable style={tw`mt-8`}>
            <Text style={tw`text-blue-500 text-center text-base`}>
              Sudah punya akun? <Text style={tw`font-bold`}>Login</Text>
            </Text>
          </Pressable>
        </Link>

      </ScrollView>
    </SafeAreaView>
  );
}
