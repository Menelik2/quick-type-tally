import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Shield, Volume2, VolumeX, Trophy, Skull } from 'lucide-react';
import { sfx } from '@/lib/sound';

const WORD_BANK = [
  "attack", "shield", "sword", "guard", "fort", "wall", "tower", "castle", "arrow", "spear",
  "brave", "hero", "quest", "fight", "power", "storm", "blaze", "frost", "iron", "steel",
  "swift", "sharp", "quick", "steady", "solid", "mighty", "bold", "grand", "royal", "noble",
  "raven", "wolf", "bear", "hawk", "lion", "tiger", "eagle", "shark", "dragon", "phoenix",
  "run", "jump", "block", "dodge", "strike", "shoot", "aim", "cast", "chant", "roar"
];

interface Enemy {
  id: number;
  word: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  typedSoFar: string;
  color: string;
  hitFlash?: boolean;
}

interface Zap { id: number; x1: number; y1: number; x2: number; y2: number; }
interface Popup { id: number; x: number; y: number; text: string; }

const ENEMY_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];
const GAME_HEIGHT = 620;
const WIN_DEFEATED = 30;

export default function WordDefense() {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [level, setLevel] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [defeated, setDefeated] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [baseShake, setBaseShake] = useState(false);
  const [glow, setGlow] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(0);
  const fxIdRef = useRef(0);
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const centerRef = useRef({ x: 400, y: GAME_HEIGHT / 2 });
  const prevInputRef = useRef('');

  useEffect(() => { sfx.setEnabled(soundOn); }, [soundOn]);

  const addZap = (x2: number, y2: number) => {
    const id = fxIdRef.current++;
    setZaps(prev => [...prev, { id, x1: centerRef.current.x, y1: centerRef.current.y, x2, y2 }]);
    setTimeout(() => setZaps(prev => prev.filter(z => z.id !== id)), 250);
  };
  const addPopup = (x: number, y: number, text: string) => {
    const id = fxIdRef.current++;
    setPopups(prev => [...prev, { id, x, y, text }]);
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 900);
  };

  const spawnEnemy = useCallback(() => {
    const wordText = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const w = gameAreaRef.current?.clientWidth || 800;
    const h = GAME_HEIGHT;
    centerRef.current = { x: w / 2, y: h / 2 };
    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    if (side === 0) { x = Math.random() * w; y = -30; }
    else if (side === 1) { x = w + 20; y = Math.random() * h; }
    else if (side === 2) { x = Math.random() * w; y = h + 20; }
    else { x = -60; y = Math.random() * h; }
    const dx = centerRef.current.x - x;
    const dy = centerRef.current.y - y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 0.3 + level * 0.1 + Math.random() * 0.15;
    const enemy: Enemy = {
      id: nextIdRef.current++,
      word: wordText,
      x, y,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      typedSoFar: '',
      color: ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
    };
    setEnemies(prev => [...prev, enemy]);
  }, [level]);

  const startGame = useCallback(() => {
    setEnemies([]);
    setZaps([]);
    setPopups([]);
    setScore(0);
    setHealth(100);
    setIsPlaying(true);
    setGameOver(false);
    setWon(false);
    setLevel(1);
    setUserInput('');
    setDefeated(0);
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

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const animate = (time: number) => {
      if (time - lastSpawnRef.current > Math.max(1500 - level * 100, 500)) {
        spawnEnemy();
        lastSpawnRef.current = time;
      }
      setEnemies(prev => {
        const updated = prev.map(e => ({ ...e, x: e.x + e.vx, y: e.y + e.vy }));
        const hits = updated.filter(e => Math.hypot(e.x - centerRef.current.x, e.y - centerRef.current.y) < 45);
        if (hits.length > 0) {
          const damage = hits.reduce((sum, h) => sum + h.word.length * 2, 0);
          sfx.damage();
          setStreak(0);
          setBaseShake(true);
          setTimeout(() => setBaseShake(false), 300);
          setHealth(hp => {
            const nh = hp - damage;
            if (nh <= 0) { setGameOver(true); setIsPlaying(false); sfx.lose(); }
            return Math.max(0, nh);
          });
        }
        return updated.filter(e => !hits.includes(e));
      });
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, level, spawnEnemy, startTime]);

  useEffect(() => {
    if (defeated > 0 && defeated % 8 === 0) setLevel(p => p + 1);
  }, [defeated]);

  useEffect(() => {
    if ((gameOver || won) && score > bestScore) setBestScore(score);
  }, [gameOver, won, score, bestScore]);

  useEffect(() => {
    if (isPlaying && defeated >= WIN_DEFEATED) {
      setWon(true);
      setIsPlaying(false);
      sfx.win();
    }
  }, [defeated, isPlaying]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isPlaying || gameOver) return;

    if (value.length > prevInputRef.current.length) {
      const anyStarts = enemies.some(en => en.word.startsWith(value));
      if (anyStarts) { setCorrectChars(c => c + 1); sfx.key(); }
      else setIncorrectChars(c => c + 1);
    }
    prevInputRef.current = value;

    const matching = enemies.find(en => en.word.startsWith(value));
    if (matching) {
      setEnemies(prev => prev.map(en => en.word.startsWith(value) ? { ...en, typedSoFar: value, hitFlash: true } : en));
      const done = enemies.find(en => en.word === value);
      if (done) {
        addZap(done.x, done.y);
        sfx.hit();
        setEnemies(prev => prev.filter(en => en.id !== done.id));
        const gain = done.word.length * 15 + level * 5 + (streak >= 5 ? 30 : 0);
        setScore(p => p + gain);
        setDefeated(p => p + 1);
        setStreak(s => {
          const ns = s + 1;
          setBestStreak(bs => Math.max(bs, ns));
          if (ns > 0 && ns % 5 === 0) {
            sfx.streak();
            setGlow(true);
            setTimeout(() => setGlow(false), 800);
            addPopup(done.x, done.y, `x${ns} COMBO!`);
          }
          return ns;
        });
        addPopup(done.x, done.y - 20, `+${gain}`);
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

  const renderWord = (en: Enemy) =>
    en.word.split('').map((ch, i) => {
      let cls = 'text-sm font-mono font-bold';
      if (i < en.typedSoFar.length) cls += en.typedSoFar[i] === ch ? ' text-green-300' : ' text-red-300';
      else cls += ' text-white';
      return <span key={i} className={cls}>{ch}</span>;
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { label: 'Score', value: score, color: 'text-indigo-600' },
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
        <Shield className="w-5 h-5 text-indigo-600" />
        <div className="w-72 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
            style={{ width: `${health}%` }}
          />
        </div>
        <span className="text-sm font-mono font-bold text-gray-700">{health} HP</span>
        <Button variant="ghost" size="sm" onClick={() => setSoundOn(v => !v)} className="gap-1">
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="text-xs">{soundOn ? 'Sound On' : 'Muted'}</span>
        </Button>
      </div>

      <Card className={`border-0 shadow-sm overflow-hidden ${glow ? 'animate-streak-glow' : ''}`}>
        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 rounded-lg overflow-hidden"
            style={{ height: GAME_HEIGHT }}
          >
            {/* Base */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 shadow-[0_0_40px_rgba(129,140,248,0.6)] flex items-center justify-center border-4 border-white/40 ${baseShake ? 'animate-shake' : ''}`}
            >
              <Shield className="w-10 h-10 text-white" />
            </div>

            {/* Zaps */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {zaps.map(z => (
                <line
                  key={z.id}
                  x1={z.x1} y1={z.y1} x2={z.x2} y2={z.y2}
                  stroke="rgb(250 204 21)" strokeWidth="3" opacity="0.9"
                  style={{ filter: 'drop-shadow(0 0 6px rgb(250 204 21))' }}
                />
              ))}
            </svg>

            {enemies.map(en => (
              <div
                key={en.id}
                className={`absolute px-3 py-1.5 rounded-lg ${en.color} shadow-lg border border-white/30 -translate-x-1/2 -translate-y-1/2 ${en.hitFlash ? 'animate-hit-flash' : ''}`}
                style={{ left: en.x, top: en.y }}
              >
                {renderWord(en)}
              </div>
            ))}

            {popups.map(p => (
              <div
                key={p.id}
                className="absolute text-xl font-black text-amber-300 drop-shadow animate-float-up pointer-events-none"
                style={{ left: p.x, top: p.y }}
              >
                {p.text}
              </div>
            ))}

            {(!isPlaying || gameOver || won) && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                {(gameOver || won) ? (
                  <Card className="w-full max-w-md border-0 shadow-2xl animate-scale-in">
                    <CardContent className="p-8 space-y-5 text-center">
                      <div className="flex justify-center">
                        {won ? <Trophy className="w-14 h-14 text-amber-500" /> : <Skull className="w-14 h-14 text-red-500" />}
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{won ? 'Base Defended!' : 'Base Destroyed!'}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {won ? `You defeated ${defeated} enemies.` : `You made it to level ${level}.`}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { l: 'Score', v: score, c: 'text-indigo-600' },
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
                    <div className="text-3xl font-bold text-white">Word Defense</div>
                    <div className="text-sm text-gray-300">Type enemies to zap them. Defeat {WIN_DEFEATED} to win.</div>
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
              placeholder={isPlaying ? "Type enemy words to destroy them..." : "Press Start to defend"}
              className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 text-center font-mono"
              autoFocus={isPlaying}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
