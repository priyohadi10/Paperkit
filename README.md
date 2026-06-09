# Paper Arcade

Koleksi game offline dengan desain Paper Kit yang menyenangkan. Dapat dimainkan kapan saja, di mana saja — tanpa internet!

## Game yang Tersedia

| Game | Pemain | Deskripsi |
|------|--------|-----------|
| **Tic Tac Toe** | 2 Pemain | Permainan klasik X dan O di papan 3x3 |
| **Ular** | 1 Pemain | Kendalikan ular, makan makanan, jangan nabrak! |
| **Number Duel** | 2 Pemain | Tebak angka rahasia lawan dengan petunjuk terlalu tinggi/rendah |
| **Sambung Kata** | 2-10 Pemain | Sambung kata sesuai KBBI dengan timer dan sistem eliminasi |

## Fitur

- **100% Offline** — Tanpa koneksi internet
- **Installable PWA** — Install ke homescreen seperti app native
- **Dark Mode** — Tema gelap untuk kenyamanan mata
- **Statistik** — Lacak performa permainan
- **Tanpa Iklan** — Pengalaman bermain tanpa gangguan
- **Responsive** — Optimal di mobile dan desktop
- **Paper Kit Design** — Desain hand-drawn yang playful

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3
- Zustand (State Management)
- IndexedDB + LocalStorage (Persistence)
- vite-plugin-pwa (PWA Support)

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deploy ke Vercel

1. Push repository ke GitHub
2. Hubungkan ke Vercel
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`

## Lisensi

MIT License
