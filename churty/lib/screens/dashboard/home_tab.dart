import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../services/paket_service.dart';
import '../../services/berita_service.dart'; // <-- IMPORT INI
import '../../models/paket_model.dart';
import '../../models/berita_model.dart'; // <-- IMPORT INI
import '../paket/paket_detail_screen.dart';
import '../berita/berita_detail_screen.dart'; // <-- IMPORT INI

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  late Future<Map<String, List<PaketModel>>> _futureHome;
  late Future<List<BeritaModel>> _futureBerita; // <-- FUTURE BARU
  
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    _futureHome = PaketService().getHomeData(query: _searchController.text);
    _futureBerita = BeritaService().getAllBerita(); // <-- FETCH BERITA
  }

  void _performSearch(String query) {
    setState(() {
      _futureHome = PaketService().getHomeData(query: query);
    });
  }

  String formatRupiah(int number) {
    return NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0).format(number);
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blue,
        elevation: 0,
        title: const Text("Churty WO", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        // actions: [
        //   IconButton(icon: const Icon(Icons.notifications, color: Colors.white), onPressed: () {}),
        // ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
           setState(() {
             _loadData();
           });
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Hero Section
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
                decoration: const BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Halo, ${user?.namaUser ?? 'Tamu'}!", 
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 5),
                    const Text("Cari paket pernikahan impianmu?", style: TextStyle(color: Colors.white70, fontSize: 14)),
                    const SizedBox(height: 15),
                    
                    // Search Bar
                    TextField(
                      controller: _searchController,
                      textInputAction: TextInputAction.search,
                      onSubmitted: _performSearch,
                      decoration: InputDecoration(
                        hintText: "Cari paket...",
                        hintStyle: const TextStyle(color: Colors.grey),
                        prefixIcon: const Icon(Icons.search, color: Colors.grey),
                        filled: true, fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                        contentPadding: const EdgeInsets.symmetric(vertical: 10),
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.clear, color: Colors.grey),
                          onPressed: () {
                            _searchController.clear();
                            _performSearch('');
                          },
                        ),
                      ),
                    )
                  ],
                ),
              ),
              
              // 2. SECTION BERITA & INFO (BARU)
              _buildSectionTitle("Info & Promo Terbaru 📢"),
              SizedBox(
                height: 160,
                child: FutureBuilder<List<BeritaModel>>(
                  future: _futureBerita,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
                    if (!snapshot.hasData || snapshot.data!.isEmpty) return const Center(child: Text("Belum ada berita."));

                    return ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      scrollDirection: Axis.horizontal,
                      itemCount: snapshot.data!.length,
                      itemBuilder: (context, index) {
                        final berita = snapshot.data![index];
                        return GestureDetector(
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => BeritaDetailScreen(berita: berita))),
                          child: Container(
                            width: 260,
                            margin: const EdgeInsets.only(right: 16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 5, spreadRadius: 1)],
                            ),
                            child: Row(
                              children: [
                                ClipRRect(
                                  borderRadius: const BorderRadius.horizontal(left: Radius.circular(12)),
                                  child: berita.imageUrl != null
                                    ? Image.network(berita.fullImageUrl, width: 100, height: 160, fit: BoxFit.cover)
                                    : Container(width: 100, height: 160, color: Colors.grey.shade200, child: const Icon(Icons.article)),
                                ),
                                Expanded(
                                  child: Padding(
                                    padding: const EdgeInsets.all(12.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          berita.judul, 
                                          maxLines: 2, overflow: TextOverflow.ellipsis, 
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          DateFormat('dd MMM').format(berita.tanggal), 
                                          style: TextStyle(color: Colors.grey.shade600, fontSize: 12)
                                        ),
                                      ],
                                    ),
                                  ),
                                )
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),

              // 3. Section Paket (SAMA KAYAK SEBELUMNYA)
              FutureBuilder<Map<String, List<PaketModel>>>(
                future: _futureHome,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) return const Padding(padding: EdgeInsets.all(50), child: Center(child: CircularProgressIndicator()));
                  if (snapshot.hasError) return Center(child: Text("Error: ${snapshot.error}"));
        
                  final terlaris = snapshot.data!['terlaris'] ?? [];
                  final terbaru = snapshot.data!['terbaru'] ?? [];
        
                  if (terbaru.isEmpty) return const Padding(padding: EdgeInsets.all(20), child: Center(child: Text("Paket tidak ditemukan.")));
        
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Terlaris
                      if (terlaris.isNotEmpty) ...[
                        _buildSectionTitle("Rekomendasi Kami 🔥"),
                        SizedBox(
                          height: 220, 
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            scrollDirection: Axis.horizontal,
                            itemCount: terlaris.length,
                            itemBuilder: (context, index) => _buildHorizontalCard(context, terlaris[index]),
                          ),
                        ),
                      ],
        
                      // Terbaru
                      _buildSectionTitle(_searchController.text.isEmpty ? "Paket Terbaru ✨" : "Hasil Pencarian 🔍"),
                      ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        shrinkWrap: true, 
                        physics: const NeverScrollableScrollPhysics(), 
                        itemCount: terbaru.length,
                        itemBuilder: (context, index) => _buildVerticalCard(context, terbaru[index]),
                      ),
                      const SizedBox(height: 20),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 25, 16, 10),
      child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildHorizontalCard(BuildContext context, PaketModel paket) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => PaketDetailScreen(id: paket.id, tipe: paket.tipe, title: paket.nama))),
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 5, spreadRadius: 2)]),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
              child: paket.imageUrl != null 
                ? Image.network(paket.fullImageUrl, height: 100, width: double.infinity, fit: BoxFit.cover, errorBuilder: (_,__,___) => Container(height: 100, color: Colors.grey.shade200, child: const Icon(Icons.image)))
                : Container(height: 100, color: Colors.grey.shade200, child: const Icon(Icons.image)),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(paket.nama, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(formatRupiah(paket.harga), style: const TextStyle(color: Colors.blue, fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: Colors.orange.shade50, borderRadius: BorderRadius.circular(4)),
                    child: Text(paket.tipe.toUpperCase(), style: TextStyle(fontSize: 8, color: Colors.orange.shade800)),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildVerticalCard(BuildContext context, PaketModel paket) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => PaketDetailScreen(id: paket.id, tipe: paket.tipe, title: paket.nama))),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.horizontal(left: Radius.circular(12)),
              child: paket.imageUrl != null 
                ? Image.network(paket.fullImageUrl, height: 100, width: 100, fit: BoxFit.cover, errorBuilder: (_,__,___) => Container(height: 100, width: 100, color: Colors.grey.shade200, child: const Icon(Icons.image)))
                : Container(height: 100, width: 100, color: Colors.grey.shade200, child: const Icon(Icons.image)),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(paket.nama, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(formatRupiah(paket.harga), style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(paket.deskripsi ?? 'Tidak ada deskripsi', maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}