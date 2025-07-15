import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Keyboard } from 'lucide-react';

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

export default function TypingTest() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLimit, setTimeLimit] = useState(60); // 60 seconds by default
  const [remainingTime, setRemainingTime] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentText = SAMPLE_TEXTS[currentTextIndex];
  
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
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = userInput.length / 5; // standard: 5 characters = 1 word
    const currentWpm = Math.round(wordsTyped / timeElapsed);
    
    setWpm(currentWpm);
    
    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correctChars++;
      }
    }
    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    setAccuracy(currentAccuracy);
    
    // Check if test is complete by typing all characters
    if (userInput.length === currentText.length && !isTimeUp) {
      setIsComplete(true);
    }
  }, [userInput, startTime, currentText, isTimeUp]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Don't allow typing if time is up
    if (isTimeUp || isComplete) return;
    
    // Start timer on first character
    if (value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
    
    // Only allow typing up to the text length
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
    setRemainingTime(timeLimit);
    setCurrentTextIndex(Math.floor(Math.random() * SAMPLE_TEXTS.length));
    inputRef.current?.focus();
  };
  
  // Render text with highlighting
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'text-typing-pending';
      
      if (index < userInput.length) {
        // Character has been typed
        if (userInput[index] === char) {
          className = 'text-typing-correct bg-typing-correct/10';
        } else {
          className = 'text-typing-incorrect bg-typing-incorrect/20';
        }
      } else if (index === userInput.length) {
        // Current character to type
        className = 'text-typing-current bg-typing-current/20 animate-pulse';
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
  
  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Keyboard className="w-10 h-10 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Yeni Typing Speed Test
              </h1>
            </div>
            <p className="text-xl text-muted-foreground font-medium">
              Challenge yourself and improve your typing skills
            </p>
            <div className="w-20 h-1 bg-gradient-primary rounded-full mx-auto"></div>
            
            {/* Time limit selector */}
            <div className="flex justify-center gap-2 mt-6">
              {[30, 60, 120].map((time) => (
                <Button
                  key={time}
                  variant={timeLimit === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeTimeLimit(time)}
                  className="px-4 py-2 text-sm font-medium"
                >
                  {time}s
                </Button>
              ))}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-300 ease-out"
              style={{ width: `${(userInput.length / currentText.length) * 100}%` }}
            />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all duration-300 group border-0 bg-gradient-to-br from-background to-muted/20 shadow-card">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {wpm}
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Words/Min
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group border-0 bg-gradient-to-br from-background to-muted/20 shadow-card">
              <CardContent className="p-6">
                <div className={`text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${
                  accuracy >= 95 ? 'text-typing-correct' : 
                  accuracy >= 80 ? 'text-typing-current' : 'text-typing-incorrect'
                }`}>
                  {accuracy}%
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Accuracy
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group border-0 bg-gradient-to-br from-background to-muted/20 shadow-card">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {userInput.length}
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Characters
                </div>
              </CardContent>
            </Card>
            <Card className={`text-center hover:shadow-lg transition-all duration-300 group border-0 bg-gradient-to-br from-background to-muted/20 shadow-card ${
              remainingTime <= 10 && startTime ? 'ring-2 ring-typing-incorrect animate-pulse' : ''
            }`}>
              <CardContent className="p-6">
                <div className={`text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${
                  remainingTime <= 10 && startTime ? 'text-typing-incorrect' : 'text-primary'
                }`}>
                  {remainingTime}
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Time Left
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Typing Area */}
          <Card className="shadow-typing border-0 bg-gradient-to-br from-background to-muted/10 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {isComplete ? "🎉 Test Complete!" : "⌨️ Start typing the text below"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text to type */}
              <div className="relative p-8 bg-gradient-to-br from-background to-muted/30 rounded-xl border border-border/50 shadow-inner">
                <div className="absolute top-4 right-4 text-xs text-muted-foreground font-mono">
                  {Math.round((userInput.length / currentText.length) * 100)}%
                </div>
                <div className="text-xl leading-relaxed font-mono select-none tracking-wide">
                  {renderText()}
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
                  placeholder={isComplete ? "Test completed! 🎉" : "Click here and start typing..."}
                  className="w-full p-6 text-xl font-mono border-2 border-border/50 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-background to-muted/20 shadow-inner"
                />
                {!isComplete && userInput.length === 0 && (
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-muted-foreground flex items-center gap-2">
                    <span className="animate-pulse">Press any key to start</span>
                    <div className="w-2 h-6 bg-primary rounded animate-pulse"></div>
                  </div>
                )}
              </div>
              
              {/* Reset button */}
              <div className="text-center">
                <Button
                  onClick={resetTest}
                  variant="outline"
                  className="gap-2 px-8 py-3 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  {isComplete ? "Try Again" : "Reset Test"}
                </Button>
              </div>
              
              {/* Completion message */}
              {isComplete && (
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/30 shadow-lg animate-fade-in">
                  <div className="text-2xl font-bold text-primary mb-3">
                    {isTimeUp ? "⏰ Time's up!" : "🎉 Congratulations! You completed the test."}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Your final speed: <span className="font-bold text-primary">{wpm} WPM</span> with{' '}
                    <span className="font-bold text-primary">{accuracy}% accuracy</span>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {isTimeUp ? 
                      `You typed ${userInput.length} characters out of ${currentText.length} in ${timeLimit} seconds!` :
                      (wpm >= 60 ? "🔥 Excellent typing speed!" : 
                       wpm >= 40 ? "👍 Good typing speed!" : 
                       wpm >= 25 ? "📈 Keep practicing!" : 
                       "🚀 Room for improvement!")
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Instructions */}
          <Card className="border-0 bg-gradient-to-br from-muted/20 to-muted/10 shadow-card">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold mb-3 text-foreground">How to use:</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 bg-typing-correct rounded-full"></span>
                    <span>Correct characters appear in <span className="text-typing-correct font-semibold">green</span></span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 bg-typing-incorrect rounded-full"></span>
                    <span>Incorrect characters appear in <span className="text-typing-incorrect font-semibold">red</span></span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 bg-typing-current rounded-full animate-pulse"></span>
                    <span>Current character is <span className="text-typing-current font-semibold">highlighted</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
      By Menelik Admasu
    </footer>
    </div>
  );
  
 
}
