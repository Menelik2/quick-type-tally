import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Shield } from 'lucide-react';

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
}

const ENEMY_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];

export default function WordDefense() {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [defeated, setDefeated] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(0);
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const centerRef = useRef({ x: 300, y: 225 });

  const spawnEnemy = useCallback(() => {
    const wordText = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const w = gameAreaRef.current?.clientWidth || 600;
    const h = 450;
    centerRef.current = { x: w / 2, y: h / 2 };
    // spawn on random edge
    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    if (side === 0) { x = Math.random() * w; y = -30; }
    else if (side === 1) { x = w + 20; y = Math.random() * h; }
    else if (side === 2) { x = Math.random() * w; y = h + 20; }
    else { x = -60; y = Math.random() * h; }
    const dx = centerRef.current.x - x;
    const dy = centerRef.current.y - y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 0.25 + level * 0.1 + Math.random() * 0.15;
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
    setScore(0);
    setHealth(100);
    setIsPlaying(true);
    setGameOver(false);
    setLevel(1);
    setUserInput('');
    setDefeated(0);
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    inputRef.current?.focus();
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
          setHealth(hp => {
            const nh = hp - damage;
            if (nh <= 0) { setGameOver(true); setIsPlaying(false); }
            return Math.max(0, nh);
          });
        }
        return updated.filter(e => !hits.includes(e));
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, level, spawnEnemy]);

  useEffect(() => {
    if (defeated > 0 && defeated % 8 === 0) setLevel(p => p + 1);
  }, [defeated]);

  useEffect(() => {
    if (gameOver && score > bestScore) setBestScore(score);
  }, [gameOver, score, bestScore]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isPlaying || gameOver) return;
    const matching = enemies.find(en => en.word.startsWith(value));
    if (matching) {
      setEnemies(prev => prev.map(en => en.word.startsWith(value) ? { ...en, typedSoFar: value } : en));
      const done = enemies.find(en => en.word === value);
      if (done) {
        setEnemies(prev => prev.filter(en => en.id !== done.id));
        setScore(p => p + done.word.length * 15 + level * 5);
        setDefeated(p => p + 1);
        setUserInput('');
        inputRef.current?.focus();
        return;
      }
    }
    setUserInput(value);
  };

  const renderWord = (en: Enemy) =>
    en.word.split('').map((ch, i) => {
      let cls = 'text-sm font-mono font-bold';
      if (i < en.typedSoFar.length) cls += en.typedSoFar[i] === ch ? ' text-green-300' : ' text-red-300';
      else cls += ' text-white';
      return <span key={i} className={cls}>{ch}</span>;
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Score', value: score, color: 'text-indigo-600' },
          { label: 'Level', value: level, color: 'text-purple-600' },
          { label: 'Defeated', value: defeated, color: 'text-green-600' },
          { label: 'Best', value: bestScore, color: 'text-amber-600' },
        ].map((s) => (
          <Card key={s.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Shield className="w-5 h-5 text-indigo-600" />
        <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
            style={{ width: `${health}%` }}
          />
        </div>
        <span className="text-sm font-mono font-bold text-gray-700">{health} HP</span>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div ref={gameAreaRef} className="relative w-full h-[450px] bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 rounded-lg overflow-hidden">
            {/* Base */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 shadow-[0_0_40px_rgba(129,140,248,0.6)] flex items-center justify-center border-4 border-white/40">
              <Shield className="w-8 h-8 text-white" />
            </div>
            {enemies.map(en => (
              <div
                key={en.id}
                className={`absolute px-3 py-1.5 rounded-lg ${en.color} shadow-lg border border-white/30 -translate-x-1/2 -translate-y-1/2`}
                style={{ left: en.x, top: en.y }}
              >
                {renderWord(en)}
              </div>
            ))}
            {(!isPlaying || gameOver) && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
                {gameOver ? (
                  <>
                    <div className="text-3xl font-bold text-white">Base Destroyed!</div>
                    <div className="text-xl text-gray-300">Score: {score}</div>
                    <div className="text-sm text-gray-400">Level reached: {level}</div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-white">Word Defense</div>
                )}
                <Button onClick={startGame} size="lg" className="gap-2">
                  <RotateCcw className="w-5 h-5" />
                  {gameOver ? 'Play Again' : 'Start Game'}
                </Button>
              </div>
            )}
          </div>
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              disabled={!isPlaying || gameOver}
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
