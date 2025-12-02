import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/berita_model.dart';

class BeritaDetailScreen extends StatelessWidget {
  final BeritaModel berita;

  const BeritaDetailScreen({super.key, required this.berita});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // 1. App Bar dengan Gambar Besar
          SliverAppBar(
            expandedHeight: 250.0,
            floating: false,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: berita.imageUrl != null
                  ? Image.network(
                      berita.fullImageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade200),
                    )
                  : Container(color: Colors.grey.shade200, child: const Icon(Icons.article, size: 50, color: Colors.grey)),
            ),
          ),

          // 2. Konten Berita
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Tanggal
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      DateFormat('dd MMMM yyyy').format(berita.tanggal),
                      style: TextStyle(color: Colors.blue.shade800, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Judul
                  Text(
                    berita.judul,
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.3),
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 20),

                  // Isi Berita
                  Text(
                    berita.isi,
                    style: const TextStyle(fontSize: 16, height: 1.6, color: Colors.black87),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}