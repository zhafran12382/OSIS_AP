# 🚀 Panduan Deployment — OSIS Akademi Prestasi

Panduan lengkap langkah demi langkah untuk men-deploy aplikasi OSIS AP dari nol hingga online.

---

## 📋 Daftar Persiapan (Checklist)

Sebelum mulai, pastikan Anda sudah menyiapkan hal-hal berikut:

| # | Yang Dibutuhkan | Keterangan | Gratis? |
|---|-----------------|------------|---------|
| 1 | **Akun GitHub** | Untuk menyimpan source code | ✅ Ya |
| 2 | **Akun Supabase** | Untuk database & file storage | ✅ Ya (Free Tier) |
| 3 | **Akun Vercel** atau **Netlify** | Untuk hosting website (pilih salah satu) | ✅ Ya |
| 4 | **Node.js v18+** | Untuk development lokal (opsional) | ✅ Ya |
| 5 | **Git** | Untuk mengelola source code | ✅ Ya |

> 💡 **Semua layanan di atas gratis** untuk skala proyek OSIS. Tidak perlu kartu kredit.

---

## Langkah 1: Fork / Clone Repository

### Opsi A: Fork di GitHub (Disarankan)
1. Buka https://github.com/zhafran12382/OSIS_AP
2. Klik tombol **"Fork"** di kanan atas.
3. Repository akan tercopy ke akun GitHub Anda.

### Opsi B: Clone ke komputer lokal
```bash
git clone https://github.com/zhafran12382/OSIS_AP.git
cd OSIS_AP
npm install
```

---

## Langkah 2: Setup Supabase (Database)

### 2.1 — Buat Akun & Project Baru

1. Buka [supabase.com](https://supabase.com) → klik **"Start your project"**.
2. Login menggunakan akun **GitHub** (tercepat).
3. Klik **"New Project"**.
4. Isi form:
   - **Name:** `osis-ap` (atau nama apapun)
   - **Database Password:** Buat password yang kuat, **catat dan simpan!**
   - **Region:** Pilih yang terdekat (misal: `Southeast Asia (Singapore)`)
5. Klik **"Create new project"** → tunggu 1–2 menit hingga selesai.

### 2.2 — Buat Tabel Database

1. Di dashboard Supabase, klik **"SQL Editor"** di sidebar kiri.
2. Klik **"New Query"**.
3. Buka file `supabase-schema.sql` dari repository ini.
4. **Salin seluruh isi file** tersebut, lalu **paste** ke SQL Editor.
5. Klik **"Run"** (tombol hijau).
6. Pastikan muncul pesan **"Success. No rows returned"** — artinya semua tabel berhasil dibuat.

> ⚠️ **Penting:** Jalankan SQL ini hanya **satu kali**. Jika dijalankan ulang akan error karena tabel sudah ada.

### 2.3 — Buat Storage Bucket (Penyimpanan File)

1. Di sidebar Supabase, klik **"Storage"**.
2. Klik **"New Bucket"**.
3. Isi:
   - **Name:** `attachments`
   - **Public bucket:** ✅ **Aktifkan** (toggle ON)
4. Klik **"Create bucket"**.
5. Setelah bucket dibuat, klik bucket `attachments`.
6. Klik tab **"Policies"** → **"New Policy"**.
7. Buat **3 policy** berikut:

| Policy | Operasi | Target | Definisi |
|--------|---------|--------|----------|
| Allow public download | `SELECT` | `public` | `true` |
| Allow public upload | `INSERT` | `public` | `true` |
| Allow public delete | `DELETE` | `public` | `true` |

> 💡 Untuk kemudahan di lingkungan OSIS, semua operasi diizinkan untuk publik. Untuk keamanan lebih, batasi `INSERT` dan `DELETE` ke `authenticated` saja.

### 2.4 — Salin API Keys

1. Di sidebar Supabase, klik **"Settings"** (ikon gerigi) → **"API"**.
2. Catat **dua nilai** berikut (Anda akan membutuhkannya nanti):

   | Nama | Lokasi | Contoh |
   |------|--------|--------|
   | **Project URL** | Di bagian "Project URL" | `https://abcdefgh.supabase.co` |
   | **anon / public key** | Di bagian "Project API keys" → `anon` `public` | `eyJhbGciOiJIUzI1NiIs...` |

> ⚠️ **Jangan bagikan** `service_role` key ke siapapun. Yang dibutuhkan hanya `anon` key.

---

## Langkah 3: Deploy ke Hosting (Pilih Salah Satu)

> 💡 Anda bisa pilih **Vercel** atau **Netlify**. Keduanya gratis dan mendukung semua fitur aplikasi ini (SSR, API routes, middleware). Fitur yang didapat **sama persis**.

---

### Opsi A: Deploy ke Vercel

#### A.1 — Buat Akun Vercel

1. Buka [vercel.com](https://vercel.com) → klik **"Sign Up"**.
2. Pilih **"Continue with GitHub"** (gunakan akun GitHub yang sama).
3. Izinkan akses ke repository Anda.

#### A.2 — Import Project

1. Di dashboard Vercel, klik **"Add New..."** → **"Project"**.
2. Cari dan pilih repository **`OSIS_AP`** (atau nama fork Anda).
3. Vercel akan otomatis mendeteksi bahwa ini adalah project Next.js.

#### A.3 — Isi Environment Variables

Di halaman konfigurasi sebelum deploy, buka bagian **"Environment Variables"** dan tambahkan:

| Key | Value | Keterangan |
|-----|-------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefgh.supabase.co` | Project URL dari langkah 2.4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Anon key dari langkah 2.4 |
| `ADMIN_USERNAME` | `AdminNFBS` | Username admin (ubah jika perlu) |
| `ADMIN_PASSWORD` | *(password kuat Anda)* | **Wajib diubah** untuk keamanan! |

> 💡 Untuk setiap variable, ketik **Key** di kolom kiri, **Value** di kolom kanan, lalu klik **"Add"**.

#### A.4 — Deploy!

1. Klik **"Deploy"**.
2. Tunggu 1–3 menit hingga proses build selesai.
3. Jika berhasil, Anda akan mendapat URL seperti: `https://osis-ap.vercel.app`
4. 🎉 **Website Anda sudah online!**

---

### Opsi B: Deploy ke Netlify

> 💡 Netlify mendukung **semua fitur** yang sama dengan Vercel untuk aplikasi ini: Server-Side Rendering (SSR), API Routes, Middleware, dan auto-deploy dari GitHub.

#### B.1 — Buat Akun Netlify

1. Buka [netlify.com](https://www.netlify.com) → klik **"Sign up"**.
2. Pilih **"Sign up with GitHub"** (gunakan akun GitHub yang sama).
3. Izinkan akses ke repository Anda.

#### B.2 — Import Project

1. Di dashboard Netlify, klik **"Add new site"** → **"Import an existing project"**.
2. Pilih **"Deploy with GitHub"**.
3. Cari dan pilih repository **`OSIS_AP`** (atau nama fork Anda).
4. Netlify akan otomatis mendeteksi `netlify.toml` dan mengonfigurasi build.

#### B.3 — Isi Environment Variables

Di halaman konfigurasi sebelum deploy, klik **"Add environment variables"** dan tambahkan:

| Key | Value | Keterangan |
|-----|-------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefgh.supabase.co` | Project URL dari langkah 2.4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Anon key dari langkah 2.4 |
| `ADMIN_USERNAME` | `AdminNFBS` | Username admin (ubah jika perlu) |
| `ADMIN_PASSWORD` | *(password kuat Anda)* | **Wajib diubah** untuk keamanan! |

> 💡 Klik **"New variable"** untuk setiap variable, isi **Key** dan **Value**, lalu klik **"Deploy site"**.

#### B.4 — Deploy!

1. Klik **"Deploy site"**.
2. Tunggu 2–4 menit hingga proses build selesai.
3. Jika berhasil, Anda akan mendapat URL seperti: `https://osis-ap.netlify.app`
4. 🎉 **Website Anda sudah online!**

> 📌 **Catatan:** Jika build gagal, pastikan `netlify.toml` sudah ada di repository (file ini sudah disediakan). File ini memberitahu Netlify cara mem-build aplikasi Next.js.

---

## Langkah 4: Verifikasi & Testing

Setelah deploy berhasil, lakukan pengecekan berikut:

### Halaman Publik
- [ ] Buka URL website → tampil halaman **Beranda**
- [ ] Klik **"Lihat Proyek"** → halaman Katalog Proyek tampil
- [ ] Buka halaman **Cek Status** → form input ID tampil
- [ ] Buka halaman **Leaderboard** → halaman peringkat tampil

### Halaman Admin
- [ ] Buka `https://[url-anda]/admin/login` → form login tampil
- [ ] Login dengan username & password yang sudah diatur
- [ ] Dashboard → menampilkan statistik (mungkin 0 karena belum ada data)
- [ ] Coba buat proyek baru dari menu **Projects → Tambah**
- [ ] Coba buat artikel dari menu **Articles → Tambah**

### Test Alur Submission
- [ ] Dari halaman publik, buka salah satu proyek
- [ ] Isi form pengumpulan dan kirim → dapatkan **ID Resi** (misal: `AKT-1234`)
- [ ] Buka halaman **Cek Status** → masukkan ID → status muncul sebagai "Pending"
- [ ] Di Admin, buka **Review Center** → Terima submission → cek Leaderboard terupdate

---

## Langkah 5: Custom Domain (Opsional)

Jika ingin menggunakan domain sendiri (misal: `akademi.osis-sekolah.id`):

### Vercel
1. Di dashboard Vercel → pilih project → **"Settings"** → **"Domains"**.
2. Ketik domain Anda dan klik **"Add"**.
3. Vercel akan memberikan **DNS records** yang perlu Anda tambahkan di provider domain Anda:
   - Tipe: `CNAME`
   - Name: `@` atau subdomain
   - Value: `cname.vercel-dns.com`
4. Tunggu propagasi DNS (biasanya 5–30 menit).
5. Vercel akan otomatis memberikan **SSL/HTTPS** gratis.

### Netlify
1. Di dashboard Netlify → pilih site → **"Domain management"** → **"Add a domain"**.
2. Ketik domain Anda dan klik **"Verify"** → **"Add domain"**.
3. Netlify akan memberikan **DNS records**:
   - Tipe: `CNAME`
   - Name: `@` atau subdomain
   - Value: `[nama-site-anda].netlify.app`
4. Tunggu propagasi DNS (biasanya 5–30 menit).
5. Netlify akan otomatis memberikan **SSL/HTTPS** gratis via Let's Encrypt.

---

## 🔧 Troubleshooting

### "Gagal menambahkan artikel / proyek / tugas"
- **Penyebab utama:** RLS (Row Level Security) policy di Supabase hanya mengizinkan role `authenticated`, padahal aplikasi ini menggunakan `anon` key (autentikasi admin dilakukan oleh middleware aplikasi, bukan Supabase Auth).
- **Solusi:** Jalankan SQL berikut di **Supabase → SQL Editor** untuk memperbarui RLS policy:

```sql
-- Hapus policy lama yang hanya mengizinkan authenticated
DROP POLICY IF EXISTS "projects_insert_auth" ON projects;
DROP POLICY IF EXISTS "projects_update_auth" ON projects;
DROP POLICY IF EXISTS "projects_delete_auth" ON projects;
DROP POLICY IF EXISTS "articles_insert_auth" ON articles;
DROP POLICY IF EXISTS "articles_update_auth" ON articles;
DROP POLICY IF EXISTS "articles_delete_auth" ON articles;
DROP POLICY IF EXISTS "leaderboard_insert_auth" ON leaderboard;
DROP POLICY IF EXISTS "leaderboard_update_auth" ON leaderboard;
DROP POLICY IF EXISTS "leaderboard_delete_auth" ON leaderboard;
DROP POLICY IF EXISTS "submissions_update_auth" ON submissions;
DROP POLICY IF EXISTS "submissions_delete_auth" ON submissions;

-- Buat policy baru yang mengizinkan anon dan authenticated
CREATE POLICY "projects_insert_auth" ON projects FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "projects_update_auth" ON projects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "projects_delete_auth" ON projects FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "articles_insert_auth" ON articles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "articles_update_auth" ON articles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "articles_delete_auth" ON articles FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "leaderboard_insert_auth" ON leaderboard FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "leaderboard_update_auth" ON leaderboard FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "leaderboard_delete_auth" ON leaderboard FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "submissions_update_auth" ON submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "submissions_delete_auth" ON submissions FOR DELETE TO anon, authenticated USING (true);
```

- Setelah menjalankan SQL di atas, coba tambahkan artikel/proyek lagi — seharusnya berhasil.

### "Data tidak muncul / halaman kosong"
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar.
- Cek di Supabase → SQL Editor, jalankan: `SELECT * FROM projects;` — pastikan tabel ada.
- Pastikan RLS policy sudah aktif (ada di `supabase-schema.sql`).

### "Login admin gagal"
- Pastikan environment variable `ADMIN_USERNAME` dan `ADMIN_PASSWORD` sudah diatur di Vercel/Netlify.
- Default credentials: `AdminNFBS` / `admin`.
- Setelah mengubah env var, klik **"Redeploy"** (Vercel) atau **"Trigger deploy"** (Netlify) agar perubahan berlaku.

### "Upload file gagal"
- Pastikan bucket `attachments` sudah dibuat di Supabase Storage.
- Pastikan bucket bersifat **Public**.
- Pastikan policy `INSERT` sudah ditambahkan (lihat langkah 2.3).

### "Build gagal di Vercel"
- Cek log build di Vercel untuk pesan error spesifik.
- Pastikan semua environment variables sudah ditambahkan **sebelum** deploy.
- Coba klik **"Redeploy"** dengan opsi **"Clear Build Cache"**.

### "Build gagal di Netlify"
- Cek log build di Netlify → **"Deploys"** → klik deploy yang gagal.
- Pastikan `netlify.toml` ada di root repository.
- Pastikan semua environment variables sudah ditambahkan sebelum deploy.
- Coba klik **"Trigger deploy"** → **"Clear cache and deploy site"**.

### "Halaman 404 Not Found"
- Pastikan Anda mengakses URL yang benar (misal: `/projects`, `/admin/login`).
- Cek apakah build berhasil di dashboard Vercel/Netlify.

---

## 📊 Batasan Free Tier

| Layanan | Batasan Gratis | Cukup untuk OSIS? |
|---------|----------------|-------------------|
| **Vercel** (Hobby) | 100 GB bandwidth/bulan, unlimited deploys | ✅ Sangat cukup |
| **Netlify** (Starter) | 100 GB bandwidth/bulan, 300 build minutes/bulan | ✅ Sangat cukup |
| **Supabase** (Free) | 500 MB database, 1 GB file storage, 50K API calls/bulan | ✅ Cukup |
| **GitHub** (Free) | Unlimited public repos | ✅ Cukup |

---

## 🔄 Cara Update Website

Setiap kali Anda push perubahan ke branch `main` di GitHub, **Vercel dan Netlify** akan **otomatis re-deploy** website Anda.

```bash
# Edit file yang diinginkan, lalu:
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main
```

Hosting akan otomatis mendeteksi push baru dan memulai proses build ulang (biasanya 1–3 menit).

---

## 📝 Ringkasan Environment Variables

| Variable | Wajib? | Default | Keterangan |
|----------|--------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Ya | — | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Ya | — | Public/anon API key Supabase |
| `ADMIN_USERNAME` | ❌ Opsional | `AdminNFBS` | Username login admin |
| `ADMIN_PASSWORD` | ❌ Opsional | `admin` | Password login admin |

---

*Butuh bantuan? Buka Issue di repository GitHub ini.*
