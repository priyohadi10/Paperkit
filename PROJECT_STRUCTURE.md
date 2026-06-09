# Project Structure

```
paper-arcade/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── favicon.svg            # Favicon
│   ├── icon-192.png           # PWA icon (192x192)
│   ├── icon-512.png           # PWA icon (512x512)
│   └── apple-touch-icon.png   # iOS icon
│
├── src/
│   ├── components/
│   │   ├── paper/             # Reusable Paper UI components
│   │   │   ├── PaperButton.tsx
│   │   │   ├── PaperCard.tsx
│   │   │   ├── PaperInput.tsx
│   │   │   ├── PaperTitle.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── DoodleDecoration.tsx
│   │   └── ui/                # shadcn/ui components
│   │
│   ├── games/                 # Game implementations
│   │   ├── tic-tac-toe/
│   │   │   └── TicTacToeGame.tsx
│   │   ├── snake/
│   │   │   └── SnakeGame.tsx
│   │   ├── number-duel/
│   │   │   └── NumberDuelGame.tsx
│   │   └── sambung-kata/
│   │       └── SambungKataGame.tsx
│   │
│   ├── pages/                 # Route pages
│   │   ├── Home.tsx
│   │   ├── GamePage.tsx
│   │   ├── Statistics.tsx
│   │   └── Settings.tsx
│   │
│   ├── store/                 # Zustand stores
│   │   ├── appStore.ts        # App settings (theme, sound)
│   │   ├── statsStore.ts      # Game statistics
│   │   ├── ticTacToeStore.ts  # Tic Tac Toe game state
│   │   ├── snakeStore.ts      # Snake game state
│   │   ├── duelStore.ts       # Number Duel game state
│   │   └── sambungKataStore.ts # Sambung Kata game state
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── indexedDB.ts       # IndexedDB operations
│   │   ├── localStorage.ts    # LocalStorage helpers
│   │   └── kbbiData.ts        # KBBI word dataset
│   │
│   ├── App.tsx                # Root component with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .gitignore
├── README.md
├── DEPLOYMENT.md
└── PROJECT_STRUCTURE.md
```

## Architecture

### State Management
- **Zustand** for global state (settings, statistics, game states)
- **IndexedDB** for persistent storage (statistics, history)
- **LocalStorage** for fallback and simple settings

### Routing
- **React Router** with lazy-loaded routes
- Code splitting per game for optimal performance

### Design System
- **Paper Kit** aesthetic with hand-drawn elements
- **Monochrome** color palette
- **Thick borders** and **paper shadows**
- Custom Tailwind theme extensions

### Offline Support
- **vite-plugin-pwa** for service worker
- **IndexedDB** for local data storage
- **Manifest.json** for PWA installability
- All assets cached for offline use

### Data Flow
```
User Action → Zustand Store → IndexedDB/LocalStorage → UI Update
```

### Game Architecture
Each game follows a consistent pattern:
1. **Store** — Zustand store for game state and logic
2. **Component** — React component for UI rendering
3. **Lazy Loading** — Games loaded on demand via code splitting
