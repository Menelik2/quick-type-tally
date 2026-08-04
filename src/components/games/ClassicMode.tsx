import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Eye, EyeOff, Keyboard, Activity, MousePointerClick } from 'lucide-react';
import { useGameRestart } from './GameShell';
import { LevelSelect, poolByLevel, type Level } from './levels';
import { TEXT_ARENA_STYLE } from './arena';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and has been used for decades to test typewriters and keyboards. It remains a popular choice for typing practice.",
  "Technology has transformed the way we communicate, work, and live. From smartphones to artificial intelligence, these innovations continue to shape our daily experiences and create new opportunities.",
  "Reading is one of the most powerful tools for expanding knowledge and imagination. Through books, we can explore different worlds, learn from diverse perspectives, and develop critical thinking skills.",
  "The art of cooking brings people together through shared meals and cultural traditions. Whether preparing a simple dish or an elaborate feast, cooking allows us to express creativity while nourishing our bodies.",
  "Nature provides countless wonders that inspire and rejuvenate us. From towering mountains to serene lakes, the natural world offers beauty and peace that reminds us of our connection to the environment.",
  "Typing efficiently is a valuable skill in today's digital age. Practicing regularly helps to increase your words per minute and reduces errors, making it easier to complete tasks at school or work.",
  "A beautiful sunrise painted the sky with shades of orange and pink. Birds chirped cheerfully in the trees, welcoming a new day full of possibilities and opportunities.",
  "Learning to touch type can be challenging at first, but with persistence and practice, your fingers will learn where each key is located without needing to look at the keyboard.",
  "Teamwork and collaboration are essential in achieving success. By working together, we can overcome challenges and accomplish more than we ever could alone.",
  "Music has the power to evoke emotions and memories, connecting people across cultures and generations. Whether listening or performing, music enriches our lives in countless ways."
];

const MONKEY_PHRASES = [
  "banana split keyboard warrior",
  "typing monkey goes bananas",
  "fast fingers flying freely",
  "quick brown monkeys jump",
  "digital banana plantation",
  "keyboard jungle adventure",
  "monkey see monkey type",
  "banana powered typing machine",
  "swing from key to key",
  "tropical typing paradise"
];

interface ClassicModeProps {
  timeLimit: number;
  monkeyMode: boolean;
}

export default function ClassicMode({ timeLimit: initialTimeLimit, monkeyMode: initialMonkeyMode }: ClassicModeProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit);
  const [remainingTime, setRemainingTime] = useState(initialTimeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [monkeyMode, setMonkeyMode] = useState(initialMonkeyMode);
  const [bestWpm, setBestWpm] = useState(0);
  const [level, setLevel] = useState<Level>('medium');
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTextIndexRef = useRef<number>(-1);

  const getPool = useCallback(
    (mode: boolean, lv: Level) => poolByLevel(mode ? MONKEY_PHRASES : SAMPLE_TEXTS, lv),
    []
  );

  const pickNextIndex = useCallback(
    (mode: boolean, lv: Level) => {
      const pool = getPool(mode, lv);
      if (pool.length <= 1) return 0;
      let next = Math.floor(Math.random() * pool.length);
      while (next === lastTextIndexRef.current) {
        next = Math.floor(Math.random() * pool.length);
      }
      lastTextIndexRef.current = next;
      return next;
    },
    [getPool]
  );

  const activePool = getPool(monkeyMode, level);
  const rawText = activePool[currentTextIndex % activePool.length] ?? '';
  const currentText = monkeyMode ? `${rawText} ${rawText} ${rawText}` : rawText;

  const focusInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const len = el.value.length;
    try {
      el.setSelectionRange(len, len);
    } catch {
      /* noop */
    }
  }, []);

  /* ---------- derived stats (single source of truth) ---------- */
  const stats = useMemo(() => {
    let correct = 0;
    let errors = 0;
    let streak = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correct++;
        streak++;
      } else {
        errors++;
        streak = 0;
      }
    }
    const accuracy = userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 100;
    return { correct, errors, streak, accuracy };
  }, [userInput, currentText]);

  /* ---------- timer ---------- */
  useEffect(() => {
    if (!startTime || isComplete) return;
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const timeLeft = Math.max(0, timeLimit - elapsed);
      setRemainingTime(Math.ceil(timeLeft));
      if (timeLeft <= 0) {
        setIsTimeUp(true);
        setIsComplete(true);
      }
    };
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [startTime, isComplete, timeLimit]);

  /* ---------- live WPM (net WPM from correct characters) ---------- */
  useEffect(() => {
    if (!startTime || isComplete) return;
    const compute = () => {
      const elapsedMs = Date.now() - startTime;
      if (elapsedMs < 1000) return; // avoid absurd WPM spikes in the first second
      const minutes = elapsedMs / 60000;
      const next = Math.max(0, Math.round(stats.correct / 5 / minutes));
      setWpm(next);
      setBestWpm((b) => (next > b ? next : b));
    };
    compute();
    const id = setInterval(compute, 400);
    return () => clearInterval(id);
  }, [startTime, isComplete, stats.correct]);

  /* ---------- completion ---------- */
  useEffect(() => {
    if (!isTimeUp && userInput.length > 0 && userInput.length === currentText.length) {
      setIsComplete(true);
    }
  }, [userInput, currentText, isTimeUp]);

  const resetTest = useCallback(
    (limit?: number, lv: Level = level, mode: boolean = monkeyMode) => {
      setUserInput('');
      setStartTime(null);
      setIsComplete(false);
      setIsTimeUp(false);
      setWpm(0);
      setRemainingTime(limit ?? timeLimit);
      setCurrentTextIndex(pickNextIndex(mode, lv));
      requestAnimationFrame(focusInput);
    },
    [level, monkeyMode, timeLimit, pickNextIndex, focusInput]
  );

  useGameRestart(() => resetTest());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComplete) return;
    const value = e.target.value;
    if (!startTime && value.length > 0) setStartTime(Date.now());
    if (value.length <= currentText.length) setUserInput(value);
  };

  const changeTimeLimit = (newLimit: number) => {
    setTimeLimit(newLimit);
    resetTest(newLimit);
  };

  const changeLevel = (lv: Level) => {
    setLevel(lv);
    lastTextIndexRef.current = -1;
    resetTest(undefined, lv);
  };

  const changeMode = (mode: boolean) => {
    if (mode === monkeyMode) return;
    setMonkeyMode(mode);
    lastTextIndexRef.current = -1;
    resetTest(undefined, level, mode);
  };

  const toggleFocusMode = () => setFocusMode((f) => !f);

  /* ---------- initial text ---------- */
  useEffect(() => {
    setCurrentTextIndex(pickNextIndex(initialMonkeyMode, 'medium'));
    requestAnimationFrame(focusInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- desktop shortcuts ---------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Esc is reserved for leaving fullscreen / focus mode first
        if (document.fullscreenElement) return;
        e.preventDefault();
        if (focusMode) setFocusMode(false);
        else resetTest();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        changeMode(!monkeyMode);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFocusMode((f) => !f);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  /* ---------- passage rendering (word-aware, no mid-word wraps) ---------- */
  const renderPassage = (size: 'normal' | 'large') => {
    const words: { text: string; start: number }[] = [];
    let cursor = 0;
    currentText.split(' ').forEach((w, i, arr) => {
      const text = i < arr.length - 1 ? `${w} ` : w;
      words.push({ text, start: cursor });
      cursor += text.length;
    });

    return (
      <div
        className={`flex flex-wrap font-mono leading-relaxed ${
          size === 'large' ? 'text-3xl gap-y-3' : 'text-2xl gap-y-2'
        }`}
      >
        {words.map((word, wi) => (
          <span key={wi} className="whitespace-pre">
            {word.text.split('').map((char, ci) => {
              const index = word.start + ci;
              const typed = index < userInput.length;
              const isCurrent = index === userInput.length;
              let cls = 'relative rounded-sm transition-colors duration-75';
              if (typed) {
                cls +=
                  userInput[index] === char
                    ? ' text-emerald-600'
                    : ' text-red-500 bg-red-500/10 underline decoration-red-400 decoration-2';
              } else {
                cls += size === 'large' ? ' text-slate-500' : ' text-slate-400';
              }
              return (
                <span key={ci} className={cls}>
                  {isCurrent && <span className="caret" aria-hidden="true" />}
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    );
  };

  const progress = currentText.length > 0 ? (userInput.length / currentText.length) * 100 : 0;

  const hiddenInput = (
    <input
      ref={inputRef}
      type="text"
      value={userInput}
      onChange={handleInputChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      aria-label="Typing input"
      className="absolute inset-0 w-full h-full opacity-0 cursor-text"
    />
  );

  /* ---------- focus (zen) mode ---------- */
  if (focusMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-5xl space-y-10">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex gap-8 font-mono">
              <span>{wpm} wpm</span>
              <span>{stats.accuracy}% acc</span>
              <span>{remainingTime}s</span>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleFocusMode} className="text-slate-400 hover:text-slate-100 gap-2">
              <EyeOff className="w-4 h-4" /> Exit focus (Esc)
            </Button>
          </div>
          <div className="relative cursor-text" onMouseDown={(e) => { e.preventDefault(); focusInput(); }}>
            <div className={isFocused ? '' : 'blur-sm transition-all'}>{renderPassage('large')}</div>
            {!isFocused && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 gap-2 text-sm">
                <MousePointerClick className="w-4 h-4" /> Click here to keep typing
              </div>
            )}
            {hiddenInput}
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          {[15, 30, 60, 120].map((time) => (
            <Button
              key={time}
              variant={timeLimit === time ? 'default' : 'ghost'}
              size="sm"
              onClick={() => changeTimeLimit(time)}
            >
              {time}s
            </Button>
          ))}
        </div>
        <LevelSelect value={level} onChange={changeLevel} />
        <div className="flex gap-2">
          <Button variant={!monkeyMode ? 'default' : 'outline'} size="sm" onClick={() => changeMode(false)} className="gap-2" title="Random paragraphs">
            <Keyboard className="w-4 h-4" />
            Paragraphs
          </Button>
          <Button variant={monkeyMode ? 'default' : 'outline'} size="sm" onClick={() => changeMode(true)} className="gap-2" title="Fun phrases">
            <Activity className="w-4 h-4" />
            Fun Phrases
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFocusMode} className="gap-2" title="Focus mode (Ctrl+F)">
            <Eye className="w-4 h-4" />
            Focus
          </Button>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        Shortcuts: <kbd className="px-1.5 py-0.5 bg-muted border rounded">Esc</kbd> reset ·{' '}
        <kbd className="px-1.5 py-0.5 bg-muted border rounded">Ctrl</kbd>+
        <kbd className="px-1.5 py-0.5 bg-muted border rounded">M</kbd> switch text ·{' '}
        <kbd className="px-1.5 py-0.5 bg-muted border rounded">Ctrl</kbd>+
        <kbd className="px-1.5 py-0.5 bg-muted border rounded">F</kbd> focus mode
      </div>

      <Progress value={progress} className="h-2" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          {
            label: 'Accuracy',
            value: `${stats.accuracy}%`,
            color: stats.accuracy >= 95 ? 'text-emerald-600' : stats.accuracy >= 80 ? 'text-amber-600' : 'text-red-600',
          },
          { label: 'Time', value: `${remainingTime}s`, color: 'text-purple-600' },
          { label: 'Correct', value: stats.correct, color: 'text-emerald-600' },
          { label: 'Errors', value: stats.errors, color: 'text-red-600' },
          { label: 'Streak', value: stats.streak, color: 'text-orange-600' },
          { label: 'Best', value: bestWpm, color: 'text-amber-600' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Typing Area — click anywhere on the text to type */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 lg:p-10 space-y-6" style={TEXT_ARENA_STYLE}>
          <div
            className="relative rounded-xl bg-muted/40 p-6 lg:p-10 cursor-text ring-1 ring-transparent focus-within:ring-primary/40 transition"
            onMouseDown={(e) => {
              e.preventDefault();
              focusInput();
            }}
          >
            <div className={isFocused || isComplete ? '' : 'blur-[3px] transition-all select-none'}>
              {renderPassage('normal')}
            </div>
            {!isFocused && !isComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium shadow">
                  <MousePointerClick className="w-4 h-4" /> Click here or press any key to start typing
                </span>
              </div>
            )}
            {!isComplete && hiddenInput}
            <div className="absolute top-2 right-3 text-xs text-muted-foreground tabular-nums">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button onClick={() => resetTest()} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Restart
            </Button>
            <Button onClick={toggleFocusMode} variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Focus Mode
            </Button>
          </div>

          {isComplete && (
            <div className="text-center p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 animate-scale-in">
              <div className="text-xl font-bold text-slate-800 mb-3">
                {isTimeUp ? "Time's up!" : 'Test Complete!'}
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
                <span>Speed <span className="font-semibold text-blue-600">{wpm} WPM</span></span>
                <span>Accuracy <span className="font-semibold text-emerald-600">{stats.accuracy}%</span></span>
                <span>Correct <span className="font-semibold text-emerald-600">{stats.correct}</span></span>
                <span>Errors <span className="font-semibold text-red-600">{stats.errors}</span></span>
                <span>Best <span className="font-semibold text-amber-600">{bestWpm} WPM</span></span>
              </div>
              {monkeyMode && (
                <div className="mt-3 text-sm text-amber-600">Banana count: {Math.floor(wpm / 10)} bananas!</div>
              )}
              <Button onClick={() => resetTest()} className="mt-4 gap-2">
                <RotateCcw className="w-4 h-4" /> Next passage (Enter)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
