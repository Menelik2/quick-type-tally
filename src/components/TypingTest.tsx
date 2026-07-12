import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Keyboard, Zap, Rocket, Circle, Shield, Languages, Banana, Car, Code2, Swords } from 'lucide-react';
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

export default function TypingTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full px-6 lg:px-12 xl:px-20 py-8">
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Keyboard className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Yene Typing</h1>
            </div>
          </div>

          {/* Game Tabs */}
          <Tabs defaultValue="classic" className="w-full">
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-10 max-w-7xl mx-auto">
              <TabsTrigger value="classic" className="gap-2">
                <Keyboard className="w-4 h-4" />
                <span className="hidden sm:inline">Classic</span>
              </TabsTrigger>
              <TabsTrigger value="sprint" className="gap-2">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Sprint</span>
              </TabsTrigger>
              <TabsTrigger value="falling" className="gap-2">
                <Rocket className="w-4 h-4" />
                <span className="hidden sm:inline">Falling</span>
              </TabsTrigger>
              <TabsTrigger value="bubble" className="gap-2">
                <Circle className="w-4 h-4" />
                <span className="hidden sm:inline">Bubbles</span>
              </TabsTrigger>
              <TabsTrigger value="defense" className="gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Defense</span>
              </TabsTrigger>
              <TabsTrigger value="car" className="gap-2">
                <Car className="w-4 h-4" />
                <span className="hidden sm:inline">Car Race</span>
              </TabsTrigger>
              <TabsTrigger value="monkey" className="gap-2">
                <Banana className="w-4 h-4" />
                <span className="hidden sm:inline">Monkey</span>
              </TabsTrigger>
              <TabsTrigger value="amharic" className="gap-2">
                <Languages className="w-4 h-4" />
                <span className="hidden sm:inline">አማርኛ</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code2 className="w-4 h-4" />
                <span className="hidden sm:inline">Code</span>
              </TabsTrigger>
              <TabsTrigger value="ninja" className="gap-2">
                <Swords className="w-4 h-4" />
                <span className="hidden sm:inline">Ninja</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classic" className="mt-6">
              <GameShell><ClassicMode timeLimit={60} monkeyMode={false} /></GameShell>
            </TabsContent>
            <TabsContent value="sprint" className="mt-6">
              <GameShell><WordSprint initialTimeLimit={60} /></GameShell>
            </TabsContent>
            <TabsContent value="falling" className="mt-6">
              <GameShell><FallingWords /></GameShell>
            </TabsContent>
            <TabsContent value="bubble" className="mt-6">
              <GameShell><BubblePop /></GameShell>
            </TabsContent>
            <TabsContent value="defense" className="mt-6">
              <GameShell><WordDefense /></GameShell>
            </TabsContent>
            <TabsContent value="car" className="mt-6">
              <GameShell><CarRace /></GameShell>
            </TabsContent>
            <TabsContent value="monkey" className="mt-6">
              <GameShell><MonkeyMode /></GameShell>
            </TabsContent>
            <TabsContent value="amharic" className="mt-6">
              <GameShell><AmharicMode /></GameShell>
            </TabsContent>
            <TabsContent value="code" className="mt-6">
              <GameShell><CodeTyper /></GameShell>
            </TabsContent>
            <TabsContent value="ninja" className="mt-6">
              <GameShell><NinjaMode /></GameShell>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <footer className="text-center py-4 text-sm text-gray-500">
        By Menelik Admasu
      </footer>
    </div>
  );
}
