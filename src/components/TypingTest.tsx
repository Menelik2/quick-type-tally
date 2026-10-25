import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Keyboard,
  Zap,
  Rocket,
  Circle,
  Shield,
  Languages,
  Banana,
  Car,
  Code2,
  Swords,
  Sparkles,
  Target,
  Trophy,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  Command,
} from 'lucide-react';
import ClassicMode from './games/ClassicMode';
import WordSprint from './games/WordSprint';
import FallingWords from './games/FallingWords';
import BubblePop from './games/BubblePop';
import WordDefense from './games/WordDefense';
import AmharicMode from './games/AmharicMode';
import MonkeyMode from './games/MonkeyMode';
import CarRace from './games/CarRace';
import CodeTyper from './games/CodeTyper';
import NinjaMode from './games/NinjaMode';
import GameShell from './games/GameShell';

const modes = [
  { value: 'classic', label: 'Classic', icon: Keyboard, hint: 'Build your basics', category: 'Practice' },
  { value: 'sprint', label: 'Sprint', icon: Zap, hint: 'Race the clock', category: 'Speed' },
  { value: 'falling', label: 'Falling Words', icon: Rocket, hint: 'Type before they fall', category: 'Arcade' },
  { value: 'bubble', label: 'Bubbles', icon: Circle, hint: 'Pop each word', category: 'Arcade' },
  { value: 'defense', label: 'Word Defense', icon: Shield, hint: 'Protect your base', category: 'Arcade' },
  { value: 'car', label: 'Car Race', icon: Car, hint: 'Race with accuracy', category: 'Race' },
  { value: 'monkey', label: 'Monkey', icon: Banana, hint: 'Keep your rhythm', category: 'Challenge' },
  { value: 'amharic', label: 'አማርኛ', icon: Languages, hint: 'Practice in Amharic', category: 'Language' },
  { value: 'code', label: 'Code Typer', icon: Code2, hint: 'Type code patterns', category: 'Developer' },
  { value: 'ninja', label: 'Ninja', icon: Swords, hint: 'Sharpen your reflexes', category: 'Challenge' },
];

function ModeTrigger({ mode }: { mode: (typeof modes)[number] }) {
  const Icon = mode.icon;
  return (
    <TabsTrigger
      value={mode.value}
      title={mode.hint}
      className="group relative flex h-auto min-h-[76px] min-w-[100px] shrink-0 flex-col items-start justify-center gap-3 rounded-2xl border border-transparent bg-transparent px-3 py-3 text-left text-slate-500 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-emerald-500 data-[state=active]:border-emerald-200 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)] sm:min-w-0 sm:flex-row sm:items-center sm:gap-2.5 sm:px-3 sm:py-3 lg:min-h-[84px] lg:flex-col lg:items-start lg:gap-2 lg:px-3.5"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/80 transition-all group-data-[state=active]:bg-emerald-600 group-data-[state=active]:text-white group-data-[state=active]:ring-emerald-600">
        <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap text-xs font-bold tracking-tight sm:text-[13px]">{mode.label}</span>
        <span className="mt-1 hidden text-[10px] font-medium text-slate-400 lg:block">{mode.category}</span>
      </span>
      <span className="absolute right-3 top-3 hidden h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-0 transition-opacity group-data-[state=active]:opacity-100 sm:block" />
    </TabsTrigger>
  );
}

export default function TypingTest() {
  return (
    <main className="yene-app min-h-screen bg-[#f6f8f7] text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[440px] bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.09),_transparent_60%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-3 pb-8 pt-3 sm:px-6 sm:pb-12 sm:pt-5 lg:px-10 lg:pt-7">
        <header className="mb-8 flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4 sm:mb-10 sm:pb-5">
          <a href="#top" className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-slate-950 text-emerald-300 shadow-lg shadow-slate-900/10 transition-transform group-hover:-rotate-3 sm:h-11 sm:w-11">
              <Keyboard className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-extrabold tracking-tight text-slate-950 sm:text-base">Yene<span className="text-emerald-600">Typing</span></span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">Typing practice studio</span>
            </span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-500 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready to practice
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-600 shadow-sm sm:px-3">
              <Languages className="h-3.5 w-3.5 text-emerald-600" /> EN <span className="text-slate-300">/</span> አማ
            </span>
          </div>
        </header>

        <section id="top" className="mb-7 grid gap-6 lg:mb-9 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-800 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Your daily skill builder
            </div>
            <h1 className="max-w-3xl text-[2.15rem] font-black leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Better typing starts with <span className="text-emerald-600">one keystroke.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
              Train your speed, accuracy, and focus with purposeful practice and quick arcade challenges—in English or Amharic.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 sm:text-sm">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Accuracy before speed</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-600" /> Progress at your pace</span>
            </div>
          </div>

          <aside className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.4)] sm:gap-3 sm:p-4 lg:mb-1">
            <div className="rounded-xl bg-slate-50 px-2 py-3 text-center sm:px-3 sm:py-4">
              <span className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Keyboard className="h-4 w-4" /></span>
              <p className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">10</p>
              <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-xs">Game modes</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-2 py-3 text-center sm:px-3 sm:py-4">
              <span className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-700"><Languages className="h-4 w-4" /></span>
              <p className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">2</p>
              <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-xs">Languages</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-2 py-3 text-center sm:px-3 sm:py-4">
              <span className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-700"><Trophy className="h-4 w-4" /></span>
              <p className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">∞</p>
              <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-xs">Ways to grow</p>
            </div>
          </aside>
        </section>

        <section aria-labelledby="practice-heading" className="overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)] sm:rounded-[30px]">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700 sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> The practice room
              </div>
              <h2 id="practice-heading" className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Choose your challenge</h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">Pick a mode, settle into a rhythm, and beat your personal best.</p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-100 sm:text-xs">
              <Command className="h-3.5 w-3.5 text-slate-400" /> Select a mode to begin
            </div>
          </div>

          <div className="p-3 sm:p-5 lg:p-7">
            <Tabs defaultValue="classic" className="w-full">
              <TabsList
                aria-label="Choose a typing game"
                className="flex h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-2xl bg-slate-50/90 p-1.5 sm:grid sm:grid-cols-5 sm:gap-2 sm:p-2 lg:grid-cols-5 xl:grid-cols-10"
              >
                {modes.map((mode) => <ModeTrigger key={mode.value} mode={mode} />)}
              </TabsList>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100/80 bg-emerald-50/50 px-3 py-2.5 text-[11px] leading-5 text-emerald-900 sm:mt-5 sm:items-center sm:text-xs">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 sm:mt-0" aria-hidden="true" />
                <span><strong className="font-bold">Pro tip:</strong> aim for clean, consistent keystrokes. Speed builds naturally as your accuracy improves.</span>
                <ArrowUpRight className="ml-auto hidden h-4 w-4 shrink-0 text-emerald-700 sm:block" aria-hidden="true" />
              </div>

              <TabsContent value="classic" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><ClassicMode timeLimit={60} monkeyMode={false} /></GameShell></TabsContent>
              <TabsContent value="sprint" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><WordSprint initialTimeLimit={60} /></GameShell></TabsContent>
              <TabsContent value="falling" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><FallingWords /></GameShell></TabsContent>
              <TabsContent value="bubble" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><BubblePop /></GameShell></TabsContent>
              <TabsContent value="defense" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><WordDefense /></GameShell></TabsContent>
              <TabsContent value="car" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><CarRace /></GameShell></TabsContent>
              <TabsContent value="monkey" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><MonkeyMode /></GameShell></TabsContent>
              <TabsContent value="amharic" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><AmharicMode /></GameShell></TabsContent>
              <TabsContent value="code" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><CodeTyper /></GameShell></TabsContent>
              <TabsContent value="ninja" className="mt-4 rounded-2xl focus-visible:outline-none sm:mt-6"><GameShell><NinjaMode /></GameShell></TabsContent>
            </Tabs>
          </div>
        </section>

        <footer className="mt-6 flex flex-col gap-3 px-1 py-4 text-[11px] font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <span>Small practice sessions. Real progress.</span>
          <span className="flex items-center gap-2">Yene Typing <span className="h-1 w-1 rounded-full bg-slate-300" /> Crafted by Menelik Admasu</span>
        </footer>
      </div>
    </main>
  );
}
