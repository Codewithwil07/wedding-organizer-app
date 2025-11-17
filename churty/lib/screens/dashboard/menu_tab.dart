import 'package:flutter/material.dart';
import '../paket/paket_list_screen.dart'; // (Kita bikin abis ini)

class MenuTab extends StatelessWidget {
  const MenuTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Pilih Paket")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildMenuCard(context, "Dokumentasi", Icons.camera_alt, "dokumentasi"),
          _buildMenuCard(context, "Busana & Makeup", Icons.woman, "busana"),
          _buildMenuCard(context, "Dekorasi", Icons.filter_vintage, "dekorasi"),
          _buildMenuCard(context, "Akad & Resepsi", Icons.event_seat, "akadresepsi"),
        ],
      ),
    );
  }

  Widget _buildMenuCard(BuildContext context, String title, IconData icon, String tipeApi) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blue.shade50,
          child: Icon(icon, color: Colors.blue),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        contentPadding: const EdgeInsets.all(16),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => PaketListScreen(title: title, tipe: tipeApi),
            ),
          );
        },
      ),
    );
  }
}