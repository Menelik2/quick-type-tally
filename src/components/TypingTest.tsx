import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Keyboard, Zap, Rocket, Circle, Shield, Languages, Banana, Car, Code2, Swords,
  Sparkles, Target, Trophy, ArrowUpRight, Activity, CheckCircle2, ChevronRight, SlidersHorizontal,
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
  { value: 'classic', label: 'Classic typing', short: 'Classic', icon: Keyboard, hint: 'Build your basics', category: 'PRACTICE' },
  { value: 'sprint', label: 'Word sprint', short: 'Sprint', icon: Zap, hint: 'Race the clock', category: 'SPEED' },
  { value: 'falling', label: 'Falling words', short: 'Falling Words', icon: Rocket, hint: 'Type before they fall', category: 'ARCADE' },
  { value: 'bubble', label: 'Bubble pop', short: 'Bubbles', icon: Circle, hint: 'Pop each word', category: 'ARCADE' },
  { value: 'defense', label: 'Word defense', short: 'Defense', icon: Shield, hint: 'Protect your base', category: 'ARCADE' },
  { value: 'car', label: 'Car race', short: 'Car Race', icon: Car, hint: 'Race with accuracy', category: 'RACE' },
  { value: 'monkey', label: 'Monkey type', short: 'Monkey', icon: Banana, hint: 'Keep your rhythm', category: 'CHALLENGE' },
  { value: 'amharic', label: 'Amharic typing', short: 'አማርኛ', icon: Languages, hint: 'Practice in Amharic', category: 'LANGUAGE' },
  { value: 'code', label: 'Code typing', short: 'Code Typer', icon: Code2, hint: 'Type code patterns', category: 'DEVELOPER' },
  { value: 'ninja', label: 'Ninja challenge', short: 'Ninja', icon: Swords, hint: 'Sharpen your reflexes', category: 'CHALLENGE' },
];

function ModeTrigger({ mode }: { mode: (typeof modes)[number] }) {
  const Icon = mode.icon;
  return (
    <TabsTrigger
      value={mode.value}
      title={mode.hint}
      className="group flex h-auto min-h-[58px] w-full shrink-0 items-center justify-start gap-3 rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-left text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-violet-500 data-[state=active]:border-violet-100 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-950 data-[state=active]:shadow-sm"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 transition-colors group-data-[state=active]:bg-violet-600 group-data-[state=active]:text-white group-data-[state=active]:ring-violet-600">
        <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold">{mode.short}</span>
        <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-400 group-data-[state=active]:text-violet-700">{mode.hint}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 opacity-0 transition-all group-data-[state=active]:translate-x-0.5 group-data-[state=active]:text-violet-500 group-data-[state=active]:opacity-100" />
    </TabsTrigger>
  );
}

export default function TypingTest() {
  return (
    <main className="yene-app min-h-screen bg-[#f5f6fa] text-slate-900 selection:bg-violet-200 selection:text-violet-950">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.09),transparent_58%),radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.07),transparent_45%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1540px] px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-10 lg:pt-8">
        <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_3px_14px_-10px_rgba(15,23,42,0.25)] sm:px-5">
          <a href="#top" className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20 transition-transform group-hover:-rotate-3">
              <Keyboard className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold tracking-tight text-slate-950">Yene<span className="text-violet-600">Typing</span></span>
              <span className="hidden text-[10px] font-medium text-slate-400 sm:block">Typing practice studio</span>
            </span>
          </a>
          <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Your next session starts here
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <Languages className="h-4 w-4 text-violet-600" /> English <span className="text-slate-300">/</span> አማርኛ
          </div>
        </header>

        <section id="top" className="mb-7 grid gap-6 lg:mb-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" /> Your personal practice space
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[3.25rem]">
              Make every keystroke <span className="text-violet-600">count.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
              Build speed, accuracy, and confidence with focused typing lessons and quick games. Find the mode that fits your flow.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-[88px] rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:min-w-[110px] sm:p-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600"><Keyboard className="h-4 w-4" /></span>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">10</p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-xs">Game modes</p>
            </div>
            <div className="min-w-[88px] rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:min-w-[110px] sm:p-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><Languages className="h-4 w-4" /></span>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">2</p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-xs">Languages</p>
            </div>
            <div className="min-w-[88px] rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:min-w-[110px] sm:p-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600"><Trophy className="h-4 w-4" /></span>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">∞</p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-xs">Practice</p>
            </div>
          </div>
        </section>

        <section id="practice" aria-labelledby="practice-heading" className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_45px_-30px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-600">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Practice dashboard
              </div>
              <h2 id="practice-heading" className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Choose your challenge</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">Select a mode on the left, then focus on your next best score.</p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500 md:self-auto">
              <SlidersHorizontal className="h-3.5 w-3.5 text-violet-500" /> 10 ways to practice
            </div>
          </div>

          <div className="p-3 sm:p-5 lg:p-6">
            <Tabs defaultValue="classic" className="flex w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
              <TabsList aria-label="Choose a typing game" className="flex h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1.5 sm:grid sm:grid-cols-2 sm:gap-2 lg:flex lg:w-[248px] lg:shrink-0 lg:flex-col lg:items-stretch lg:gap-1.5 lg:p-2">
                {modes.map((mode) => <ModeTrigger key={mode.value} mode={mode} />)}
              </TabsList>

              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200/80 bg-[#fbfcff] p-3 sm:p-5 lg:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Target className="h-4 w-4 text-violet-600" /> Ready when you are
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Practice mode</span>
                </div>
                <TabsContent value="classic" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><ClassicMode timeLimit={60} monkeyMode={false} /></GameShell></TabsContent>
                <TabsContent value="sprint" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><WordSprint initialTimeLimit={60} /></GameShell></TabsContent>
                <TabsContent value="falling" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><FallingWords /></GameShell></TabsContent>
                <TabsContent value="bubble" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><BubblePop /></GameShell></TabsContent>
                <TabsContent value="defense" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><WordDefense /></GameShell></TabsContent>
                <TabsContent value="car" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><CarRace /></GameShell></TabsContent>
                <TabsContent value="monkey" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><MonkeyMode /></GameShell></TabsContent>
                <TabsContent value="amharic" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><AmharicMode /></GameShell></TabsContent>
                <TabsContent value="code" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><CodeTyper /></GameShell></TabsContent>
                <TabsContent value="ninja" className="mt-0 rounded-xl focus-visible:outline-none"><GameShell><NinjaMode /></GameShell></TabsContent>
                <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-500 sm:items-center sm:text-xs">
                  <Activity className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 sm:mt-0" />
                  <span><strong className="font-semibold text-slate-700">Tip:</strong> Start with accuracy. Consistent practice will naturally build your speed.</span>
                  <ArrowUpRight className="ml-auto hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
                </div>
              </div>
            </Tabs>
          </div>
        </section>

        <footer className="mt-6 flex flex-col gap-2 px-1 py-4 text-[11px] font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Practice a little. Improve a lot.</span>
          <span className="flex items-center gap-2">Yene Typing <span className="h-1 w-1 rounded-full bg-slate-300" /> Crafted by Menelik Admasu</span>
        </footer>
      </div>
    </main>
  );
}
