import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../models/pesanan_model.dart';
import '../../services/pesanan_service.dart';
import '../../core/constants.dart'; // Buat url gambar

class HistoryDetailScreen extends StatefulWidget {
  final int pesananId;
  const HistoryDetailScreen({super.key, required this.pesananId});

  @override
  State<HistoryDetailScreen> createState() => _HistoryDetailScreenState();
}

class _HistoryDetailScreenState extends State<HistoryDetailScreen> {
  final PesananService _service = PesananService();
  Future<PesananModel>? _futureDetail;
  bool _isCancelling = false;

  @override
  void initState() {
    super.initState();
    _futureDetail = _service.getDetail(widget.pesananId);
  }

  void _refresh() {
    setState(() {
      _futureDetail = _service.getDetail(widget.pesananId);
    });
  }

  String formatRupiah(int number) {
    return NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0).format(number);
  }

  String getFullImageUrl(String? url) {
    if (url == null || url.isEmpty) return '';
    if (url.startsWith('http')) return url;
    final baseUrlRoot = AppConstants.baseUrl.replaceAll('/api', '');
    return "$baseUrlRoot$url";
  }

  void _showCancelDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Batalkan Pesanan?"),
        content: const Text("Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat diurungkan."),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Tidak")),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              Navigator.pop(ctx); 
              setState(() => _isCancelling = true);
              try {
                await _service.cancelPesanan(widget.pesananId);
                _refresh(); 
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Gagal: $e"), backgroundColor: Colors.red),
                );
              } finally {
                setState(() => _isCancelling = false);
              }
            }, 
            child: const Text("Ya, Batalkan", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  // Widget buat Nampilin 1 Item Paket
  Widget _buildPaketItem(String label, PaketRingkas? paket) {
    if (paket == null) return const SizedBox.shrink(); // Gak nampilin apa2 kalo null

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Gambar (Kecil di kiri)
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: (paket.imageUrl != null)
                ? Image.network(
                    getFullImageUrl(paket.imageUrl),
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(width: 60, height: 60, color: Colors.grey.shade200, child: const Icon(Icons.image_not_supported)),
                  )
                : Container(width: 60, height: 60, color: Colors.grey.shade200, child: const Icon(Icons.image)),
            ),
            const SizedBox(width: 12),
            
            // Info Teks
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(paket.nama, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(formatRupiah(paket.harga), style: const TextStyle(fontSize: 14, color: Colors.blue)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Detail Pesanan #${widget.pesananId}")),
      body: FutureBuilder<PesananModel>(
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

          final pesanan = snapshot.data!;
          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Status & Harga Total
                      Card(
                        color: Colors.blue.shade50,
                        elevation: 0,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("Status Pesanan", style: TextStyle(fontSize: 12, color: Colors.grey)),
                                  const SizedBox(height: 4),
                                  Text(pesanan.status, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  const Text("Total Biaya", style: TextStyle(fontSize: 12, color: Colors.grey)),
                                  const SizedBox(height: 4),
                                  Text(formatRupiah(pesanan.harga), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue)),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Info Acara
                      const Text("Detail Acara", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 10),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.location_on, color: Colors.blue),
                        title: const Text("Alamat"),
                        subtitle: Text(pesanan.alamat),
                      ),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.calendar_today, color: Colors.blue),
                        title: const Text("Tanggal"),
                        // Tampilkan range tanggal kalo beda, atau satu aja kalo sama
                        subtitle: Text(
                          pesanan.waktuAwal.year == pesanan.waktuAkhir.year && 
                          pesanan.waktuAwal.month == pesanan.waktuAkhir.month && 
                          pesanan.waktuAwal.day == pesanan.waktuAkhir.day
                            ? DateFormat('dd MMMM yyyy').format(pesanan.waktuAwal)
                            : "${DateFormat('dd MMM').format(pesanan.waktuAwal)} - ${DateFormat('dd MMM yyyy').format(pesanan.waktuAkhir)}"
                        ),
                      ),
                      const Divider(height: 30),

                      // List Paket (Pake Widget Baru)
                      const Text("Paket Terpilih:", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 10),
                      
                      _buildPaketItem("DOKUMENTASI", pesanan.dokumentasi),
                      _buildPaketItem("BUSANA & MUA", pesanan.busana),
                      _buildPaketItem("DEKORASI", pesanan.dekorasi),
                      _buildPaketItem("AKAD & RESEPSI", pesanan.akadResepsi),
                    ],
                  ),
                ),
              ),

              // Tombol Batal
              if (pesanan.status == 'pending')
                Container(
                  padding: const EdgeInsets.all(16),
                  width: double.infinity,
                  child: _isCancelling
                    ? const Center(child: CircularProgressIndicator())
                    : ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red.shade100,
                          foregroundColor: Colors.red,
                          padding: const EdgeInsets.all(16),
                        ),
                        onPressed: _showCancelDialog,
                        child: const Text("BATALKAN PESANAN INI"),
                      ),
                ),
            ],
          );
        },
      ),
    );
  }
}