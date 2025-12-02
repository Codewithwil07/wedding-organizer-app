import 'package:flutter/material.dart';
import 'package:dio/dio.dart'; // <-- WAJIB IMPORT INI BIAR KITA BISA NANGKEP ERRORNYA
import '../models/paket_model.dart';
import '../services/pesanan_service.dart';

class CartProvider with ChangeNotifier {
  final PesananService _pesananService = PesananService();

  // 4 slot paket
  PaketModel? _dokumentasi;
  PaketModel? _busana;
  PaketModel? _dekorasi;
  PaketModel? _akadresepsi;
  
  bool _isLoading = false;

  // Getters
  bool get isLoading => _isLoading;
  PaketModel? get dokumentasi => _dokumentasi;
  PaketModel? get busana => _busana;
  PaketModel? get dekorasi => _dekorasi;
  PaketModel? get akadresepsi => _akadresepsi;

  // Getter List Items
  List<PaketModel> get items {
    return [_dokumentasi, _busana, _dekorasi, _akadresepsi]
        .whereType<PaketModel>() 
        .toList();
  }

  // Getter Total Harga
  int get totalHarga {
    int total = 0;
    if (_dokumentasi != null) total += _dokumentasi!.harga;
    if (_busana != null) total += _busana!.harga;
    if (_dekorasi != null) total += _dekorasi!.harga;
    if (_akadresepsi != null) total += _akadresepsi!.harga;
    return total;
  }

  // Actions
  void addPaket(PaketModel paket) {
    if (paket.tipe == 'dokumentasi') _dokumentasi = paket;
    if (paket.tipe == 'busana') _busana = paket;
    if (paket.tipe == 'dekorasi') _dekorasi = paket;
    if (paket.tipe == 'akadresepsi') _akadresepsi = paket;
    notifyListeners();
  }

  void removePaket(String tipe) {
    if (tipe == 'dokumentasi') _dokumentasi = null;
    if (tipe == 'busana') _busana = null;
    if (tipe == 'dekorasi') _dekorasi = null;
    if (tipe == 'akadresepsi') _akadresepsi = null;
    notifyListeners();
  }

  void clearCart() {
    _dokumentasi = null;
    _busana = null;
    _dekorasi = null;
    _akadresepsi = null;
    notifyListeners();
  }

  // ============================================================
  // FUNGSI CHECKOUT (YANG KITA FIX)
  // ============================================================
  Future<void> checkout({
    required String alamat,
    required String tglAwal,
    required String tglAkhir,
    required String noWa,
    required String latitude,
    required String longitude
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final payload = {
        'id_dokum': _dokumentasi?.id,
        'id_busana': _busana?.id,
        'id_dekorasi': _dekorasi?.id,
        'id_ar': _akadresepsi?.id,
        'alamat': alamat,
        'waktu_awal': tglAwal,
        'waktu_akhir': tglAkhir,
        'no_wa': noWa,
        'latitude': latitude,
        'longitude': longitude,
      };

      await _pesananService.createPesanan(payload);
      clearCart(); 

    } on DioException catch (e) {
      // 1. NANGKEP ERROR KHUSUS DIO (409 Conflict, 400 Bad Request, dll)
      // Kita ambil pesan dari backend: { "message": "Gagal! Salah satu paket..." }
      
      String errorMessage = "Terjadi kesalahan koneksi"; // Default message

      if (e.response != null && e.response?.data != null) {
        // Cek apakah backend ngirim json dengan field 'message'
        if (e.response?.data is Map && e.response?.data['message'] != null) {
          errorMessage = e.response?.data['message'];
        } else {
          // Fallback kalo format error backend beda
          errorMessage = e.response?.statusMessage ?? "Server Error";
        }
      }

      // Lempar string bersih ke UI
      throw errorMessage; 
      
    } catch (e) {
      // 2. Nangkep error lain (kodingan salah, dll)
      throw e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}