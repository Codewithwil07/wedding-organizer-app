import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    return Scaffold(
      appBar: AppBar(title: const Text("Home")),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              color: Colors.blue.shade50,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Halo, ${user?.namaUser ?? 'Tamu'}!", 
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 5),
                  const Text("Wujudkan pernikahan impianmu bersama kami."),
                ],
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text("Portofolio Terbaru", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            // Dummy Portofolio List
            _buildPortfolioItem("Pernikahan Adat Jawa", "https://via.placeholder.com/400x200"),
            _buildPortfolioItem("Modern Wedding", "https://via.placeholder.com/400x200"),
          ],
        ),
      ),
    );
  }

  Widget _buildPortfolioItem(String title, String imgUrl) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Image.network(imgUrl, height: 150, width: double.infinity, fit: BoxFit.cover),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }
}