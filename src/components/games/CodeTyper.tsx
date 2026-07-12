import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Code2 } from 'lucide-react';
import { useGameRestart } from './GameShell';

type Lang = 'javascript' | 'python' | 'html' | 'css';

const SNIPPETS: Record<Lang, string[]> = {
  javascript: [
    `function fibonacci(n) {\n  if (n < 2) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
    `const sum = arr.reduce((a, b) => a + b, 0);\nconst avg = sum / arr.length;\nconsole.log({ sum, avg });`,
    `async function fetchUser(id) {\n  const res = await fetch(\`/api/users/\${id}\`);\n  if (!res.ok) throw new Error('failed');\n  return res.json();\n}`,
    `const debounce = (fn, ms) => {\n  let t;\n  return (...a) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...a), ms);\n  };\n};`,
  ],
  python: [
    `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + [pivot] + quicksort(right)`,
    `class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, x):\n        self.items.append(x)\n    def pop(self):\n        return self.items.pop()`,
    `with open('data.txt', 'r') as f:\n    lines = [line.strip() for line in f if line.strip()]\nprint(f"Loaded {len(lines)} lines")`,
  ],
  html: [
    `<nav class="navbar">\n  <a href="/" class="logo">Home</a>\n  <ul>\n    <li><a href="/about">About</a></li>\n    <li><a href="/contact">Contact</a></li>\n  </ul>\n</nav>`,
    `<form onsubmit="return validate()">\n  <label for="email">Email</label>\n  <input id="email" type="email" required />\n  <button type="submit">Send</button>\n</form>`,
  ],
  css: [
    `.card {\n  display: flex;\n  padding: 1.5rem;\n  border-radius: 0.75rem;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n  background: #ffffff;\n}`,
    `@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n    gap: 1rem;\n  }\n}`,
  ],
};

const LANGS: { key: Lang; label: string; color: string }[] = [
  { key: 'javascript', label: 'JavaScript', color: 'text-yellow-600' },
  { key: 'python', label: 'Python', color: 'text-blue-600' },
  { key: 'html', label: 'HTML', color: 'text-orange-600' },
  { key: 'css', label: 'CSS', color: 'text-sky-600' },
];

export default function CodeTyper() {
  const [lang, setLang] = useState<Lang>('javascript');
  const [target, setTarget] = useState('');
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const lastRef = useRef('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const pick = useCallback((l: Lang) => {
    const pool = SNIPPETS[l];
    let choice = pool[Math.floor(Math.random() * pool.length)];
    let guard = 0;
    while (choice === lastRef.current && pool.length > 1 && guard < 8) {
      choice = pool[Math.floor(Math.random() * pool.length)];
      guard++;
    }
    lastRef.current = choice;
    return choice;
  }, []);

  const reset = useCallback((l: Lang = lang) => {
    setTarget(pick(l));
    setInput('');
    setStartedAt(null);
    setFinishedAt(null);
    setErrors(0);
    setTotalTyped(0);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [lang, pick]);

  useGameRestart(() => reset());

  useEffect(() => {
    reset(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    lastRef.current = '';
    setTarget(pick(l));
    setInput('');
    setStartedAt(null);
    setFinishedAt(null);
    setErrors(0);
    setTotalTyped(0);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finishedAt) return;
    const v = e.target.value;
    if (v.length > target.length) return; // don't overrun
    if (!startedAt && v.length > 0) setStartedAt(Date.now());
    if (v.length > input.length) {
      const i = v.length - 1;
      if (v[i] !== target[i]) setErrors((x) => x + 1);
      setTotalTyped((x) => x + 1);
    }
    setInput(v);
    if (v === target) setFinishedAt(Date.now());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Insert 2 spaces on Tab so users can type code naturally
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const insert = '  ';
      const next = input.slice(0, start) + insert + input.slice(end);
      if (next.length <= target.length) {
        setInput(next);
        if (!startedAt) setStartedAt(Date.now());
        setTotalTyped((x) => x + insert.length);
        for (let i = 0; i < insert.length; i++) {
          if (insert[i] !== target[start + i]) setErrors((x) => x + 1);
        }
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + insert.length;
        });
      }
    }
  };

  const elapsed = startedAt ? ((finishedAt ?? Date.now()) - startedAt) / 1000 : 0;
  const wpm = elapsed > 0 ? Math.round((totalTyped / 5) / (elapsed / 60)) : 0;
  const accuracy = totalTyped > 0 ? Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100)) : 100;
  const progress = target.length ? Math.round((input.length / target.length) * 100) : 0;

  // Live-render every character so newlines and indentation stay visible
  const rendered = useMemo(() => {
    const chars: JSX.Element[] = [];
    for (let i = 0; i < target.length; i++) {
      const ch = target[i];
      let cls = 'text-gray-400';
      if (i < input.length) cls = input[i] === ch ? 'text-emerald-600' : 'text-red-500 bg-red-100 rounded-sm';
      else if (i === input.length) cls = 'text-blue-600 bg-blue-100 rounded-sm';
      if (ch === '\n') {
        chars.push(<span key={i} className={cls}>↵{'\n'}</span>);
      } else if (ch === ' ') {
        chars.push(<span key={i} className={cls}>·</span>);
      } else {
        chars.push(<span key={i} className={cls}>{ch}</span>);
      }
    }
    return chars;
  }, [target, input]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {LANGS.map((l) => (
          <Button
            key={l.key}
            size="sm"
            variant={lang === l.key ? 'default' : 'outline'}
            onClick={() => changeLang(l.key)}
            className="gap-2"
          >
            <Code2 className="w-4 h-4" />
            {l.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'WPM', value: wpm, color: 'text-blue-600' },
          { label: 'Accuracy', value: `${accuracy}%`, color: 'text-emerald-600' },
          { label: 'Progress', value: `${progress}%`, color: 'text-purple-600' },
          { label: 'Errors', value: errors, color: 'text-red-600' },
          { label: 'Language', value: lang, color: LANGS.find((x) => x.key === lang)!.color },
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
        <CardContent className="p-6 space-y-5">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 overflow-auto max-h-[360px]">
            <pre className="font-mono text-base md:text-lg leading-relaxed whitespace-pre-wrap break-all text-slate-300">
              {rendered}
            </pre>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            rows={6}
            placeholder="// Start typing the snippet exactly as shown. Tab inserts 2 spaces."
            className="w-full p-4 text-base md:text-lg font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 leading-relaxed resize-none bg-white"
            autoFocus
          />

          {finishedAt && (
            <div className="text-center rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 p-4">
              <div className="text-lg font-semibold text-emerald-700">Snippet complete!</div>
              <div className="text-sm text-muted-foreground">
                {wpm} WPM · {accuracy}% accuracy · {Math.round(elapsed)}s
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button onClick={() => reset(lang)} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Snippet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
