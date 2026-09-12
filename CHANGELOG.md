# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

---

## [1.1.0] - 2026-09-12

### 🔐 Security & Authentication

#### Ditambahkan
- **NextAuth.js** — Sistem autentikasi lengkap menggunakan Credentials Provider
  - `lib/auth.ts` — Konfigurasi NextAuth dengan JWT strategy
  - `app/api/auth/[...nextauth]/route.ts` — API handler untuk auth
  - `app/login/page.tsx` — Halaman login baru
  - `middleware.ts` — Proteksi route (redirect ke `/login` jika belum login)
- **Variabel env baru**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **`.env.example`** — Template environment variables tanpa kredensial asli

#### Diperbaiki
- Kredensial database di `.env` yang sebelumnya bisa terekspos — ditambahkan `.env.example` sebagai template aman

---

### 🗄️ Database & Prisma

#### Diperbaiki
- **Prisma Client Singleton** — Semua 15 file API route yang menggunakan `new PrismaClient()` sudah diganti ke singleton `import { db } from '@/lib/db'`
  - `app/api/product/route.ts`
  - `app/api/product/[id]/route.ts`
  - `app/api/onsale/route.ts`
  - `app/api/onsale/[id]/route.ts`
  - `app/api/transactions/route.ts`
  - `app/api/transactions/[id]/route.ts`
  - `app/api/dashboard/route.ts`
  - `app/api/favorite/route.ts`
  - `app/api/profit/route.ts`
  - `app/api/productsale/route.ts`
  - `app/api/restock/route.ts`
  - `app/api/restock/[id]/route.ts`
  - `app/api/shopdata/route.ts`
  - `app/api/shopdata/[id]/route.ts`
  - `app/api/storage/route.ts`
- **Dihapus `prisma.$disconnect()`** dari semua API route (berbahaya di serverless/edge, menyebabkan connection pool issues)

#### Diubah
- `prisma/seed.ts` — Ditambahkan pembuatan admin user default (`admin@pos.com` / `admin123`) dan default shop data

---

### 🛒 Business Logic

#### Diperbaiki
- **`POST /api/onsale`** — Stok sekarang berkurang secara atomik saat produk dijual
  - Menggunakan `prisma.$transaction()` untuk memastikan konsistensi data
  - Validasi stok cukup sebelum penjualan (menolak jika stok tidak mencukupi)
- **`POST /api/restock`** — Diubah dari restock massal (semua produk) menjadi restock per produk
  - Sekarang menerima `productId` dan `stock` (jumlah yang ditambahkan)
  - Mengembalikan error 404 jika produk tidak ditemukan
- **`PATCH /api/restock/[id]`** — Ditambahkan null-check untuk `currentProduct` (sebelumnya bisa crash jika produk tidak ada)

#### Ditambahkan
- Validasi Zod di `POST /api/product` — Request body sekarang divalidasi server-side, bukan hanya client-side

---

### 🔧 Code Quality

#### Ditambahkan
- **`lib/api-response.ts`** — Utility terpusat untuk API response
  - `apiSuccess()` — Respons sukses yang konsisten
  - `apiError()` — Respons error yang konsisten (tidak mengekspos detail internal)
  - `getErrorMessage()` — Safely extract error message dari unknown error
  - `isPrismaError()` — Helper untuk cek Prisma error code

#### Diperbaiki
- **TypeScript error handling** — Semua `catch (error: any)` diganti dengan `instanceof Error` check
  - Menghindari penggunaan `any` type
  - Tidak mengekspos `error.message` mentah ke client di production
- **Dihapus `is-online` check di server-side** (`data/product.ts`, `data/records.ts`)
  - `navigator.onLine` tidak valid di server environment — Prisma akan throw error sendiri jika DB tidak bisa diakses
- **Dihapus dead code** — `('use server')` expression statement di `data/product.ts` dan `data/records.ts` yang tidak berfungsi sebagai directive

---

### 📦 Dependencies

#### Ditambahkan
- `next-auth@4` — Framework autentikasi untuk Next.js
- `bcryptjs` — Hashing password
- `@types/bcryptjs` — TypeScript types untuk bcryptjs

---

### ⏳ Ditunda (Planned)
- Penggabungan tabel `ProductStock` + `Product` → terlalu banyak komponen UI terdampak (~20+ file), memerlukan fase refactoring terpisah
- Setup testing framework (Vitest/Jest)
- Unit test untuk logika bisnis
