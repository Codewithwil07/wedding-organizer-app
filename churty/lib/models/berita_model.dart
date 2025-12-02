import '../core/constants.dart';

class BeritaModel {
  final int id;
  final String judul;
  final String isi;
  final String? imageUrl;
  final DateTime tanggal;

  BeritaModel({
    required this.id,
    required this.judul,
    required this.isi,
    this.imageUrl,
    required this.tanggal,
  });

  factory BeritaModel.fromJson(Map<String, dynamic> json) {
    return BeritaModel(
      id: json['id_berita'],
      judul: json['judul'],
      isi: json['isi'],
      imageUrl: json['image_url'],
      tanggal: DateTime.parse(json['tanggal']),
    );
  }

  // Helper URL Gambar
  String get fullImageUrl {
    if (imageUrl == null) return "";
    if (imageUrl!.startsWith("http")) return imageUrl!;
    final baseUrlRoot = AppConstants.baseUrl.replaceAll('/api', '');
    return "$baseUrlRoot$imageUrl";
  }
}