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
  Play,
  ChevronRight,
  Gauge,
  Flame,
  Star,
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
  { value: 'classic', label: 'Classic', icon: Keyboard, hint: 'Build your basics', category: 'Practice', number: '01' },
  { value: 'sprint', label: 'Sprint', icon: Zap, hint: 'Race the clock', category: 'Speed', number: '02' },
  { value: 'falling', label: 'Falling Words', icon: Rocket, hint: 'Type before they fall', category: 'Arcade', number: '03' },
  { value: 'bubble', label: 'Bubbles', icon: Circle, hint: 'Pop each word', category: 'Arcade', number: '04' },
  { value: 'defense', label: 'Word Defense', icon: Shield, hint: 'Protect your base', category: 'Arcade', number: '05' },
  { value: 'car', label: 'Car Race', icon: Car, hint: 'Race with accuracy', category: 'Race', number: '06' },
  { value: 'monkey', label: 'Monkey', icon: Banana, hint: 'Keep your rhythm', category: 'Challenge', number: '07' },
  { value: 'amharic', label: 'አማርኛ', icon: Languages, hint: 'Practice in Amharic', category: 'Language', number: '08' },
  { value: 'code', label: 'Code Typer', icon: Code2, hint: 'Type code patterns', category: 'Developer', number: '09' },
  { value: 'ninja', label: 'Ninja', icon: Swords, hint: 'Sharpen your reflexes', category: 'Challenge', number: '10' },
];

function ModeTrigger({ mode }: { mode: (typeof modes)[number] }) {
  const Icon = mode.icon;
  return (
    <TabsTrigger
      value={mode.value}
      title={mode.hint}
      className="group relative flex h-auto min-h-[106px] min-w-[126px] shrink-0 flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 py-4 text-left text-stone-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/30 hover:bg-white/[0.075] hover:text-white focus-visible:ring-2 focus-visible:ring-amber-300 data-[state=active]:border-amber-200/50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-100/[0.14] data-[state=active]:to-white/[0.04] data-[state=active]:text-white data-[state=active]:shadow-[0_12px_38px_-20px_rgba(245,158,11,0.35)] sm:min-w-0"
    >
      <span className="flex w-full items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/20 text-stone-300 transition-colors group-data-[state=active]:border-amber-200/40 group-data-[state=active]:bg-amber-200/15 group-data-[state=active]:text-amber-100">
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="text-[10px] font-semibold tracking-[0.16em] text-stone-600 group-data-[state=active]:text-amber-100/70">{mode.number}</span>
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-bold tracking-tight">{mode.label}</span>
        <span className="mt-1 block text-[10px] font-medium text-stone-500 group-data-[state=active]:text-stone-300">{mode.category}</span>
      </span>
      <span className="absolute bottom-0 left-4 right-4 h-px origin-left scale-x-0 bg-gradient-to-r from-amber-200/70 to-transparent transition-transform duration-300 group-data-[state=active]:scale-x-100" />
    </TabsTrigger>
  );
}

export default function TypingTest() {
  return (
    <main className="yene-app relative min-h-screen overflow-hidden bg-[#141311] text-stone-100 selection:bg-amber-200/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(161,105,53,0.19),transparent_38%),radial-gradient(ellipse_at_90%_35%,rgba(91,70,50,0.15),transparent_35%),linear-gradient(145deg,#1b1916_0%,#121211_52%,#191612_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-8 pt-4 sm:px-7 sm:pb-12 sm:pt-6 lg:px-12 lg:pt-8">
        <header className="mb-10 flex items-center justify-between gap-4 rounded-full border border-white/[0.09] bg-black/20 px-4 py-3 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:mb-14 sm:px-6">
          <a href="#top" className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-100/25 bg-gradient-to-br from-amber-100/20 to-white/[0.04] text-amber-100 shadow-inner shadow-white/5 transition-transform group-hover:rotate-[-6deg]">
              <Keyboard className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-extrabold tracking-tight text-white sm:text-base">Yene<span className="text-amber-200">Typing</span></span>
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500 sm:block">The art of getting faster</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-xs font-semibold text-stone-400 md:flex" aria-label="Main navigation">
            <a href="#practice" className="transition-colors hover:text-amber-100">Explore modes</a>
            <a href="#progress" className="transition-colors hover:text-amber-100">Your progress</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold text-stone-400 sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Studio online
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-bold text-stone-300">
              <Languages className="h-3.5 w-3.5 text-amber-200" /> EN <span className="text-stone-600">/</span> አማ
            </span>
          </div>
        </header>

        <section id="top" className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-center xl:gap-16">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-100/20 bg-amber-100/[0.06] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-100/90 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Your personal practice studio
            </div>
            <h1 className="max-w-4xl text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.065em] text-stone-50 sm:text-6xl lg:text-[5.6rem]">
              Find your <span className="font-light italic text-amber-100">flow.</span><br />
              One key at a time.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base sm:leading-8">
              A quieter space to sharpen your speed, build accuracy, and find your rhythm. Choose a challenge and let your fingers do the talking—in English or Amharic.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-stone-400 sm:text-sm">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-200" /> Accuracy over haste</span>
              <span className="hidden h-1 w-1 rounded-full bg-stone-600 sm:block" />
              <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4 text-amber-200" /> Progress at your pace</span>
            </div>
            <a href="#practice" className="mt-8 inline-flex items-center gap-3 rounded-full border border-amber-100/30 bg-amber-100 px-5 py-3.5 text-xs font-extrabold text-[#211a12] shadow-[0_10px_35px_-16px_rgba(251,191,36,0.5)] transition-all hover:-translate-y-0.5 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100">
              <Play className="h-4 w-4 fill-current" /> Start a session <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <aside id="progress" className="relative mx-auto w-full max-w-[380px] lg:mx-0 lg:max-w-none">
            <div className="absolute -inset-4 rounded-[34px] bg-amber-100/[0.06] blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-white/[0.10] via-white/[0.045] to-white/[0.025] p-5 shadow-[0_30px_90px_-45px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-6">
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">The practice collection</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">Your next level</h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/20 text-amber-100"><Trophy className="h-4 w-4" /></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                  <span className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-amber-100/10 text-amber-100"><Keyboard className="h-4 w-4" /></span>
                  <p className="text-3xl font-semibold tracking-tight text-white">10</p>
                  <p className="mt-1 text-[11px] font-medium text-stone-500">Game modes</p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                  <span className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-emerald-200/10 text-emerald-200"><Languages className="h-4 w-4" /></span>
                  <p className="text-3xl font-semibold tracking-tight text-white">02</p>
                  <p className="mt-1 text-[11px] font-medium text-stone-500">Languages</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-xs font-semibold text-stone-300"><Flame className="h-4 w-4 text-amber-200" /> Build your streak</span>
                  <span className="text-[10px] font-medium text-stone-500">One session at a time</span>
                </div>
                <div className="mt-4 flex gap-1.5" aria-label="Seven day practice inspiration">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={day + index} className={`grid h-8 flex-1 place-items-center rounded-lg border text-[10px] font-bold ${index === 3 ? 'border-amber-100/30 bg-amber-100/15 text-amber-100' : 'border-white/[0.07] bg-white/[0.025] text-stone-600'}`}>{day}</span>)}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-amber-100/20 to-stone-500/10 text-amber-100"><Star className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white">Small sessions. Real progress.</p>
                  <p className="mt-1 text-[10px] text-stone-500">Your best starts with practice.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-stone-500" />
              </div>
            </div>
          </aside>
        </section>

        <section id="practice" aria-labelledby="practice-heading" className="overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.035] shadow-[0_30px_100px_-55px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:rounded-[34px]">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-end lg:justify-between lg:px-9">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-100/80 sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-200" /> Explore the collection
              </div>
              <h2 id="practice-heading" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Choose your challenge<span className="text-amber-100">.</span></h2>
              <p className="mt-2 text-xs leading-6 text-stone-400 sm:text-sm">Ten ways to train. One skill that keeps getting better.</p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-white/[0.09] bg-black/20 px-3.5 py-2.5 text-[10px] font-semibold text-stone-400 sm:text-xs">
              <Command className="h-3.5 w-3.5 text-amber-100/70" /> Select a mode to begin
            </div>
          </div>

          <div className="p-3 sm:p-5 lg:p-7">
            <Tabs defaultValue="classic" className="w-full">
              <TabsList aria-label="Choose a typing game" className="flex h-auto w-full justify-start gap-2 overflow-x-auto rounded-2xl border border-white/[0.06] bg-black/20 p-2 sm:grid sm:grid-cols-5 lg:grid-cols-5 xl:grid-cols-10">
                {modes.map((mode) => <ModeTrigger key={mode.value} mode={mode} />)}
              </TabsList>

              <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-100/[0.14] bg-amber-100/[0.045] px-4 py-3 text-[11px] leading-5 text-stone-300 sm:items-center sm:text-xs">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-100 sm:mt-0" aria-hidden="true" />
                <span><strong className="font-bold text-amber-100">A little reminder:</strong> smooth, accurate keystrokes are the foundation. Speed follows naturally.</span>
                <Gauge className="ml-auto hidden h-4 w-4 shrink-0 text-amber-100/70 sm:block" aria-hidden="true" />
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

        <footer className="mt-7 flex flex-col gap-3 border-t border-white/[0.08] px-1 py-5 text-[10px] font-medium text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-200/70" /> A calmer way to get faster.</span>
          <span className="flex items-center gap-2">Yene Typing <span className="h-1 w-1 rounded-full bg-stone-700" /> Crafted by Menelik Admasu</span>
        </footer>
      </div>
    </main>
  );
}
