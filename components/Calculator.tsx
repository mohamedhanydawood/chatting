"use client";
import { useState } from "react";

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCalculate: (expression: string) => void;
}

const CalcButton = ({
  children,
  onClick,
  className = "",
  double = false
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  double?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`
      ${double ? 'col-span-2' : ''} 
      h-14 sm:h-16 rounded-full font-light text-xl sm:text-2xl transition-all active:brightness-90
      ${className}
    `}
  >
    {children}
  </button>
);

export default function Calculator({ isOpen, onClose, onCalculate }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);

  if (!isOpen) return null;

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setExpression(display + " " + op + " ");
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setIsNewNumber(true);
  };

  const handleSendToChat = () => {
    // Build the complete expression
    const fullExpression = expression ? expression + display : display;
    // Convert calculator symbols to math symbols
    const mathExpression = fullExpression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

    // Send to server for calculation
    onCalculate(mathExpression);

    // Reset calculator and close
    setDisplay("0");
    setExpression("");
    setIsNewNumber(true);
    onClose();
  };

  const handlePercent = () => {
    const num = parseFloat(display);
    setDisplay((num / 100).toString());
  };

  const handleToggleSign = () => {
    const num = parseFloat(display);
    setDisplay((num * -1).toString());
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setIsNewNumber(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-black rounded-3xl p-3 sm:p-4 shadow-2xl w-full max-w-xs sm:w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Display */}
        <div className="text-white text-right mb-2 px-2 sm:px-4">
          <div className="text-xs sm:text-sm text-gray-400 h-5 sm:h-6 overflow-hidden">
            {expression}
          </div>
          <div className="text-4xl sm:text-6xl font-light overflow-hidden text-ellipsis">
            {display.length > 9 ? display.slice(0, 9) : display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {/* Row 1 */}
          <CalcButton onClick={handleClear} className="bg-gray-400 text-black">
            AC
          </CalcButton>
          <CalcButton onClick={handleToggleSign} className="bg-gray-400 text-black">
            +/−
          </CalcButton>
          <CalcButton onClick={handlePercent} className="bg-gray-400 text-black">
            %
          </CalcButton>
          <CalcButton onClick={() => handleOperator("÷")} className="bg-orange-500 text-white">
            ÷
          </CalcButton>

          {/* Row 2 */}
          <CalcButton onClick={() => handleNumber("7")} className="bg-gray-700 text-white">
            7
          </CalcButton>
          <CalcButton onClick={() => handleNumber("8")} className="bg-gray-700 text-white">
            8
          </CalcButton>
          <CalcButton onClick={() => handleNumber("9")} className="bg-gray-700 text-white">
            9
          </CalcButton>
          <CalcButton onClick={() => handleOperator("×")} className="bg-orange-500 text-white">
            ×
          </CalcButton>

          {/* Row 3 */}
          <CalcButton onClick={() => handleNumber("4")} className="bg-gray-700 text-white">
            4
          </CalcButton>
          <CalcButton onClick={() => handleNumber("5")} className="bg-gray-700 text-white">
            5
          </CalcButton>
          <CalcButton onClick={() => handleNumber("6")} className="bg-gray-700 text-white">
            6
          </CalcButton>
          <CalcButton onClick={() => handleOperator("−")} className="bg-orange-500 text-white">
            −
          </CalcButton>

          {/* Row 4 */}
          <CalcButton onClick={() => handleNumber("1")} className="bg-gray-700 text-white">
            1
          </CalcButton>
          <CalcButton onClick={() => handleNumber("2")} className="bg-gray-700 text-white">
            2
          </CalcButton>
          <CalcButton onClick={() => handleNumber("3")} className="bg-gray-700 text-white">
            3
          </CalcButton>
          <CalcButton onClick={() => handleOperator("+")} className="bg-orange-500 text-white">
            +
          </CalcButton>

          {/* Row 5 */}
          <CalcButton onClick={() => handleNumber("0")} className="bg-gray-700 text-white" double>
            0
          </CalcButton>
          <CalcButton onClick={handleDecimal} className="bg-gray-700 text-white">
            .
          </CalcButton>

          <button
            onClick={handleSendToChat}
            className="bg-blue-500 text-white rounded-full"
          >
            Calc
          </button>
        </div>

      </div>
    </div>
  );
}
