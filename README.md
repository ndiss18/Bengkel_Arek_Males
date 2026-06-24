# 🔧 Bengkel Arek Males - Sistem Informasi Manajemen Bengkel

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![License](https://img.shields.io/badge/License-Educational-green)

## 📖 Deskripsi

**Bengkel Arek Males** merupakan aplikasi Sistem Informasi Manajemen Bengkel Kendaraan yang dikembangkan untuk membantu proses operasional bengkel secara digital, mulai dari pengelolaan pelanggan, kendaraan, montir, transaksi servis, sparepart, hingga pembuatan laporan.

Proyek ini dibuat sebagai implementasi Mata Kuliah **Basis Data I** dengan menerapkan konsep:

* Entity Relationship Diagram (ERD)
* Conceptual Data Model (CDM)
* Relasi Database (1:1, 1:M, M:N)
* Supertype dan Subtype
* Weak Entity dan Identifying Relationship
* ARC (Exclusive Relationship)
* Transferable dan Non-Transferable Relationship
* Implementasi Database menggunakan PostgreSQL

---

# ✨ Fitur Utama

## 📊 Dashboard

* Statistik pelanggan dan kendaraan
* Statistik transaksi servis
* Grafik pendapatan
* Monitoring status transaksi
* Daftar transaksi terbaru

## 👤 Manajemen Pelanggan

* Tambah pelanggan
* Edit pelanggan
* Hapus pelanggan
* Pencarian pelanggan

## 🚗 Manajemen Kendaraan

* Data kendaraan pelanggan
* Relasi kendaraan dengan pelanggan
* Riwayat servis kendaraan

## 👨‍🔧 Manajemen Montir

* Data montir
* Keahlian montir
* Status kerja montir
* Sistem supervisor

## 🛠️ Manajemen Layanan Servis

* Data layanan servis
* Harga layanan
* Durasi pengerjaan
* Catatan servis

## 📦 Manajemen Sparepart

* Data sparepart
* Monitoring stok
* Harga produk
* Informasi produk

## 💳 Pembayaran

* Pembayaran tunai
* Pembayaran transfer
* Riwayat pembayaran
* Perhitungan total transaksi

## 📈 Laporan dan Analitik

* Laporan pendapatan
* Statistik layanan
* Monitoring performa bengkel
* Analisis transaksi

---

# 🗄️ Struktur Database

## Entitas Utama

* Pelanggan
* Kendaraan
* Pegawai
* Mekanik
* Kasir
* Admin
* Servis
* Detail Servis
* Sparepart
* Supplier
* Pembayaran

## Relasi Database

* Pelanggan → Kendaraan (1:M)
* Kendaraan → Servis (1:M)
* Servis → Sparepart (M:N)
* Servis → Mekanik (M:N)
* Pelanggan → Akun (1:1)

---

# 🏗️ Teknologi yang Digunakan

### Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

### Database

* PostgreSQL

### Visualisasi Data

* Recharts

### Version Control

* Git & GitHub

---

# 📁 Struktur Project

```bash
Bengkel_Arek_Males
│
├── src
│   ├── app
│   ├── components
│   ├── pages
│   ├── styles
│   └── data
│
├── Bengkel_db.sql
├── package.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Instalasi

## Clone Repository

```bash
git clone https://github.com/ndiss18/Bengkel_Arek_Males.git
cd Bengkel_Arek_Males
```

## Install Dependency

```bash
npm install
```

## Menjalankan Project

```bash
npm run dev
```

Aplikasi akan berjalan pada:

```bash
http://localhost:5173
```

---

# 🗄️ Menjalankan Database PostgreSQL

Buat database:

```sql
CREATE DATABASE bengkel_db;
```

Import file:

```bash
psql -U postgres -d bengkel_db -f Bengkel_db.sql
```

---

# 👥 Tim Pengembang

Project ini dikembangkan oleh Kelompok Mata Kuliah Basis Data I.

| Nama           | Peran               |
| -------------- | ------------------  |
| Anggota 1      | Analisis Kebutuhan  |
| Anggota 2      |      ERC/CDM        |
| Anggota 3      | Database PostgreSQL |
| Anggota 4      |  UI dan Prsentasi   |
| Anggota 5      | Pengujian Sisteem   |

---

# 🎯 Tujuan Pengembangan

* Digitalisasi operasional bengkel.
* Mempermudah pengelolaan data pelanggan.
* Mengelola transaksi servis secara terstruktur.
* Memantau stok sparepart.
* Menyediakan laporan yang akurat.
* Mengimplementasikan konsep basis data dalam studi kasus nyata.

---

# 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran dan tugas Mata Kuliah Basis Data I.

© 2026 - Bengkel Arek Males Team
