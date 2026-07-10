import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, RotateCcw, Flag, Trophy } from 'lucide-react';
import { sfx } from '@/lib/sound';
import { useGameRestart } from './GameShell';

const WORD_POOL = [
  'engine', 'wheel', 'brake', 'gear', 'turbo', 'road', 'speed', 'drive', 'race', 'track',
  'fast', 'shift', 'clutch', 'motor', 'fuel', 'tire', 'lane', 'pit', 'lap', 'finish',
  'apex', 'draft', 'corner', 'straight', 'nitro', 'boost', 'flag', 'sprint', 'circuit',
  'rally', 'pedal', 'wheelie', 'accelerate', 'overtake', 'throttle', 'chassis', 'exhaust',
  'quick', 'sharp', 'smooth', 'steady', 'launch', 'power', 'force', 'grip', 'slide',
  'the', 'and', 'you', 'for', 'with', 'from', 'this', 'that', 'have', 'will',
];

const DURATIONS = [30, 60, 90] as const;
const TRACK_LEN = 100; // percent
const OPPONENT_WPM = 45; // baseline pace for the rival

function pickWord(prev: string) {
  let w = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
  let guard = 0;
  while (w === prev && guard < 5) {
    w = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    guard++;
  }
  return w;
}

export default function CarRace() {
  const [duration, setDuration] = useState<number>(60);
  const [word, setWord] = useState(() => pickWord(''));
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(60);
  const [finished, setFinished] = useState(false);
  const [playerPos, setPlayerPos] = useState(0); // 0..TRACK_LEN
  const [oppPos, setOppPos] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wordsDone, setWordsDone] = useState(0);
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback((d: number = duration) => {
    setWord(pickWord(''));
    setTyped('');
    setStartedAt(null);
    setRemaining(d);
    setFinished(false);
    setPlayerPos(0);
    setOppPos(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWordsDone(0);
    setStreak(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [duration]);

  useGameRestart(() => reset());

  const changeDuration = (d: number) => {
    setDuration(d);
    setTimeout(() => reset(d), 0);
  };

  // Timer + opponent movement
  useEffect(() => {
    if (!startedAt || finished) return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const left = Math.max(0, duration - Math.floor(elapsed));
      setRemaining(left);
      // Opponent progresses linearly to reach ~TRACK_LEN in `duration * (OPPONENT_WPM / 60)` chars-per-min pace
      // Simpler: opponent finishes track in slightly more than duration -> steady progress
      const oppRate = TRACK_LEN / duration; // % per second
      setOppPos(Math.min(TRACK_LEN, elapsed * oppRate));
      if (left === 0) {
        setFinished(true);
        (playerPos >= oppPos ? sfx.win : sfx.lose)();
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, duration, finished]);

  // Finish early if player reaches the flag
  useEffect(() => {
    if (playerPos >= TRACK_LEN && !finished) {
      setFinished(true);
      sfx.win();
    }
  }, [playerPos, finished]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const v = e.target.value;
    if (!startedAt && v.length > 0) setStartedAt(Date.now());

    // If user typed a space at end and word matches, complete it
    if (v.endsWith(' ')) {
      const attempt = v.slice(0, -1);
      if (attempt === word) {
        setCorrectChars((c) => c + word.length);
        setWordsDone((n) => n + 1);
        setStreak((s) => s + 1);
        // Advance: each character = ~1% of track, scaled to duration
        const advance = (word.length * 60) / (duration * OPPONENT_WPM * 5) * TRACK_LEN;
        setPlayerPos((p) => Math.min(TRACK_LEN, p + advance + (streak >= 5 ? advance * 0.3 : 0)));
        setWord((prev) => pickWord(prev));
        setTyped('');
        sfx.pop();
        if ((streak + 1) % 5 === 0) sfx.streak();
      } else {
        // wrong submission: penalty, keep the word
        setIncorrectChars((c) => c + Math.max(1, attempt.length));
        setStreak(0);
        setTyped('');
        sfx.hit();
      }
      return;
    }

    // Live typing — track per-char correctness roughly
    if (v.length > typed.length) {
      const i = v.length - 1;
      if (v[i] !== word[i]) {
        // don't count here — counted at commit — but soft feedback
        sfx.key();
      } else {
        sfx.key();
      }
    }
    setTyped(v);
  };

  const elapsed = startedAt ? (Date.now() - startedAt) / 1000 : 0;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  const totalChars = correctChars + incorrectChars;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  const won = playerPos >= oppPos && finished;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-red-500" />
          <span className="text-sm font-semibold text-gray-700">Car Race</span>
        </div>
        {DURATIONS.map((d) => (
          <Button key={d} size="sm" variant={duration === d ? 'default' : 'outline'} onClick={() => changeDuration(d)}>
            {d}s
          </Button>
        ))}
        <Button size="sm" variant="outline" onClick={() => reset()} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Time', value: `${remaining}s`, color: 'text-purple-500' },
          { label: 'WPM', value: wpm, color: 'text-blue-500' },
          { label: 'Accuracy', value: `${accuracy}%`, color: 'text-green-500' },
          { label: 'Words', value: wordsDone, color: 'text-amber-500' },
          { label: 'Streak', value: streak, color: 'text-red-500' },
        ].map((s) => (
          <Card key={s.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Track */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-6 space-y-4 bg-gradient-to-b from-sky-100 via-white to-slate-100">
          {[
            { label: 'You', pos: playerPos, color: 'text-red-500', bg: 'bg-red-100' },
            { label: 'Rival', pos: oppPos, color: 'text-slate-600', bg: 'bg-slate-100' },
          ].map((lane) => (
            <div key={lane.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-semibold ${lane.color}`}>{lane.label}</span>
                <span className="text-muted-foreground">{Math.round(lane.pos)}%</span>
              </div>
              <div className={`relative h-12 rounded-lg border border-dashed border-slate-300 ${lane.bg}`}>
                {/* dashed lane markings */}
                <div className="absolute inset-y-1/2 left-0 right-0 border-t-2 border-dashed border-white/70" />
                {/* finish flag */}
                <Flag className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                {/* car */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-200 ease-out"
                  style={{ left: `calc(${Math.min(96, lane.pos)}% )` }}
                >
                  <Car className={`w-8 h-8 drop-shadow ${lane.color}`} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Typing zone */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 space-y-4">
          <div className="text-center">
            <div className="text-3xl font-mono tracking-wide">
              {word.split('').map((ch, i) => {
                let cls = 'text-gray-400';
                if (i < typed.length) cls = typed[i] === ch ? 'text-green-600' : 'text-red-500 underline';
                else if (i === typed.length) cls = 'text-blue-600 underline underline-offset-4';
                return <span key={i} className={cls}>{ch}</span>;
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Type the word and press <kbd className="px-1.5 py-0.5 border rounded bg-white text-[10px]">Space</kbd> to launch. Streaks of 5+ give a boost.
            </p>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={handleChange}
            placeholder="Type here to accelerate..."
            className="w-full p-4 text-xl border border-gray-200 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 text-center font-mono"
            autoFocus
            disabled={finished}
          />
        </CardContent>
      </Card>

      {finished && (
        <Card className={`border-0 shadow-lg ${won ? 'bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-200' : 'bg-gradient-to-r from-slate-50 to-rose-50 border border-rose-200'}`}>
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              {won ? <Trophy className="w-8 h-8 text-amber-500" /> : <Flag className="w-8 h-8 text-slate-500" />}
              <div className="text-3xl font-bold text-gray-800">
                {won ? 'You won the race! 🏁' : 'Rival won — try again!'}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
              <div><div className="text-3xl font-bold text-blue-500">{wpm}</div><div className="text-xs text-muted-foreground">WPM</div></div>
              <div><div className="text-3xl font-bold text-green-500">{accuracy}%</div><div className="text-xs text-muted-foreground">Accuracy</div></div>
              <div><div className="text-3xl font-bold text-amber-500">{wordsDone}</div><div className="text-xs text-muted-foreground">Words</div></div>
              <div><div className="text-3xl font-bold text-red-500">{Math.round(playerPos)}%</div><div className="text-xs text-muted-foreground">Distance</div></div>
              <div><div className="text-3xl font-bold text-emerald-500">{correctChars}</div><div className="text-xs text-muted-foreground">Correct Chars</div></div>
              <div><div className="text-3xl font-bold text-purple-500">{duration}s</div><div className="text-xs text-muted-foreground">Duration</div></div>
            </div>
            <Button onClick={() => reset()} size="lg" className="gap-2 mt-4">
              <RotateCcw className="w-4 h-4" /> Race Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
