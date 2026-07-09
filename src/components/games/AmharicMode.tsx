import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Languages } from 'lucide-react';

const AMHARIC_WORDS = [
  'ሰላም', 'እንደምን', 'አመሰግናለሁ', 'ኢትዮጵያ', 'አዲስ', 'አበባ', 'ቡና', 'እንጀራ',
  'ወዳጅ', 'ቤተሰብ', 'ትምህርት', 'መጽሐፍ', 'ተማሪ', 'መምህር', 'ጤና', 'ደስታ',
  'ፍቅር', 'ተስፋ', 'ሕይወት', 'ጊዜ', 'ቀን', 'ሌሊት', 'ጠዋት', 'ማታ',
  'ውሃ', 'እሳት', 'ምድር', 'ሰማይ', 'ፀሐይ', 'ጨረቃ', 'ኮከብ', 'ዝናብ',
  'ተራራ', 'ወንዝ', 'ባህር', 'ጫካ', 'አበባ', 'ዛፍ', 'እንስሳ', 'ወፍ',
];

const AMHARIC_PHRASES = [
  'ሰላም ለዓለም ሁሉ ይሁን።',
  'ኢትዮጵያ የታሪክ ሀገር ናት።',
  'መማር በጣም ጠቃሚ ነው።',
  'አዲስ አበባ የኢትዮጵያ ዋና ከተማ ናት።',
  'ቡና የኢትዮጵያ ባህላዊ መጠጥ ነው።',
  'እንጀራ የተለመደ የኢትዮጵያ ምግብ ነው።',
  'ትዕግስት ጣፋጭ ፍሬ አለው።',
  'እውቀት ኃይል ነው።',
  'ጓደኝነት እንደ ወርቅ ውድ ነው።',
  'ፀሐይ በምስራቅ ትወጣለች።',
];

type Mode = 'words' | 'phrases';

export default function AmharicMode() {
  const [mode, setMode] = useState<Mode>('words');
  const [target, setTarget] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const lastIndexRef = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickNext = useCallback((m: Mode) => {
    const pool = m === 'words' ? AMHARIC_WORDS : AMHARIC_PHRASES;
    let idx = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && idx === lastIndexRef.current) {
      idx = (idx + 1) % pool.length;
    }
    lastIndexRef.current = idx;
    return pool[idx];
  }, []);

  const reset = useCallback((m: Mode = mode) => {
    setTarget(pickNext(m));
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setCompleted(0);
    setErrors(0);
    setTotalTyped(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [mode, pickNext]);

  useEffect(() => {
    reset(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMode = (m: Mode) => {
    setMode(m);
    lastIndexRef.current = -1;
    setTarget(pickNext(m));
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setCompleted(0);
    setErrors(0);
    setTotalTyped(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (endTime) return;
    if (!startTime && v.length > 0) setStartTime(Date.now());

    // track new error at latest char
    if (v.length > userInput.length) {
      const i = v.length - 1;
      if (v[i] !== target[i]) setErrors((e) => e + 1);
      setTotalTyped((t) => t + 1);
    }
    setUserInput(v);

    if (v === target) {
      setCompleted((c) => c + 1);
      const next = pickNext(mode);
      setTarget(next);
      setUserInput('');
    }
  };

  const elapsedSec = startTime ? ((endTime ?? Date.now()) - startTime) / 1000 : 0;
  const wpm = elapsedSec > 0 ? Math.round((totalTyped / 5) / (elapsedSec / 60)) : 0;
  const accuracy = totalTyped > 0 ? Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100)) : 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2">
        <Button size="sm" variant={mode === 'words' ? 'default' : 'outline'} onClick={() => changeMode('words')}>
          Words / ቃላት
        </Button>
        <Button size="sm" variant={mode === 'phrases' ? 'default' : 'outline'} onClick={() => changeMode('phrases')}>
          Phrases / ሐረጎች
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          { label: 'Accuracy', value: `${accuracy}%`, color: 'text-green-600' },
          { label: 'Completed', value: completed, color: 'text-purple-600' },
          { label: 'Errors', value: errors, color: 'text-red-600' },
        ].map((s) => (
          <Card key={s.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="rounded-lg bg-gradient-to-br from-amber-50 via-white to-green-50 border border-amber-100 p-6 text-center">
            <div className="text-2xl md:text-3xl leading-relaxed font-serif tracking-wide" lang="am" dir="ltr">
              {target.split('').map((ch, i) => {
                let cls = '';
                if (i < userInput.length) {
                  cls = userInput[i] === ch ? 'text-green-600' : 'text-red-500 underline';
                } else if (i === userInput.length) {
                  cls = 'text-blue-600 underline underline-offset-4';
                } else {
                  cls = 'text-gray-400';
                }
                return <span key={i} className={cls}>{ch}</span>;
              })}
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleChange}
            lang="am"
            placeholder="እዚህ ይተይቡ... (Type here in Amharic)"
            className="w-full p-4 text-xl border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-center font-serif"
            autoFocus
          />

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              Tip: Enable an Amharic (Geez) keyboard on your OS, or use a browser IME extension like
              {' '}
              <a href="https://keyman.com/keyboards/sil_ethiopic" target="_blank" rel="noreferrer" className="text-blue-600 underline">Keyman SIL Ethiopic</a>
              {' '}or Google Input Tools to type Amharic characters.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button onClick={() => reset(mode)} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New {mode === 'words' ? 'Word' : 'Phrase'}
            </Button>
            <Button onClick={() => { setUserInput(''); inputRef.current?.focus(); }} variant="ghost" className="gap-2">
              <Languages className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
