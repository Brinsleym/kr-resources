import { useState, useEffect } from 'react';
import Head from 'next/head';

const allQuestions = [
  { question: "The item is right next to you (the speaker). You point to it and ask:", sentence: "___ 뭐예요?", blank: "이거", options: ["이거", "그거", "저거"] },
  { question: "The item is next to your friend (the listener). You ask them:", sentence: "___ 뭐예요?", blank: "그거", options: ["이거", "그거", "저거"] },
  { question: "The item is far away from both of you. You point and ask:", sentence: "___ 뭐예요?", blank: "저거", options: ["이거", "그거", "저거"] },
  { question: "Your friend is holding a book. You ask:", blank: "그거 책이에요?", options: ["이거 책이에요?", "그거 책이에요?", "저거 책이에요?"] },
  { question: "You are holding a pen and want to identify it. You say:", blank: "이거는 펜이에요.", options: ["이거는 펜이에요.", "그거는 펜이에요.", "저거는 펜이에요."] },
  { question: "You see a cat across the street and say:", blank: "저거 고양이 아니에요?", options: ["이거 고양이 아니에요?", "그거 고양이 아니에요?", "저거 고양이 아니에요?"] },
  { question: "Question: '저거 뭐예요?' (What is that over there?). A correct answer would be:", blank: "저거는 비행기예요.", options: ["이거는 책이에요.", "그거는 가방이에요.", "저거는 비행기예요."] },
  { question: "You hand a wallet to your friend and say:", blank: "이거 네 지갑이야.", options: ["이거 네 지갑이야.", "그거 네 지갑이야.", "저거 네 지갑이야."] },
  { question: "Your friend asks what's in your bag. You pull out an apple and say:", blank: "이거는 사과야.", options: ["이거는 사과야.", "그거는 사과야.", "저거는 사과야."] },
  { question: "Which word means 'this thing' (near the speaker)?", blank: "이거", options: ["이거", "그거", "저거"] },
  { question: "Which word means 'that thing' (near the listener)?", blank: "그거", options: ["이거", "그거", "저거"] },
  { question: "Which word means 'that thing' (far from both)?", blank: "저거", options: ["이거", "그거", "저거"] },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function DemonstrativesQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const startQuiz = () => {
    setIsFinished(false);
    setScore(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setQuestions(shuffleArray(allQuestions).slice(0, 10));
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
    if (option === questions[currentIndex].blank) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };
  
  useEffect(() => {
    startQuiz();
  }, []);

  const renderSentence = (sentence) => {
    if (!sentence) return null;
    return sentence.split('___').map((part, index, arr) => (
      <span key={index}>
        {part}
        {index < arr.length - 1 && (
          <span className="inline-block w-20 h-8 border-b-2 border-dashed border-gray-400 align-middle mx-2"></span>
        )}
      </span>
    ));
  };

  if (isFinished) {
    return (
        <div className="w-full max-w-3xl p-6 sm:p-8 bg-white rounded-2xl shadow-lg border text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-4xl font-bold text-blue-600 mb-2">{score} / {questions.length}</p>
          <button 
            onClick={startQuiz} 
            className="w-full mt-6 bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
    );
  }

  if (questions.length === 0) return <div className="text-center">Loading...</div>;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
      <div className="w-full max-w-3xl p-6 sm:p-8 bg-white rounded-2xl shadow-lg border">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-blue-600">Score: {score}</div>
          <div className="text-sm text-gray-500">Question {currentIndex + 1} / {questions.length}</div>
        </div>
        
        <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden mb-6">
          <div className="bg-blue-600 h-2.5 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="text-xl text-gray-700 mb-4 text-center">{currentQuestion.question}</div>
        <div className="text-2xl text-gray-800 mb-8 text-center leading-relaxed">
          {renderSentence(currentQuestion.sentence)}
        </div>
        
        <div className="grid grid-cols-1 gap-4 my-6">
          {currentQuestion.options.map((option) => {
            const isCorrect = option === currentQuestion.blank;
            const isSelected = selectedAnswer === option;
            let btnClass = 'border-gray-300 bg-white hover:bg-gray-100 hover:-translate-y-1 hover:shadow-md';
            
            if (selectedAnswer) {
              if (isCorrect) btnClass = 'border-green-500 bg-green-100 text-green-700';
              else if (isSelected) btnClass = 'border-red-500 bg-red-100 text-red-700';
              else btnClass = 'border-gray-300 bg-white opacity-60';
            }
            
            return (
              <button key={option} onClick={() => handleAnswerSelect(option)} disabled={!!selectedAnswer}
                className={`w-full text-lg font-bold py-3 px-4 rounded-lg border-2 transition-all duration-200 disabled:cursor-not-allowed ${btnClass}`}>
                {option}
              </button>
            );
          })}
        </div>
        
        {selectedAnswer && (
          <button onClick={handleNext} 
            className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
  );
}
