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
    
    // Calculate accuracy, correct chars, and errors
    let correctCount = 0;
    let errorCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correctCount++;
      } else {
        errorCount++;
      }
    }
    setCorrectChars(correctCount);
    setErrors(errorCount);
    const currentAccuracy = userInput.length > 0 ? Math.round((correctCount / userInput.length) * 100) : 100;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Optional Ad Banner */}
      {showAds && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm">
          🚀 Improve your typing speed by 50% in 30 days! 
          <Button variant="link" className="text-white underline ml-2" size="sm">
            Learn More
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAds(false)}
            className="ml-2 text-white hover:bg-white/20"
          >
            ×
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              {monkeyMode && <Activity className="w-8 h-8 text-amber-500" />}
              <Keyboard className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">
                {monkeyMode ? "🐵 Monkey Typing" : "Minimal Type"}
              </h1>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* Time limits */}
              <div className="flex gap-2">
                {[15, 30, 60, 120].map((time) => (
                  <Button
                    key={time}
                    variant={timeLimit === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeTimeLimit(time)}
                  >
                    {time}s
                  </Button>
                ))}
              </div>
              
              {/* Mode toggles */}
              <div className="flex gap-2">
                <Button
                  variant={focusMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleFocusMode}
                  className="gap-2"
                >
                  {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Focus
                </Button>
                
                <Button
                  variant={monkeyMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleMonkeyMode}
                  className="gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Monkey
                </Button>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <Progress 
            value={(userInput.length / currentText.length) * 100} 
            className="h-2"
          />
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{wpm}</div>
                <div className="text-xs text-muted-foreground">WPM</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${accuracy >= 95 ? 'text-green-600' : accuracy >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {accuracy}%
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{remainingTime}</div>
                <div className="text-xs text-muted-foreground">Time</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{streak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">{bestWpm}</div>
                <div className="text-xs text-muted-foreground">Best</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Typing Area */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 space-y-6">
              {/* Text to type */}
              <div className="relative p-6 bg-gray-50 rounded-lg">
                <div className="text-lg leading-relaxed font-mono">
                  {renderText()}
                </div>
                <div className="absolute top-2 right-2 text-xs text-gray-400">
                  {Math.round((userInput.length / currentText.length) * 100)}%
                </div>
              </div>
              
              {/* Input field */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                disabled={isComplete}
                placeholder={isComplete ? "Test completed!" : "Start typing here..."}
                className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
              />
              
              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button onClick={resetTest} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                
                <Button
                  onClick={toggleFocusMode}
                  variant="outline"
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Focus Mode
                </Button>
              </div>
              
              {/* Completion message */}
              {isComplete && (
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    {isTimeUp ? "⏰ Time's up!" : "🎉 Test Complete!"}
                  </div>
                  <div className="text-gray-600">
                    Final speed: <span className="font-semibold text-blue-600">{wpm} WPM</span> | 
                    Accuracy: <span className="font-semibold text-green-600">{accuracy}%</span>
                  </div>
                  {monkeyMode && (
                    <div className="mt-2 text-sm text-amber-600">
                      🐵 Banana count: {Math.floor(wpm / 10)} bananas!
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optional Sidebar Ad */}
      {showAds && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-48 bg-white rounded-lg shadow-lg p-4 border">
          <div className="text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-800 mb-2">
              Typing Challenge
            </div>
            <div className="text-xs text-gray-600 mb-3">
              Join daily challenges and compete with others!
            </div>
            <Button size="sm" className="w-full text-xs">
              Join Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAds(false)}
              className="mt-2 text-xs"
            >
              Hide Ads
            </Button>
          </div>
        </div>
      )}
      
      <footer className="text-center py-4 text-sm text-gray-500">
        By Menelik Admasu
      </footer>
    </div>
  );
}