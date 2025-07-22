import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Keyboard, Eye, EyeOff, Zap, Target, Clock, Trophy, Settings, Activity } from 'lucide-react';

// Sample paragraphs for typing test
const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and has been used for decades to test typewriters and keyboards. It remains a popular choice for typing practice.",
  "Technology has transformed the way we communicate, work, and live. From smartphones to artificial intelligence, these innovations continue to shape our daily experiences and create new opportunities.",
  "Reading is one of the most powerful tools for expanding knowledge and imagination. Through books, we can explore different worlds, learn from diverse perspectives, and develop critical thinking skills.",
  "The art of cooking brings people together through shared meals and cultural traditions. Whether preparing a simple dish or an elaborate feast, cooking allows us to express creativity while nourishing our bodies.",
  "Nature provides countless wonders that inspire and rejuvenate us. From towering mountains to serene lakes, the natural world offers beauty and peace that reminds us of our connection to the environment.",
  "Typing efficiently is a valuable skill in today's digital age. Practicing regularly helps to increase your words per minute and reduces errors, making it easier to complete tasks at school or work.",
  "A beautiful sunrise painted the sky with shades of orange and pink. Birds chirped cheerfully in the trees, welcoming a new day full of possibilities and opportunities.",
  "Learning to touch type can be challenging at first, but with persistence and practice, your fingers will learn where each key is located without needing to look at the keyboard.",
  "Teamwork and collaboration are essential in achieving success. By working together, we can overcome challenges and accomplish more than we ever could alone.",
  "Music has the power to evoke emotions and memories, connecting people across cultures and generations. Whether listening or performing, music enriches our lives in countless ways."
];

// Monkey typing phrases for fun mode
const MONKEY_PHRASES = [
  "banana split keyboard warrior",
  "typing monkey goes bananas",
  "fast fingers flying freely",
  "quick brown monkeys jump",
  "digital banana plantation",
  "keyboard jungle adventure",
  "monkey see monkey type",
  "banana powered typing machine",
  "swing from key to key",
  "tropical typing paradise"
];

export default function TypingTest() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLimit, setTimeLimit] = useState(60);
  const [remainingTime, setRemainingTime] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showAds, setShowAds] = useState(true);
  const [monkeyMode, setMonkeyMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentText = monkeyMode ? 
    MONKEY_PHRASES[currentTextIndex % MONKEY_PHRASES.length].repeat(3) : 
    SAMPLE_TEXTS[currentTextIndex];
  
  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (startTime && !isComplete && !isTimeUp) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = Math.max(0, timeLimit - elapsed);
        setRemainingTime(timeLeft);
        
        if (timeLeft === 0) {
          setIsTimeUp(true);
          setIsComplete(true);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [startTime, isComplete, isTimeUp, timeLimit]);

  // Calculate WPM and accuracy
  useEffect(() => {
    if (!startTime || userInput.length === 0) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = userInput.length / 5;
    const currentWpm = Math.round(wordsTyped / timeElapsed);
    
    setWpm(currentWpm);
    
    // Update best WPM
    if (currentWpm > bestWpm) {
      setBestWpm(currentWpm);
    }
    
    // Calculate accuracy and track errors/correct characters
    let correctCharsCount = 0;
    let errorsCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correctCharsCount++;
      } else {
        errorsCount++;
      }
    }
    setCorrectChars(correctCharsCount);
    setErrors(errorsCount);
    const currentAccuracy = userInput.length > 0 ? Math.round((correctCharsCount / userInput.length) * 100) : 100;
    setAccuracy(currentAccuracy);
    
    // Update streak
    if (userInput.length > 0 && userInput[userInput.length - 1] === currentText[userInput.length - 1]) {
      setStreak(prev => prev + 1);
    } else if (userInput.length > 0) {
      setStreak(0);
    }
    
    // Check if test is complete
    if (userInput.length === currentText.length && !isTimeUp) {
      setIsComplete(true);
    }
  }, [userInput, startTime, currentText, isTimeUp, bestWpm]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (isTimeUp || isComplete) return;
    
    if (value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
    
    if (value.length <= currentText.length) {
      setUserInput(value);
    }
  };
  
  // Change time limit
  const changeTimeLimit = (newLimit: number) => {
    setTimeLimit(newLimit);
    setRemainingTime(newLimit);
    resetTest();
  };
  
  // Reset the test
  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setIsComplete(false);
    setIsTimeUp(false);
    setWpm(0);
    setAccuracy(100);
    setStreak(0);
    setErrors(0);
    setCorrectChars(0);
    setRemainingTime(timeLimit);
    setCurrentTextIndex(monkeyMode ? 
      Math.floor(Math.random() * MONKEY_PHRASES.length) : 
      Math.floor(Math.random() * SAMPLE_TEXTS.length));
    inputRef.current?.focus();
  };
  
  // Toggle focus mode
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  // Toggle monkey mode
  const toggleMonkeyMode = () => {
    setMonkeyMode(!monkeyMode);
    resetTest();
  };
  
  // Render text with highlighting
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'transition-all duration-150';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += ' text-green-500 bg-green-50';
        } else {
          className += ' text-red-500 bg-red-50';
        }
      } else if (index === userInput.length) {
        className += ' bg-blue-200 animate-pulse';
      } else {
        className += ' text-muted-foreground';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };
  
  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
    setCurrentTextIndex(Math.floor(Math.random() * SAMPLE_TEXTS.length));
  }, []);

  if (focusMode && startTime && !isComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Minimal stats in focus mode */}
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>WPM: {wpm}</div>
            <div>Time: {remainingTime}s</div>
            <div>Accuracy: {accuracy}%</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFocusMode}
              className="text-gray-400 hover:text-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Text to type */}
          <div className="text-2xl leading-relaxed font-mono text-center px-8">
            {renderText()}
          </div>
          
          {/* Hidden input */}
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="sr-only"
            autoFocus
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Optional Ad Banner */}
      {showAds && (
        <div className="relative z-10 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-center py-3 shadow-lg">
          <div className="flex items-center justify-center gap-3 text-sm">
            <Zap className="w-4 h-4" />
            <span className="font-medium">🚀 Boost your typing speed by 50% in 30 days!</span>
            <Button variant="link" className="text-white underline font-medium" size="sm">
              Learn More
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAds(false)}
              className="ml-2 text-white hover:bg-white/20 transition-colors"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4 animate-fade-in">
              {monkeyMode && <Activity className="w-10 h-10 text-amber-500 animate-bounce" />}
              <Keyboard className="w-10 h-10 text-indigo-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {monkeyMode ? "🐵 Monkey Typing" : "TypeMaster Pro"}
              </h1>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {/* Time limits */}
              <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
                {[15, 30, 60, 120].map((time) => (
                  <Button
                    key={time}
                    variant={timeLimit === time ? "default" : "ghost"}
                    size="sm"
                    onClick={() => changeTimeLimit(time)}
                    className={`relative transition-all duration-300 ${
                      timeLimit === time 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105" 
                        : "hover:bg-white/60 text-gray-700"
                    }`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {time}s
                  </Button>
                ))}
              </div>
              
              {/* Mode toggles */}
              <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg">
                <Button
                  variant={focusMode ? "default" : "ghost"}
                  size="sm"
                  onClick={toggleFocusMode}
                  className={`gap-2 transition-all duration-300 ${
                    focusMode 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                      : "hover:bg-white/60 text-gray-700"
                  }`}
                >
                  {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Focus
                </Button>
                
                <Button
                  variant={monkeyMode ? "default" : "ghost"}
                  size="sm"
                  onClick={toggleMonkeyMode}
                  className={`gap-2 transition-all duration-300 ${
                    monkeyMode 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" 
                      : "hover:bg-white/60 text-gray-700"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Monkey
                </Button>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <Progress 
              value={(userInput.length / currentText.length) * 100} 
              className="h-3 bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {[
              { label: "WPM", value: wpm, icon: Zap, color: "from-blue-500 to-indigo-600" },
              { label: "Accuracy", value: `${accuracy}%`, icon: Target, color: accuracy >= 95 ? "from-green-500 to-emerald-600" : accuracy >= 80 ? "from-yellow-500 to-amber-600" : "from-red-500 to-rose-600" },
              { label: "Time", value: remainingTime, icon: Clock, color: remainingTime <= 10 ? "from-red-500 to-rose-600" : "from-purple-500 to-violet-600" },
              { label: "Errors", value: errors, icon: Target, color: "from-red-500 to-rose-600" },
              { label: "Correct", value: correctChars, icon: Target, color: "from-green-500 to-emerald-600" },
              { label: "Streak", value: streak, icon: Zap, color: "from-orange-500 to-amber-600" },
              { label: "Best", value: bestWpm, icon: Trophy, color: "from-yellow-500 to-amber-600" }
            ].map((stat, index) => (
              <Card key={stat.label} className="group relative overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <CardContent className="relative p-6 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Typing Area */}
          <Card className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50"></div>
            <CardContent className="relative p-8 space-y-8">
              {/* Text to type */}
              <div className="relative p-8 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-inner">
                <div className="text-xl leading-relaxed font-mono tracking-wide">
                  {renderText()}
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 bg-white/60 px-3 py-1 rounded-full border">
                    {Math.round((userInput.length / currentText.length) * 100)}% Complete
                  </div>
                </div>
              </div>
              
              {/* Input field */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  disabled={isComplete}
                  placeholder={isComplete ? "Test completed! 🎉" : "Start typing here to begin..."}
                  className="w-full p-6 text-xl bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 disabled:opacity-50 transition-all duration-300 shadow-lg placeholder:text-gray-400"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={resetTest} 
                  variant="outline" 
                  className="gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Test
                </Button>
                
                <Button
                  onClick={toggleFocusMode}
                  variant="outline"
                  className="gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Focus Mode
                </Button>
              </div>
              
              {/* Completion message */}
              {isComplete && (
                <div className="text-center p-8 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-emerald-200/50 shadow-lg animate-fade-in">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    {isTimeUp ? "⏰ Time's Up!" : "🎉 Incredible Job!"}
                  </div>
                  <div className="text-lg text-gray-700 space-y-2">
                    <div>
                      Final Speed: <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{wpm} WPM</span>
                    </div>
                    <div>
                      Accuracy: <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{accuracy}%</span>
                    </div>
                  </div>
                  {monkeyMode && (
                    <div className="mt-4 text-lg font-medium text-amber-600">
                      🐵 Banana Achievement: {Math.floor(wpm / 10)} bananas collected!
                    </div>
                  )}
                  <Button 
                    onClick={resetTest}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optional Sidebar Ad */}
      {showAds && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 w-56 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/30 z-20">
          <div className="text-center space-y-4">
            <div className="relative">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-30"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Daily Challenge
              </h3>
              <p className="text-sm text-gray-600">
                Compete with typists worldwide and earn achievements!
              </p>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Join Challenge
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAds(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Hide Ads
            </Button>
          </div>
        </div>
      )}
      
      {/* Modern Footer */}
      <footer className="relative z-10 text-center py-8">
        <div className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
          Crafted with ❤️ by Menelik Admasu
        </div>
      </footer>
    </div>
  );
}