import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';
import '../profile/edit_profile_screen.dart'; // <-- IMPORT INI

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context); // dengerin perubahan
    final user = auth.user;

    return Scaffold(
      appBar: AppBar(title: const Text("Profil Saya")),
      body: Column(
        children: [
          const SizedBox(height: 20),
          const CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40)),
          const SizedBox(height: 10),
          Text(
            user?.namaUser ?? "-",
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          Text(user?.email ?? "-", style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 30),

          const Divider(),
          // === TOMBOL PENGATURAN PROFIL ===
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text("Pengaturan Profil"),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const EditProfileScreen()),
              );
            },
          ),
          const Divider(),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red.shade50,
                  foregroundColor: Colors.red,
                ),
                onPressed: () {
                  auth.logout();
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                    (route) => false,
                  );
                },
                child: const Text("LOGOUT"),
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
