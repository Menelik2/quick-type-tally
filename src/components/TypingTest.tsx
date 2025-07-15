import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Keyboard } from 'lucide-react';

// Sample paragraphs for typing test
const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and has been used for decades to test typewriters and keyboards. It remains a popular choice for typing practice today.",
  "Technology has transformed the way we communicate, work, and live. From smartphones to artificial intelligence, these innovations continue to shape our daily experiences and create new opportunities for connection and creativity.",
  "Reading is one of the most powerful tools for expanding knowledge and imagination. Through books, we can explore different worlds, learn from diverse perspectives, and develop critical thinking skills that benefit us throughout life.",
  "The art of cooking brings people together through shared meals and cultural traditions. Whether preparing a simple dish or an elaborate feast, cooking allows us to express creativity while nourishing both body and soul.",
  "Nature provides countless wonders that inspire and rejuvenate us. From towering mountains to serene lakes, the natural world offers beauty and peace that reminds us of our connection to the environment around us."
];

export default function TypingTest() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentText = SAMPLE_TEXTS[currentTextIndex];
  
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
    
    // Check if test is complete
    if (userInput.length === currentText.length) {
      setIsComplete(true);
    }
  }, [userInput, startTime, currentText]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Start timer on first character
    if (value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
    
    // Only allow typing up to the text length
    if (value.length <= currentText.length) {
      setUserInput(value);
    }
  };
  
  // Reset the test
  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setIsComplete(false);
    setWpm(0);
    setAccuracy(100);
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
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Keyboard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Typing Speed Test
          </h1>
        </div>
        <p className="text-muted-foreground">
          Test your typing speed and accuracy
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{wpm}</div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{userInput.length}</div>
            <div className="text-sm text-muted-foreground">Characters</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {startTime ? Math.round((Date.now() - startTime) / 1000) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Seconds</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Typing Area */}
      <Card className="shadow-typing">
        <CardHeader>
          <CardTitle className="text-center">
            {isComplete ? "Test Complete!" : "Start typing the text below"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Text to type */}
          <div className="p-6 bg-gradient-background rounded-lg border-2 border-dashed border-border">
            <div className="text-lg leading-relaxed font-mono select-none">
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
              placeholder={isComplete ? "Test completed!" : "Click here and start typing..."}
              className="w-full p-4 text-lg font-mono border-2 border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {!isComplete && userInput.length === 0 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                Press any key to start
              </div>
            )}
          </div>
          
          {/* Reset button */}
          <div className="text-center">
            <Button
              onClick={resetTest}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {isComplete ? "Try Again" : "Reset Test"}
            </Button>
          </div>
          
          {/* Completion message */}
          {isComplete && (
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-lg font-semibold text-primary mb-2">
                Great job! You completed the test.
              </div>
              <div className="text-sm text-muted-foreground">
                Your final speed: <span className="font-medium">{wpm} WPM</span> with{' '}
                <span className="font-medium">{accuracy}% accuracy</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <p>
          Type the text exactly as shown above. Correct characters will appear in{' '}
          <span className="text-typing-correct font-medium">green</span>, incorrect ones in{' '}
          <span className="text-typing-incorrect font-medium">red</span>, and the current character will be{' '}
          <span className="text-typing-current font-medium">highlighted</span>.
        </p>
      </div>
    </div>
  );
}