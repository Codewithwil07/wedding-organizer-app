import 'package:dio/dio.dart';
import '../core/api_client.dart';
import '../models/pesanan_model.dart';

class PesananService {
  final Dio _dio = ApiClient().dio;

  // 1. Buat Pesanan (POST)
  Future<PesananModel> createPesanan(Map<String, dynamic> payload) async {
    try {
      final response = await _dio.post('/app/pesanan', data: payload);
      // Backend balikin data pesanan baru
      return PesananModel.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }

  // 2. Get History (GET)
  Future<List<PesananModel>> getMyHistory() async {
    try {
      final response = await _dio.get('/app/pesanan/saya');
      final List data = response.data['data'];
      return data.map((json) => PesananModel.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  // 3. Get Detail by ID (GET)
  Future<PesananModel> getDetail(int id) async {
    try {
      final response = await _dio.get('/app/pesanan/$id');
      // Backend balikin data detail pesanan
      return PesananModel.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }

  // 4. Batalin Pesanan (PUT)
  Future<void> cancelPesanan(int id) async {
    try {
      // Sesuai backend kita: PUT ke .../cancel (tanpa body)
      await _dio.put('/app/pesanan/$id');
    } catch (e) {
      rethrow;
    }
  }
}