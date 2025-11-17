import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../models/paket_model.dart';
import '../../services/paket_service.dart';
import '../../providers/cart_provider.dart';
import '../../utils//smart_trim.dart';
import 'paket_detail_screen.dart'; // <-- 1. IMPORT INI

class PaketListScreen extends StatefulWidget {
  final String title;
  final String tipe;

  const PaketListScreen({super.key, required this.title, required this.tipe});

  @override
  State<PaketListScreen> createState() => _PaketListScreenState();
}

class _PaketListScreenState extends State<PaketListScreen> {
  late Future<List<PaketModel>> _futurePaket;

  @override
  void initState() {
    super.initState();
    _futurePaket = PaketService().getPaket(widget.tipe);
  }

  String formatRupiah(int number) {
    return NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0).format(number);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: FutureBuilder<List<PaketModel>>(
        future: _futurePaket,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("Belum ada paket tersedia."));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: snapshot.data!.length,
            separatorBuilder: (_, __) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final paket = snapshot.data![index];
              
              return Card(
                clipBehavior: Clip.antiAlias,
                child: InkWell( // <-- 2. BUNGKUS PAKE INKWELL BIAR BISA DIKLIK
                  onTap: () {
                    // 3. NAVIGASI KE DETAIL
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PaketDetailScreen(
                          id: paket.id,
                          tipe: widget.tipe,
                          title: paket.nama,
                        ),
                      ),
                    );
                  },
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (paket.imageUrl != null)
                        Image.network(
                          paket.fullImageUrl,
                          height: 150,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            height: 150, color: Colors.grey.shade200, 
                            child: const Icon(Icons.image_not_supported),
                          ),
                        ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(paket.nama, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text(formatRupiah(paket.harga), style: const TextStyle(fontSize: 16, color: Colors.blue, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 8),
                            // Text(paket.deskripsi ?? "Tidak ada deskripsi", maxLines: 2, overflow: TextOverflow.ellipsis),
                            Text(smartTrim(paket.deskripsi ?? "", max: 40)),
                            const SizedBox(height: 16),
                            
                            // Tombol "Tambah Cepat" (Opsional, bisa dihapus kalo mau paksa user liat detail dulu)
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: () {
                                  Provider.of<CartProvider>(context, listen: false).addPaket(paket);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text("${paket.nama} ditambahkan ke keranjang")),
                                  );
                                },
                                child: const Text("Tambah ke Keranjang"),
                              ),
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}