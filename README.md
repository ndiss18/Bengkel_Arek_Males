# 🚗 AutoShop Pro - Sistem Manajemen Bengkel Kendaraan

## 📌 Deskripsi

AutoShop Pro adalah aplikasi manajemen bengkel kendaraan berbasis **React, TypeScript, dan Tailwind CSS** yang dirancang untuk membantu operasional bengkel secara digital. Sistem ini menyediakan fitur pengelolaan pelanggan, kendaraan, montir, layanan servis, produk, transaksi, pembayaran, hingga laporan analitik.

Aplikasi menggunakan data dummy (seed data) untuk simulasi operasional bengkel dan dapat dikembangkan lebih lanjut dengan integrasi database dan backend API.

---

## ✨ Fitur Utama

### 📊 Dashboard

* Statistik pelanggan, kendaraan, dan transaksi
* Grafik pendapatan bulanan
* Grafik layanan terpopuler
* Monitoring status transaksi
* Daftar transaksi terbaru

### 👥 Manajemen Pelanggan

* Tambah pelanggan
* Edit data pelanggan
* Hapus pelanggan
* Pencarian pelanggan

### 🚙 Manajemen Kendaraan

* Tambah kendaraan
* Edit kendaraan
* Hapus kendaraan
* Relasi kendaraan dengan pelanggan

### 🔧 Manajemen Montir

* Data montir
* Keahlian montir
* Status kerja (Aktif/Cuti)
* Sistem supervisor

### 🛠️ Manajemen Layanan Servis

* Data layanan servis
* Harga layanan
* Durasi pengerjaan
* Deskripsi layanan

### 📦 Manajemen Produk

* Sparepart
* Aksesoris kendaraan
* Monitoring stok
* Informasi masa pakai produk

### 📋 Transaksi Servis

* Pencatatan servis kendaraan
* Status pengerjaan
* Detail layanan yang digunakan
* Catatan servis

### 💳 Pembayaran

* Pembayaran tunai
* Pembayaran transfer
* Perhitungan kembalian
* Riwayat pembayaran

### 📈 Laporan dan Analitik

* Grafik pendapatan
* Statistik layanan
* Analisis transaksi
* Monitoring performa bengkel

---

## 🏗️ Teknologi yang Digunakan

### Frontend

* React
* TypeScript
* Tailwind CSS

### UI & Icons

* Lucide React

### Visualisasi Data

* Recharts

### Build Tool

* Vite

---

## 📂 Struktur Proyek

```text
src/
│
├── app/
│   └── App.tsx
│
├── styles/
│   └── index.css
│
├── main.tsx
│
└── components/
```

---

## 🚀 Instalasi

### Clone Repository

```bash
git clone https://github.com/username/autoshop-pro.git
cd autoshop-pro
```

### Install Dependency

```bash
npm install
```

### Jalankan Project

```bash
npm run dev
```

Aplikasi akan berjalan pada:

```text
http://localhost:5173
```

---

## 🔑 Login Demo

Gunakan akun berikut untuk masuk:

```text
Username : admin
Password : admin123
```

---

## 📊 Modul Sistem

| Modul      | Deskripsi                 |
| ---------- | ------------------------- |
| Dashboard  | Ringkasan data dan grafik |
| Pelanggan  | Data pelanggan bengkel    |
| Kendaraan  | Data kendaraan pelanggan  |
| Montir     | Pengelolaan montir        |
| Layanan    | Data servis kendaraan     |
| Produk     | Sparepart dan aksesoris   |
| Transaksi  | Proses servis kendaraan   |
| Pembayaran | Data pembayaran           |
| Riwayat    | Riwayat servis            |
| Laporan    | Analitik dan laporan      |

---

## 🎯 Tujuan Pengembangan

* Digitalisasi operasional bengkel.
* Mempermudah pencatatan servis.
* Mengelola data pelanggan dan kendaraan.
* Memantau stok sparepart.
* Menyediakan laporan yang akurat.
* Meningkatkan efisiensi pelayanan bengkel.

---

## 👨‍💻 Pengembang

Project dibuat sebagai implementasi Sistem Informasi Bengkel Kendaraan menggunakan React dan TypeScript.

---

## 📄 Lisensi

Proyek ini digunakan untuk keperluan pembelajaran, tugas kuliah, dan pengembangan sistem informasi bengkel.
