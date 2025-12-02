// Cetakan untuk data paket yang di-include (simple)
class PaketRingkas {
  final String nama;
  final int harga;
  final String? imageUrl;
  PaketRingkas({required this.nama, required this.harga, this.imageUrl});

  factory PaketRingkas.fromJson(Map<String, dynamic> json) {
    return PaketRingkas(
      nama: json['nama'] ?? 'N/A',
      harga: json['harga'] ?? 0,
      imageUrl: json['image_url'],
    );
  }
}

class PesananModel {
  final int id;
  final int harga;
  final String status; // PENDING, DITERIMA, DITOLAK, DIBATALKAN
  final String alamat;
  final DateTime waktuAwal;
  final DateTime waktuAkhir;

  // Paket yang di-include (bisa null)
  final PaketRingkas? dokumentasi;
  final PaketRingkas? busana;
  final PaketRingkas? dekorasi;
  final PaketRingkas? akadResepsi;

  PesananModel({
    required this.id,
    required this.harga,
    required this.status,
    required this.alamat,
    required this.waktuAwal,
    required this.waktuAkhir,
    this.dokumentasi,
    this.busana,
    this.dekorasi,
    this.akadResepsi,
  });

  factory PesananModel.fromJson(Map<String, dynamic> json) {
    return PesananModel(
      id: json['id_pesan'],
      harga: json['harga'],
      status: json['status'],
      alamat: json['alamat'],
      waktuAwal: DateTime.parse(json['waktu_awal']), // Convert string jadi DateTime
      waktuAkhir: DateTime.parse(json['waktu_akhir']), // Convert string jadi DateTime
      // Cek kalo datanya ada, baru di-parse
      dokumentasi: json['dokumentasi'] != null ? PaketRingkas.fromJson(json['dokumentasi']) : null,
      busana: json['busana'] != null ? PaketRingkas.fromJson(json['busana']) : null,
      dekorasi: json['dekorasi'] != null ? PaketRingkas.fromJson(json['dekorasi']) : null,
      akadResepsi: json['akadResepsi'] != null ? PaketRingkas.fromJson(json['akadResepsi']) : null,
    );
  }
}