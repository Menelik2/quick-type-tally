import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Heart } from 'lucide-react';

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

export default function BubblePop() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [popped, setPopped] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(0);
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnBubble = useCallback(() => {
    const wordText = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const gameWidth = gameAreaRef.current?.clientWidth || 600;
    const size = 70 + Math.random() * 40;
    const newBubble: Bubble = {
      id: nextIdRef.current++,
      word: wordText,
      x: 40 + Math.random() * (gameWidth - size - 80),
      y: 450,
      speed: 0.25 + level * 0.12 + Math.random() * 0.15,
      size,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      typedSoFar: '',
      drift: (Math.random() - 0.5) * 0.3,
    };
    setBubbles(prev => [...prev, newBubble]);
  }, [level]);

  const startGame = useCallback(() => {
    setBubbles([]);
    setScore(0);
    setLives(5);
    setIsPlaying(true);
    setGameOver(false);
    setLevel(1);
    setUserInput('');
    setPopped(0);
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    inputRef.current?.focus();
  }, []);

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
          setLives(l => {
            const nl = l - escaped.length;
            if (nl <= 0) { setGameOver(true); setIsPlaying(false); }
            return Math.max(0, nl);
          });
        }
        return updated.filter(b => b.y >= -60);
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, level, spawnBubble]);

  useEffect(() => {
    if (popped > 0 && popped % 10 === 0) setLevel(p => p + 1);
  }, [popped]);

  useEffect(() => {
    if (gameOver && score > bestScore) setBestScore(score);
  }, [gameOver, score, bestScore]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isPlaying || gameOver) return;
    const matching = bubbles.find(b => b.word.startsWith(value));
    if (matching) {
      setBubbles(prev => prev.map(b => b.word.startsWith(value) ? { ...b, typedSoFar: value } : b));
      const done = bubbles.find(b => b.word === value);
      if (done) {
        setBubbles(prev => prev.filter(b => b.id !== done.id));
        setScore(p => p + done.word.length * 12 + level * 5);
        setPopped(p => p + 1);
        setUserInput('');
        inputRef.current?.focus();
        return;
      }
    }
    setUserInput(value);
  };

  const renderWord = (b: Bubble) =>
    b.word.split('').map((ch, i) => {
      let cls = 'text-sm font-mono font-bold';
      if (i < b.typedSoFar.length) cls += b.typedSoFar[i] === ch ? ' text-green-700' : ' text-red-700';
      else cls += ' text-slate-800';
      return <span key={i} className={cls}>{ch}</span>;
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Score', value: score, color: 'text-cyan-600' },
          { label: 'Level', value: level, color: 'text-purple-600' },
          { label: 'Popped', value: popped, color: 'text-green-600' },
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

      <div className="flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
        ))}
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div ref={gameAreaRef} className="relative w-full h-[450px] bg-gradient-to-b from-sky-200 via-cyan-100 to-blue-100 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-400/60" />
            {bubbles.map(b => (
              <div
                key={b.id}
                className={`absolute flex items-center justify-center rounded-full bg-gradient-to-br ${b.color} shadow-lg border-2 border-white/60 backdrop-blur-sm`}
                style={{ left: b.x, top: b.y, width: b.size, height: b.size }}
              >
                <div className="text-center px-1">{renderWord(b)}</div>
              </div>
            ))}
            {(!isPlaying || gameOver) && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
                {gameOver ? (
                  <>
                    <div className="text-3xl font-bold text-white">Bubbles Escaped!</div>
                    <div className="text-xl text-gray-100">Score: {score}</div>
                    <div className="text-sm text-gray-200">Level reached: {level}</div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-white">Bubble Pop</div>
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
