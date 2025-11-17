import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';

import '../core/constants.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();

  UserModel? _user;
  String? _token;
  bool _isLoading = false;

  UserModel? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuth => _token != null;

  // === LOGIN ===
  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final data = await _authService.login(email, password);

      _token = data['token'];
      _user = UserModel.fromJson(data['user']);

      // Simpen ke HP
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.tokenKey, _token!);
      await prefs.setString(AppConstants.userKey, json.encode(_user!.toJson()));
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? 'Terjadi kesalahan saat login';
    } catch (e) {
      throw 'Gagal login: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // === LOGOUT ===
  Future<void> logout() async {
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    notifyListeners();
  }

  // === AUTO LOGIN (Cek pas app dibuka) ===
  Future<bool> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey(AppConstants.tokenKey)) return false;

    _token = prefs.getString(AppConstants.tokenKey);
    final userDataFn = prefs.getString(AppConstants.userKey);

    if (userDataFn != null) {
      _user = UserModel.fromJson(json.decode(userDataFn));
    }

    notifyListeners();
    return true;
  }

  // ... (import dan class AuthProvider yang lama) ...

  // === 2. REGISTER ===
  Future<void> register(String username, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Panggil Service
      await _authService.register(username, email, password);
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? 'Gagal Registrasi';
    } catch (e) {
      throw 'Gagal Registrasi: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // === 3. FORGOT PASSWORD (Minta OTP) ===
  Future<void> forgotPassword(String email) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.forgotPassword(email);
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? 'Gagal mengirim OTP';
    } catch (e) {
      throw 'Gagal mengirim OTP: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // === 4. RESET PASSWORD (Kirim OTP + Pass Baru) ===
  Future<void> resetPassword(
    String email,
    String token,
    String newPassword,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.resetPassword(email, token, newPassword);
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? 'Gagal reset password';
    } catch (e) {
      throw 'Gagal reset password: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // === UPDATE PROFILE ===
  Future<void> updateProfile(
    String username,
    String email,
    String? password,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      final updatedUserData = await _authService.updateProfile(
        username,
        email,
        password,
      );

      // 1. Update object User di RAM
      _user = UserModel.fromJson(updatedUserData);

      // 2. Update object User di Storage HP (biar pas restart tetep update)
      final prefs = await SharedPreferences.getInstance();
      // Kita perlu simpan ulang data user, tapi token tetep sama
      await prefs.setString(AppConstants.userKey, json.encode(_user!.toJson()));

      notifyListeners();
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? 'Gagal update profil';
    } catch (e) {
      throw 'Gagal update profil: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
