# Revisi Portfolio Ferdi Hassan — Desain

Tanggal: 2026-11-18
Status: draft, menunggu persetujuan

## Intent & alasan

Situs ini adalah portfolio profesional Ferdi Hassan (mahasiswa Sistem Informasi, fokus strategy / consulting / digital transformation). Pembaca utamanya rekruter dan orang profesional yang menilai Ferdi, sering dalam waktu singkat dan sering dari HP. Klien memberi tujuh permintaan revisi; inti terbesarnya adalah mengubah bagian Work dari slide tiruan menjadi deck PDF asli yang bisa di-scroll, plus halaman detail tersendiri per proyek.

Konten final (foto, CV, PDF proyek, link sosial, teks detail) akan diisi sendiri oleh klien. Tugas kita: membangun strukturnya dengan placeholder yang jelas dan mudah diganti.

## Goals

1. Navbar mengikuti urutan section di halaman: **ABOUT → WORK → APPROACH → EXPERIENCE → CONTACT**.
2. Tombol **Download CV** di navbar.
3. Hero kanan menampilkan **foto Ferdi** (placeholder dulu).
4. Teks di card About kiri ("Information Systems gave me…", `.about-note p`, sekarang 29px) **dikecilkan**.
5. Work: klik card → **popup preview** berisi PDF yang bisa di-scroll + tombol **"Lihat detail lengkap"** → **halaman detail** `/work/:id` dengan layout split.
6. Experience: **tombol panah dihapus**.
7. Contact: tambah link **GitHub, LinkedIn, Instagram**.
8. Semua di atas **responsif dan nyaman dipakai** di HP, tablet, dan desktop — termasuk PDF yang benar-benar tampil dan bisa di-scroll di iOS Safari dan Chrome Android.

## Non-goals

- Mengganti identitas visual (palet, font, gaya kartu) — tetap memakai sistem di `src/styles.css`.
- CMS / admin panel. Konten tetap di kode (array data).
- Menulis konten final klien.
- Melakukan deploy ke Vercel (cukup disiapkan konfigurasinya).

## Anti-goals (gagal walau "jalan")

- PDF tidak tampil atau hanya halaman pertama di HP.
- Konten palsu yang terlihat seperti konten asli (slide tiruan dengan klaim generik) tetap tayang di portfolio profesional.
- Klien kesulitan mengganti placeholder (harus mengedit banyak tempat atau menjalankan skrip konversi).
- Halaman utama jadi lambat karena library PDF ikut dimuat di awal.
- Link `/work/:id` 404 saat di-refresh atau dibuka langsung.

## Constraints

- Stack yang ada: Vite 8.3.8 + React 19.2.8 + lucide-react, versi di-pin exact. Library baru juga di-pin exact.
- Satu-satunya PDF asli saat ini: `public/projects/kita-ngantuk-gmbcc-semifinal.pdf` (41 halaman), dipasang ke proyek "Consumer Strategy Lab".
- Navbar memakai anchor hash (`#about`, `#work`, …) untuk scroll di halaman utama.
- Breakpoint yang ada: 980px dan 680px.
- Hosting: **Vercel**, di root domain (bukan sub-path). Path aset absolut (`/projects/…`) tetap valid.
- Bahasa UI: **Inggris**, mengikuti seluruh situs (`lang="en"`). Label di dokumen ini yang ditulis dalam bahasa Indonesia hanya deskripsi; teks UI final berbahasa Inggris (mis. "VIEW FULL CASE →", "← Back to Work", "Deck coming soon", "Project not found", "Couldn't load the PDF").
- PDF Kita Ngantuk berukuran 54 MB dan tidak linearized — terlalu berat untuk HP (download lama, risiko crash memori di iOS Safari).

## Approaches

### Alur Work
- **A. Popup preview → halaman detail (dipilih).** Cocok dengan kata "preview" dari klien; pengunjung bisa mengintip dulu.
- B. Card langsung ke halaman detail, tanpa popup. Lebih sederhana tapi tidak sesuai permintaan klien.

### Layout halaman detail
- A. Editorial: cerita (Konteks → Peran → Hasil) lalu PDF di bawah.
- **B. Split (dipilih oleh partner):** panel info di kiri yang sticky, PDF jadi fokus di kanan. Di HP, panel info pindah ke atas PDF.

### Routing
- **React Router, URL bersih `/work/:id` (satu-satunya opsi yang masuk akal).** Hash routing (`/#/work/…`) bentrok dengan anchor navbar `#about`/`#work`. Konsekuensi: hosting butuh aturan SPA rewrite.

### Render PDF
- **A. PDF.js via `react-pdf` (dipilih).** Tampil konsisten di semua browser termasuk mobile; halaman di-render lazy; klien cukup taruh file PDF. Tambahan ~1 MB yang hanya dimuat saat PDF dibuka.
- B. Viewer bawaan browser via `<iframe>` (yang sekarang). Nol dependensi, tapi rusak di iOS/Android.
- C. Konversi PDF → gambar per halaman. Cepat, tapi klien harus menjalankan skrip setiap ganti PDF.

## Desain

### Data proyek
Pindahkan array `projects` dan data situs lain ke satu file data (mis. `src/data/`), supaya klien hanya mengedit satu tempat. Setiap proyek:

```js
{
  id: 'ocean-health',            // dipakai di URL /work/ocean-health
  type, industry, title, year, summary, role, accent,
  context: '…placeholder…',
  outcome: '…placeholder…',
  pdf: { src: '/projects/xxx.pdf' } | null,
  draft: false,                  // true = disembunyikan dari grid & halaman detail
}
```

- Field `draft` memungkinkan klien menyembunyikan proyek yang belum siap. Untuk sekarang kelima proyek tetap `draft: false` (tampil), karena belum dipastikan mana yang contoh. *(Keputusan Claude.)*
- Judul "Consumer Strategy Lab" dibiarkan; klien yang menggantinya agar sesuai deck Kita Ngantuk. Ditandai di README. *(Keputusan Claude.)*

- `slides` (slide tiruan) dihapus dari data dan UI.
- Jumlah halaman PDF dibaca otomatis oleh PDF.js; field `pages` tidak lagi diperlukan.
- Chip di `ProjectVisual` yang sekarang diambil dari judul slide perlu sumber lain (mis. dari `role` atau field `tags`) — keputusan builder.

Data situs lain yang juga jadi placeholder di file data yang sama: path foto, path CV, URL GitHub/LinkedIn/Instagram, email.

### Navbar
- Urutan link: ABOUT, WORK, APPROACH, EXPERIENCE, CONTACT.
- Tombol "VIEW MY WORK" di kanan navbar **diganti** "DOWNLOAD CV" (`<a href download>` ke `public/cv/…pdf`). *(Usulan Claude: hero sudah punya CTA "Explore my work", jadi CTA navbar lebih berguna untuk CV.)*
- Di ≤980px, tombol CV juga ikut muncul di menu hamburger.
- Di halaman detail, link navbar tetap bekerja: membawa kembali ke halaman utama lalu scroll ke section terkait.

### Hero
- Isi `.hero-portrait` (cincin, orb, inisial "FH") diganti `<img>` foto dengan `object-fit: cover`, `alt` deskriptif. Kartu, rotasi, dan label di sekitarnya boleh dipertahankan bila tetap rapi dengan foto.
- Placeholder: gambar netral di `public/images/` yang jelas terlihat sebagai placeholder.

### About
- `.about-note p` dikecilkan (dari 29px; ukuran pasti keputusan builder, mis. ~20–22px desktop) dan tetap proporsional di breakpoint mobile.

### Popup preview (Work)
- Kiri: type, year, title, summary, tags (seperti sekarang). Progress bar slide & thumbnail dihapus.
- Kanan: PDF viewer yang bisa di-scroll vertikal (semua halaman).
- Tombol **"LIHAT DETAIL LENGKAP →"** ke `/work/:id`.
- Tetap: tutup dengan ×, klik backdrop, dan Escape.
- Proyek tanpa PDF: kotak "Deck segera tersedia".

### Halaman detail `/work/:id`
- "← Kembali ke Work" (ke `/#work`).
- Layout split: panel kiri sticky (type · year, title, summary, industry, role, context, outcome); kanan PDF viewer + tombol Download PDF.
- Bawah: navigasi proyek sebelumnya / berikutnya.
- ≤980px: satu kolom, panel info di atas PDF, tidak sticky.
- `id` tidak dikenal → tampilan "Proyek tidak ditemukan" + link ke Work.
- Saat masuk halaman, scroll ke atas; `<title>` dokumen mengikuti judul proyek.

### PDF viewer (komponen bersama)
- Dipakai di popup dan halaman detail.
- `react-pdf` di-load secara lazy (dynamic import) hanya saat viewer tampil.
- Lebar halaman mengikuti lebar container (responsif, juga saat resize/rotasi).
- Halaman di-render saat mendekati viewport (deck 41 halaman tidak dirender sekaligus).
- State loading dan error (mis. "PDF gagal dimuat — Download PDF").

### Experience
- Hapus elemen `.experience-arrow` dan sesuaikan grid agar tidak menyisakan kolom kosong.

### Contact
- Tambah link GitHub, LinkedIn, Instagram (ikon + label), buka di tab baru (`target="_blank" rel="noopener noreferrer"`), URL placeholder dari file data.

### Ukuran PDF
- Kompres + linearize PDF Kita Ngantuk **sekali** (oleh kita, bukan skrip yang dijalankan klien), target < ~10 MB, dengan kualitas visual dicek sebelum dipakai. Tools: `qpdf` + `ghostscript` via Homebrew. *(Keputusan Claude.)*
- PDF.js memakai range request (didukung Vercel untuk file statis), sehingga PDF linearized dimuat bertahap per halaman.
- README menetapkan batas ukuran untuk PDF yang diunggah klien nanti dan cara mengompresnya.

### Hosting
- Vercel. Sertakan `vercel.json` dengan SPA rewrite agar `/work/:id` tidak 404 saat di-refresh, tanpa mengganggu file statis (`/projects/*.pdf`, `/cv/*`, `/images/*`).

### Dokumentasi
- Perbarui `README.md`: cara mengganti foto, CV, PDF proyek, teks detail, dan link sosial. README sekarang juga keliru soal navigasi PDF — harus disesuaikan dengan perilaku baru.

## Diputuskan partner
- Alur Work: popup preview → halaman detail.
- Layout detail: split.
- Render PDF: PDF.js (`react-pdf`).
- Placeholder untuk semua aset; klien mengganti sendiri.
- Responsif lintas device adalah prioritas.
- Hosting: Vercel.

## Keputusan Claude (bisa dikoreksi)
- Teks UI baru berbahasa Inggris.
- PDF 54 MB dikompres + linearize sekali (install `qpdf` + `ghostscript`).
- Kelima proyek tetap tampil; field `draft` disediakan untuk menyembunyikan proyek.
- Judul "Consumer Strategy Lab" tidak diubah, diserahkan ke klien.
- React Router dengan URL bersih (hash routing bentrok dengan anchor).
- Slide tiruan dihapus; proyek tanpa PDF menampilkan "Deck segera tersedia".
- Field detail: context dan outcome (selain field yang sudah ada).
- Tombol Download PDF di halaman detail.
- CTA navbar "View my work" diganti "Download CV".

## Diserahkan ke builder
- Struktur file/komponen, nama komponen, dan pemisahan CSS.
- Ukuran font About yang tepat, sumber chip di card proyek.
- Gaya visual placeholder dan state loading/error, selama mengikuti sistem desain yang ada.
- Cara verifikasi responsif (mis. Playwright di beberapa ukuran viewport).
