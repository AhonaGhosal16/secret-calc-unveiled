
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const navigate = useNavigate();

  // Secret pattern: 777+777=
  const SECRET_PATTERN = ['7', '7', '7', '+', '7', '7', '7', '='];

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

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Calculator className="h-6 w-6 mr-2 text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">Calculator</h1>
      </div>
      
      {/* Display */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="text-right text-2xl font-mono text-gray-800 min-h-[2rem] overflow-hidden">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <Button variant="secondary" onClick={clear} className="bg-red-100 hover:bg-red-200 text-red-700">
          C
        </Button>
        <Button variant="secondary" onClick={clearEntry} className="bg-orange-100 hover:bg-orange-200 text-orange-700">
          CE
        </Button>
        <Button variant="secondary" onClick={() => inputOperation('÷')} className="bg-blue-100 hover:bg-blue-200 text-blue-700">
          ÷
        </Button>
        <Button variant="secondary" onClick={() => inputOperation('×')} className="bg-blue-100 hover:bg-blue-200 text-blue-700">
          ×
        </Button>

        {/* Row 2 */}
        <Button variant="outline" onClick={() => inputDigit('7')}>7</Button>
        <Button variant="outline" onClick={() => inputDigit('8')}>8</Button>
        <Button variant="outline" onClick={() => inputDigit('9')}>9</Button>
        <Button variant="secondary" onClick={() => inputOperation('-')} className="bg-blue-100 hover:bg-blue-200 text-blue-700">
          -
        </Button>

        {/* Row 3 */}
        <Button variant="outline" onClick={() => inputDigit('4')}>4</Button>
        <Button variant="outline" onClick={() => inputDigit('5')}>5</Button>
        <Button variant="outline" onClick={() => inputDigit('6')}>6</Button>
        <Button variant="secondary" onClick={() => inputOperation('+')} className="bg-blue-100 hover:bg-blue-200 text-blue-700">
          +
        </Button>

        {/* Row 4 */}
        <Button variant="outline" onClick={() => inputDigit('1')}>1</Button>
        <Button variant="outline" onClick={() => inputDigit('2')}>2</Button>
        <Button variant="outline" onClick={() => inputDigit('3')}>3</Button>
        <Button variant="default" onClick={performCalculation} className="row-span-2 bg-green-600 hover:bg-green-700">
          =
        </Button>

        {/* Row 5 */}
        <Button variant="outline" onClick={() => inputDigit('0')} className="col-span-2">0</Button>
        <Button variant="outline" onClick={() => inputDigit('.')}>.</Button>
      </div>

      {/* Hidden hint for testing (remove in production) */}
      <div className="text-xs text-gray-400 text-center mt-4 opacity-20">
        Try: 777+777=
      </div>
    </div>
  );
};

export default CalculatorApp;
