import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Eye, EyeOff, Keyboard, Activity } from 'lucide-react';
import { useGameRestart } from './GameShell';

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

const WORD_LIST = [
  "apple", "bridge", "castle", "dragon", "eagle", "forest", "garden", "harbor", "island", "jungle",
  "knight", "lunar", "mirror", "noble", "ocean", "palace", "quest", "river", "shadow", "tower",
  "unity", "valley", "wizard", "yellow", "zebra", "amber", "brave", "cloud", "dance", "ember",
  "flame", "grace", "heart", "ivory", "jewel", "karma", "light", "magic", "night", "orbit",
  "peace", "quiet", "rose", "storm", "train", "urban", "voice", "wave", "xenon", "yearn"
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
  const [accuracy, setAccuracy] = useState(100);
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit);
  const [remainingTime, setRemainingTime] = useState(initialTimeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [monkeyMode, setMonkeyMode] = useState(initialMonkeyMode);
  const [streak, setStreak] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTextIndexRef = useRef<number>(-1);

  const pickNextIndex = (mode: boolean) => {
    const pool = mode ? MONKEY_PHRASES : SAMPLE_TEXTS;
    if (pool.length <= 1) return 0;
    let next = Math.floor(Math.random() * pool.length);
    while (next === lastTextIndexRef.current) {
      next = Math.floor(Math.random() * pool.length);
    }
    lastTextIndexRef.current = next;
    return next;
  };

  const currentText = monkeyMode
    ? MONKEY_PHRASES[currentTextIndex % MONKEY_PHRASES.length].repeat(3)
    : SAMPLE_TEXTS[currentTextIndex];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (startTime && !isComplete && !isTimeUp) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = Math.max(0, timeLimit - elapsed);
        setRemainingTime(timeLeft);
        if (timeLeft === 0) {
          setIsTimeUp(true);
          setIsComplete(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete, isTimeUp, timeLimit]);

  useEffect(() => {
    if (!startTime || userInput.length === 0) return;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = userInput.length / 5;
    const currentWpm = Math.round(wordsTyped / timeElapsed);
    setWpm(currentWpm);
    if (currentWpm > bestWpm) setBestWpm(currentWpm);

    let correctCount = 0;
    let errorCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) correctCount++;
      else errorCount++;
    }
    setCorrectChars(correctCount);
    setErrors(errorCount);
    const currentAccuracy = userInput.length > 0 ? Math.round((correctCount / userInput.length) * 100) : 100;
    setAccuracy(currentAccuracy);

    if (userInput.length > 0 && userInput[userInput.length - 1] === currentText[userInput.length - 1]) {
      setStreak(prev => prev + 1);
    } else if (userInput.length > 0) {
      setStreak(0);
    }

    if (userInput.length === currentText.length && !isTimeUp) {
      setIsComplete(true);
    }
  }, [userInput, startTime, currentText, isTimeUp, bestWpm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isTimeUp || isComplete) return;
    if (value.length === 1 && !startTime) setStartTime(Date.now());
    if (value.length <= currentText.length) setUserInput(value);
  };

  const changeTimeLimit = (newLimit: number) => {
    setTimeLimit(newLimit);
    setRemainingTime(newLimit);
    resetTest(newLimit);
  };

  const resetTest = (limit?: number) => {
    setUserInput('');
    setStartTime(null);
    setIsComplete(false);
    setIsTimeUp(false);
    setWpm(0);
    setAccuracy(100);
    setStreak(0);
    setErrors(0);
    setCorrectChars(0);
    setRemainingTime(limit ?? timeLimit);
    setCurrentTextIndex(pickNextIndex(monkeyMode));
    inputRef.current?.focus();
  };

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'transition-all duration-150';
      if (index < userInput.length) {
        if (userInput[index] === char) className += ' text-green-500 bg-green-50';
        else className += ' text-red-500 bg-red-50';
      } else if (index === userInput.length) {
        className += ' bg-blue-200 animate-pulse';
      } else {
        className += ' text-muted-foreground';
      }
      return <span key={index} className={className}>{char}</span>;
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
    const initial = pickNextIndex(initialMonkeyMode);
    setCurrentTextIndex(initial);
  }, []);

  // Keyboard shortcuts: Tab/Esc to reset, Ctrl/Cmd+M toggle mode, Ctrl/Cmd+F focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setMonkeyMode(prev => {
          const next = !prev;
          setUserInput('');
          setStartTime(null);
          setIsComplete(false);
          setIsTimeUp(false);
          setWpm(0);
          setAccuracy(100);
          setStreak(0);
          setErrors(0);
          setCorrectChars(0);
          setRemainingTime(timeLimit);
          setCurrentTextIndex(pickNextIndex(next));
          inputRef.current?.focus();
          return next;
        });
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFocusMode(f => !f);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [timeLimit]);

  if (focusMode && startTime && !isComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>WPM: {wpm}</div>
            <div>Time: {remainingTime}s</div>
            <div>Accuracy: {accuracy}%</div>
            <Button variant="ghost" size="sm" onClick={toggleFocusMode} className="text-gray-400 hover:text-white">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-2xl leading-relaxed font-mono text-center px-8">{renderText()}</div>
          <input ref={inputRef} type="text" value={userInput} onChange={handleInputChange} className="sr-only" autoFocus />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex gap-2">
          {[15, 30, 60, 120].map((time) => (
            <Button key={time} variant={timeLimit === time ? "default" : "outline"} size="sm" onClick={() => changeTimeLimit(time)}>
              {time}s
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant={!monkeyMode ? "default" : "outline"} size="sm" onClick={() => { if (monkeyMode) { setMonkeyMode(false); lastTextIndexRef.current = -1; setCurrentTextIndex(pickNextIndex(false)); resetTest(); } }} className="gap-2" title="Random paragraphs">
            <Keyboard className="w-4 h-4" />
            Paragraphs
          </Button>
          <Button variant={monkeyMode ? "default" : "outline"} size="sm" onClick={() => { if (!monkeyMode) { setMonkeyMode(true); lastTextIndexRef.current = -1; setCurrentTextIndex(pickNextIndex(true)); resetTest(); } }} className="gap-2" title="Fun phrases">
            <Activity className="w-4 h-4" />
            Fun Phrases
          </Button>
          <Button variant={focusMode ? "default" : "outline"} size="sm" onClick={toggleFocusMode} className="gap-2" title="Focus mode (Ctrl+F)">
            {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Focus
          </Button>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500">
        Shortcuts: <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">Esc</kbd> reset · <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">M</kbd> toggle mode · <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">F</kbd> focus
      </div>

      <Progress value={(userInput.length / currentText.length) * 100} className="h-2" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {[
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 95 ? 'text-green-600' : accuracy >= 80 ? 'text-yellow-600' : 'text-red-600' },
          { label: 'Time', value: remainingTime, color: 'text-purple-600' },
          { label: 'Correct', value: correctChars, color: 'text-green-600' },
          { label: 'Errors', value: errors, color: 'text-red-600' },
          { label: 'Streak', value: streak, color: 'text-orange-600' },
          { label: 'Best', value: bestWpm, color: 'text-amber-600' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Typing Area */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="relative p-6 bg-gray-50 rounded-lg">
            <div className="text-lg leading-relaxed font-mono">{renderText()}</div>
            <div className="absolute top-2 right-2 text-xs text-gray-400">
              {Math.round((userInput.length / currentText.length) * 100)}%
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isComplete}
            placeholder={isComplete ? "Test completed!" : "Start typing here..."}
            className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
          />
          <div className="flex justify-center gap-4">
            <Button onClick={() => resetTest()} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button onClick={toggleFocusMode} variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Focus Mode
            </Button>
          </div>
          {isComplete && (
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-gray-800 mb-2">
                {isTimeUp ? "Time's up!" : "Test Complete!"}
              </div>
              <div className="text-gray-600">
                Final speed: <span className="font-semibold text-blue-600">{wpm} WPM</span> |
                Accuracy: <span className="font-semibold text-green-600">{accuracy}%</span>
              </div>
              {monkeyMode && (
                <div className="mt-2 text-sm text-amber-600">
                  Banana count: {Math.floor(wpm / 10)} bananas!
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
