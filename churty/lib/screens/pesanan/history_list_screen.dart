import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/pesanan_model.dart';
import '../../services/pesanan_service.dart';
import 'history_detail_screen.dart';

class HistoryListScreen extends StatefulWidget {
  const HistoryListScreen({super.key});

  @override
  State<HistoryListScreen> createState() => _HistoryListScreenState();
}

class _HistoryListScreenState extends State<HistoryListScreen> {
  late Future<List<PesananModel>> _futureHistory;

  @override
  void initState() {
    super.initState();
    _futureHistory = PesananService().getMyHistory();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Riwayat Pesanan")),
      body: FutureBuilder<List<PesananModel>>(
        future: _futureHistory,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("Belum ada riwayat pesanan."));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: snapshot.data!.length,
            itemBuilder: (ctx, i) {
              final pesanan = snapshot.data![i];
              return Card(
                child: ListTile(
                  title: Text("Pesanan Anda ${pesanan.id}", style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text("Tanggal: ${DateFormat('dd MMMM yyyy').format(pesanan.waktuAwal)}"),
                  trailing: Chip(
                    label: Text(pesanan.status, style: const TextStyle(fontSize: 12)),
                    backgroundColor: pesanan.status == 'pending' ? Colors.orange.shade100 : 
                                     pesanan.status == 'diterima' ? Colors.green.shade100 : 
                                     Colors.red.shade100,
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => HistoryDetailScreen(pesananId: pesanan.id),
                      ),
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}