# OSIS Akademi Prestasi — Manajemen Proyek

Aplikasi web manajemen proyek untuk Divisi Akademi Prestasi OSIS. Dibangun dengan **Next.js 16**, **TypeScript**, **Tailwind CSS**, dan **Supabase**.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend & API | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Backend & Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

## Fitur

### Sisi Publik (Tanpa Login)
- **Beranda** — Hero section, statistik, pengumuman terbaru
- **Katalog Proyek** — Grid/Card dengan search dan filter (Lomba, Tugas, Event)
- **Detail Proyek** — Deskripsi, countdown timer, unduh lampiran, form pengumpulan
- **Sistem Resi** — Siswa mendapat ID Pengumpulan (contoh: `AKT-9281`)
- **Cek Status** — Masukkan ID untuk melihat status (Pending/Diterima/Ditolak)
- **Leaderboard & Hall of Fame** — Karya terbaik dan papan peringkat

### Sisi Admin (Login Required)
- **Dashboard** — Analitik sederhana (total proyek, submission menunggu, partisipan)
- **Manajemen Proyek** — CRUD proyek dengan deadline dan lampiran
- **Review Center** — Validasi submission (Terima/Tolak), otomatis update leaderboard
- **Export CSV** — Unduh data submission untuk pelaporan
- **Manajemen Artikel** — CRUD berita dan pengumuman

## 🚀 Apa yang Harus Disiapkan untuk Deploy?

Anda membutuhkan **3 akun gratis** berikut:

| # | Layanan | Fungsi | Link |
|---|---------|--------|------|
| 1 | **GitHub** | Menyimpan source code | [github.com](https://github.com) |
| 2 | **Supabase** | Database & file storage | [supabase.com](https://supabase.com) |
| 3 | **Vercel** | Hosting website | [vercel.com](https://vercel.com) |

> 📖 **Panduan lengkap step-by-step tersedia di [`DEPLOYMENT.md`](./DEPLOYMENT.md)** — termasuk cara setup Supabase, konfigurasi environment variables, dan deploy ke Vercel.

### Quick Start (Lokal)

```bash
git clone https://github.com/zhafran12382/OSIS_AP.git
cd OSIS_AP
npm install
cp .env.example .env.local   # Edit dan isi dengan kredensial Supabase Anda
npm run dev                   # Buka http://localhost:3000
```

### Environment Variables

| Variable | Wajib? | Keterangan |
|----------|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public API key Supabase |
| `ADMIN_USERNAME` | ❌ | Default: `AdminNFBS` |
| `ADMIN_PASSWORD` | ❌ | Default: `admin` |

> ⚠️ Untuk production, **wajib ubah** `ADMIN_PASSWORD` via environment variables di Vercel.

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx                    # Beranda
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles (monochrome theme)
│   ├── projects/
│   │   ├── page.tsx                # Katalog Proyek
│   │   └── [id]/page.tsx           # Detail Proyek + Form Submission
│   ├── check-status/page.tsx       # Cek Status Pengumpulan
│   ├── leaderboard/page.tsx        # Leaderboard & Hall of Fame
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout wrapper
│   │   ├── page.tsx                # Dashboard Admin
│   │   ├── login/page.tsx          # Login Admin
│   │   ├── projects/
│   │   │   ├── page.tsx            # Daftar Proyek
│   │   │   ├── new/page.tsx        # Tambah Proyek
│   │   │   └── [id]/page.tsx       # Edit Proyek
│   │   ├── submissions/page.tsx    # Review Center
│   │   └── articles/
│   │       ├── page.tsx            # Daftar Artikel
│   │       └── new/page.tsx        # Tambah Artikel
│   └── api/
│       └── auth/route.ts           # API autentikasi admin
├── components/
│   ├── admin-layout.tsx            # Layout sidebar admin
│   ├── bottom-nav.tsx              # Bottom navigation mobile
│   ├── countdown-timer.tsx         # Countdown timer
│   ├── project-card.tsx            # Card proyek
│   └── status-badge.tsx            # Badge status submission
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # Utility functions
└── middleware.ts                    # Auth middleware for /admin
```

## Database Schema

Lihat file `supabase-schema.sql` untuk skema lengkap. Tabel utama:

- **projects** — Proyek/tugas yang dibuat admin
- **submissions** — Karya yang dikirim siswa (auto-generate ID seperti `AKT-XXXX`)
- **leaderboard** — Peringkat siswa berdasarkan poin
- **articles** — Berita dan pengumuman

## Desain

- **Device Target:** Mobile-first, dioptimalkan untuk Samsung Galaxy Tab A9 (800×1340px)
- **Tema:** Monochrome (Hitam, Putih, Abu-abu) — tanpa warna neon
- **Tipografi:** Geist Sans
- **Touch Target:** Minimal 44×44px
- **Navigation:** Bottom navigation bar untuk siswa
