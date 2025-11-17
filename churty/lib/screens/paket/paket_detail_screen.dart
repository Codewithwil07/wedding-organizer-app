import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../models/paket_model.dart';
import '../../services/paket_service.dart';
import '../../providers/cart_provider.dart';

class PaketDetailScreen extends StatefulWidget {
  final int id;
  final String tipe;
  final String title; // Nama paket buat judul AppBar

  const PaketDetailScreen({
    super.key,
    required this.id,
    required this.tipe,
    required this.title,
  });

  @override
  State<PaketDetailScreen> createState() => _PaketDetailScreenState();
}

class _PaketDetailScreenState extends State<PaketDetailScreen> {
  late Future<PaketModel> _futureDetail;

  @override
  void initState() {
    super.initState();
    _futureDetail = PaketService().getDetail(widget.tipe, widget.id);
  }

  String formatRupiah(int number) {
    return NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0).format(number);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: FutureBuilder<PaketModel>(
        future: _futureDetail,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          if (!snapshot.hasData) {
            return const Center(child: Text("Data tidak ditemukan"));
          }

          final paket = snapshot.data!;

          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Gambar Hero
                      if (paket.imageUrl != null)
                        Image.network(
                          paket.fullImageUrl,
                          height: 250,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            height: 250, color: Colors.grey.shade200,
                            child: const Icon(Icons.image_not_supported, size: 50),
                          ),
                        ),
                      
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(paket.nama, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 8),
                            Text(
                              formatRupiah(paket.harga),
                              style: const TextStyle(fontSize: 20, color: Colors.blue, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 16),
                            const Text("Deskripsi:", style: TextStyle(fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text(
                              paket.deskripsi ?? "Tidak ada deskripsi",
                              style: const TextStyle(fontSize: 16, height: 1.5),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              
              // Tombol Add to Cart di bawah (Sticky)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5, offset: const Offset(0, -2))],
                ),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      Provider.of<CartProvider>(context, listen: false).addPaket(paket);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("${paket.nama} masuk keranjang!")),
                      );
                    },
                    child: const Text("TAMBAH KE KERANJANG", style: TextStyle(fontSize: 16)),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}