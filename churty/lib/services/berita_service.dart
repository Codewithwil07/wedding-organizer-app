import 'package:dio/dio.dart';
import '../core/api_client.dart';
import '../models/berita_model.dart';

class BeritaService {
  final Dio _dio = ApiClient().dio;

  Future<List<BeritaModel>> getAllBerita() async {
    try {
      final response = await _dio.get('/app/berita');
      final List data = response.data['data'];
      return data.map((json) => BeritaModel.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }
}