import 'package:dio/dio.dart';
import '../core/api_client.dart';
import '../models/paket_model.dart';

class PaketService {
  final Dio _dio = ApiClient().dio;

  Future<List<PaketModel>> getPaket(String tipe) async {
    try {
      // Tipe: 'dokumentasi', 'busana', 'dekorasi', 'akadresepsi'
      final response = await _dio.get('/app/paket/$tipe');

      // Backend ngirim { "data": [...] }
      final List data = response.data['data'];

      return data.map((json) => PaketModel.fromJson(json, tipe)).toList();
    } catch (e) {
      throw e.toString();
    }
  }

  // === TAMBAHAN BARU ===
  Future<PaketModel> getDetail(String tipe, int id) async {
    try {
      final response = await _dio.get('/app/paket/$tipe/$id');
      return PaketModel.fromJson(response.data['data'], tipe);
    } catch (e) {
      rethrow;
    }
  }
}
