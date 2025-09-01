import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function GrammarQuiz() {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'quiz', 'results'
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizType, setQuizType] = useState('');

  const questionBanks = {
    possessive: [
      { q: "How do you formally say 'my bag'?", o: ["나의 가방", "저의 가방"], a: "저의 가방" },
      { q: "How do you casually say 'your phone'?", o: ["너의 핸드폰", "저의 핸드폰"], a: "너의 핸드폰" },
      { q: "What is 'teacher's book'?", o: ["선생님 책", "선생님의 책"], a: "선생님의 책" },
      { q: "How do you casually say 'our house'?", o: ["저희의 집", "우리의 집"], a: "우리의 집" },
      { q: "How do you formally say 'our company'?", o: ["우리의 회사", "저희의 회사"], a: "저희의 회사" },
      { q: "What is 'Korea's capital city'?", o: ["한국의 수도", "한국 수도"], a: "한국의 수도" },
      { q: "How do you say 'friend's name'?", o: ["친구의 이름", "나의 이름"], a: "친구의 이름" },
      { q: "What is 'that person's car'?", o: ["그 사람의 차", "이 사람의 차"], a: "그 사람의 차" },
      { q: "How do you formally say 'my parents'?", o: ["나의 부모님", "저의 부모님"], a: "저의 부모님" },
      { q: "What is 'my younger sibling's school'?", o: ["동생의 학교", "형의 학교"], a: "동생의 학교" }
    ],
    connectors: [
      { q: "In a formal report, how do you connect 'book' (책) and 'notebook' (공책)?", o: ["책과 공책", "책와 공책", "책하고 공책"], a: "책과 공책" },
      { q: "When talking to a friend, how do you say 'milk' (우유) and 'bread' (빵)?", o: ["우유랑 빵", "우유이랑 빵", "우유과 빵"], a: "우유이랑 빵" },
      { q: "In a formal presentation, how do you say 'apple' (사과) and 'orange' (오렌지)?", o: ["사과와 오렌지", "사과과 오렌지", "사과랑 오렌지"], a: "사과와 오렌지" },
      { q: "Which particle is a safe, neutral choice for 'water' (물) and 'juice' (주스) in most situations?", o: ["물하고 주스", "물이랑 주스", "물과 주스"], a: "물하고 주스" },
      { q: "You're casually telling a friend what you want. How do you say 'coffee' (커피) and 'cake' (케이크)?", o: ["커피랑 케이크", "커피이랑 케이크", "커피와 케이크"], a: "커피랑 케이크" },
      { q: "When writing an email to your boss, how would you list 'computer' (컴퓨터) and 'chair' (의자)?", o: ["컴퓨터와 의자", "컴퓨터과 의자", "컴퓨터하고 의자"], a: "컴퓨터와 의자" },
      { q: "You're speaking casually. How do you say 'bag' (가방) and 'hat' (모자)?", o: ["가방이랑 모자", "가방랑 모자", "가방과 모자"], a: "가방이랑 모자" },
      { q: "In a newspaper article, how would 'newspaper' (신문) and 'magazine' (잡지) be connected?", o: ["신문과 잡지", "신문와 잡지", "신문하고 잡지"], a: "신문과 잡지" },
      { q: "You're chatting with a friend about your hobbies. How do you say 'movie' (영화) and 'drama' (드라마)?", o: ["영화랑 드라마", "영화이랑 드라마", "영화와 드라마"], a: "영화랑 드라마" },
      { q: "How would you connect 'father' (아버지) and 'mother' (어머니) in a formal speech?", o: ["아버지와 어머니", "아버지랑 어머니", "아버지하고 어머니"], a: "아버지와 어머니" }
    ],
    titles: [
      { q: "How do you politely address a colleague named 이지은?", o: ["지은 씨", "지은 님"], a: "지은 씨" },
      { q: "You are speaking to a doctor. How do you refer to them?", o: ["의사 씨", "의사 선생님"], a: "의사 선생님" },
      { q: "How do you address a customer named 김철수?", o: ["철수 씨", "철수 님"], a: "철수 님" },
      { q: "Which title is more honorific?", o: ["~씨", "~님"], a: "~님" },
      { q: "You are talking to a new classmate, Park Seojun. What's a standard polite title?", o: ["서준 씨", "서준 님"], a: "서준 씨" },
      { q: "How would a company announce an award for 'employee Kim Minjun'?", o: ["김민준 씨", "김민준 님"], a: "김민준 님" },
      { q: "What title is attached to job positions like '사장' (CEO)?", o: ["사장 씨", "사장님"], a: "사장님" },
      { q: "When talking about a friend named 'Sujin' to another friend, you would say:", o: ["수진 씨", "수진"], a: "수진" }
    ]
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const speak = (text) => {
    if (!text) return;
    try {
      const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
      audio.volume = 0.8;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Unable to play audio. Please check your connection.');
      });
    } catch (error) {
      console.error('Error creating audio:', error);
      alert('Audio not available.');
    }
  };

  const startQuiz = (type) => {
    const fullBank = questionBanks[type];
    setCurrentQuiz(shuffleArray([...fullBank]));
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizType(type);
    setCurrentScreen('quiz');
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === currentQuestion.a) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < currentQuiz.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      setCurrentScreen('results');
    }
  };

  const restartQuiz = () => {
    setCurrentScreen('start');
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const currentQuestion = currentQuiz[currentQuestionIndex];

  const getQuizTitle = (type) => {
    const titles = {
      possessive: 'Possessive `~의`',
      connectors: 'Connectors for "And"',
      titles: 'Titles for Names'
    };
    return titles[type] || '';
  };

  return (
    <>
      <Head>
        <title>Korean Grammar Quiz | Interactive Learning</title>
        <meta name="description" content="Interactive Korean grammar quiz covering possessive particles, connectors, and formal titles. Practice Korean grammar with instant feedback." />
      </Head>
      
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            <span className="font-emoji">🇰🇷</span> Korean Grammar Quiz
          </h1>
          <p className="mt-2 text-slate-600">
            {currentScreen === 'start' && 'Select a topic to start the quiz.'}
            {currentScreen === 'quiz' && `Testing your knowledge of ${getQuizTitle(quizType)}.`}
            {currentScreen === 'results' && 'Here are your results!'}
          </p>
        </header>

        <div className="min-h-[450px] bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col justify-center">
          
          {/* Start Screen */}
          {currentScreen === 'start' && (
            <div className="text-center space-y-4">
              <button 
                onClick={() => startQuiz('possessive')}
                className="w-full text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Quiz 1: Possessive `~의`
              </button>
              <button 
                onClick={() => startQuiz('connectors')}
                className="w-full text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Quiz 2: Connectors for "And"
              </button>
              <button 
                onClick={() => startQuiz('titles')}
                className="w-full text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Quiz 3: Titles for Names
              </button>
            </div>
          )}

          {/* Quiz Screen */}
          {currentScreen === 'quiz' && currentQuestion && (
            <div>
              <div className="mb-4 text-right text-slate-500 font-semibold">
                Question {currentQuestionIndex + 1} / {currentQuiz.length}
              </div>
              <p className="font-semibold text-xl sm:text-2xl text-slate-800 mb-6 min-h-[64px]">
                {currentQuestion.q}
              </p>
              <div className="space-y-3">
                {shuffleArray([...currentQuestion.o]).map((option, index) => {
                  const isCorrect = option === currentQuestion.a;
                  const isSelected = option === selectedAnswer;
                  
                  let buttonClasses = "w-full text-left p-4 border-2 rounded-lg font-medium transition-all duration-200 ";
                  
                  if (showFeedback) {
                    if (isCorrect) {
                      buttonClasses += "bg-green-600 border-green-600 text-white ";
                    } else if (isSelected && !isCorrect) {
                      buttonClasses += "bg-red-600 border-red-600 text-white ";
                    } else {
                      buttonClasses += "border-slate-300 text-slate-400 opacity-70 cursor-not-allowed ";
                    }
                  } else {
                    buttonClasses += "border-slate-300 hover:bg-slate-100 hover:border-indigo-400 cursor-pointer ";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !showFeedback && selectAnswer(option)}
                      disabled={showFeedback}
                      className={buttonClasses}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && (
                <div className="mt-4 min-h-[32px] text-center font-semibold flex items-center justify-center">
                  <span className={selectedAnswer === currentQuestion.a ? 'text-green-600' : 'text-red-600'}>
                    {selectedAnswer === currentQuestion.a 
                      ? <>Correct! (정답!) <span className="font-emoji">🎉</span></> 
                      : `Not quite. The answer is "${currentQuestion.a}".`
                    }
                  </span>
                  <button
                    onClick={() => speak(currentQuestion.a)}
                    className="ml-2 text-xl hover:text-indigo-600 transition-colors cursor-pointer font-emoji"
                    title="Listen to pronunciation"
                  >
                    🔊
                  </button>
                </div>
              )}
              
              {showFeedback && (
                <button
                  onClick={nextQuestion}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {currentQuestionIndex + 1 < currentQuiz.length ? 'Next Question' : 'View Results'}
                </button>
              )}
            </div>
          )}

          {/* Results Screen */}
          {currentScreen === 'results' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
              <p className="text-xl text-slate-700 mb-2">Your score:</p>
              <p className="text-5xl font-bold text-indigo-600 mb-8">
                {score} / {currentQuiz.length}
              </p>
              <button
                onClick={restartQuiz}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Back to Main Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
