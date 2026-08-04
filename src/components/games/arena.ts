import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';

/**
 * Shared responsive play-area sizing.
 *
 * Height scales with both viewport height and width so the arena stays
 * proportional on ultrawide monitors (capped) and short/narrow desktop
 * windows (never taller than the visible area).
 */
export const ARENA_CLASS = 'relative w-full mx-auto overflow-hidden rounded-xl';

export const ARENA_STYLE: CSSProperties = {
  height: 'clamp(320px, min(60vh, 44vw), 720px)',
  maxWidth: 'min(100%, 1400px)',
};

/** Play surface for text/typing modes: readable line length on ultrawide. */
export const TEXT_ARENA_STYLE: CSSProperties = {
  maxWidth: 'min(100%, 1100px)',
  marginInline: 'auto',
};

export function useArenaSize(ref: RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 900, height: 520 });
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const w = el.clientWidth || 900;
      const h = el.clientHeight || 520;
      setSize(prev => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    window.addEventListener('resize', read);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', read);
    };
  }, [ref]);

  return { size, sizeRef };
}
