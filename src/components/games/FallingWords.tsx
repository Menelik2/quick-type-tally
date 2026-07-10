import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Heart } from 'lucide-react';
import { useGameRestart } from './GameShell';

const WORD_BANK = [
  "apple", "bridge", "castle", "dragon", "eagle", "forest", "garden", "harbor", "island", "jungle",
  "knight", "lunar", "mirror", "noble", "ocean", "palace", "quest", "river", "shadow", "tower",
  "unity", "valley", "wizard", "yellow", "zebra", "amber", "brave", "cloud", "dance", "ember",
  "flame", "grace", "heart", "ivory", "jewel", "karma", "light", "magic", "night", "orbit",
  "peace", "quiet", "rose", "storm", "train", "urban", "voice", "wave", "yearn", "active",
  "bright", "calm", "deep", "early", "fair", "gold", "happy", "iron", "just", "keen",
  "large", "mild", "neat", "open", "proud", "quick", "rare", "safe", "true", "vast",
  "warm", "young", "alert", "bold", "cool", "direct", "eager", "fancy", "great", "high"
];

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  typedSoFar: string;
}

export default function FallingWords() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [wordsTyped, setWordsTyped] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(0);
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnWord = useCallback(() => {
    const wordText = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const gameWidth = gameAreaRef.current?.clientWidth || 600;
    const newWord: FallingWord = {
      id: nextIdRef.current++,
      word: wordText,
      x: 40 + Math.random() * (gameWidth - 200),
      y: -30,
      speed: 0.3 + level * 0.15 + Math.random() * 0.2,
      typedSoFar: '',
    };
    setWords(prev => [...prev, newWord]);
  }, [level]);

  const startGame = useCallback(() => {
    setWords([]);
    setScore(0);
    setLives(5);
    setIsPlaying(true);
    setGameOver(false);
    setLevel(1);
    setUserInput('');
    setWordsTyped(0);
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    inputRef.current?.focus();
  }, []);

  useGameRestart(() => startGame());

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const animate = (time: number) => {
      if (time - lastSpawnRef.current > Math.max(1200 - level * 80, 400)) {
        spawnWord();
        lastSpawnRef.current = time;
      }

      setWords(prev => {
        const updated = prev.map(w => ({ ...w, y: w.y + w.speed }));
        const offScreen = updated.filter(w => w.y > 420);
        if (offScreen.length > 0) {
          setLives(l => {
            const newLives = l - offScreen.length;
            if (newLives <= 0) {
              setGameOver(true);
              setIsPlaying(false);
            }
            return Math.max(0, newLives);
          });
        }
        return updated.filter(w => w.y <= 420);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, level, spawnWord]);

  useEffect(() => {
    if (wordsTyped > 0 && wordsTyped % 10 === 0) {
      setLevel(prev => prev + 1);
    }
  }, [wordsTyped]);

  useEffect(() => {
    if (gameOver && score > bestScore) {
      setBestScore(score);
    }
  }, [gameOver, score, bestScore]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isPlaying || gameOver) return;

    const matching = words.find(w => w.word.startsWith(value));
    if (matching) {
      setWords(prev => prev.map(w =>
        w.word.startsWith(value) ? { ...w, typedSoFar: value } : w
      ));

      const completed = words.find(w => w.word === value);
      if (completed) {
        setWords(prev => prev.filter(w => w.id !== completed.id));
        setScore(prev => prev + completed.word.length * 10 + level * 5);
        setWordsTyped(prev => prev + 1);
        setUserInput('');
        inputRef.current?.focus();
        return;
      }
    }
    setUserInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setUserInput('');
    }
    if (e.key === 'Backspace' && userInput === '') {
      setWords(prev => prev.map(w => ({ ...w, typedSoFar: '' })));
    }
  };

  const renderWord = (word: FallingWord) => {
    return word.word.split('').map((char, idx) => {
      let cls = 'text-lg font-mono font-bold';
      if (idx < word.typedSoFar.length) {
        cls += word.typedSoFar[idx] === char ? ' text-green-400' : ' text-red-400';
      } else {
        cls += ' text-white';
      }
      return <span key={idx} className={cls}>{char}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Score', value: score, color: 'text-blue-600' },
          { label: 'Level', value: level, color: 'text-purple-600' },
          { label: 'Words', value: wordsTyped, color: 'text-green-600' },
          { label: 'Best', value: bestScore, color: 'text-amber-600' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lives */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
        ))}
      </div>

      {/* Game Area */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-[450px] bg-slate-900 rounded-lg overflow-hidden"
          >
            {/* Stars background */}
            <div className="absolute inset-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            {/* Falling words */}
            {words.map(word => (
              <div
                key={word.id}
                className="absolute px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                style={{ left: word.x, top: word.y }}
              >
                {renderWord(word)}
              </div>
            ))}

            {/* Ground line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/50" />

            {/* Start / Game Over overlay */}
            {(!isPlaying || gameOver) && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
                {gameOver ? (
                  <>
                    <div className="text-3xl font-bold text-white">Game Over</div>
                    <div className="text-xl text-gray-300">Score: {score}</div>
                    <div className="text-sm text-gray-400">Level reached: {level}</div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-white">Falling Words</div>
                )}
                <Button onClick={startGame} size="lg" className="gap-2">
                  <RotateCcw className="w-5 h-5" />
                  {gameOver ? 'Play Again' : 'Start Game'}
                </Button>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!isPlaying || gameOver}
              placeholder={isPlaying ? "Type the falling words..." : "Press Start to play"}
              className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 text-center font-mono"
              autoFocus={isPlaying}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
