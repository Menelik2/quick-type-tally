import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Swords, Skull, Trophy } from 'lucide-react';
import { useGameRestart } from './GameShell';

type Difficulty = 'apprentice' | 'ninja' | 'grandmaster';

const QUOTES: Record<Difficulty, string[]> = {
  apprentice: [
    'The quick brown fox jumps over the lazy dog.',
    'Practice makes perfect, but only with focus and patience.',
    'A journey of a thousand miles begins with a single step.',
    'Success is the sum of small efforts repeated day after day.',
  ],
  ninja: [
    'Discipline is choosing between what you want now and what you want most; it is the bridge between goals and accomplishment.',
    'The greatest glory in living lies not in never falling, but in rising every time we fall — and doing so with quiet determination.',
    'Talent hits a target no one else can hit; genius hits a target no one else can see, and both are forged in relentless practice.',
    'Whether you think you can or you think you cannot, you are right; the mind is the first battlefield of every meaningful victory.',
  ],
  grandmaster: [
    'It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.',
    'We are what we repeatedly do; excellence, then, is not an act but a habit, cultivated through countless small choices made when nobody is watching, when the applause has faded, and when only the standard we set for ourselves remains.',
    'The future belongs to those who believe in the beauty of their dreams, who commit themselves to a discipline of daily improvement, and who understand that mastery is less a destination than a way of walking through the world with intention.',
  ],
};

const DIFF_CONFIG: Record<Difficulty, { label: string; color: string; desc: string }> = {
  apprentice: { label: 'Apprentice', color: 'text-emerald-600', desc: '1 mistake allowed' },
  ninja: { label: 'Ninja', color: 'text-amber-600', desc: 'Zero mistakes' },
  grandmaster: { label: 'Grandmaster', color: 'text-red-600', desc: 'Zero mistakes · long passage' },
};

export default function NinjaMode() {
  const [difficulty, setDifficulty] = useState<Difficulty>('ninja');
  const [target, setTarget] = useState('');
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [dead, setDead] = useState(false);
  const [best, setBest] = useState<Record<Difficulty, number>>({ apprentice: 0, ninja: 0, grandmaster: 0 });
  const lastRef = useRef('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const allowedMistakes = difficulty === 'apprentice' ? 1 : 0;

  const pick = useCallback((d: Difficulty) => {
    const pool = QUOTES[d];
    let choice = pool[Math.floor(Math.random() * pool.length)];
    let guard = 0;
    while (choice === lastRef.current && pool.length > 1 && guard < 8) {
      choice = pool[Math.floor(Math.random() * pool.length)];
      guard++;
    }
    lastRef.current = choice;
    return choice;
  }, []);

  const reset = useCallback((d: Difficulty = difficulty) => {
    setTarget(pick(d));
    setInput('');
    setStartedAt(null);
    setFinishedAt(null);
    setMistakes(0);
    setDead(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [difficulty, pick]);

  useGameRestart(() => reset());

  useEffect(() => {
    reset(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    lastRef.current = '';
    setTarget(pick(d));
    setInput('');
    setStartedAt(null);
    setFinishedAt(null);
    setMistakes(0);
    setDead(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finishedAt || dead) return;
    const v = e.target.value;
    if (v.length > target.length) return;
    if (!startedAt && v.length > 0) setStartedAt(Date.now());

    if (v.length > input.length) {
      const i = v.length - 1;
      if (v[i] !== target[i]) {
        const nextMistakes = mistakes + 1;
        setMistakes(nextMistakes);
        if (nextMistakes > allowedMistakes) {
          setDead(true);
          setFinishedAt(Date.now());
          return;
        }
      }
    }
    setInput(v);

    if (v === target) {
      const now = Date.now();
      setFinishedAt(now);
      const secs = startedAt ? (now - startedAt) / 1000 : 1;
      const wpm = Math.round((v.length / 5) / (secs / 60));
      setBest((b) => ({ ...b, [difficulty]: Math.max(b[difficulty], wpm) }));
    }
  };

  const elapsed = startedAt ? ((finishedAt ?? Date.now()) - startedAt) / 1000 : 0;
  const wpm = elapsed > 0 ? Math.round((input.length / 5) / (elapsed / 60)) : 0;
  const accuracy = input.length > 0 ? Math.max(0, Math.round(((input.length - mistakes) / input.length) * 100)) : 100;
  const progress = target.length ? Math.round((input.length / target.length) * 100) : 0;
  const won = finishedAt && !dead;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {(['apprentice', 'ninja', 'grandmaster'] as Difficulty[]).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={difficulty === d ? 'default' : 'outline'}
            onClick={() => changeDifficulty(d)}
            className="gap-2"
          >
            <Swords className="w-4 h-4" />
            {DIFF_CONFIG[d].label}
          </Button>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {DIFF_CONFIG[difficulty].desc} · one wrong keystroke and the run ends.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          { label: 'Accuracy', value: `${accuracy}%`, color: 'text-emerald-600' },
          { label: 'Progress', value: `${progress}%`, color: 'text-purple-600' },
          { label: 'Mistakes', value: `${mistakes}/${allowedMistakes}`, color: 'text-red-600' },
          { label: 'Best WPM', value: best[difficulty], color: 'text-amber-600' },
        ].map((s) => (
          <Card key={s.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className={`rounded-lg p-6 border transition-colors ${
            dead
              ? 'bg-red-50 border-red-200'
              : won
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-gradient-to-br from-slate-50 to-amber-50 border-amber-100'
          }`}>
            <div className="text-xl md:text-2xl leading-relaxed font-serif tracking-wide">
              {target.split('').map((ch, i) => {
                let cls = 'text-gray-400';
                if (i < input.length) {
                  cls = input[i] === ch ? 'text-emerald-700' : 'text-red-600 bg-red-200 rounded-sm';
                } else if (i === input.length && !finishedAt) {
                  cls = 'text-blue-600 border-b-2 border-blue-500';
                }
                return <span key={i} className={cls}>{ch}</span>;
              })}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            disabled={!!finishedAt}
            spellCheck={false}
            rows={3}
            placeholder="One mistake ends the run. Breathe. Type carefully."
            className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 leading-relaxed resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            autoFocus
          />

          {dead && (
            <div className="text-center rounded-lg bg-red-50 border border-red-200 p-4 space-y-1">
              <div className="flex items-center justify-center gap-2 text-red-700 font-semibold text-lg">
                <Skull className="w-5 h-5" /> Run ended
              </div>
              <div className="text-sm text-muted-foreground">
                Reached {progress}% at {wpm} WPM before the fatal keystroke.
              </div>
            </div>
          )}
          {won && (
            <div className="text-center rounded-lg bg-emerald-50 border border-emerald-200 p-4 space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-lg">
                <Trophy className="w-5 h-5" /> Flawless victory
              </div>
              <div className="text-sm text-muted-foreground">
                {wpm} WPM · {accuracy}% accuracy · {Math.round(elapsed)}s
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button onClick={() => reset(difficulty)} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Run
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
