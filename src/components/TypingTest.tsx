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
      <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1360px] space-y-5 sm:space-y-7">
          <header className="flex flex-col gap-5 rounded-3xl border border-white/80 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)] sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-900/15 sm:h-14 sm:w-14">
                <Keyboard className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Yene Typing</span>
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Practice studio</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                  Make every keystroke count.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Build speed, improve accuracy, and learn through games—in English or Amharic.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[330px]">
              <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                <Keyboard className="mb-2 h-4 w-4 text-emerald-700" aria-hidden="true" />
                <p className="text-lg font-bold tabular-nums text-slate-900">10</p>
                <p className="text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">Game modes</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                <Languages className="mb-2 h-4 w-4 text-emerald-700" aria-hidden="true" />
                <p className="text-lg font-bold text-slate-900">2</p>
                <p className="text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">Languages</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                <Target className="mb-2 h-4 w-4 text-emerald-700" aria-hidden="true" />
                <p className="text-lg font-bold text-slate-900">Your pace</p>
                <p className="text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">Learn by doing</p>
              </div>
            </div>
          </header>

          <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 right-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Your next best score starts here
                </div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Choose a mode. Find your flow.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Start with Classic to warm up, switch to a challenge to test your reflexes, or practice Amharic and code.
                </p>
              </div>
              <div className="hidden shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:flex">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <Trophy className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Progress over perfection</p>
                  <p className="mt-0.5 text-xs text-slate-400">Accuracy first. Speed follows.</p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="mode-heading" className="space-y-3">
            <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">The practice room</p>
                <h2 id="mode-heading" className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Explore typing games</h2>
              </div>
              <p className="text-xs text-slate-500 sm:text-sm">Swipe the mode bar on smaller screens</p>
            </div>

            <Tabs defaultValue="classic" className="w-full">
              <TabsList aria-label="Choose a typing game" className="flex h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
                {modes.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="min-h-[62px] min-w-[92px] shrink-0 flex-col gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md sm:min-w-[108px] sm:flex-row sm:gap-2 sm:px-4 sm:text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-3 flex items-center gap-2 px-1 text-xs text-slate-500">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>Tip: focus on accuracy first—consistent practice builds speed.</span>
              </div>

              <TabsContent value="classic" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><ClassicMode timeLimit={60} monkeyMode={false} /></GameShell></TabsContent>
              <TabsContent value="sprint" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><WordSprint initialTimeLimit={60} /></GameShell></TabsContent>
              <TabsContent value="falling" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><FallingWords /></GameShell></TabsContent>
              <TabsContent value="bubble" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><BubblePop /></GameShell></TabsContent>
              <TabsContent value="defense" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><WordDefense /></GameShell></TabsContent>
              <TabsContent value="car" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><CarRace /></GameShell></TabsContent>
              <TabsContent value="monkey" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><MonkeyMode /></GameShell></TabsContent>
              <TabsContent value="amharic" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><AmharicMode /></GameShell></TabsContent>
              <TabsContent value="code" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><CodeTyper /></GameShell></TabsContent>
              <TabsContent value="ninja" className="mt-4 rounded-3xl focus-visible:outline-none sm:mt-5"><GameShell><NinjaMode /></GameShell></TabsContent>
            </Tabs>
          </section>

          <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 px-2 pt-5 text-xs text-slate-500 sm:flex-row">
            <span>Made for curious minds and better typists.</span>
            <span>Yene Typing <span className="px-1 text-slate-300">•</span> By Menelik Admasu</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
