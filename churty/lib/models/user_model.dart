class UserModel {
  final int id;
  final String namaUser; // Kita tetep pake nama variabel ini di Flutter biar UI gak error
  final String email;
  final String role;

  UserModel({
    required this.id,
    required this.namaUser,
    required this.email,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id_user'] ?? 0,
      // ===================================================
      // INI FIX-NYA: Ambil dari 'username' (sesuai DB lo)
      // ===================================================
      namaUser: json['username'] ?? json['nama_user'] ?? "Tanpa Nama", 
      email: json['email'] ?? "",
      role: json['role'] ?? "pemesan",
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_user': id,
      'username': namaUser, // Simpen balik sebagai username
      'email': email,
      'role': role,
    };
  }
}