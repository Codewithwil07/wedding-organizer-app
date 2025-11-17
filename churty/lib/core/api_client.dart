import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'constants.dart';

class ApiClient {
  // Singleton pattern (biar cuma ada 1 instance)
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  
  late Dio _dio;

  ApiClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Pasang "Satpam" (Interceptor)
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // 1. Ambil token dari HP
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString(AppConstants.tokenKey);

          // 2. Tempel ke header
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          
          print("➡️ REQ: ${options.method} ${options.path}");
          return handler.next(options);
        },
        onError: (DioException e, handler) {
          print("❌ ERR: ${e.response?.statusCode} - ${e.response?.data}");
          return handler.next(e);
        },
        onResponse: (response, handler) {
          print("✅ RES: ${response.statusCode}");
          return handler.next(response);
        }
      ),
    );
  }

  Dio get dio => _dio;
}