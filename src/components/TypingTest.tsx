import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Keyboard, Zap, Rocket } from 'lucide-react';
import ClassicMode from './games/ClassicMode';
import WordSprint from './games/WordSprint';
import FallingWords from './games/FallingWords';

export default function TypingTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Keyboard className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Type Arcade</h1>
            </div>
          </div>

          {/* Game Tabs */}
          <Tabs defaultValue="classic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="classic" className="gap-2">
                <Keyboard className="w-4 h-4" />
                Classic
              </TabsTrigger>
              <TabsTrigger value="sprint" className="gap-2">
                <Zap className="w-4 h-4" />
                Sprint
              </TabsTrigger>
              <TabsTrigger value="falling" className="gap-2">
                <Rocket className="w-4 h-4" />
                Falling
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classic" className="mt-6">
              <ClassicMode timeLimit={60} monkeyMode={false} />
            </TabsContent>

            <TabsContent value="sprint" className="mt-6">
              <WordSprint initialTimeLimit={60} />
            </TabsContent>

            <TabsContent value="falling" className="mt-6">
              <FallingWords />
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
