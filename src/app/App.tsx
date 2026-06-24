import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, Car, Wrench, Package, Tag,
  ClipboardList, CreditCard, History, BarChart2, Plus, Edit2,
  Trash2, Search, X, Menu, Bell, LogOut, CheckCircle, Clock,
  AlertCircle, FileText, Download, Banknote, Building2,
  Settings, TrendingUp, TrendingDown, Filter, Calendar,
  Eye, Printer, ChevronDown, MapPin, Phone, Mail, Gauge,
  ShieldCheck, Star, Layers, Hash, AlertTriangle, RefreshCw,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Page =
  | "dashboard" | "pelanggan" | "kendaraan" | "montir"
  | "layanan" | "produk" | "transaksi" | "pembayaran"
  | "riwayat" | "laporan";

interface Pelanggan { id: string; nama: string; noHp: string; alamat: string; email: string; }
interface Kendaraan { id: string; nopol: string; jenis: string; merk: string; warna: string; pemilikId: string; tahun: string; }
interface Montir { id: string; nama: string; noHp: string; keahlian: string; supervisorId: string | null; status: string; }
interface Layanan { id: string; nama: string; harga: number; deskripsi: string; durasi: string; }
interface Produk { id: string; nama: string; harga: number; stok: number; jenis: "Sparepart" | "Aksesoris"; masaPakai?: string; tipeKendaraan?: string; warna?: string; merk?: string; }
interface DetailItem { layananId: string; qty: number; subtotal: number; }
interface Transaksi { id: string; tanggal: string; pelangganId: string; kendaraanId: string; status: "Menunggu" | "Proses" | "Selesai"; total: number; details: DetailItem[]; montirId: string; catatan: string; }
interface Pembayaran { id: string; transaksiId: string; metode: "Tunai" | "Transfer"; tanggal: string; jumlah: number; catatan: string; namaBank?: string; noRekening?: string; uangDiterima?: number; kembalian?: number; }

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────
const seedPelanggan: Pelanggan[] = [
  { id: "PLG-001", nama: "Budi Santoso", noHp: "081234567890", alamat: "Jl. Merdeka No. 12, Jakarta Pusat", email: "budi.santoso@gmail.com" },
  { id: "PLG-002", nama: "Siti Rahayu", noHp: "082345678901", alamat: "Jl. Sudirman No. 45, Bandung", email: "siti.rahayu@yahoo.com" },
  { id: "PLG-003", nama: "Ahmad Fauzi", noHp: "083456789012", alamat: "Jl. Gatot Subroto No. 8, Surabaya", email: "ahmad.fauzi@email.com" },
  { id: "PLG-004", nama: "Dewi Lestari", noHp: "085678901234", alamat: "Jl. Ahmad Yani No. 33, Semarang", email: "dewi.lestari@gmail.com" },
  { id: "PLG-005", nama: "Hendra Wijaya", noHp: "087890123456", alamat: "Jl. Diponegoro No. 21, Yogyakarta", email: "hendra.wijaya@gmail.com" },
  { id: "PLG-006", nama: "Rina Maharani", noHp: "089012345678", alamat: "Jl. Imam Bonjol No. 7, Medan", email: "rina.maharani@email.com" },
  { id: "PLG-007", nama: "Dicky Prasetyo", noHp: "081122334455", alamat: "Jl. Pahlawan No. 3, Malang", email: "dicky.p@gmail.com" },
];

const seedKendaraan: Kendaraan[] = [
  { id: "KND-001", nopol: "B 1234 ABC", jenis: "Mobil", merk: "Toyota Avanza", warna: "Putih", pemilikId: "PLG-001", tahun: "2020" },
  { id: "KND-002", nopol: "D 5678 DEF", jenis: "Mobil", merk: "Honda Jazz", warna: "Silver", pemilikId: "PLG-002", tahun: "2019" },
  { id: "KND-003", nopol: "L 9012 GHI", jenis: "Motor", merk: "Yamaha NMAX 155", warna: "Hitam", pemilikId: "PLG-003", tahun: "2022" },
  { id: "KND-004", nopol: "H 3456 JKL", jenis: "Mobil", merk: "Suzuki Ertiga", warna: "Merah", pemilikId: "PLG-004", tahun: "2021" },
  { id: "KND-005", nopol: "AB 7890 MNO", jenis: "Motor", merk: "Honda Vario 160", warna: "Biru", pemilikId: "PLG-005", tahun: "2023" },
  { id: "KND-006", nopol: "BK 2345 PQR", jenis: "Mobil", merk: "Daihatsu Xenia", warna: "Abu-abu", pemilikId: "PLG-006", tahun: "2018" },
  { id: "KND-007", nopol: "N 6789 STU", jenis: "Mobil", merk: "Mitsubishi Xpander", warna: "Putih Mutiara", pemilikId: "PLG-007", tahun: "2022" },
];

const seedMontir: Montir[] = [
  { id: "MTR-001", nama: "Joko Widodo", noHp: "081111111111", keahlian: "Mesin & Transmisi", supervisorId: null, status: "Aktif" },
  { id: "MTR-002", nama: "Bambang Sutrisno", noHp: "082222222222", keahlian: "Elektrikal & AC", supervisorId: "MTR-001", status: "Aktif" },
  { id: "MTR-003", nama: "Agus Prasetyo", noHp: "083333333333", keahlian: "Body & Cat", supervisorId: "MTR-001", status: "Aktif" },
  { id: "MTR-004", nama: "Doni Setiawan", noHp: "084444444444", keahlian: "Suspensi & Rem", supervisorId: "MTR-001", status: "Aktif" },
  { id: "MTR-005", nama: "Rudi Hartono", noHp: "085555555555", keahlian: "Servis Umum", supervisorId: "MTR-002", status: "Cuti" },
];

const seedLayanan: Layanan[] = [
  { id: "LYN-001", nama: "Ganti Oli Mesin", harga: 150000, deskripsi: "Penggantian oli mesin dengan produk berkualitas", durasi: "30 menit" },
  { id: "LYN-002", nama: "Tune Up Standar", harga: 350000, deskripsi: "Tune up lengkap: busi, filter udara, karburator", durasi: "2 jam" },
  { id: "LYN-003", nama: "Servis AC Mobil", harga: 500000, deskripsi: "Pembersihan evaporator dan pengisian freon", durasi: "3 jam" },
  { id: "LYN-004", nama: "Balancing & Rotasi Ban", harga: 200000, deskripsi: "Balancing semua ban dan rotasi sesuai rekomendasi", durasi: "1 jam" },
  { id: "LYN-005", nama: "Spooring", harga: 250000, deskripsi: "Penyetelan sudut kemudi dan keselarasan roda", durasi: "1.5 jam" },
  { id: "LYN-006", nama: "Ganti Kampas Rem", harga: 400000, deskripsi: "Penggantian kampas rem depan dan belakang", durasi: "2 jam" },
  { id: "LYN-007", nama: "Servis Radiator", harga: 300000, deskripsi: "Flush radiator dan pengisian coolant baru", durasi: "1.5 jam" },
  { id: "LYN-008", nama: "Cek & Ganti Aki", harga: 750000, deskripsi: "Pengecekan dan penggantian aki kendaraan", durasi: "30 menit" },
];

const seedProduk: Produk[] = [
  { id: "PRD-001", nama: "Oli Mesin Castrol GTX 10W40", harga: 85000, stok: 45, jenis: "Sparepart", masaPakai: "5.000 km", tipeKendaraan: "Mobil" },
  { id: "PRD-002", nama: "Filter Udara Honda Jazz OEM", harga: 125000, stok: 12, jenis: "Sparepart", masaPakai: "10.000 km", tipeKendaraan: "Mobil" },
  { id: "PRD-003", nama: "Busi Denso Iridium IK20", harga: 95000, stok: 60, jenis: "Sparepart", masaPakai: "20.000 km", tipeKendaraan: "Universal" },
  { id: "PRD-004", nama: "Kampas Rem Depan Toyota Avanza", harga: 185000, stok: 8, jenis: "Sparepart", masaPakai: "30.000 km", tipeKendaraan: "Mobil" },
  { id: "PRD-005", nama: "Cover Setir Kulit Premium", harga: 250000, stok: 20, jenis: "Aksesoris", warna: "Hitam", merk: "AutoStyle Pro" },
  { id: "PRD-006", nama: "Parfum Mobil Gantung Vanilla", harga: 35000, stok: 3, jenis: "Aksesoris", warna: "Kuning", merk: "Aroma Drive" },
  { id: "PRD-007", nama: "Karpet Kaki 3D All-Season", harga: 320000, stok: 15, jenis: "Aksesoris", warna: "Abu-abu", merk: "CarMat Pro" },
  { id: "PRD-008", nama: "Aki GS Astra MF 45Ah", harga: 650000, stok: 6, jenis: "Sparepart", masaPakai: "2 tahun", tipeKendaraan: "Mobil" },
  { id: "PRD-009", nama: "Freon AC R134a 250gr", harga: 75000, stok: 2, jenis: "Sparepart", masaPakai: "Sesuai kondisi", tipeKendaraan: "Mobil" },
  { id: "PRD-010", nama: "Emblem Logo Chrome Universal", harga: 45000, stok: 30, jenis: "Aksesoris", warna: "Chrome", merk: "CarDeco" },
];

const seedTransaksi: Transaksi[] = [
  { id: "TRX-001", tanggal: "2024-12-18", pelangganId: "PLG-001", kendaraanId: "KND-001", status: "Selesai", total: 650000, montirId: "MTR-001", catatan: "Ganti oli rutin", details: [{ layananId: "LYN-001", qty: 1, subtotal: 150000 }, { layananId: "LYN-004", qty: 1, subtotal: 200000 }] },
  { id: "TRX-002", tanggal: "2024-12-19", pelangganId: "PLG-002", kendaraanId: "KND-002", status: "Selesai", total: 850000, montirId: "MTR-002", catatan: "Tune up dan ganti kampas", details: [{ layananId: "LYN-002", qty: 1, subtotal: 350000 }, { layananId: "LYN-006", qty: 1, subtotal: 400000 }] },
  { id: "TRX-003", tanggal: "2024-12-22", pelangganId: "PLG-003", kendaraanId: "KND-003", status: "Proses", total: 400000, montirId: "MTR-003", catatan: "Spooring dan balancing", details: [{ layananId: "LYN-005", qty: 1, subtotal: 250000 }] },
  { id: "TRX-004", tanggal: "2024-12-22", pelangganId: "PLG-004", kendaraanId: "KND-004", status: "Selesai", total: 1200000, montirId: "MTR-001", catatan: "Service lengkap", details: [{ layananId: "LYN-003", qty: 1, subtotal: 500000 }, { layananId: "LYN-007", qty: 1, subtotal: 300000 }] },
  { id: "TRX-005", tanggal: "2024-12-23", pelangganId: "PLG-005", kendaraanId: "KND-005", status: "Menunggu", total: 550000, montirId: "MTR-004", catatan: "Pengecekan aki", details: [{ layananId: "LYN-008", qty: 1, subtotal: 750000 }] },
  { id: "TRX-006", tanggal: "2024-12-23", pelangganId: "PLG-006", kendaraanId: "KND-006", status: "Proses", total: 350000, montirId: "MTR-002", catatan: "Ganti oli dan tune up ringan", details: [{ layananId: "LYN-001", qty: 1, subtotal: 150000 }, { layananId: "LYN-002", qty: 1, subtotal: 350000 }] },
];

const seedPembayaran: Pembayaran[] = [
  { id: "PAY-001", transaksiId: "TRX-001", metode: "Tunai", tanggal: "2024-12-18", jumlah: 650000, catatan: "Lunas", uangDiterima: 700000, kembalian: 50000 },
  { id: "PAY-002", transaksiId: "TRX-002", metode: "Transfer", tanggal: "2024-12-19", jumlah: 850000, catatan: "Transfer BCA", namaBank: "BCA", noRekening: "1234567890" },
  { id: "PAY-003", transaksiId: "TRX-004", metode: "Tunai", tanggal: "2024-12-22", jumlah: 1200000, catatan: "Lunas cash", uangDiterima: 1200000, kembalian: 0 },
];

const revenueData = [
  { bulan: "Jan", pendapatan: 28500000 }, { bulan: "Feb", pendapatan: 32100000 },
  { bulan: "Mar", pendapatan: 27800000 }, { bulan: "Apr", pendapatan: 35200000 },
  { bulan: "Mei", pendapatan: 41500000 }, { bulan: "Jun", pendapatan: 38900000 },
  { bulan: "Jul", pendapatan: 44200000 }, { bulan: "Agu", pendapatan: 39800000 },
  { bulan: "Sep", pendapatan: 47300000 }, { bulan: "Okt", pendapatan: 52100000 },
  { bulan: "Nov", pendapatan: 48700000 }, { bulan: "Des", pendapatan: 56400000 },
];

const serviceUsageData = [
  { name: "Ganti Oli", count: 342 }, { name: "Tune Up", count: 218 },
  { name: "Servis AC", count: 185 }, { name: "Balancing", count: 156 },
  { name: "Spooring", count: 134 }, { name: "Rem", count: 127 },
  { name: "Radiator", count: 98 }, { name: "Aki", count: 87 },
];

const PIE_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
};

function nextId(prefix: string, list: { id: string }[]) {
  const nums = list.map(x => parseInt(x.id.split("-")[1])).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

// ─────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────
function Modal({ open, onClose, title, children, wide = false }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col max-h-[92vh] ${wide ? "max-w-2xl" : "max-w-lg"}`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Proses: "bg-blue-50 text-blue-700 border-blue-200",
    Menunggu: "bg-amber-50 text-amber-700 border-amber-200",
    Aktif: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cuti: "bg-orange-50 text-orange-700 border-orange-200",
    Tunai: "bg-green-50 text-green-700 border-green-200",
    Transfer: "bg-violet-50 text-violet-700 border-violet-200",
    Sparepart: "bg-blue-50 text-blue-700 border-blue-200",
    Aksesoris: "bg-pink-50 text-pink-700 border-pink-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${map[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";
const selectCls = inputCls;
const btnPrimary = "inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors";
const btnSecondary = "inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors";
const btnDanger = "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors";
const btnEdit = "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors";

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = "Cari..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all w-64"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function Table({ cols, children, empty = "Tidak ada data" }: { cols: string[]; children: React.ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {cols.map(c => (
              <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {React.Children.count(children) === 0
            ? <tr><td colSpan={cols.length} className="px-4 py-8 text-center text-sm text-slate-400">{empty}</td></tr>
            : children}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !pass) { setErr("Username dan password wajib diisi."); return; }
    setLoading(true);
    setTimeout(() => {
      if (user === "admin" && pass === "admin123") {
        onLogin();
      } else {
        setErr("Username atau password salah. Coba: admin / admin123");
        setLoading(false);
      }
    }, 900);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2441 40%, #1e3a5f 100%)" }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #2563eb 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)`,
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Decorative circles */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #2563eb, transparent)" }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />

      <div className="relative w-full max-w-md px-4">
        {/* Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)" }} />

          <div className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}>
                <Wrench size={36} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>AutoShop Pro</h1>
              <p className="text-blue-300 text-sm mt-1">Sistem Manajemen Bengkel Kendaraan</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Username</label>
                <input
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  placeholder="Masukkan username"
                  value={user}
                  onChange={e => { setUser(e.target.value); setErr(""); }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                  placeholder="Masukkan password"
                  value={pass}
                  onChange={e => { setPass(e.target.value); setErr(""); }}
                />
              </div>

              {err && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/20 border border-red-400/30 rounded-xl">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-xs">{err}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: loading ? "#1d4ed8" : "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white" }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
              </button>
            </form>

            <p className="text-center text-xs text-white/30 mt-6">
              Demo: <span className="text-white/50 font-mono">admin</span> / <span className="text-white/50 font-mono">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-blue-400/50 text-xs mt-6">
          © 2024 AutoShop Pro · Bengkel Kendaraan Modern
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
const navGroups = [
  {
    label: null,
    items: [{ id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Master Data",
    items: [
      { id: "pelanggan" as Page, label: "Pelanggan", icon: Users },
      { id: "kendaraan" as Page, label: "Kendaraan", icon: Car },
      { id: "montir" as Page, label: "Montir", icon: Wrench },
      { id: "layanan" as Page, label: "Layanan Service", icon: Gauge },
      { id: "produk" as Page, label: "Produk", icon: Package },
    ],
  },
  {
    label: "Transaksi",
    items: [
      { id: "transaksi" as Page, label: "Transaksi Service", icon: ClipboardList },
      { id: "pembayaran" as Page, label: "Pembayaran", icon: CreditCard },
      { id: "riwayat" as Page, label: "Riwayat Service", icon: History },
    ],
  },
  {
    label: "Laporan",
    items: [
      { id: "laporan" as Page, label: "Laporan & Analitik", icon: BarChart2 },
    ],
  },
];

function Sidebar({ current, onNavigate, open, onClose }: {
  current: Page; onNavigate: (p: Page) => void; open: boolean; onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0a1628", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}>
            <Wrench size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>AutoShop Pro</p>
            <p className="text-blue-400 text-[10px] leading-tight">Manajemen Bengkel</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5"
          style={{ scrollbarWidth: "none" }}>
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = current === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); onClose(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <item.icon size={16} className={active ? "text-white" : "text-slate-500"} />
                      <span>{item.label}</span>
                      {active && <ChevronRight size={14} className="ml-auto text-blue-300" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin</p>
              <p className="text-slate-500 text-[10px] truncate">admin@autoshop.id</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────
const pageTitle: Record<Page, string> = {
  dashboard: "Dashboard", pelanggan: "Manajemen Pelanggan", kendaraan: "Manajemen Kendaraan",
  montir: "Manajemen Montir", layanan: "Layanan Service", produk: "Manajemen Produk",
  transaksi: "Transaksi Service", pembayaran: "Pembayaran", riwayat: "Riwayat Service",
  laporan: "Laporan & Analitik",
};

function Topbar({ current, onMenuClick, onLogout }: { current: Page; onMenuClick: () => void; onLogout: () => void; }) {
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center gap-4 px-4 flex-shrink-0 sticky top-0 z-20">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <Menu size={18} className="text-slate-600" />
      </button>
      <div className="flex-1">
        <span className="text-sm font-semibold text-slate-700">{pageTitle[current]}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={17} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-slate-200"
        >
          <LogOut size={13} />
          Keluar
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string; trend?: "up" | "down";
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-2 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
          <div className="flex items-center gap-1">
            {trend === "up" && <TrendingUp size={12} className="text-emerald-500" />}
            {trend === "down" && <TrendingDown size={12} className="text-red-500" />}
            <p className={`text-xs font-medium ${trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-slate-400"}`}>{sub}</p>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────
function DashboardPage({ pelanggan, kendaraan, transaksi }: { pelanggan: Pelanggan[]; kendaraan: Kendaraan[]; transaksi: Transaksi[]; }) {
  const todayTrx = transaksi.filter(t => t.tanggal === "2024-12-23");
  const monthRev = transaksi.filter(t => t.status === "Selesai").reduce((a, b) => a + b.total, 0);

  const pieData = [
    { name: "Selesai", value: transaksi.filter(t => t.status === "Selesai").length },
    { name: "Proses", value: transaksi.filter(t => t.status === "Proses").length },
    { name: "Menunggu", value: transaksi.filter(t => t.status === "Menunggu").length },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pelanggan" value={String(pelanggan.length)} sub="+2 bulan ini" icon={Users} color="bg-blue-50 text-blue-600" trend="up" />
        <StatCard label="Total Kendaraan" value={String(kendaraan.length)} sub="+3 bulan ini" icon={Car} color="bg-indigo-50 text-indigo-600" trend="up" />
        <StatCard label="Service Hari Ini" value={String(todayTrx.length)} sub="transaksi aktif" icon={Wrench} color="bg-amber-50 text-amber-600" />
        <StatCard label="Pendapatan Bulan Ini" value={fmtShort(monthRev)} sub="+18% vs bulan lalu" icon={TrendingUp} color="bg-emerald-50 text-emerald-600" trend="up" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>Pendapatan Bulanan</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tahun 2024</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">2024</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v / 1e6).toFixed(0)}jt`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [fmtShort(v), "Pendapatan"]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="pendapatan" stroke="#2563eb" strokeWidth={2.5} fill="url(#colorRev)" dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Status Transaksi</h3>
          <p className="text-xs text-slate-400 mb-4">Distribusi status saat ini</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-xs text-slate-600">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service bar chart + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Layanan Terpopuler</h3>
          <p className="text-xs text-slate-400 mb-4">Total penggunaan layanan</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviceUsageData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={72} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Transaksi Terbaru</h3>
          <div className="space-y-2">
            {transaksi.slice(0, 5).map(t => {
              const plg = seedPelanggan.find(p => p.id === t.pelangganId);
              const knd = seedKendaraan.find(k => k.id === t.kendaraanId);
              return (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Car size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{plg?.nama}</p>
                    <p className="text-[11px] text-slate-400">{knd?.nopol} · {t.tanggal}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-slate-800">{fmtShort(t.total)}</p>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PELANGGAN PAGE
// ─────────────────────────────────────────────
function PelangganPage() {
  const [data, setData] = useState<Pelanggan[]>(seedPelanggan);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; item?: Pelanggan }>({ open: false, mode: "add" });
  const [form, setForm] = useState<Partial<Pelanggan>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => data.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.noHp.includes(search) || p.email.toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  function openAdd() { setForm({}); setModal({ open: true, mode: "add" }); }
  function openEdit(item: Pelanggan) { setForm({ ...item }); setModal({ open: true, mode: "edit", item }); }
  function save() {
    if (!form.nama || !form.noHp) return;
    if (modal.mode === "add") {
      setData(d => [...d, { id: nextId("PLG", d), nama: form.nama!, noHp: form.noHp!, alamat: form.alamat ?? "", email: form.email ?? "" }]);
    } else {
      setData(d => d.map(p => p.id === modal.item!.id ? { ...p, ...form } as Pelanggan : p));
    }
    setModal({ open: false, mode: "add" });
  }

  return (
    <div>
      <PageHeader
        title="Data Pelanggan"
        subtitle={`${data.length} pelanggan terdaftar`}
        action={<button onClick={openAdd} className={btnPrimary}><Plus size={15} />Tambah Pelanggan</button>}
      />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari nama, HP, email..." />
          <div className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} hasil</div>
        </div>
        <Table cols={["ID", "Nama", "No. HP", "Alamat", "Email", "Aksi"]}>
          {filtered.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-xs font-mono text-slate-400">{p.id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                    {p.nama.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{p.nama}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{p.noHp}</td>
              <td className="px-4 py-3 text-sm text-slate-600 max-w-[180px] truncate">{p.alamat}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{p.email}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(p)} className={btnEdit}><Edit2 size={13} />Edit</button>
                  <button onClick={() => setDeleteId(p.id)} className={btnDanger}><Trash2 size={13} />Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: "add" })} title={modal.mode === "add" ? "Tambah Pelanggan" : "Edit Pelanggan"}>
        <div className="space-y-4">
          <FormField label="Nama Lengkap"><input className={inputCls} value={form.nama ?? ""} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama lengkap" /></FormField>
          <FormField label="No. HP"><input className={inputCls} value={form.noHp ?? ""} onChange={e => setForm(f => ({ ...f, noHp: e.target.value }))} placeholder="08xxxxxxxxxx" /></FormField>
          <FormField label="Email"><input className={inputCls} type="email" value={form.email ?? ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@domain.com" /></FormField>
          <FormField label="Alamat"><textarea className={inputCls} rows={2} value={form.alamat ?? ""} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} placeholder="Alamat lengkap" /></FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className={btnPrimary}><CheckCircle size={15} />Simpan</button>
            <button onClick={() => setModal({ open: false, mode: "add" })} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <p className="text-sm text-slate-600">Yakin ingin menghapus pelanggan ini? Tindakan tidak dapat dibatalkan.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setData(d => d.filter(p => p.id !== deleteId)); setDeleteId(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">Hapus</button>
            <button onClick={() => setDeleteId(null)} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// KENDARAAN PAGE
// ─────────────────────────────────────────────
function KendaraanPage({ pelangganList }: { pelangganList: Pelanggan[] }) {
  const [data, setData] = useState<Kendaraan[]>(seedKendaraan);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; item?: Kendaraan }>({ open: false, mode: "add" });
  const [form, setForm] = useState<Partial<Kendaraan>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => data.filter(k =>
    k.nopol.toLowerCase().includes(search.toLowerCase()) ||
    k.merk.toLowerCase().includes(search.toLowerCase()) ||
    (pelangganList.find(p => p.id === k.pemilikId)?.nama ?? "").toLowerCase().includes(search.toLowerCase())
  ), [data, search, pelangganList]);

  function openAdd() { setForm({}); setModal({ open: true, mode: "add" }); }
  function openEdit(item: Kendaraan) { setForm({ ...item }); setModal({ open: true, mode: "edit", item }); }
  function save() {
    if (!form.nopol || !form.merk) return;
    if (modal.mode === "add") {
      setData(d => [...d, { id: nextId("KND", d), nopol: form.nopol!, jenis: form.jenis ?? "Mobil", merk: form.merk!, warna: form.warna ?? "", pemilikId: form.pemilikId ?? "", tahun: form.tahun ?? "" }]);
    } else {
      setData(d => d.map(k => k.id === modal.item!.id ? { ...k, ...form } as Kendaraan : k));
    }
    setModal({ open: false, mode: "add" });
  }

  return (
    <div>
      <PageHeader
        title="Data Kendaraan"
        subtitle={`${data.length} kendaraan terdaftar`}
        action={<button onClick={openAdd} className={btnPrimary}><Plus size={15} />Tambah Kendaraan</button>}
      />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari nopol, merk, pemilik..." />
          <div className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} hasil</div>
        </div>
        <Table cols={["ID", "No. Polisi", "Jenis", "Merk & Model", "Warna", "Tahun", "Pemilik", "Aksi"]}>
          {filtered.map(k => {
            const pemilik = pelangganList.find(p => p.id === k.pemilikId);
            return (
              <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{k.id}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{k.nopol}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${k.jenis === "Mobil" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>{k.jenis}</span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">{k.merk}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{k.warna}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{k.tahun}</td>
                <td className="px-4 py-3 text-sm text-slate-700 font-medium">{pemilik?.nama ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(k)} className={btnEdit}><Edit2 size={13} />Edit</button>
                    <button onClick={() => setDeleteId(k.id)} className={btnDanger}><Trash2 size={13} />Hapus</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: "add" })} title={modal.mode === "add" ? "Tambah Kendaraan" : "Edit Kendaraan"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="No. Polisi"><input className={inputCls} value={form.nopol ?? ""} onChange={e => setForm(f => ({ ...f, nopol: e.target.value.toUpperCase() }))} placeholder="B 1234 ABC" /></FormField>
            <FormField label="Tahun"><input className={inputCls} type="number" value={form.tahun ?? ""} onChange={e => setForm(f => ({ ...f, tahun: e.target.value }))} placeholder="2022" /></FormField>
          </div>
          <FormField label="Jenis Kendaraan">
            <select className={selectCls} value={form.jenis ?? ""} onChange={e => setForm(f => ({ ...f, jenis: e.target.value }))}>
              <option value="">Pilih jenis</option>
              <option>Mobil</option><option>Motor</option><option>Truk</option>
            </select>
          </FormField>
          <FormField label="Merk & Model"><input className={inputCls} value={form.merk ?? ""} onChange={e => setForm(f => ({ ...f, merk: e.target.value }))} placeholder="Toyota Avanza" /></FormField>
          <FormField label="Warna"><input className={inputCls} value={form.warna ?? ""} onChange={e => setForm(f => ({ ...f, warna: e.target.value }))} placeholder="Putih" /></FormField>
          <FormField label="Pemilik (Pelanggan)">
            <select className={selectCls} value={form.pemilikId ?? ""} onChange={e => setForm(f => ({ ...f, pemilikId: e.target.value }))}>
              <option value="">Pilih pelanggan</option>
              {pelangganList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className={btnPrimary}><CheckCircle size={15} />Simpan</button>
            <button onClick={() => setModal({ open: false, mode: "add" })} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto"><AlertTriangle size={24} className="text-red-500" /></div>
          <p className="text-sm text-slate-600">Yakin ingin menghapus data kendaraan ini?</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setData(d => d.filter(k => k.id !== deleteId)); setDeleteId(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">Hapus</button>
            <button onClick={() => setDeleteId(null)} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// MONTIR PAGE
// ─────────────────────────────────────────────
function MontirPage() {
  const [data, setData] = useState<Montir[]>(seedMontir);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; item?: Montir }>({ open: false, mode: "add" });
  const [form, setForm] = useState<Partial<Montir>>({});

  const filtered = useMemo(() => data.filter(m =>
    m.nama.toLowerCase().includes(search.toLowerCase()) || m.keahlian.toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  function save() {
    if (!form.nama) return;
    if (modal.mode === "add") {
      setData(d => [...d, { id: nextId("MTR", d), nama: form.nama!, noHp: form.noHp ?? "", keahlian: form.keahlian ?? "", supervisorId: form.supervisorId ?? null, status: form.status ?? "Aktif" }]);
    } else {
      setData(d => d.map(m => m.id === modal.item!.id ? { ...m, ...form } as Montir : m));
    }
    setModal({ open: false, mode: "add" });
  }

  return (
    <div>
      <PageHeader
        title="Data Montir"
        subtitle={`${data.filter(m => m.status === "Aktif").length} montir aktif`}
        action={<button onClick={() => { setForm({}); setModal({ open: true, mode: "add" }); }} className={btnPrimary}><Plus size={15} />Tambah Montir</button>}
      />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari nama, keahlian..." />
          <div className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} hasil</div>
        </div>
        <Table cols={["ID", "Nama Montir", "No. HP", "Keahlian", "Supervisor", "Status", "Aksi"]}>
          {filtered.map(m => {
            const sup = data.find(x => x.id === m.supervisorId);
            return (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{m.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">{m.nama.charAt(0)}</div>
                    <span className="text-sm font-semibold text-slate-800">{m.nama}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{m.noHp}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">{m.keahlian}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{sup?.nama ?? <span className="text-slate-300 italic">Kepala</span>}</td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => { setForm({ ...m }); setModal({ open: true, mode: "edit", item: m }); }} className={btnEdit}><Edit2 size={13} />Edit</button>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: "add" })} title={modal.mode === "add" ? "Tambah Montir" : "Edit Montir"}>
        <div className="space-y-4">
          <FormField label="Nama Montir"><input className={inputCls} value={form.nama ?? ""} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama lengkap" /></FormField>
          <FormField label="No. HP"><input className={inputCls} value={form.noHp ?? ""} onChange={e => setForm(f => ({ ...f, noHp: e.target.value }))} placeholder="08xxxxxxxxxx" /></FormField>
          <FormField label="Keahlian"><input className={inputCls} value={form.keahlian ?? ""} onChange={e => setForm(f => ({ ...f, keahlian: e.target.value }))} placeholder="Mesin & Transmisi" /></FormField>
          <FormField label="Supervisor">
            <select className={selectCls} value={form.supervisorId ?? ""} onChange={e => setForm(f => ({ ...f, supervisorId: e.target.value || null }))}>
              <option value="">Tidak ada (Kepala)</option>
              {data.filter(m => m.id !== form.id).map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={selectCls} value={form.status ?? "Aktif"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option>Aktif</option><option>Cuti</option><option>Nonaktif</option>
            </select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className={btnPrimary}><CheckCircle size={15} />Simpan</button>
            <button onClick={() => setModal({ open: false, mode: "add" })} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// LAYANAN PAGE
// ─────────────────────────────────────────────
function LayananPage() {
  const [data, setData] = useState<Layanan[]>(seedLayanan);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; item?: Layanan }>({ open: false, mode: "add" });
  const [form, setForm] = useState<Partial<Layanan>>({});

  const filtered = useMemo(() => data.filter(l =>
    l.nama.toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  function save() {
    if (!form.nama || !form.harga) return;
    if (modal.mode === "add") {
      setData(d => [...d, { id: nextId("LYN", d), nama: form.nama!, harga: Number(form.harga), deskripsi: form.deskripsi ?? "", durasi: form.durasi ?? "" }]);
    } else {
      setData(d => d.map(l => l.id === modal.item!.id ? { ...l, ...form, harga: Number(form.harga) } as Layanan : l));
    }
    setModal({ open: false, mode: "add" });
  }

  return (
    <div>
      <PageHeader
        title="Layanan Service"
        subtitle={`${data.length} jenis layanan tersedia`}
        action={<button onClick={() => { setForm({}); setModal({ open: true, mode: "add" }); }} className={btnPrimary}><Plus size={15} />Tambah Layanan</button>}
      />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari layanan..." />
          <div className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} layanan</div>
        </div>
        <Table cols={["ID", "Nama Layanan", "Harga", "Durasi", "Deskripsi", "Aksi"]}>
          {filtered.map(l => (
            <tr key={l.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-xs font-mono text-slate-400">{l.id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Gauge size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{l.nama}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(l.harga)}</td>
              <td className="px-4 py-3">
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit">
                  <Clock size={11} />{l.durasi}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">{l.deskripsi}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => { setForm({ ...l }); setModal({ open: true, mode: "edit", item: l }); }} className={btnEdit}><Edit2 size={13} />Edit</button>
                  <button onClick={() => setData(d => d.filter(x => x.id !== l.id))} className={btnDanger}><Trash2 size={13} />Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: "add" })} title={modal.mode === "add" ? "Tambah Layanan" : "Edit Layanan"}>
        <div className="space-y-4">
          <FormField label="Nama Layanan"><input className={inputCls} value={form.nama ?? ""} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Ganti Oli Mesin" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Harga (Rp)"><input className={inputCls} type="number" value={form.harga ?? ""} onChange={e => setForm(f => ({ ...f, harga: Number(e.target.value) }))} placeholder="150000" /></FormField>
            <FormField label="Durasi"><input className={inputCls} value={form.durasi ?? ""} onChange={e => setForm(f => ({ ...f, durasi: e.target.value }))} placeholder="30 menit" /></FormField>
          </div>
          <FormField label="Deskripsi"><textarea className={inputCls} rows={2} value={form.deskripsi ?? ""} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} placeholder="Deskripsi singkat layanan" /></FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className={btnPrimary}><CheckCircle size={15} />Simpan</button>
            <button onClick={() => setModal({ open: false, mode: "add" })} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUK PAGE (Sparepart + Aksesoris tabs)
// ─────────────────────────────────────────────
function ProdukPage() {
  const [data, setData] = useState<Produk[]>(seedProduk);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"Semua" | "Sparepart" | "Aksesoris">("Semua");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; item?: Produk }>({ open: false, mode: "add" });
  const [form, setForm] = useState<Partial<Produk>>({ jenis: "Sparepart" });

  const filtered = useMemo(() => data.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "Semua" || p.jenis === tab;
    return matchSearch && matchTab;
  }), [data, search, tab]);

  const LOW_STOCK = 10;

  function save() {
    if (!form.nama || !form.harga) return;
    const base = { id: nextId("PRD", data), nama: form.nama!, harga: Number(form.harga), stok: Number(form.stok ?? 0), jenis: form.jenis ?? "Sparepart" } as Produk;
    if (form.jenis === "Sparepart") { base.masaPakai = form.masaPakai; base.tipeKendaraan = form.tipeKendaraan; }
    else { base.warna = form.warna; base.merk = form.merk; }
    if (modal.mode === "add") setData(d => [...d, base]);
    else setData(d => d.map(p => p.id === modal.item!.id ? { ...p, ...form, harga: Number(form.harga), stok: Number(form.stok) } as Produk : p));
    setModal({ open: false, mode: "add" });
  }

  return (
    <div>
      <PageHeader
        title="Manajemen Produk"
        subtitle={`${data.length} produk · ${data.filter(p => p.stok <= LOW_STOCK).length} stok menipis`}
        action={<button onClick={() => { setForm({ jenis: "Sparepart" }); setModal({ open: true, mode: "add" }); }} className={btnPrimary}><Plus size={15} />Tambah Produk</button>}
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 flex-wrap gap-y-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari produk..." />
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {(["Semua", "Sparepart", "Aksesoris"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >{t}</button>
            ))}
          </div>
          <div className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} produk</div>
        </div>

        <Table cols={["ID", "Nama Produk", "Kategori", "Harga", "Stok", "Info Tambahan", "Aksi"]}>
          {filtered.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-xs font-mono text-slate-400">{p.id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${p.jenis === "Sparepart" ? "bg-blue-50" : "bg-pink-50"}`}>
                    {p.jenis === "Sparepart" ? <Settings size={14} className="text-blue-600" /> : <Tag size={14} className="text-pink-600" />}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 max-w-[200px] truncate">{p.nama}</span>
                </div>
              </td>
              <td className="px-4 py-3"><StatusBadge status={p.jenis} /></td>
              <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(p.harga)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${p.stok <= LOW_STOCK ? "text-red-600" : "text-slate-800"}`}>{p.stok}</span>
                  {p.stok <= LOW_STOCK && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                      <AlertTriangle size={9} />Stok Tipis
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {p.jenis === "Sparepart" ? `${p.masaPakai ?? "-"} · ${p.tipeKendaraan ?? "-"}` : `${p.warna ?? "-"} · ${p.merk ?? "-"}`}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => { setForm({ ...p }); setModal({ open: true, mode: "edit", item: p }); }} className={btnEdit}><Edit2 size={13} />Edit</button>
                  <button onClick={() => setData(d => d.filter(x => x.id !== p.id))} className={btnDanger}><Trash2 size={13} />Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: "add" })} title={modal.mode === "add" ? "Tambah Produk" : "Edit Produk"}>
        <div className="space-y-4">
          <FormField label="Nama Produk"><input className={inputCls} value={form.nama ?? ""} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Harga (Rp)"><input className={inputCls} type="number" value={form.harga ?? ""} onChange={e => setForm(f => ({ ...f, harga: Number(e.target.value) }))} /></FormField>
            <FormField label="Stok"><input className={inputCls} type="number" value={form.stok ?? ""} onChange={e => setForm(f => ({ ...f, stok: Number(e.target.value) }))} /></FormField>
          </div>
          <FormField label="Jenis Produk">
            <select className={selectCls} value={form.jenis ?? "Sparepart"} onChange={e => setForm(f => ({ ...f, jenis: e.target.value as "Sparepart" | "Aksesoris" }))}>
              <option value="Sparepart">Sparepart</option>
              <option value="Aksesoris">Aksesoris</option>
            </select>
          </FormField>
          {form.jenis === "Sparepart" ? (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Masa Pakai"><input className={inputCls} value={form.masaPakai ?? ""} onChange={e => setForm(f => ({ ...f, masaPakai: e.target.value }))} placeholder="5.000 km" /></FormField>
              <FormField label="Tipe Kendaraan"><input className={inputCls} value={form.tipeKendaraan ?? ""} onChange={e => setForm(f => ({ ...f, tipeKendaraan: e.target.value }))} placeholder="Mobil" /></FormField>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Warna"><input className={inputCls} value={form.warna ?? ""} onChange={e => setForm(f => ({ ...f, warna: e.target.value }))} placeholder="Hitam" /></FormField>
              <FormField label="Merk"><input className={inputCls} value={form.merk ?? ""} onChange={e => setForm(f => ({ ...f, merk: e.target.value }))} placeholder="AutoStyle" /></FormField>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={save} className={btnPrimary}><CheckCircle size={15} />Simpan</button>
            <button onClick={() => setModal({ open: false, mode: "add" })} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// TRANSAKSI PAGE
// ─────────────────────────────────────────────
function TransaksiPage({ pelangganList, kendaraanList, layananList, montirList }: {
  pelangganList: Pelanggan[]; kendaraanList: Kendaraan[]; layananList: Layanan[]; montirList: Montir[];
}) {
  const [data, setData] = useState<Transaksi[]>(seedTransaksi);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState<Transaksi | null>(null);
  const [form, setForm] = useState<{ pelangganId: string; kendaraanId: string; montirId: string; catatan: string; details: DetailItem[] }>({
    pelangganId: "", kendaraanId: "", montirId: "", catatan: "", details: [],
  });
  const [selectedLayananId, setSelectedLayananId] = useState("");
  const [qty, setQty] = useState(1);

  const filteredKendaraan = kendaraanList.filter(k => k.pemilikId === form.pelangganId);
  const total = form.details.reduce((a, b) => a + b.subtotal, 0);

  const filtered = useMemo(() => data.filter(t => {
    const plg = pelangganList.find(p => p.id === t.pelangganId)?.nama ?? "";
    const knd = kendaraanList.find(k => k.id === t.kendaraanId)?.nopol ?? "";
    return plg.toLowerCase().includes(search.toLowerCase()) || knd.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
  }), [data, search, pelangganList, kendaraanList]);

  function addDetail() {
    const layanan = layananList.find(l => l.id === selectedLayananId);
    if (!layanan) return;
    const exists = form.details.findIndex(d => d.layananId === selectedLayananId);
    if (exists >= 0) {
      setForm(f => ({ ...f, details: f.details.map((d, i) => i === exists ? { ...d, qty: d.qty + qty, subtotal: layanan.harga * (d.qty + qty) } : d) }));
    } else {
      setForm(f => ({ ...f, details: [...f.details, { layananId: selectedLayananId, qty, subtotal: layanan.harga * qty }] }));
    }
    setSelectedLayananId(""); setQty(1);
  }

  function removeDetail(idx: number) {
    setForm(f => ({ ...f, details: f.details.filter((_, i) => i !== idx) }));
  }

  function save() {
    if (!form.pelangganId || !form.kendaraanId || form.details.length === 0) return;
    const today = new Date().toISOString().split("T")[0];
    setData(d => [...d, { id: nextId("TRX", d), tanggal: today, pelangganId: form.pelangganId, kendaraanId: form.kendaraanId, montirId: form.montirId, status: "Menunggu", total, catatan: form.catatan, details: form.details }]);
    setForm({ pelangganId: "", kendaraanId: "", montirId: "", catatan: "", details: [] });
    setModal(false);
  }

  const statusColor: Record<string, string> = { Selesai: "text-emerald-600", Proses: "text-blue-600", Menunggu: "text-amber-600" };

  return (
    <div>
      <PageHeader
        title="Transaksi Service"
        subtitle={`${data.length} transaksi total`}
        action={<button onClick={() => setModal(true)} className={btnPrimary}><Plus size={15} />Transaksi Baru</button>}
      />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari ID, pelanggan, nopol..." />
          <div className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} transaksi</div>
        </div>
        <Table cols={["ID", "Tanggal", "Pelanggan", "Kendaraan", "Montir", "Total", "Status", "Aksi"]}>
          {filtered.map(t => {
            const plg = pelangganList.find(p => p.id === t.pelangganId);
            const knd = kendaraanList.find(k => k.id === t.kendaraanId);
            const mtr = montirList.find(m => m.id === t.montirId);
            return (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono font-semibold text-blue-600">{t.id}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.tanggal}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">{plg?.nama ?? "-"}</td>
                <td className="px-4 py-3"><span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">{knd?.nopol ?? "-"}</span></td>
                <td className="px-4 py-3 text-sm text-slate-600">{mtr?.nama ?? "-"}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(t.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setDetailModal(t)} className={btnEdit}><Eye size={13} />Detail</button>
                    <button onClick={() => setData(d => d.map(x => x.id === t.id ? { ...x, status: x.status === "Menunggu" ? "Proses" : x.status === "Proses" ? "Selesai" : x.status } : x))} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
                      <CheckCircle size={13} />Update
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>

      {/* New Transaction Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Transaksi Service Baru" wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Pelanggan">
              <select className={selectCls} value={form.pelangganId} onChange={e => setForm(f => ({ ...f, pelangganId: e.target.value, kendaraanId: "" }))}>
                <option value="">Pilih pelanggan</option>
                {pelangganList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
            </FormField>
            <FormField label="Kendaraan">
              <select className={selectCls} value={form.kendaraanId} onChange={e => setForm(f => ({ ...f, kendaraanId: e.target.value }))} disabled={!form.pelangganId}>
                <option value="">Pilih kendaraan</option>
                {filteredKendaraan.map(k => <option key={k.id} value={k.id}>{k.nopol} — {k.merk}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Montir">
            <select className={selectCls} value={form.montirId} onChange={e => setForm(f => ({ ...f, montirId: e.target.value }))}>
              <option value="">Pilih montir</option>
              {montirList.filter(m => m.status === "Aktif").map(m => <option key={m.id} value={m.id}>{m.nama} — {m.keahlian}</option>)}
            </select>
          </FormField>

          {/* Detail service builder */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detail Layanan</p>
            <div className="flex gap-2">
              <select className={`${selectCls} flex-1`} value={selectedLayananId} onChange={e => setSelectedLayananId(e.target.value)}>
                <option value="">Pilih layanan</option>
                {layananList.map(l => <option key={l.id} value={l.id}>{l.nama} — {fmt(l.harga)}</option>)}
              </select>
              <input className={`${inputCls} w-16`} type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} />
              <button onClick={addDetail} className={btnPrimary} disabled={!selectedLayananId}><Plus size={14} />Tambah</button>
            </div>
            {form.details.length > 0 && (
              <div className="space-y-2">
                {form.details.map((d, i) => {
                  const layanan = layananList.find(l => l.id === d.layananId);
                  return (
                    <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100">
                      <span className="text-sm text-slate-700">{layanan?.nama}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">x{d.qty}</span>
                        <span className="text-sm font-bold text-slate-800">{fmt(d.subtotal)}</span>
                        <button onClick={() => removeDetail(i)} className="text-red-400 hover:text-red-600 transition-colors"><X size={14} /></button>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-700">Total</span>
                  <span className="text-base font-bold text-blue-600">{fmt(total)}</span>
                </div>
              </div>
            )}
          </div>

          <FormField label="Catatan"><textarea className={inputCls} rows={2} value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} placeholder="Keluhan atau catatan tambahan..." /></FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className={btnPrimary}><CheckCircle size={15} />Simpan Transaksi</button>
            <button onClick={() => setModal(false)} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>

      {/* Detail view modal */}
      <Modal open={!!detailModal} onClose={() => setDetailModal(null)} title={`Detail Transaksi — ${detailModal?.id}`} wide>
        {detailModal && (() => {
          const plg = pelangganList.find(p => p.id === detailModal.pelangganId);
          const knd = kendaraanList.find(k => k.id === detailModal.kendaraanId);
          const mtr = montirList.find(m => m.id === detailModal.montirId);
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Pelanggan</p>
                  <p className="font-bold text-slate-800">{plg?.nama}</p>
                  <p className="text-slate-500 text-xs">{plg?.noHp}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Kendaraan</p>
                  <p className="font-bold text-slate-800 font-mono">{knd?.nopol}</p>
                  <p className="text-slate-500 text-xs">{knd?.merk} · {knd?.warna}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Montir</p>
                  <p className="font-bold text-slate-800">{mtr?.nama ?? "-"}</p>
                  <p className="text-slate-500 text-xs">{mtr?.keahlian}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Status</p>
                  <StatusBadge status={detailModal.status} />
                  <p className="text-slate-500 text-xs">{detailModal.tanggal}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Layanan</p>
                <div className="space-y-2">
                  {detailModal.details.map((d, i) => {
                    const l = layananList.find(x => x.id === d.layananId);
                    return (
                      <div key={i} className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg text-sm">
                        <span className="text-slate-700">{l?.nama ?? d.layananId}</span>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>x{d.qty}</span>
                          <span className="text-sm font-bold text-slate-800">{fmt(d.subtotal)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between px-3 py-2 font-bold text-sm border-t border-slate-200">
                    <span className="text-slate-700">Total</span>
                    <span className="text-blue-600">{fmt(detailModal.total)}</span>
                  </div>
                </div>
              </div>
              {detailModal.catatan && <p className="text-sm text-slate-500 italic bg-slate-50 rounded-lg px-3 py-2">{detailModal.catatan}</p>}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// PEMBAYARAN PAGE
// ─────────────────────────────────────────────
function PembayaranPage({ transaksiList, pelangganList }: { transaksiList: Transaksi[]; pelangganList: Pelanggan[]; }) {
  const [data, setData] = useState<Pembayaran[]>(seedPembayaran);
  const [modal, setModal] = useState(false);
  const [metode, setMetode] = useState<"Tunai" | "Transfer">("Tunai");
  const [trxId, setTrxId] = useState("");
  const [uangDiterima, setUangDiterima] = useState(0);
  const [namaBank, setNamaBank] = useState("");
  const [noRek, setNoRek] = useState("");
  const [catatan, setCatatan] = useState("");

  const selectedTrx = transaksiList.find(t => t.id === trxId);
  const kembalian = metode === "Tunai" ? Math.max(0, uangDiterima - (selectedTrx?.total ?? 0)) : 0;
  const unpaidTrx = transaksiList.filter(t => !data.find(p => p.transaksiId === t.id));

  function save() {
    if (!trxId) return;
    const plg = pelangganList.find(p => p.id === selectedTrx?.pelangganId);
    const today = new Date().toISOString().split("T")[0];
    const base: Pembayaran = { id: nextId("PAY", data), transaksiId: trxId, metode, tanggal: today, jumlah: selectedTrx?.total ?? 0, catatan };
    if (metode === "Tunai") { base.uangDiterima = uangDiterima; base.kembalian = kembalian; }
    else { base.namaBank = namaBank; base.noRekening = noRek; }
    setData(d => [...d, base]);
    setModal(false); setTrxId(""); setUangDiterima(0); setNamaBank(""); setNoRek(""); setCatatan("");
  }

  return (
    <div>
      <PageHeader
        title="Pembayaran"
        subtitle={`${data.length} pembayaran tercatat`}
        action={<button onClick={() => setModal(true)} className={btnPrimary}><Plus size={15} />Proses Pembayaran</button>}
      />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table cols={["ID", "Transaksi", "Metode", "Tanggal", "Jumlah", "Info", "Catatan"]}>
          {data.map(p => {
            const trx = transaksiList.find(t => t.id === p.transaksiId);
            const plg = pelangganList.find(x => x.id === trx?.pelangganId);
            return (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{p.id}</td>
                <td className="px-4 py-3">
                  <p className="text-xs font-mono font-semibold text-blue-600">{p.transaksiId}</p>
                  <p className="text-xs text-slate-400">{plg?.nama}</p>
                </td>
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${p.metode === "Tunai" ? "bg-green-50 text-green-700" : "bg-violet-50 text-violet-700"}`}>
                    {p.metode === "Tunai" ? <Banknote size={12} /> : <Building2 size={12} />}
                    {p.metode}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{p.tanggal}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(p.jumlah)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {p.metode === "Tunai"
                    ? `Diterima: ${fmt(p.uangDiterima ?? 0)} · Kembalian: ${fmt(p.kembalian ?? 0)}`
                    : `${p.namaBank} — ${p.noRekening}`}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{p.catatan || "-"}</td>
              </tr>
            );
          })}
        </Table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Proses Pembayaran" wide>
        <div className="space-y-4">
          <FormField label="Pilih Transaksi">
            <select className={selectCls} value={trxId} onChange={e => setTrxId(e.target.value)}>
              <option value="">Pilih transaksi</option>
              {unpaidTrx.map(t => {
                const plg = pelangganList.find(p => p.id === t.pelangganId);
                return <option key={t.id} value={t.id}>{t.id} — {plg?.nama} — {fmt(t.total)}</option>;
              })}
            </select>
          </FormField>

          {selectedTrx && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Tagihan</span>
                <span className="text-xl font-bold text-blue-700">{fmt(selectedTrx.total)}</span>
              </div>
            </div>
          )}

          {/* Metode toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Metode Pembayaran</label>
            <div className="flex gap-3">
              {(["Tunai", "Transfer"] as const).map(m => (
                <button key={m} onClick={() => setMetode(m)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${metode === m ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                  {m === "Tunai" ? <Banknote size={18} /> : <Building2 size={18} />}
                  {m}
                </button>
              ))}
            </div>
          </div>

          {metode === "Tunai" ? (
            <div className="space-y-3">
              <FormField label="Uang Diterima (Rp)">
                <input className={inputCls} type="number" value={uangDiterima || ""} onChange={e => setUangDiterima(Number(e.target.value))} placeholder="0" />
              </FormField>
              {uangDiterima > 0 && selectedTrx && (
                <div className={`flex justify-between items-center px-4 py-3 rounded-xl font-semibold text-sm ${kembalian >= 0 ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
                  <span className={kembalian >= 0 ? "text-emerald-700" : "text-red-700"}>Kembalian</span>
                  <span className={`text-lg font-bold ${kembalian >= 0 ? "text-emerald-700" : "text-red-600"}`}>{fmt(kembalian)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <FormField label="Nama Bank">
                <select className={selectCls} value={namaBank} onChange={e => setNamaBank(e.target.value)}>
                  <option value="">Pilih bank</option>
                  {["BCA", "BRI", "BNI", "Mandiri", "BSI", "CIMB Niaga"].map(b => <option key={b}>{b}</option>)}
                </select>
              </FormField>
              <FormField label="Nomor Rekening">
                <input className={inputCls} value={noRek} onChange={e => setNoRek(e.target.value)} placeholder="Nomor rekening pengirim" />
              </FormField>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                <FileText size={20} className="text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400 font-medium">Upload Bukti Transfer</p>
                <p className="text-[10px] text-slate-300 mt-0.5">PNG, JPG, PDF maks. 2MB</p>
              </div>
            </div>
          )}

          <FormField label="Catatan (opsional)">
            <input className={inputCls} value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Catatan pembayaran..." />
          </FormField>

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={!trxId} className={`${btnPrimary} disabled:opacity-50`}><CheckCircle size={15} />Konfirmasi Pembayaran</button>
            <button onClick={() => setModal(false)} className={btnSecondary}>Batal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// RIWAYAT PAGE
// ─────────────────────────────────────────────
function RiwayatPage({ transaksiList, pelangganList, kendaraanList, layananList }: {
  transaksiList: Transaksi[]; pelangganList: Pelanggan[]; kendaraanList: Kendaraan[]; layananList: Layanan[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [detail, setDetail] = useState<Transaksi | null>(null);

  const filtered = useMemo(() => transaksiList.filter(t => {
    const plg = pelangganList.find(p => p.id === t.pelangganId)?.nama ?? "";
    const knd = kendaraanList.find(k => k.id === t.kendaraanId)?.nopol ?? "";
    const matchSearch = plg.toLowerCase().includes(search.toLowerCase()) || knd.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Semua" || t.status === statusFilter;
    return matchSearch && matchStatus;
  }), [transaksiList, search, statusFilter, pelangganList, kendaraanList]);

  return (
    <div>
      <PageHeader title="Riwayat Service" subtitle={`${transaksiList.length} total riwayat`} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 flex-wrap gap-y-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari pelanggan, nopol..." />
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {["Semua", "Menunggu", "Proses", "Selesai"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === s ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >{s}</button>
            ))}
          </div>
          <div className="ml-auto text-xs text-slate-400 font-medium">{filtered.length} riwayat</div>
        </div>
        <Table cols={["ID", "Tanggal", "Pelanggan", "Kendaraan", "Layanan", "Total", "Status", "Aksi"]}>
          {filtered.map(t => {
            const plg = pelangganList.find(p => p.id === t.pelangganId);
            const knd = kendaraanList.find(k => k.id === t.kendaraanId);
            const layananNames = t.details.map(d => layananList.find(l => l.id === d.layananId)?.nama ?? "").filter(Boolean).join(", ");
            return (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono font-semibold text-blue-600">{t.id}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.tanggal}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">{plg?.nama}</td>
                <td className="px-4 py-3"><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">{knd?.nopol}</span></td>
                <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate">{layananNames}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(t.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => setDetail(t)} className={btnEdit}><Eye size={13} />Lihat</button>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Riwayat — ${detail?.id}`} wide>
        {detail && (() => {
          const plg = pelangganList.find(p => p.id === detail.pelangganId);
          const knd = kendaraanList.find(k => k.id === detail.kendaraanId);
          return (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 font-semibold mb-1">Pelanggan</p><p className="font-bold text-slate-800">{plg?.nama}</p><p className="text-xs text-slate-400">{plg?.email}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 font-semibold mb-1">Kendaraan</p><p className="font-bold font-mono text-slate-800">{knd?.nopol}</p><p className="text-xs text-slate-400">{knd?.merk}</p></div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Layanan Dikerjakan</p>
                {detail.details.map((d, i) => {
                  const l = layananList.find(x => x.id === d.layananId);
                  return (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-700">{l?.nama}</span>
                      <span className="font-bold text-slate-800">{fmt(d.subtotal)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between py-2 font-bold">
                  <span className="text-slate-700">Total</span>
                  <span className="text-blue-600">{fmt(detail.total)}</span>
                </div>
              </div>
              {detail.catatan && <p className="text-xs text-slate-500 italic bg-slate-50 rounded-lg p-3">{detail.catatan}</p>}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// LAPORAN PAGE
// ─────────────────────────────────────────────
function LaporanPage({ transaksiList, pelangganList, layananList, produkList }: {
  transaksiList: Transaksi[]; pelangganList: Pelanggan[]; layananList: Layanan[]; produkList: Produk[];
}) {
  const [tab, setTab] = useState<"pendapatan" | "layanan" | "produk">("pendapatan");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const totalRevenue = revenueData.reduce((a, b) => a + b.pendapatan, 0);
  const avgMonthly = totalRevenue / 12;
  const bestMonth = revenueData.reduce((a, b) => b.pendapatan > a.pendapatan ? b : a);

  return (
    <div>
      <PageHeader
        title="Laporan & Analitik"
        subtitle="Ringkasan performa bisnis bengkel"
        action={
          <div className="flex gap-2">
            <button className={btnSecondary}><Printer size={14} />Export PDF</button>
            <button className={btnPrimary}><Download size={14} />Export Excel</button>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Total Pendapatan</p>
          <p className="text-xl font-bold text-slate-800">{fmtShort(totalRevenue)}</p>
          <p className="text-xs text-emerald-500 mt-0.5">Tahun 2024</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Rata-rata Bulanan</p>
          <p className="text-xl font-bold text-slate-800">{fmtShort(avgMonthly)}</p>
          <p className="text-xs text-blue-500 mt-0.5">per bulan</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Bulan Terbaik</p>
          <p className="text-xl font-bold text-slate-800">{bestMonth.bulan}</p>
          <p className="text-xs text-emerald-500 mt-0.5">{fmtShort(bestMonth.pendapatan)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Total Service</p>
          <p className="text-xl font-bold text-slate-800">{transaksiList.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">semua status</p>
        </div>
      </div>

      {/* Date filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex items-center gap-4 flex-wrap">
        <Calendar size={16} className="text-slate-400" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Dari</span>
          <input type="date" className={`${inputCls} w-36`} value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sampai</span>
          <input type="date" className={`${inputCls} w-36`} value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button className={btnPrimary}><Filter size={14} />Terapkan Filter</button>
        <div className="ml-auto flex gap-1 bg-slate-100 rounded-lg p-1">
          {([["pendapatan", "Pendapatan"], ["layanan", "Layanan"], ["produk", "Produk Terlaris"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${tab === id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >{label}</button>
          ))}
        </div>
      </div>

      {tab === "pendapatan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Grafik Pendapatan Bulanan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v / 1e6).toFixed(0)}jt`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [fmt(v), "Pendapatan"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="pendapatan" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Tabel Bulanan</h3>
            <div className="space-y-2">
              {revenueData.map((d, i) => (
                <div key={d.bulan} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                    <span className="text-sm font-medium text-slate-700">{d.bulan}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">{fmtShort(d.pendapatan)}</span>
                    {d.bulan === bestMonth.bulan && <span className="ml-2 text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">Terbaik</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "layanan" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Grafik Layanan Terpopuler</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={serviceUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Tabel Frekuensi Layanan</h3>
            <div className="space-y-3">
              {serviceUsageData.sort((a, b) => b.count - a.count).map((d, i) => {
                const pct = Math.round((d.count / serviceUsageData[0].count) * 100);
                return (
                  <div key={d.name}>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700"><span className="text-slate-400 mr-2">#{i + 1}</span>{d.name}</span>
                      <span className="text-slate-800 font-bold">{d.count}x</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "produk" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Table cols={["Ranking", "Nama Produk", "Kategori", "Harga", "Stok Tersisa", "Status Stok"]}>
            {produkList.sort((a, b) => a.stok - b.stok).map((p, i) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`text-sm font-bold ${i < 3 ? "text-amber-500" : "text-slate-400"}`}>#{i + 1}</span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">{p.nama}</td>
                <td className="px-4 py-3"><StatusBadge status={p.jenis} /></td>
                <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(p.harga)}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-800">{p.stok}</td>
                <td className="px-4 py-3">
                  {p.stok <= 5
                    ? <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit"><AlertTriangle size={10} />Kritis</span>
                    : p.stok <= 10
                      ? <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit"><AlertCircle size={10} />Menipis</span>
                      : <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit"><CheckCircle size={10} />Aman</span>
                  }
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Shared state (so pages can reference each other's data)
  const [pelanggan] = useState<Pelanggan[]>(seedPelanggan);
  const [kendaraan] = useState<Kendaraan[]>(seedKendaraan);
  const [transaksi] = useState<Transaksi[]>(seedTransaksi);
  const [layanan] = useState<Layanan[]>(seedLayanan);
  const [produk] = useState<Produk[]>(seedProduk);
  const [montir] = useState<Montir[]>(seedMontir);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar
        current={currentPage}
        onNavigate={p => { setCurrentPage(p); setSidebarOpen(false); }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          current={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={() => setIsLoggedIn(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          {currentPage === "dashboard" && (
            <DashboardPage pelanggan={pelanggan} kendaraan={kendaraan} transaksi={transaksi} />
          )}
          {currentPage === "pelanggan" && <PelangganPage />}
          {currentPage === "kendaraan" && <KendaraanPage pelangganList={pelanggan} />}
          {currentPage === "montir" && <MontirPage />}
          {currentPage === "layanan" && <LayananPage />}
          {currentPage === "produk" && <ProdukPage />}
          {currentPage === "transaksi" && (
            <TransaksiPage
              pelangganList={pelanggan}
              kendaraanList={kendaraan}
              layananList={layanan}
              montirList={montir}
            />
          )}
          {currentPage === "pembayaran" && (
            <PembayaranPage transaksiList={transaksi} pelangganList={pelanggan} />
          )}
          {currentPage === "riwayat" && (
            <RiwayatPage
              transaksiList={transaksi}
              pelangganList={pelanggan}
              kendaraanList={kendaraan}
              layananList={layanan}
            />
          )}
          {currentPage === "laporan" && (
            <LaporanPage
              transaksiList={transaksi}
              pelangganList={pelanggan}
              layananList={layanan}
              produkList={produk}
            />
          )}
        </main>
      </div>
    </div>
  );
}
