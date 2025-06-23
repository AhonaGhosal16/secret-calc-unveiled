
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [showMeanings, setShowMeanings] = useState(false);
  const navigate = useNavigate();

  // Secret pattern: 777+777=
  const SECRET_PATTERN = ['7', '7', '7', '+', '7', '7', '7', '='];

  // Hidden meanings for different patterns with fake calculation results
  const hiddenMeanings = [
    { pattern: '777+777=', meaning: 'Emergency SOS - Immediate help needed', fakeResult: '1554' },
    { pattern: '911×2=', meaning: 'Silent alarm - Danger nearby', fakeResult: '1822' },
    { pattern: '123+456=', meaning: 'Check-in signal - All okay', fakeResult: '579' },
    { pattern: '000÷1=', meaning: 'Location sharing - Track my position', fakeResult: '0' },
    { pattern: '555-333=', meaning: 'Medical emergency - Health issue', fakeResult: '222' },
  ];

  const checkSecretPattern = (newSequence: string[]) => {
    if (newSequence.length >= SECRET_PATTERN.length) {
      const lastInputs = newSequence.slice(-SECRET_PATTERN.length);
      if (JSON.stringify(lastInputs) === JSON.stringify(SECRET_PATTERN)) {
        // Navigate to SOS interface
        navigate('/sos');
        return true;
      }
    }
    return false;
  };

  const checkForFakeCalculation = (sequence: string[]) => {
    const sequenceString = sequence.join('');
    for (const meaning of hiddenMeanings) {
      if (sequenceString.endsWith(meaning.pattern)) {
        return meaning.fakeResult;
      }
    }
    return null;
  };

  const inputDigit = (digit: string) => {
    const newSequence = [...inputSequence, digit];
    setInputSequence(newSequence);

    if (checkSecretPattern(newSequence)) {
      return;
    }

    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const newSequence = [...inputSequence, nextOperation];
    setInputSequence(newSequence);

    if (checkSecretPattern(newSequence)) {
      return;
    }

    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const newSequence = [...inputSequence, '='];
    setInputSequence(newSequence);

    // Check for fake calculation first
    const fakeResult = checkForFakeCalculation(newSequence);
    if (fakeResult) {
      setDisplay(fakeResult);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      return;
    }

    if (checkSecretPattern(newSequence)) {
      return;
    }

    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setInputSequence([]);
  };

  const clearEntry = () => {
    setDisplay('0');
    setInputSequence([]);
  };

  const formatCalculationDisplay = () => {
    return inputSequence.join(' ') || '0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-8 px-4">
      <div className="max-w-md mx-auto bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-center mb-8">
          <Calculator className="h-8 w-8 mr-3 text-white" />
          <h1 className="text-2xl font-bold text-white">Calculator</h1>
        </div>
        
        {/* Display */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
          {/* Full calculation display */}
          <div className="text-white/70 text-sm font-mono mb-2 min-h-[1.5rem] text-right">
            {formatCalculationDisplay()}
          </div>
          {/* Current result display */}
          <div className="text-white text-3xl font-mono font-bold min-h-[3rem] overflow-hidden text-right">
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button 
            variant="secondary" 
            onClick={clear} 
            className="h-14 bg-red-500/80 hover:bg-red-600/80 text-white border-white/20 backdrop-blur-sm font-semibold"
          >
            C
          </Button>
          <Button 
            variant="secondary" 
            onClick={clearEntry} 
            className="h-14 bg-orange-500/80 hover:bg-orange-600/80 text-white border-white/20 backdrop-blur-sm font-semibold"
          >
            CE
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => inputOperation('÷')} 
            className="h-14 bg-blue-500/80 hover:bg-blue-600/80 text-white border-white/20 backdrop-blur-sm font-semibold"
          >
            ÷
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => inputOperation('×')} 
            className="h-14 bg-blue-500/80 hover:bg-blue-600/80 text-white border-white/20 backdrop-blur-sm font-semibold"
          >
            ×
          </Button>

          {/* Row 2 */}
          <Button variant="outline" onClick={() => inputDigit('7')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">7</Button>
          <Button variant="outline" onClick={() => inputDigit('8')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">8</Button>
          <Button variant="outline" onClick={() => inputDigit('9')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">9</Button>
          <Button 
            variant="secondary" 
            onClick={() => inputOperation('-')} 
            className="h-14 bg-blue-500/80 hover:bg-blue-600/80 text-white border-white/20 backdrop-blur-sm font-semibold"
          >
            -
          </Button>

          {/* Row 3 */}
          <Button variant="outline" onClick={() => inputDigit('4')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">4</Button>
          <Button variant="outline" onClick={() => inputDigit('5')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">5</Button>
          <Button variant="outline" onClick={() => inputDigit('6')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">6</Button>
          <Button 
            variant="secondary" 
            onClick={() => inputOperation('+')} 
            className="h-14 bg-blue-500/80 hover:bg-blue-600/80 text-white border-white/20 backdrop-blur-sm font-semibold"
          >
            +
          </Button>

          {/* Row 4 */}
          <Button variant="outline" onClick={() => inputDigit('1')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">1</Button>
          <Button variant="outline" onClick={() => inputDigit('2')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">2</Button>
          <Button variant="outline" onClick={() => inputDigit('3')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">3</Button>
          <Button 
            variant="default" 
            onClick={performCalculation} 
            className="row-span-2 h-auto bg-green-600/80 hover:bg-green-700/80 text-white border-white/20 backdrop-blur-sm font-semibold"
          >
            =
          </Button>

          {/* Row 5 */}
          <Button variant="outline" onClick={() => inputDigit('0')} className="col-span-2 h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">0</Button>
          <Button variant="outline" onClick={() => inputDigit('.')} className="h-14 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">.</Button>
        </div>

        {/* Hidden hint for testing */}
        <div className="text-xs text-white/40 text-center mt-6 opacity-50">
          Try: 777+777=
        </div>

        {/* Hidden Meanings Preview */}
        <div className="mt-8 border-t border-white/20 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Hidden Patterns</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMeanings(!showMeanings)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {showMeanings ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {showMeanings && (
            <div className="space-y-3">
              {hiddenMeanings.map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg text-xs">
                  <span className="font-mono text-blue-300">{item.pattern}</span>
                  <span className="text-white/80 ml-2">→ {item.meaning}</span>
                  <span className="text-white/60 ml-2">(shows: {item.fakeResult})</span>
                </div>
              ))}
              <div className="text-xs text-white/60 text-center mt-3 italic">
                Enter these patterns to see fake results and trigger hidden features
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
