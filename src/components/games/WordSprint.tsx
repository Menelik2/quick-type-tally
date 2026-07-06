import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Zap } from 'lucide-react';

const WORD_BANK = [
  "apple", "bridge", "castle", "dragon", "eagle", "forest", "garden", "harbor", "island", "jungle",
  "knight", "lunar", "mirror", "noble", "ocean", "palace", "quest", "river", "shadow", "tower",
  "unity", "valley", "wizard", "yellow", "zebra", "amber", "brave", "cloud", "dance", "ember",
  "flame", "grace", "heart", "ivory", "jewel", "karma", "light", "magic", "night", "orbit",
  "peace", "quiet", "rose", "storm", "train", "urban", "voice", "wave", "xenon", "yearn",
  "active", "bright", "calm", "deep", "early", "fair", "gold", "happy", "iron", "just",
  "keen", "large", "mild", "neat", "open", "proud", "quick", "rare", "safe", "true",
  "vast", "warm", "young", "alert", "bold", "cool", "direct", "eager", "fancy", "great",
  "high", "ideal", "jolly", "kind", "local", "major", "noble", "odd", "plain", "quiet",
  "rapid", "solid", "tight", "vital", "whole", "zeal", "about", "above", "across", "after"
];

function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_BANK].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

interface WordSprintProps {
  initialTimeLimit?: number;
}

export default function WordSprint({ initialTimeLimit = 60 }: WordSprintProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit);
  const [remainingTime, setRemainingTime] = useState(initialTimeLimit);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWords(getRandomWords(50));
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = Math.max(0, timeLimit - elapsed);
        setRemainingTime(timeLeft);
        if (timeLeft === 0) {
          setIsComplete(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete, timeLimit]);

  useEffect(() => {
    if (!startTime || totalTyped === 0) return;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = totalTyped / 5;
    const currentWpm = Math.round(wordsTyped / timeElapsed);
    setWpm(currentWpm);
  }, [totalTyped, startTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isComplete) return;

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    if (value.endsWith(' ') || value.endsWith('\n')) {
      const trimmed = value.trim();
      if (trimmed === words[currentWordIndex]) {
        setCorrectWords(prev => prev + 1);
        setStreak(prev => {
          const next = prev + 1;
          if (next > bestStreak) setBestStreak(next);
          return next;
        });
      } else {
        setStreak(0);
      }
      setTotalTyped(prev => prev + trimmed.length + 1);
      setUserInput('');
      setCurrentWordIndex(prev => {
        const next = prev + 1;
        if (next >= words.length) {
          setIsComplete(true);
        }
        return next;
      });
    } else {
      setUserInput(value);
    }
  };

  const resetTest = useCallback(() => {
    setWords(getRandomWords(50));
    setCurrentWordIndex(0);
    setUserInput('');
    setStartTime(null);
    setIsComplete(false);
    setRemainingTime(timeLimit);
    setCorrectWords(0);
    setTotalTyped(0);
    setStreak(0);
    setWpm(0);
    inputRef.current?.focus();
  }, [timeLimit]);

  const changeTimeLimit = (newLimit: number) => {
    setTimeLimit(newLimit);
    setRemainingTime(newLimit);
    resetTest();
  };

  const accuracy = totalTyped > 0 ? Math.round((correctWords / Math.max(1, currentWordIndex)) * 100) : 100;
  const progress = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0;
  const currentWord = words[currentWordIndex] || '';

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex gap-2">
          {[30, 60, 120].map((time) => (
            <Button key={time} variant={timeLimit === time ? "default" : "outline"} size="sm" onClick={() => changeTimeLimit(time)}>
              {time}s
            </Button>
          ))}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          { label: 'Words', value: `${correctWords}/${currentWordIndex}`, color: 'text-green-600' },
          { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 95 ? 'text-green-600' : accuracy >= 80 ? 'text-yellow-600' : 'text-red-600' },
          { label: 'Time', value: remainingTime, color: 'text-purple-600' },
          { label: 'Streak', value: streak, color: 'text-orange-600' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Word Display */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold font-mono tracking-wide">
              {currentWord.split('').map((char, idx) => {
                let cls = 'transition-colors duration-150';
                if (idx < userInput.length) {
                  cls += userInput[idx] === char ? ' text-green-500' : ' text-red-500';
                } else if (idx === userInput.length) {
                  cls += ' text-blue-600 underline underline-offset-4';
                } else {
                  cls += ' text-gray-400';
                }
                return <span key={idx} className={cls}>{char}</span>;
              })}
            </div>

            {/* Upcoming words preview */}
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              {words.slice(currentWordIndex + 1, currentWordIndex + 6).map((w, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded">{w}</span>
              ))}
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isComplete}
            placeholder={isComplete ? "Sprint complete!" : "Type the word and press space..."}
            className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 text-center font-mono"
            autoFocus
          />

          <div className="flex justify-center gap-4">
            <Button onClick={resetTest} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {isComplete && (
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-gray-800 mb-2">
                {remainingTime === 0 ? "Time's up!" : "Sprint Complete!"}
              </div>
              <div className="text-gray-600 space-y-1">
                <div>Words typed: <span className="font-semibold text-blue-600">{correctWords}</span></div>
                <div>Speed: <span className="font-semibold text-blue-600">{wpm} WPM</span></div>
                <div>Accuracy: <span className="font-semibold text-green-600">{accuracy}%</span></div>
                <div>Best streak: <span className="font-semibold text-orange-600">{bestStreak}</span></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
