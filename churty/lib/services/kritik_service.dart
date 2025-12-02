import 'package:dio/dio.dart';
import '../core/api_client.dart';
import '../models/kritik_model.dart';

class KritikService {
  final Dio _dio = ApiClient().dio;

  // 1. Ambil History Kritik Saya
  Future<List<KritikModel>> getMyKritik() async {
    try {
      final response = await _dio.get('/app/kritik/saya');
      final List data = response.data['data'];
      return data.map((json) => KritikModel.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  // 2. Kirim Kritik Baru
  Future<void> sendKritik(String isi) async {
    try {
      await _dio.post('/app/kritik', data: {
        'isi': isi,
      });
    } catch (e) {
      rethrow;
    }
  }
}