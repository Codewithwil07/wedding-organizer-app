import 'package:dio/dio.dart';
import '../core/api_client.dart';

class AuthService {
  final Dio _dio = ApiClient().dio;

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return response.data['data']; // Isinya {token: "...", user: {...}}
    } catch (e) {
      rethrow;
    }
  }

  // Register
  Future<void> register(String nama, String email, String password) async {
    try {
      await _dio.post(
        '/auth/register',
        data: {'username': nama, 'email': email, 'password': password},
      );
    } catch (e) {
      rethrow;
    }
  }

  // Lupa Password (Minta OTP)
  Future<void> forgotPassword(String email) async {
    try {
      await _dio.post('/auth/forgot-password', data: {'email': email});
    } catch (e) {
      rethrow;
    }
  }

  // Reset Password (Kirim OTP + Pass Baru)
  Future<void> resetPassword(
    String email,
    String token,
    String newPassword,
  ) async {
    try {
      await _dio.post(
        '/auth/reset-password',
        data: {'email': email, 'token': token, 'password': newPassword},
      );
    } catch (e) {
      rethrow;
    }
  }

  // ... kode sebelumnya ...

  // Update Profile
  Future<Map<String, dynamic>> updateProfile(
    String nama,
    String email,
    String? password,
  ) async {
    try {
      final data = {
        'username': nama, // Backend butuh 'nama_user'
        'email': email, // Backend butuh 'nama_user'
        if (password != null && password.isNotEmpty) ...{
          'password': password,
          'confirmPassword': password, // Backend butuh ini buat validasi
        },
      };

      final response = await _dio.put('/app/profil', data: data);
      return response.data['data']; // Balikin data user terbaru
    } catch (e) {
      rethrow;
    }
  }
}
