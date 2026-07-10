import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Languages } from 'lucide-react';
import { useGameRestart } from './GameShell';

type Mode = 'words' | 'phrases';
type Difficulty = 'easy' | 'medium' | 'hard';

// Easy: short common words (2-3 syllables)
const WORDS_EASY = [
  'ሰላም', 'ውሃ', 'እሳት', 'ቀን', 'ሌሊት', 'ቡና', 'ወፍ', 'ዛፍ', 'አበባ', 'ጨው',
  'እናት', 'አባት', 'ልጅ', 'ቤት', 'መኪና', 'ጠዋት', 'ማታ', 'ጤና', 'ደስታ', 'ፍቅር',
];

// Medium: longer everyday words
const WORDS_MEDIUM = [
  'እንደምን', 'አመሰግናለሁ', 'ኢትዮጵያ', 'ተማሪ', 'መምህር', 'መጽሐፍ', 'ትምህርት',
  'ወዳጅ', 'ቤተሰብ', 'ጊዜ', 'ተስፋ', 'ሕይወት', 'ተራራ', 'ወንዝ', 'ባህር', 'ጫካ',
  'ፀሐይ', 'ጨረቃ', 'ኮከብ', 'ዝናብ', 'ሰማይ', 'ምድር', 'እንስሳ', 'ጓደኝነት',
];

// Hard: rare / compound / longer vocabulary
const WORDS_HARD = [
  'ዲሞክራሲ', 'ሕገመንግስት', 'ጠቅላይሚኒስትር', 'ፕሬዚዳንት', 'ኤሌክትሮኒክስ',
  'ኮምፒውተር', 'ቴክኖሎጂ', 'አካባቢ', 'ዩኒቨርሲቲ', 'ፍልስፍና', 'ሥነጽሑፍ',
  'ኢኮኖሚ', 'ማኅበረሰብ', 'ባህላዊ', 'ታሪካዊ', 'መንፈሳዊ', 'ሳይንሳዊ',
  'ትብብር', 'ልማት', 'እድገት', 'ተግባራዊ', 'ኃላፊነት', 'ጤናማነት',
];

// Short phrases
const PHRASES_EASY = [
  'ሰላም ነው።',
  'እንዴት ነህ?',
  'ደህና ነኝ።',
  'ስምህ ማን ነው?',
  'ቡና እወዳለሁ።',
  'ዛሬ ጥሩ ቀን ነው።',
  'እናቴን እወዳለሁ።',
  'ውሃ ጠጣ።',
];

// Medium sentences
const PHRASES_MEDIUM = [
  'ኢትዮጵያ የታሪክ ሀገር ናት።',
  'መማር በጣም ጠቃሚ ነው።',
  'ቡና የኢትዮጵያ ባህላዊ መጠጥ ነው።',
  'እንጀራ የተለመደ የኢትዮጵያ ምግብ ነው።',
  'ጓደኝነት እንደ ወርቅ ውድ ነው።',
  'ፀሐይ በምስራቅ ትወጣለች።',
  'እውቀት ኃይል ነው።',
  'ትዕግስት ጣፋጭ ፍሬ አለው።',
];

// Long / complex passages — full paragraphs for advanced typists
const PHRASES_HARD = [
  'ኢትዮጵያ ከጥንት ጀምሮ የራሷ ፊደል፣ የራሷ ታሪክና የራሷ ባህል ያላት ጥንታዊ ሀገር ናት። ሕዝቦቿ በተለያዩ ቋንቋዎችና ባህሎች ቢለያዩም በአንድ ወንድማማችነት ተሳስረው ለዘመናት አብረው ኖረዋል።',
  'ትምህርት የሰው ልጅ አእምሮን የሚያበራ፣ ሕይወትን የሚቀይርና ማኅበረሰብን የሚያሳድግ ኃያል መሣሪያ ነው። ስለዚህ እያንዳንዱ ወጣት እውቀትን በትዕግስት መፈለግና ጠንክሮ መማር ይኖርበታል።',
  'የአዲስ አበባ ከተማ የአፍሪካ ኅብረት መቀመጫ በመሆኗ የዲፕሎማሲ ማዕከል ሆና ታገለግላለች። ከመላው ዓለም የመጡ ዲፕሎማቶችና ጎብኚዎች በየዕለቱ ወደዚች ከተማ ይመጣሉ።',
  'ቡና በኢትዮጵያ የተገኘ ሲሆን ዛሬ በዓለም ዙሪያ በሚሊዮን ለሚቆጠሩ ሰዎች ተወዳጅ መጠጥ ሆኗል። የቡና ሥነ ሥርዓት የኢትዮጵያ ሕዝብ የእንግድነትና የአንድነት መገለጫ ነው።',
  'ጠንክሮ የሚሠራ፣ ትዕግስት ያለውና እውነትን የሚናገር ሰው በሕይወቱ ስኬታማ ይሆናል። ውድቀት የስኬት መንገድ አካል መሆኑን ተረድቶ ተስፋ ሳይቆርጥ ወደፊት የሚራመድ ሰው ግቡን ይመታል።',
  'የኢትዮጵያ ተፈጥሮ በተራሮች፣ በወንዞች፣ በሐይቆችና በደኖች የተሞላ በመሆኑ ለጎብኚዎች ማራኪ ነው። ስሜን ተራሮች፣ ዳናኪል በረሃና ጣና ሐይቅ ከዓለም ተወዳዳሪ የተፈጥሮ ውበቶች መካከል ይመደባሉ።',
];

const POOLS: Record<Mode, Record<Difficulty, string[]>> = {
  words: { easy: WORDS_EASY, medium: WORDS_MEDIUM, hard: WORDS_HARD },
  phrases: { easy: PHRASES_EASY, medium: PHRASES_MEDIUM, hard: PHRASES_HARD },
};

export default function AmharicMode() {
  const [mode, setMode] = useState<Mode>('words');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [target, setTarget] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const lastTextRef = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const pickNext = useCallback((m: Mode, d: Difficulty) => {
    const pool = POOLS[m][d];
    if (pool.length === 0) return '';
    if (pool.length === 1) {
      lastTextRef.current = pool[0];
      return pool[0];
    }
    let choice = pool[Math.floor(Math.random() * pool.length)];
    let guard = 0;
    while (choice === lastTextRef.current && guard < 10) {
      choice = pool[Math.floor(Math.random() * pool.length)];
      guard++;
    }
    lastTextRef.current = choice;
    return choice;
  }, []);

  const resetStats = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setCompleted(0);
    setErrors(0);
    setTotalTyped(0);
  };

  const reset = useCallback((m: Mode = mode, d: Difficulty = difficulty) => {
    setTarget(pickNext(m, d));
    resetStats();
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [mode, difficulty, pickNext]);

  useEffect(() => {
    reset(mode, difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMode = (m: Mode) => {
    setMode(m);
    lastTextRef.current = '';
    setTarget(pickNext(m, difficulty));
    resetStats();
  };

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    lastTextRef.current = '';
    setTarget(pickNext(mode, d));
    resetStats();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (endTime) return;
    if (!startTime && v.length > 0) setStartTime(Date.now());

    if (v.length > userInput.length) {
      const i = v.length - 1;
      if (v[i] !== target[i]) setErrors((e) => e + 1);
      setTotalTyped((t) => t + 1);
    }
    setUserInput(v);

    if (v === target) {
      setCompleted((c) => c + 1);
      setTarget(pickNext(mode, difficulty));
      setUserInput('');
    }
  };

  const elapsedSec = startTime ? ((endTime ?? Date.now()) - startTime) / 1000 : 0;
  const wpm = elapsedSec > 0 ? Math.round((totalTyped / 5) / (elapsedSec / 60)) : 0;
  const accuracy = totalTyped > 0 ? Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100)) : 100;

  const difficultyColor: Record<Difficulty, string> = {
    easy: 'text-green-600',
    medium: 'text-amber-600',
    hard: 'text-red-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button size="sm" variant={mode === 'words' ? 'default' : 'outline'} onClick={() => changeMode('words')}>
          Words / ቃላት
        </Button>
        <Button size="sm" variant={mode === 'phrases' ? 'default' : 'outline'} onClick={() => changeMode('phrases')}>
          Phrases / ሐረጎች
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={difficulty === d ? 'default' : 'outline'}
            onClick={() => changeDifficulty(d)}
          >
            {d === 'easy' ? 'Easy / ቀላል' : d === 'medium' ? 'Medium / መካከለኛ' : 'Hard / ከባድ'}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          { label: 'Accuracy', value: `${accuracy}%`, color: 'text-green-600' },
          { label: 'Completed', value: completed, color: 'text-purple-600' },
          { label: 'Errors', value: errors, color: 'text-red-600' },
          { label: 'Level', value: difficulty, color: difficultyColor[difficulty] },
        ].map((s) => (
          <Card key={s.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold capitalize ${s.color}`}>{s.value}</div>
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

          {target.length > 80 ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={userInput}
              onChange={handleChange}
              lang="am"
              rows={4}
              placeholder="እዚህ ረጅም አንቀጽ ይተይቡ... (Type the full paragraph here)"
              className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 font-serif leading-relaxed resize-none"
              autoFocus
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={userInput}
              onChange={handleChange}
              lang="am"
              placeholder="እዚህ ይተይቡ... (Type here in Amharic)"
              className="w-full p-4 text-xl border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-center font-serif"
              autoFocus
            />
          )}

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              Tip: Enable an Amharic (Geez) keyboard on your OS, or use a browser IME extension like
              {' '}
              <a href="https://keyman.com/keyboards/sil_ethiopic" target="_blank" rel="noreferrer" className="text-blue-600 underline">Keyman SIL Ethiopic</a>
              {' '}or Google Input Tools to type Amharic characters.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button onClick={() => reset(mode, difficulty)} variant="outline" className="gap-2">
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
