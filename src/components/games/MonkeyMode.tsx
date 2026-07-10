import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Maximize2, Minimize2, Banana } from 'lucide-react';

const MONKEY_WORDS = [
  'monkey', 'banana', 'jungle', 'swing', 'tree', 'vine', 'coconut', 'palm',
  'chimp', 'ape', 'gorilla', 'leaf', 'branch', 'climb', 'jump', 'howl',
  'the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they',
  'have', 'this', 'from', 'not', 'but', 'what', 'all', 'were', 'when', 'your',
  'can', 'said', 'there', 'use', 'each', 'which', 'she', 'how', 'their', 'will',
  'about', 'out', 'many', 'then', 'them', 'these', 'some', 'her', 'would', 'make',
  'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 'see',
  'number', 'way', 'could', 'people', 'than', 'first', 'water', 'been', 'call', 'who',
  'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part',
];

const DURATIONS = [15, 30, 60, 120] as const;

function pickWords(count: number): string[] {
  const arr: string[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(MONKEY_WORDS[Math.floor(Math.random() * MONKEY_WORDS.length)]);
  }
  return arr;
}

export default function MonkeyMode() {
  const [duration, setDuration] = useState<number>(30);
  const [words, setWords] = useState<string[]>(() => pickWords(120));
  const [typed, setTyped] = useState<string[]>(['']); // typed[i] = what user typed for word i
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(30);
  const [finished, setFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback((d: number = duration) => {
    setWords(pickWords(120));
    setTyped(['']);
    setCurrentIndex(0);
    setStartedAt(null);
    setRemaining(d);
    setFinished(false);
    setTimeout(() => hiddenInputRef.current?.focus(), 0);
  }, [duration]);

  const changeDuration = (d: number) => {
    setDuration(d);
    setWords(pickWords(120));
    setTyped(['']);
    setCurrentIndex(0);
    setStartedAt(null);
    setRemaining(d);
    setFinished(false);
    setTimeout(() => hiddenInputRef.current?.focus(), 0);
  };

  // Timer
  useEffect(() => {
    if (!startedAt || finished) return;
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, duration - elapsed);
      setRemaining(left);
      if (left === 0) setFinished(true);
    }, 100);
    return () => clearInterval(id);
  }, [startedAt, duration, finished]);

  // Fullscreen tracking — auto-focus input on enter, restore focus on exit
  useEffect(() => {
    const onChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setTimeout(() => hiddenInputRef.current?.focus(), 50);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Auto-exit fullscreen when the round finishes so results are clearly visible
  useEffect(() => {
    if (finished && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [finished]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return;

    // Start on first keystroke
    if (!startedAt && e.key.length === 1) {
      setStartedAt(Date.now());
    }

    if (e.key === ' ') {
      e.preventDefault();
      if ((typed[currentIndex] ?? '').length === 0) return;
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setTyped((t) => {
        const copy = [...t];
        if (copy.length <= next) copy.push('');
        return copy;
      });
      // extend word list if near end
      if (next > words.length - 20) {
        setWords((w) => [...w, ...pickWords(60)]);
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      setTyped((t) => {
        const copy = [...t];
        const cur = copy[currentIndex] ?? '';
        if (cur.length > 0) {
          copy[currentIndex] = cur.slice(0, -1);
        } else if (currentIndex > 0) {
          // jump back to previous word
          setCurrentIndex(currentIndex - 1);
        }
        return copy;
      });
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setTyped((t) => {
        const copy = [...t];
        copy[currentIndex] = (copy[currentIndex] ?? '') + e.key;
        return copy;
      });
    }

    if (e.key === 'Escape') {
      reset();
    }
  };

  // Stats
  const stats = (() => {
    let correctChars = 0;
    let incorrectChars = 0;
    let correctWords = 0;
    for (let i = 0; i <= currentIndex && i < words.length; i++) {
      const w = words[i];
      const t = typed[i] ?? '';
      if (i < currentIndex && t === w) correctWords++;
      for (let j = 0; j < t.length; j++) {
        if (t[j] === w[j]) correctChars++;
        else incorrectChars++;
      }
    }
    const totalChars = correctChars + incorrectChars;
    const elapsed = startedAt ? (Date.now() - startedAt) / 1000 : 0;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    return { wpm, accuracy, correctWords, correctChars, incorrectChars };
  })();

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? 'w-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-8 overflow-auto' : ''}`}
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Banana className={`w-5 h-5 ${isFullscreen ? 'text-amber-300' : 'text-amber-500'}`} />
            <span className={`text-sm font-semibold ${isFullscreen ? 'text-amber-100' : 'text-gray-700'}`}>Monkey Mode</span>
          </div>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <Button
                key={d}
                size="sm"
                variant={duration === d ? 'default' : 'outline'}
                onClick={() => changeDuration(d)}
              >
                {d}s
              </Button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={() => reset()} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Button size="sm" variant="outline" onClick={toggleFullscreen} className="gap-2">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Play Fullscreen'}
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Time', value: `${remaining}s`, color: 'text-purple-500' },
            { label: 'WPM', value: stats.wpm, color: 'text-blue-500' },
            { label: 'Accuracy', value: `${stats.accuracy}%`, color: 'text-green-500' },
            { label: 'Words', value: stats.correctWords, color: 'text-amber-500' },
          ].map((s) => (
            <Card key={s.label} className={`text-center border-0 shadow-sm ${isFullscreen ? 'bg-white/10 backdrop-blur' : ''}`}>
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className={`text-xs ${isFullscreen ? 'text-amber-100/80' : 'text-muted-foreground'}`}>{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Word canvas */}
        <Card className={`border-0 shadow-sm ${isFullscreen ? 'bg-white/5 backdrop-blur' : ''}`}>
          <CardContent
            className={`${isFullscreen ? 'p-12 min-h-[60vh]' : 'p-8'} cursor-text`}
            onClick={() => hiddenInputRef.current?.focus()}
          >
            <div
              className={`font-mono leading-relaxed flex flex-wrap gap-x-3 gap-y-2 ${isFullscreen ? 'text-4xl' : 'text-2xl'}`}
            >
              {words.slice(0, currentIndex + 40).map((word, wi) => {
                const t = typed[wi] ?? '';
                const isCurrent = wi === currentIndex;
                const chars = word.split('').map((ch, ci) => {
                  let cls = isFullscreen ? 'text-amber-100/40' : 'text-gray-400';
                  if (ci < t.length) {
                    cls = t[ci] === ch ? (isFullscreen ? 'text-green-400' : 'text-green-600') : (isFullscreen ? 'text-red-400 underline' : 'text-red-500 underline');
                  }
                  if (isCurrent && ci === t.length) {
                    cls += ' border-l-2 border-amber-400 animate-pulse';
                  }
                  return <span key={ci} className={cls}>{ch}</span>;
                });
                // extra typed chars beyond target
                const extras = t.slice(word.length).split('').map((ch, i) => (
                  <span key={`ex-${i}`} className={isFullscreen ? 'text-red-400/70' : 'text-red-400'}>{ch}</span>
                ));
                return (
                  <span key={wi} className="whitespace-nowrap">
                    {chars}
                    {extras}
                  </span>
                );
              })}
            </div>

            <input
              ref={hiddenInputRef}
              className="opacity-0 w-0 h-0 absolute"
              onKeyDown={handleKey}
              value=""
              onChange={() => {}}
              autoFocus
            />

            <p className={`mt-6 text-center text-xs ${isFullscreen ? 'text-amber-100/70' : 'text-muted-foreground'}`}>
              Click the words to focus. Type. Space = next word. Esc = reset.
            </p>
          </CardContent>
        </Card>

        {finished && (
          <Card className={`border-0 shadow-lg ${isFullscreen ? 'bg-white/10 backdrop-blur' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'}`}>
            <CardContent className="p-8 text-center space-y-3">
              <div className={`text-3xl font-bold ${isFullscreen ? 'text-amber-200' : 'text-gray-800'}`}>Time's up! 🐒</div>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 ${isFullscreen ? 'text-amber-100' : ''}`}>
                <div><div className="text-3xl font-bold text-blue-500">{stats.wpm}</div><div className="text-xs">WPM</div></div>
                <div><div className="text-3xl font-bold text-green-500">{stats.accuracy}%</div><div className="text-xs">Accuracy</div></div>
                <div><div className="text-3xl font-bold text-amber-500">{stats.correctWords}</div><div className="text-xs">Correct Words</div></div>
                <div><div className="text-3xl font-bold text-red-500">{stats.incorrectChars}</div><div className="text-xs">Errors</div></div>
              </div>
              <Button onClick={() => reset()} className="gap-2 mt-4">
                <RotateCcw className="w-4 h-4" /> Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
