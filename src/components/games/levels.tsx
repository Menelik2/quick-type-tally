import { Button } from '@/components/ui/button';
import { Gauge } from 'lucide-react';

export type Level = 'easy' | 'medium' | 'hard';

export const LEVELS: Level[] = ['easy', 'medium', 'hard'];

export const LEVEL_LABEL: Record<Level, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const LEVEL_COLOR: Record<Level, string> = {
  easy: 'text-green-600',
  medium: 'text-amber-600',
  hard: 'text-red-600',
};

/** Arcade tuning: speed multiplier, spawn interval multiplier, starting lives/health. */
export const LEVEL_TUNING: Record<Level, { speed: number; spawn: number; lives: number; health: number }> = {
  easy: { speed: 0.7, spawn: 1.35, lives: 7, health: 130 },
  medium: { speed: 1, spawn: 1, lives: 5, health: 100 },
  hard: { speed: 1.5, spawn: 0.7, lives: 3, health: 70 },
};

/** Pick a word subset that matches the level's difficulty by word length. */
export function filterWordsByLevel(bank: string[], level: Level): string[] {
  const picked =
    level === 'easy'
      ? bank.filter((w) => w.length <= 5)
      : level === 'medium'
        ? bank.filter((w) => w.length >= 5 && w.length <= 7)
        : bank.filter((w) => w.length >= 6);
  return picked.length >= 8 ? picked : bank;
}

/** Sort a text/snippet pool by length and take the slice matching the level. */
export function poolByLevel(pool: string[], level: Level): string[] {
  if (pool.length < 3) return pool;
  const sorted = [...pool].sort((a, b) => a.length - b.length);
  const third = Math.max(1, Math.ceil(sorted.length / 3));
  if (level === 'easy') return sorted.slice(0, third);
  if (level === 'hard') return sorted.slice(-third);
  return sorted.slice(third, Math.max(third + 1, sorted.length - third));
}

interface LevelSelectProps {
  value: Level;
  onChange: (level: Level) => void;
  showIcon?: boolean;
}

export function LevelSelect({ value, onChange, showIcon = true }: LevelSelectProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {showIcon && <Gauge className="w-4 h-4 text-muted-foreground" />}
      {LEVELS.map((l) => (
        <Button
          key={l}
          size="sm"
          variant={value === l ? 'default' : 'outline'}
          onClick={() => onChange(l)}
          title={`${LEVEL_LABEL[l]} level`}
        >
          {LEVEL_LABEL[l]}
        </Button>
      ))}
    </div>
  );
}
