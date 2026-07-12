import { useEffect, useRef, useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';

/**
 * Wraps a game with:
 *  - Fullscreen toggle button (per-game)
 *  - Keyboard shortcuts: Enter (or Shift+Enter when inside an input) to restart,
 *    Esc to exit fullscreen (browser default + explicit call).
 *  - A visible shortcut hint bar.
 *
 * Games opt in to restart by listening for the global `game:restart` event.
 */
export default function GameShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);

  useEffect(() => {
    let retryTimers: number[] = [];
    const clearRetries = () => {
      retryTimers.forEach((id) => window.clearTimeout(id));
      retryTimers = [];
    };

    const focusTypingField = () => {
      const root = ref.current;
      if (!root) return false;
      // Prefer visible typing fields; fall back to any input/textarea (e.g. Monkey's hidden input)
      const candidates = Array.from(
        root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          'textarea, input[type="text"], input:not([type]), input'
        )
      ).filter((el) => !el.disabled && !el.readOnly);
      const el = candidates[0];
      if (!el) return false;

      el.focus({ preventScroll: true });
      try {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      } catch {
        /* some input types don't support selection */
      }
      try {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } catch {
        /* ignore */
      }
      return document.activeElement === el;
    };

    const onChange = () => {
      const isFs = document.fullscreenElement === ref.current;
      setFs(isFs);
      clearRetries();
      if (!isFs) return;

      // The fullscreen transition can still be settling when fullscreenchange fires.
      // Retry focus a few times across frames until the active element sticks.
      const attempt = (remaining: number) => {
        requestAnimationFrame(() => {
          const ok = focusTypingField();
          if (!ok && remaining > 0) {
            retryTimers.push(
              window.setTimeout(() => attempt(remaining - 1), 60)
            );
          }
        });
      };
      attempt(8);
    };

    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      clearRetries();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const el = e.target as HTMLElement | null;
        const tag = el?.tagName;
        const inField = tag === 'INPUT' || tag === 'TEXTAREA';
        // Enter restarts globally, but only Shift+Enter inside a typing field
        if (!inField || e.shiftKey) {
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('game:restart'));
        }
      } else if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggle = async () => {
    try {
      if (!document.fullscreenElement) await ref.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  };

  const triggerRestart = () =>
    document.dispatchEvent(new CustomEvent('game:restart'));

  return (
    <div
      ref={ref}
      className={
        fs
          ? 'w-screen h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 overflow-auto'
          : ''
      }
    >
      <div className="flex flex-wrap items-center justify-end gap-2 mb-3">
        <span className="text-xs text-muted-foreground hidden md:inline">
          <kbd className="px-1.5 py-0.5 border rounded bg-white text-[10px]">Enter</kbd>{' '}
          restart ·{' '}
          <kbd className="px-1.5 py-0.5 border rounded bg-white text-[10px]">Shift+Enter</kbd>{' '}
          restart while typing ·{' '}
          <kbd className="px-1.5 py-0.5 border rounded bg-white text-[10px]">Esc</kbd>{' '}
          exit fullscreen
        </span>
        <Button size="sm" variant="outline" onClick={triggerRestart} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Restart
        </Button>
        <Button size="sm" variant="outline" onClick={toggle} className="gap-2">
          {fs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          {fs ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>
      {children}
    </div>
  );
}

/** Hook: run `handler` whenever the shell requests a restart. */
export function useGameRestart(handler: () => void) {
  useEffect(() => {
    const h = () => handler();
    document.addEventListener('game:restart', h);
    return () => document.removeEventListener('game:restart', h);
  }, [handler]);
}
