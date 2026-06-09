import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useStatsStore } from '@/store/statsStore';

// Lazy load pages for code splitting
const Home = React.lazy(() => import('@/pages/Home'));
const GamePage = React.lazy(() => import('@/pages/GamePage'));
const Statistics = React.lazy(() => import('@/pages/Statistics'));
const Settings = React.lazy(() => import('@/pages/Settings'));

function AppInitializer({ children }: { children: React.ReactNode }) {
  const init = useAppStore((s) => s.init);
  const initStats = useStatsStore((s) => s.init);
  const isLoaded = useAppStore((s) => s.isLoaded);

  useEffect(() => {
    init();
    initStats();
  }, [init, initStats]);

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--paper-bg)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--paper-text)]" />
          <p className="font-display text-lg text-[var(--paper-text)]">Memuat...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Suspense
          fallback={
            <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--paper-bg)]">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--paper-text)]" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tic-tac-toe" element={<GamePage />} />
            <Route path="/snake" element={<GamePage />} />
            <Route path="/number-duel" element={<GamePage />} />
            <Route path="/sambung-kata" element={<GamePage />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppInitializer>
    </BrowserRouter>
  );
}

export default App;
