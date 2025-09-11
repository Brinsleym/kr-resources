import { useState, useEffect } from 'react';
import Head from 'next/head';

const allQuestions = [
  { question: "To ask 'What is this?', you would say:", blank: "이거 뭐예요?", options: ["이거 누구예요?", "이거 뭐예요?", "이거 어디예요?"] },
  { question: "To ask 'Who is that person?', you would say:", blank: "저 사람 누구예요?", options: ["저 사람 얼마예요?", "저 사람 어디예요?", "저 사람 누구예요?"] },
  { question: "To ask 'Where is the restroom?', you would say:", blank: "화장실 어디예요?", options: ["화장실 뭐예요?", "화장실 얼마예요?", "화장실 어디예요?"] },
  { question: "To ask 'How much is this?', you would say:", blank: "이거 얼마예요?", options: ["이거 얼마예요?", "이거 누구예요?", "이거 어디예요?"] },
  { question: "Someone answers, '저는 학생이에요.' (I am a student). What was the question?", blank: "누구예요?", options: ["뭐예요?", "누구예요?", "어디예요?"] },
  { question: "Someone answers, '집이에요.' (I'm at home). What was the question?", blank: "어디예요?", options: ["얼마예요?", "누구예요?", "어디예요?"] },
  { question: "Someone answers, '오천 원이에요.' (It's 5,000 won). What was the question?", blank: "얼마예요?", options: ["얼마예요?", "뭐예요?", "누구예요?"] },
  { question: "Someone answers, '제 가방이에요.' (It's my bag). What was the question?", blank: "이거 뭐예요?", options: ["이거 어디예요?", "이거 뭐예요?", "이거 얼마예요?"] },
  { question: "Which word is used to ask for a price?", blank: "얼마", options: ["누구", "어디", "얼마"] },
  { question: "Which word is used to ask for a location?", blank: "어디", options: ["어디", "뭐", "누구"] },
  { question: "Which word is used to ask for a person's identity?", blank: "누구", options: ["얼마", "누구", "어디"] },
  { question: "To ask a friend 'What is that?' (casually), you would say:", blank: "저거 뭐야?", options: ["저거 뭐예요?", "저거 뭐야?", "저거 누구야?"] },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuestionWordsQuiz() {
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
        
        <div className="text-2xl text-gray-800 mb-8 text-center leading-relaxed">
          {currentQuestion.question}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
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
