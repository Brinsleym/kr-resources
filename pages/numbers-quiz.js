import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

function QuizHeader({ title, subtitle }) {
    return (
        <header className="w-full max-w-3xl flex items-center gap-4 p-4 mb-8 border-b border-gray-200">
            <Link href="/" className="flex-shrink-0 py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors shadow-sm">
                ← Back
            </Link>
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
            </div>
        </header>
    );
}

export default function NumbersQuizPage() {
  const [mode, setMode] = useState('sino');
  const [currentNumber, setCurrentNumber] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const specialSinoNumbers = [1000, 10000, 100000, 1000000000];
  const nativeUnits = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
  const nativeTens = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];

  function sinoChunk(numStr) {
    let result = '';
    const sinoUnits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const sinoTens = ['', '십', '백', '천'];
    for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i]);
        if (digit > 0) {
            if (digit > 1 || (numStr.length - i - 1 === 0)) {
                result += sinoUnits[digit];
            }
            result += sinoTens[numStr.length - i - 1];
        }
    }
    return result;
  }

  function toSinoKorean(num) {
    if (num === 0) return '영';
    let numStr = String(num);
    let result = '';
    const largeUnits = ['', '만', '억', '조'];
    let unitIndex = 0;
    while (numStr.length > 0) {
        const end = numStr.length;
        const start = Math.max(0, end - 4);
        const chunk = numStr.substring(start, end);
        numStr = numStr.substring(0, start);
        const chunkAsNum = parseInt(chunk, 10);
        if (chunkAsNum > 0) {
            const chunkKorean = sinoChunk(chunk);
            if (chunkAsNum === 1 && unitIndex > 0 && chunkKorean === '일') {
                result = largeUnits[unitIndex] + result;
            } else {
                result = chunkKorean + largeUnits[unitIndex] + result;
            }
        }
        unitIndex++;
    }
    return result;
  }

  function toNativeKorean(num) {
    if (num === 0) return '영';
    if (num > 99) return 'Too large for native Korean!';
    if (num < 1 || num > 99) return 'Out of range for native Korean!';
    const tens = Math.floor(num / 10);
    const units = num % 10;
    let result = '';
    if (tens > 0) {
        result += nativeTens[tens];
    }
    if (units > 0) {
        result += nativeUnits[units];
    }
    return result;
  }

  const generateQuestion = useCallback(() => {
    setUserAnswer('');
    setFeedback(null);
    setIsRevealed(false);
    let num;
    if (mode === 'sino') {
        if (Math.random() < 0.3) {
            num = specialSinoNumbers[Math.floor(Math.random() * specialSinoNumbers.length)];
        } else {
            const ranges = [
                [1, 99],
                [100, 999],
                [1000, 9999],
                [10000, 99999],
                [100000, 999999],
                [1000000, 9999999]
            ];
            const range = ranges[Math.floor(Math.random() * ranges.length)];
            num = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        }
        setCurrentNumber(num);
        setCorrectAnswer(toSinoKorean(num));
    } else {
        num = Math.floor(Math.random() * 99) + 1;
        setCurrentNumber(num);
        setCorrectAnswer(toNativeKorean(num));
    }
  }, [mode]);

  const normalizeAnswer = (answer) => {
    return answer.replace(/\s+/g, '').toLowerCase();
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const revealAnswer = () => {
    if (isRevealed) {
        generateQuestion();
    } else {
        setFeedback('reveal');
        setIsRevealed(true);
        playAudio();
    }
  };

  const playAudio = () => {
    if (!correctAnswer) return;
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(correctAnswer)}`);
    audio.play();
  };

  useEffect(() => {
    generateQuestion();
  }, [mode, generateQuestion]);

  return (
    <>
      <Head>
        <title>Korean Numbers Quiz | 숫자 퀴즈</title>
        <meta name="description" content="Practice Korean numbers with our interactive quiz. Learn Sino-Korean and Native Korean numbers from 1 to millions. Test your knowledge and improve your Korean language skills." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="w-full p-4 flex flex-col items-center">
        <QuizHeader title="숫자 퀴즈" subtitle="Number Quiz" />
        <div className="w-full max-w-xl p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-center gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                <button onClick={() => setMode('sino')} className={`mode-btn w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 ${mode === 'sino' ? 'active' : ''}`}>
                    Sino-Korean numbers
                </button>
                <button onClick={() => setMode('native')} className={`mode-btn w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 ${mode === 'native' ? 'active' : ''}`}>
                    Native Korean numbers
                </button>
            </div>
            <div className="text-center">
                <p className="text-gray-600 mb-2">Write the following number in Korean:</p>
                <p className="text-6xl font-bold text-blue-600 mb-6">{currentNumber.toLocaleString()}</p>
                <input
                    type="text"
                    lang="ko"
                    placeholder="Type answer here..."
                    className="w-full text-center text-xl p-3 border-2 border-gray-300 rounded-lg mb-4 transition-all duration-200"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    disabled={feedback !== null}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={checkAnswer} disabled={feedback !== null} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed">
                        Check Answer
                    </button>
                    <button onClick={revealAnswer} className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                        {isRevealed ? 'Next Question' : 'Listening / Speaking 🎧'}
                    </button>
                </div>
                {feedback && (
                    <div className="feedback-card mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center">
                            <div className="text-left">
                                <p className={`text-lg font-bold ${feedback === 'correct' ? 'text-green-600' : feedback === 'incorrect' ? 'text-red-600' : 'text-gray-800'}`}>
                                    {feedback === 'correct' ? '정답! Correct!' : feedback === 'incorrect' ? '틀렸어요 Wrong!' : 'Korean pronunciation:'}
                                </p>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{correctAnswer}</p>
                                {(feedback === 'reveal' || feedback === 'incorrect') && (
                                    <button onClick={playAudio} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        🎧 Play Audio
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {feedback && !isRevealed && (
                    <button onClick={generateQuestion} className="w-full mt-4 bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                        Next Question
                    </button>
                )}
            </div>
        </div>
      </div>
      <style jsx global>{`
        .mode-btn.active {
            background-color: #3b82f6;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
            outline: none;
        }
        .feedback-card {
            min-height: 100px;
        }
      `}</style>
    </Layout>
    </>
  );
}
