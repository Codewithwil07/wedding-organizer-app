class KritikModel {
  final int id;
  final String isi;
  final String? balasan; // Bisa null kalo belum dibales
  final DateTime tanggal;

  KritikModel({
    required this.id,
    required this.isi,
    this.balasan,
    required this.tanggal,
  });

  factory KritikModel.fromJson(Map<String, dynamic> json) {
    return KritikModel(
      id: json['id_ks'],
      isi: json['isi'],
      balasan: json['balasan'],
      tanggal: DateTime.parse(json['tanggal']),
    );
  }
}