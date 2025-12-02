import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/cart_provider.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _alamatController = TextEditingController();
  final _waController = TextEditingController(); // WA
  final _latController = TextEditingController(); // Latitude
  final _longController = TextEditingController(); // Longitude
  
  final _startDateController = TextEditingController(); 
  final _endDateController = TextEditingController();
  
  DateTime? _startDate;
  DateTime? _endDate;

  // ... (Fungsi _selectDate SAMA, gak perlu diubah) ...
  Future<void> _selectDate(bool isStart) async {
    // ... (Logic date picker yang udah bener tadi) ...
    // Copy paste logic _selectDate dari chat sebelumnya di sini
     final initialDate = isStart 
        ? (_startDate ?? DateTime.now()) 
        : (_endDate ?? _startDate ?? DateTime.now());

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime.now(),
      lastDate: DateTime(2101),
    );

    if (picked != null) {
      setState(() {
        final dateWithZeroTime = DateTime(picked.year, picked.month, picked.day); 
        String formatted = DateFormat('yyyy-MM-dd').format(dateWithZeroTime);

        if (isStart) {
          _startDate = dateWithZeroTime;
          _startDateController.text = formatted;
          
          if (_endDate != null && _endDate!.isBefore(_startDate!)) {
            _endDate = null;
            _endDateController.text = "";
          }
        } else {
          _endDate = dateWithZeroTime;
          _endDateController.text = formatted;
        }
      });
    }
  }

  Future<void> _submitCheckout() async {
    if (!_formKey.currentState!.validate()) return;
    
    final cart = Provider.of<CartProvider>(context, listen: false);
    
    try {
      await cart.checkout(
        alamat: _alamatController.text,
        tglAwal: _startDateController.text,
        tglAkhir: _endDateController.text,
        noWa: _waController.text,       // <-- Kirim WA
        latitude: _latController.text,  // <-- Kirim Lat
        longitude: _longController.text // <-- Kirim Long
      );
      
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Pesanan Berhasil Dibuat!"), backgroundColor: Colors.green),
      );
      Navigator.of(context).popUntil((route) => route.isFirst);

    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Gagal: $e"), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    final formatter = NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0);

    return Scaffold(
      appBar: AppBar(title: const Text("Konfirmasi Pesanan")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Total
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("Total Tagihan:", style: TextStyle(fontSize: 16)),
                    Text(
                      formatter.format(cart.totalHarga), 
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.blue)
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              
              const Text("Kontak Pemilik Acara", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),

              // Input No WA
              TextFormField(
                controller: _waController,
                decoration: const InputDecoration(
                  labelText: "Nomor WhatsApp",
                  hintText: "08xxxxxxxxxx",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone, color: Colors.green),
                ),
                keyboardType: TextInputType.phone,
                validator: (val) => val!.isEmpty ? 'Wajib diisi' : null,
              ),
              const SizedBox(height: 20),

              const Text("Lokasi & Waktu", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),

              // Input Alamat
              TextFormField(
                controller: _alamatController,
                decoration: const InputDecoration(
                  labelText: "Alamat Lengkap",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.location_on),
                ),
                maxLines: 2,
                validator: (val) => val!.isEmpty ? 'Wajib diisi' : null,
              ),
              const SizedBox(height: 10),

              // Input Koordinat (Manual Dulu)
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _latController,
                      decoration: const InputDecoration(
                        labelText: "Latitude",
                        border: OutlineInputBorder(),
                        hintText: "-7.12345",
                      ),
                      keyboardType: TextInputType.numberWithOptions(decimal: true),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _longController,
                      decoration: const InputDecoration(
                        labelText: "Longitude",
                        border: OutlineInputBorder(),
                        hintText: "113.12345",
                      ),
                      keyboardType: TextInputType.numberWithOptions(decimal: true),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // Input Tanggal (Range)
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _startDateController,
                      decoration: const InputDecoration(
                        labelText: "Mulai",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.calendar_today),
                      ),
                      readOnly: true,
                      onTap: () => _selectDate(true),
                      validator: (val) => val!.isEmpty ? 'Wajib' : null,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _endDateController,
                      decoration: const InputDecoration(
                        labelText: "Selesai",
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.event_available),
                      ),
                      readOnly: true,
                      onTap: () => _selectDate(false),
                      validator: (val) => val!.isEmpty ? 'Wajib' : null,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 30),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: cart.isLoading ? null : _submitCheckout,
                  child: cart.isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white))
                    : const Text("PESAN SEKARANG", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}