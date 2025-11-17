import '../core/constants.dart';

class PaketModel {
  final int id;
  final String nama;
  final int harga;
  final String? deskripsi;
  final String? imageUrl;
  final String tipe; // 'dokumentasi', 'busana', etc.

  PaketModel({
    required this.id,
    required this.nama,
    required this.harga,
    this.deskripsi,
    this.imageUrl,
    required this.tipe,
  });

  factory PaketModel.fromJson(Map<String, dynamic> json, String tipePaket) {
    // Normalisasi ID dari backend yang beda-beda nama kolomnya
    int id = json['id_dokum'] ?? 
             json['id_busana'] ?? 
             json['id_dekorasi'] ?? 
             json['id_ar'] ?? 
             json['id'] ?? 0;

    return PaketModel(
      id: id,
      nama: json['nama'] ?? 'Tanpa Nama',
      harga: json['harga'] ?? 0,
      deskripsi: json['deskripsi'],
      imageUrl: json['image_url'], // Backend kirim '/uploads/...'
      tipe: tipePaket,
    );
  }

  // Helper buat benerin URL Gambar
  String get fullImageUrl {
    if (imageUrl == null) return "";
    if (imageUrl!.startsWith("http")) return imageUrl!;
    // Gabungin Base URL (tanpa /api) dengan path gambar
    return "${AppConstants.baseUrl.replaceAll('/api', '')}$imageUrl";
  }
}