import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Heart, Volume2, VolumeX, Trophy, Flame } from 'lucide-react';
import { sfx } from '@/lib/sound';
import { useGameRestart } from './GameShell';

const WORD_BANK = [
  "bubble", "float", "pop", "rise", "sky", "cloud", "air", "wind", "blue", "soap",
  "pearl", "drop", "wave", "sea", "swim", "dive", "coral", "shell", "reef", "tide",
  "shine", "glow", "spark", "burst", "puff", "wisp", "haze", "mist", "foam", "fizz",
  "orb", "sphere", "round", "smooth", "light", "soft", "gentle", "calm", "cool", "fresh"
];

const BUBBLE_COLORS = [
  'from-blue-400 to-cyan-300',
  'from-pink-400 to-rose-300',
  'from-purple-400 to-fuchsia-300',
  'from-emerald-400 to-teal-300',
  'from-amber-400 to-yellow-300',
  'from-indigo-400 to-blue-300',
];

interface Bubble {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  typedSoFar: string;
  drift: number;
}

interface Burst { id: number; x: number; y: number; size: number; color: string; }
interface Popup { id: number; x: number; y: number; text: string; }

const GAME_HEIGHT = 620;
const WIN_SCORE = 1000;

export default function BubblePop() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [level, setLevel] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [popped, setPopped] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [glow, setGlow] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(0);
  const burstIdRef = useRef(0);
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const prevInputRef = useRef('');

  useEffect(() => { sfx.setEnabled(soundOn); }, [soundOn]);

  const addBurst = (x: number, y: number, size: number, color: string) => {
    const id = burstIdRef.current++;
    setBursts(prev => [...prev, { id, x, y, size, color }]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 400);
  };
  const addPopup = (x: number, y: number, text: string) => {
    const id = burstIdRef.current++;
    setPopups(prev => [...prev, { id, x, y, text }]);
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 900);
  };

  const spawnBubble = useCallback(() => {
    const wordText = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const gameWidth = gameAreaRef.current?.clientWidth || 800;
    const size = 80 + Math.random() * 50;
    const newBubble: Bubble = {
      id: nextIdRef.current++,
      word: wordText,
      x: 40 + Math.random() * (gameWidth - size - 80),
      y: GAME_HEIGHT,
      speed: 0.3 + level * 0.13 + Math.random() * 0.15,
      size,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      typedSoFar: '',
      drift: (Math.random() - 0.5) * 0.3,
    };
    setBubbles(prev => [...prev, newBubble]);
  }, [level]);

  const startGame = useCallback(() => {
    setBubbles([]);
    setBursts([]);
    setPopups([]);
    setScore(0);
    setLives(5);
    setIsPlaying(true);
    setGameOver(false);
    setWon(false);
    setLevel(1);
    setUserInput('');
    setPopped(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setStartTime(Date.now());
    setElapsed(0);
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    prevInputRef.current = '';
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useGameRestart(() => startGame());

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const animate = (time: number) => {
      if (time - lastSpawnRef.current > Math.max(1400 - level * 90, 500)) {
        spawnBubble();
        lastSpawnRef.current = time;
      }
      setBubbles(prev => {
        const updated = prev.map(b => ({ ...b, y: b.y - b.speed, x: b.x + b.drift }));
        const escaped = updated.filter(b => b.y < -60);
        if (escaped.length > 0) {
          sfx.damage();
          setStreak(0);
          setLives(l => {
            const nl = l - escaped.length;
            if (nl <= 0) { setGameOver(true); setIsPlaying(false); sfx.lose(); }
            return Math.max(0, nl);
          });
        }
        return updated.filter(b => b.y >= -60);
      });
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, level, spawnBubble, startTime]);

  useEffect(() => {
    if (popped > 0 && popped % 10 === 0) setLevel(p => p + 1);
  }, [popped]);

  useEffect(() => {
    if ((gameOver || won) && score > bestScore) setBestScore(score);
  }, [gameOver, won, score, bestScore]);

  useEffect(() => {
    if (isPlaying && score >= WIN_SCORE) {
      setWon(true);
      setIsPlaying(false);
      sfx.win();
    }
  }, [score, isPlaying]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isPlaying || gameOver) return;

    // Track correctness on typed char
    if (value.length > prevInputRef.current.length) {
      const ch = value[value.length - 1];
      const anyStarts = bubbles.some(b => b.word.startsWith(value));
      if (anyStarts) {
        setCorrectChars(c => c + 1);
        sfx.key();
      } else {
        setIncorrectChars(c => c + 1);
      }
      if (ch !== ' ') { /* noop */ }
    }
    prevInputRef.current = value;

    const matching = bubbles.find(b => b.word.startsWith(value));
    if (matching) {
      setBubbles(prev => prev.map(b => b.word.startsWith(value) ? { ...b, typedSoFar: value } : b));
      const done = bubbles.find(b => b.word === value);
      if (done) {
        setBubbles(prev => prev.filter(b => b.id !== done.id));
        const gain = done.word.length * 12 + level * 5 + (streak >= 5 ? 20 : 0);
        setScore(p => p + gain);
        setPopped(p => p + 1);
        setStreak(s => {
          const ns = s + 1;
          setBestStreak(bs => Math.max(bs, ns));
          if (ns > 0 && ns % 5 === 0) {
            sfx.streak();
            setGlow(true);
            setTimeout(() => setGlow(false), 800);
            addPopup(done.x + done.size / 2, done.y, `x${ns} STREAK!`);
          }
          return ns;
        });
        sfx.pop();
        addBurst(done.x + done.size / 2, done.y + done.size / 2, done.size, done.color);
        addPopup(done.x + done.size / 2, done.y, `+${gain}`);
        setUserInput('');
        prevInputRef.current = '';
        inputRef.current?.focus();
        return;
      }
    } else if (value.length > 0) {
      setStreak(0);
    }
    setUserInput(value);
  };

  const totalChars = correctChars + incorrectChars;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;

  const renderWord = (b: Bubble) =>
    b.word.split('').map((ch, i) => {
      let cls = 'text-base font-mono font-bold';
      if (i < b.typedSoFar.length) cls += b.typedSoFar[i] === ch ? ' text-green-700' : ' text-red-700';
      else cls += ' text-slate-800';
      return <span key={i} className={cls}>{ch}</span>;
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { label: 'Score', value: score, color: 'text-cyan-600' },
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          { label: 'Accuracy', value: `${accuracy}%`, color: 'text-emerald-600' },
          { label: 'Streak', value: streak, color: 'text-orange-600' },
          { label: 'Level', value: level, color: 'text-purple-600' },
          { label: 'Best', value: bestScore, color: 'text-amber-600' },
        ].map((s) => (
          <Card key={s.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-3">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart key={i} className={`w-6 h-6 transition-all ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSoundOn(v => !v)} className="gap-1">
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="text-xs">{soundOn ? 'Sound On' : 'Muted'}</span>
        </Button>
      </div>

      <Card className={`border-0 shadow-sm overflow-hidden ${glow ? 'animate-streak-glow' : ''}`}>
        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full bg-gradient-to-b from-sky-200 via-cyan-100 to-blue-100 rounded-lg overflow-hidden"
            style={{ height: GAME_HEIGHT }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-400/60" />

            {bubbles.map(b => (
              <div
                key={b.id}
                className={`absolute flex items-center justify-center rounded-full bg-gradient-to-br ${b.color} shadow-lg border-2 border-white/60 backdrop-blur-sm`}
                style={{ left: b.x, top: b.y, width: b.size, height: b.size }}
              >
                <div className="text-center px-2">{renderWord(b)}</div>
              </div>
            ))}

            {bursts.map(b => (
              <div
                key={b.id}
                className={`absolute rounded-full bg-gradient-to-br ${b.color} animate-pop-burst pointer-events-none`}
                style={{ left: b.x - b.size / 2, top: b.y - b.size / 2, width: b.size, height: b.size }}
              />
            ))}

            {popups.map(p => (
              <div
                key={p.id}
                className="absolute text-xl font-black text-amber-600 drop-shadow animate-float-up pointer-events-none"
                style={{ left: p.x, top: p.y }}
              >
                {p.text}
              </div>
            ))}

            {(!isPlaying || gameOver || won) && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                {(gameOver || won) ? (
                  <Card className="w-full max-w-md border-0 shadow-2xl animate-scale-in">
                    <CardContent className="p-8 space-y-5 text-center">
                      <div className="flex justify-center">
                        {won ? <Trophy className="w-14 h-14 text-amber-500" /> : <Flame className="w-14 h-14 text-red-500" />}
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{won ? 'Victory!' : 'Bubbles Escaped!'}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {won ? 'You reached the target score.' : `You made it to level ${level}.`}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { l: 'Score', v: score, c: 'text-cyan-600' },
                          { l: 'WPM', v: wpm, c: 'text-blue-600' },
                          { l: 'Accuracy', v: `${accuracy}%`, c: 'text-emerald-600' },
                          { l: 'Best Streak', v: bestStreak, c: 'text-orange-600' },
                        ].map(s => (
                          <div key={s.l} className="rounded-lg bg-muted/60 p-3">
                            <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
                            <div className="text-xs text-muted-foreground">{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <Button onClick={startGame} size="lg" className="w-full gap-2">
                        <RotateCcw className="w-5 h-5" /> Play Again
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-3xl font-bold text-white">Bubble Pop</div>
                    <div className="text-sm text-gray-200">Type words to pop bubbles. Reach {WIN_SCORE} to win.</div>
                    <Button onClick={startGame} size="lg" className="gap-2">
                      <RotateCcw className="w-5 h-5" /> Start Game
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              disabled={!isPlaying || gameOver || won}
              placeholder={isPlaying ? "Type to pop the bubbles..." : "Press Start to play"}
              className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:opacity-50 text-center font-mono"
              autoFocus={isPlaying}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
