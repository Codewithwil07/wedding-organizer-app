import 'package:flutter/material.dart';
import '../models/paket_model.dart';

class CartProvider with ChangeNotifier {
  // Simpan paket berdasarkan tipe (cuma boleh 1 paket per tipe)
  final Map<String, PaketModel?> _cart = {
    'dokumentasi': null,
    'busana': null,
    'dekorasi': null,
    'akadresepsi': null,
  };

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  Map<String, PaketModel?> get items => _cart;

  // Hitung Total
  int get totalHarga {
    int total = 0;
    _cart.forEach((key, paket) {
      if (paket != null) total += paket.harga;
    });
    return total;
  }

  // Tambah Paket
  void addPaket(PaketModel paket) {
    _cart[paket.tipe] = paket;
    notifyListeners();
  }

  // Hapus Paket
  void removePaket(String tipe) {
    _cart[tipe] = null;
    notifyListeners();
  }

  // Kosongkan Keranjang
  void clearCart() {
    _cart.updateAll((key, value) => null);
    notifyListeners();
  }
}
