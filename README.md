Siap. Ini draf `README.md` yang keren, profesional, dan *to the point*. Ini udah gue sesuaikan sama *tech stack* (React, RN, Express, Prisma) dan *scope* proyek yang udah kita bahas.

Langsung *copy-paste* aja ke file `README.md` di *root* folder proyek lo.

-----

# 👑 Churty Wedding Organizer (CWO)

Sistem informasi manajemen dan *booking* layanan untuk Churty Wedding Organizer (CWO), dibangun untuk mendigitalkan proses pemesanan manual mereka.

[](https://nodejs.org/)
[](https://expressjs.com/)
[](https://reactjs.org/)
[](https://reactnative.dev/)
[](https://www.typescriptlang.org/)
[](https://www.prisma.io/)
[](https://www.mysql.com/)

-----

## 📖 Tentang Proyek Ini

[cite\_start]Proyek ini adalah implementasi *full-stack* dari skripsi berjudul "**Perancangan Sistem Informasi Manajemen Layanan dan Fortofolio Churty Wedding Organizer (CWO) Berbasis Android**"[cite: 1].

[cite\_start]Sistem ini menggantikan alur kerja manual (via WhatsApp) [cite: 66] dengan tiga komponen digital:

1.  **Backend (API)**: Otak dari sistem yang berjalan di Node.js, mengelola semua data, *logic* bisnis, dan otentikasi.
2.  **Admin Panel (Web)**: Dashboard berbasis React untuk staf CWO mengelola paket, portofolio, dan yang terpenting, **menerima** atau **menolak** *booking* yang masuk.
3.  [cite\_start]**Mobile App (Android)**: Aplikasi React Native untuk klien melihat paket layanan [cite: 708-781][cite\_start], portofolio, dan melakukan *booking* [cite: 819-826].

-----

## ✨ Fitur Utama

### 📱 Aplikasi Klien (React Native)

  * [cite\_start]*Browse* semua paket layanan (Dokumentasi, Dekorasi, MUA, dll) [cite: 708-714].
  * [cite\_start]Melihat galeri portofolio CWO[cite: 701].
  * [cite\_start]Registrasi dan Login Klien[cite: 659].
  * [cite\_start]Melakukan *booking* paket untuk tanggal tertentu[cite: 818].
  * Melihat status *booking* (Menunggu Konfirmasi, Diterima, Ditolak) di halaman "Pesanan Saya".
  * [cite\_start]Membatalkan *booking*[cite: 841].

### 💻 Admin Panel (React)

  * Login admin yang aman.
  * CRUD (Create, Read, Update, Delete) untuk semua paket layanan.
  * CRUD untuk konten portofolio.
  * Dashboard utama untuk melihat semua *booking* yang masuk.
  * **Fungsi inti:** Tombol **"Terima"** dan **"Tolak"** untuk setiap *booking* yang masuk.

-----

## 🛠️ Tech Stack

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Backend** | `Node.js`, `Express.js`, `TypeScript` | Fondasi API REST. |
| **ORM** | `Prisma` | Berinteraksi dengan database (gak pake SQL manual\!). |
| **Database** | `MySQL` | Penyimpanan data relasional. |
| **Otentikasi** | `JWT (JSON Web Tokens)` | Mengamankan *endpoint* API untuk admin & klien. |
| **Admin Panel** | `React.js` | UI *dashboard* admin yang interaktif. |
| **Mobile App** | `React Native` | [cite\_start]Aplikasi *cross-platform* (fokus Android)[cite: 90]. |
| **State** | `React Context API` | Mengelola *state* (termasuk keranjang) di React & React Native. |

-----

## 🚀 Instalasi & Menjalankan Proyek

Proyek ini terdiri dari 3 bagian: `backend`, `admin-panel`, dan `mobile-app`.

### 1\. 🔑 Prasyarat

  * [Node.js](https://nodejs.org/) (v18+)
  * Server [MySQL](https://www.mysql.com/) (misal via XAMPP atau Laragon)
  * [Git](https://git-scm.com/)
  * [VS Code](https://code.visualstudio.com/)
  * Android Studio / Emulator Android

### 2\. 🌍 Pengaturan Global (Wajib)

1.  **Buat Database:**
    Buka `phpMyAdmin` atau *tool* MySQL lo, dan buat database baru. (Misal: `churty_wo_db`).

2.  **Konfigurasi `.env`:**
    Di folder `backend`, buat file `.env` dan isi berdasarkan contoh ini:

    ```.env.example
    # Ganti dengan kredensial MySQL lo
    DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/NAMA_DATABASE"

    # Ganti dengan 'secret' acak lo sendiri
    JWT_SECRET="secret_key_super_rahasia"
    ```

### 3\. 🖥️ Menjalankan Backend (Express + Prisma)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Jalankan migrasi Prisma (Otomatis bikin tabel di DB)
npx prisma migrate dev --name "init"

# Jalankan server (mode development)
npm run dev

# Server akan jalan di http://localhost:3000
```

### 4\. ⚙️ Menjalankan Admin Panel (React)

```bash
# Buka terminal baru, masuk ke folder admin
cd admin-panel

# Install dependencies
npm install

# Jalankan server development React
npm start

# Admin panel akan jalan di http://localhost:3001 (atau port lain)
```

### 5\. 📱 Menjalankan Mobile App (React Native)

**PENTING:** Pastikan lo pake *hotspot* dari laptop atau HP lo biar HP tes dan laptop ada di satu jaringan.

1.  **Cari IP Laptop Lo:**

      * Jika pake *hotspot* laptop (Windows): IP lo kemungkinan besar `192.168.137.1`.
      * Jika pake *hotspot* HP: Ketik `ipconfig` (Win) atau `ifconfig` (Mac) di terminal laptop lo untuk cari IP-nya.

2.  **Ubah Alamat API:**
    Di dalam kode React Native (misal di `src/config/api.ts`), ganti *base URL* dari `http://localhost:3000` menjadi IP laptop lo.

    ```javascript
    const API_URL = 'http://192.168.137.1:3000/api'; // CONTOH
    ```

3.  **Jalankan Aplikasi:**

    ```bash
    # Buka terminal baru, masuk ke folder mobile app
    cd mobile-app

    # Install dependencies
    npm install

    # Jalankan aplikasi di Android
    npx react-native run-android
    ```