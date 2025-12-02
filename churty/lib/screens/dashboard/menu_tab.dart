import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/cart_provider.dart';
import '../paket/paket_list_screen.dart';
import '../pesanan/cart_screen.dart';

class MenuTab extends StatelessWidget {
  const MenuTab({super.key});

  @override
  Widget build(BuildContext context) {
    // Formatter Rupiah
    final formatter = NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0);

    return Scaffold(
      appBar: AppBar(title: const Text("Pilih Paket")),
      body: Stack(
        children: [
          // 1. LIST MENU
          ListView(
            padding: const EdgeInsets.all(16),
            // Kasih padding bawah biar gak ketutupan tombol keranjang
            // padding: const EdgeInsets.only(bottom: 100, left: 16, right: 16, top: 16),
            children: [
              _buildMenuCard(context, "Dokumentasi Wedding", Icons.camera_alt, "dokumentasi"),
              _buildMenuCard(context, "Busana & Makeup", Icons.woman, "busana"),
              _buildMenuCard(context, "Dekorasi", Icons.filter_vintage, "dekorasi"),
              _buildMenuCard(context, "Akad & Resepsi", Icons.event_seat, "akadresepsi"),
            ],
          ),

          // 2. TOMBOL KERANJANG MELAYANG (Cuma muncul kalo ada item)
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: Consumer<CartProvider>(
              builder: (context, cart, child) {
                if (cart.totalHarga <= 0) return const SizedBox.shrink(); // Umpetin kalo kosong

                return ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 5,
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const CartScreen()),
                    );
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.shopping_cart),
                          const SizedBox(width: 10),
                          const Text("Lihat Keranjang", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Text(
                        formatter.format(cart.totalHarga),
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // Widget Helper buat Kartu Menu
  Widget _buildMenuCard(BuildContext context, String title, IconData icon, String tipeApi) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          radius: 25,
          backgroundColor: Colors.blue.shade50,
          child: Icon(icon, color: Colors.blue, size: 28),
        ),
        title: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
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