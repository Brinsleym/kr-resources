import { useState, useEffect } from 'react';
import Head from 'next/head';

const allQuestions = [
  // Korean to English
  { question: "What does '회사' mean?", blank: "Workplace", options: ["Workplace", "Office", "School"] },
  { question: "What does '선생님' mean?", blank: "Teacher", options: ["Student", "Teacher", "Doctor"] },
  { question: "What does '집' mean?", blank: "House", options: ["Restaurant", "Dormitory", "House"] },
  { question: "What does '학생' mean?", blank: "Student", options: ["Student", "Police Officer", "Singer"] },
  { question: "What does '식당' mean?", blank: "Restaurant", options: ["Laundromat", "Restaurant", "Hair Salon"] },
  { question: "What does '의사' mean?", blank: "Doctor", options: ["Driver", "Nurse", "Doctor"] },
  { question: "What does '화장실' mean?", blank: "Restroom", options: ["Restroom", "Office", "Mart"] },
  { question: "What does '가수' mean?", blank: "Singer", options: ["Actor", "Singer", "Chef"] },

  // English to Korean
  { question: "Which word means 'Office'?", blank: "사무실", options: ["사무실", "기숙사", "세탁소"] },
  { question: "Which word means 'Nurse'?", blank: "간호사", options: ["요리사", "간호사", "경찰"] },
  { question: "Which word means 'Hair Salon'?", blank: "미용실", options: ["마트", "미용실", "회사"] },
  { question: "Which word means 'Office Worker'?", blank: "회사원", options: ["배우", "운전기사", "회사원"] },
  { question: "Which word means 'Dormitory'?", blank: "기숙사", options: ["기숙사", "집", "식당"] },
  { question: "Which word means 'Police Officer'?", blank: "경찰", options: ["의사", "경찰", "선생님"] },
  { question: "Which word means 'Laundromat'?", blank: "세탁소", options: ["세탁소", "사무실", "미용실"] },
  { question: "Which word means 'Actor / Actress'?", blank: "배우", options: ["가수", "요리사", "배우"] },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function VocabularyQuiz() {
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
