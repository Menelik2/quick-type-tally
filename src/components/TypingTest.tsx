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
  { value: 'classic', label: 'Classic', icon: Keyboard, hint: 'Build your basics' },
  { value: 'sprint', label: 'Sprint', icon: Zap, hint: 'Race the clock' },
  { value: 'falling', label: 'Falling Words', icon: Rocket, hint: 'Type before they fall' },
  { value: 'bubble', label: 'Bubbles', icon: Circle, hint: 'Pop each word' },
  { value: 'defense', label: 'Word Defense', icon: Shield, hint: 'Protect your base' },
  { value: 'car', label: 'Car Race', icon: Car, hint: 'Race with accuracy' },
  { value: 'monkey', label: 'Monkey', icon: Banana, hint: 'Keep your rhythm' },
  { value: 'amharic', label: 'አማርኛ', icon: Languages, hint: 'Practice in Amharic' },
  { value: 'code', label: 'Code Typer', icon: Code2, hint: 'Type real code patterns' },
  { value: 'ninja', label: 'Ninja', icon: Swords, hint: 'Sharpen your reflexes' },
];

export default function TypingTest() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto w-full max-w-[1760px] px-3 py-4 sm:px-6 sm:py-7 lg:px-10 lg:py-10 2xl:px-14">
        <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-7 lg:space-y-8">
          <header className="grid gap-5 rounded-3xl border border-white/80 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)] sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:p-9">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-900/15 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                <Keyboard className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Yene Typing</span>
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Practice studio</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl 2xl:text-5xl">
                  Make every keystroke count.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base lg:text-lg">
                  Build speed, improve accuracy, and learn through games—in English or Amharic.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[390px] 2xl:w-[450px]">
              <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 lg:p-5">
                <Keyboard className="mb-2 h-4 w-4 text-emerald-700 lg:h-5 lg:w-5" aria-hidden="true" />
                <p className="text-lg font-bold tabular-nums text-slate-900 lg:text-2xl">10</p>
                <p className="text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">Game modes</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 lg:p-5">
                <Languages className="mb-2 h-4 w-4 text-emerald-700 lg:h-5 lg:w-5" aria-hidden="true" />
                <p className="text-lg font-bold text-slate-900 lg:text-2xl">2</p>
                <p className="text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">Languages</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 lg:p-5">
                <Target className="mb-2 h-4 w-4 text-emerald-700 lg:h-5 lg:w-5" aria-hidden="true" />
                <p className="text-base font-bold text-slate-900 lg:text-xl">Your pace</p>
                <p className="text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">Learn by doing</p>
              </div>
            </div>
          </header>

          <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-7 lg:p-10 2xl:p-12">
            <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl lg:h-80 lg:w-80" />
            <div className="pointer-events-none absolute -bottom-28 right-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:gap-10">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Your next best score starts here
                </div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl 2xl:text-4xl">Choose a mode. Find your flow.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base lg:mt-3 lg:text-lg lg:leading-7">
                  Start with Classic to warm up, switch to a challenge to test your reflexes, or practice Amharic and code.
                </p>
              </div>
              <div className="hidden shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 xl:flex">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <Trophy className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Progress over perfection</p>
                  <p className="mt-1 text-xs text-slate-400">Accuracy first. Speed follows.</p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="mode-heading" className="space-y-3 lg:space-y-4">
            <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">The practice room</p>
                <h2 id="mode-heading" className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">Explore typing games</h2>
              </div>
              <p className="text-xs text-slate-500 sm:text-sm">Choose a game to start practicing</p>
            </div>

            <Tabs defaultValue="classic" className="w-full">
              <TabsList
                aria-label="Choose a typing game"
                className="flex h-auto w-full justify-start gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm sm:p-3 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible xl:grid-cols-5 2xl:grid-cols-10 2xl:gap-2"
              >
                {modes.map(({ value, label, icon: Icon, hint }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    title={hint}
                    className="group min-h-[68px] min-w-[104px] shrink-0 flex-col gap-1.5 rounded-xl border border-transparent px-3 py-2.5 text-xs font-semibold text-slate-500 transition-all hover:border-slate-200 hover:bg-slate-50 data-[state=active]:border-emerald-200 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-900 data-[state=active]:shadow-sm sm:min-w-[116px] sm:flex-row sm:gap-2 sm:text-sm lg:min-h-[94px] lg:min-w-0 lg:flex-col lg:items-start lg:justify-center lg:gap-2 lg:rounded-2xl lg:px-4 lg:py-4 2xl:min-h-[110px] 2xl:items-center 2xl:px-2 2xl:py-3"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-data-[state=active]:bg-emerald-600 group-data-[state=active]:text-white lg:h-9 lg:w-9">
                      <Icon className="h-4 w-4 lg:h-[18px] lg:w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="whitespace-nowrap">{label}</span>
                    <span className="hidden text-left text-[11px] font-normal leading-4 text-slate-400 lg:block 2xl:hidden">{hint}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-3 flex items-center gap-2 px-1 text-xs text-slate-500 lg:mt-4 lg:text-sm">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>Tip: focus on accuracy first—consistent practice builds speed.</span>
              </div>

              <TabsContent value="classic" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><ClassicMode timeLimit={60} monkeyMode={false} /></GameShell></TabsContent>
              <TabsContent value="sprint" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><WordSprint initialTimeLimit={60} /></GameShell></TabsContent>
              <TabsContent value="falling" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><FallingWords /></GameShell></TabsContent>
              <TabsContent value="bubble" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><BubblePop /></GameShell></TabsContent>
              <TabsContent value="defense" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><WordDefense /></GameShell></TabsContent>
              <TabsContent value="car" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><CarRace /></GameShell></TabsContent>
              <TabsContent value="monkey" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><MonkeyMode /></GameShell></TabsContent>
              <TabsContent value="amharic" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><AmharicMode /></GameShell></TabsContent>
              <TabsContent value="code" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><CodeTyper /></GameShell></TabsContent>
              <TabsContent value="ninja" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5 lg:mt-6"><GameShell><NinjaMode /></GameShell></TabsContent>
            </Tabs>
          </section>

          <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 px-2 pt-5 text-xs text-slate-500 sm:flex-row lg:pt-7 lg:text-sm">
            <span>Made for curious minds and better typists.</span>
            <span>Yene Typing <span className="px-1 text-slate-300">•</span> By Menelik Admasu</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
