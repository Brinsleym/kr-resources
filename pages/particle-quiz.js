import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

function QuizHeader({ title, subtitle }) {
    return (
        <header className="w-full max-w-3xl flex items-center gap-4 p-4 mb-8 border-b border-gray-200">
            <a href="/" className="flex-shrink-0 py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors shadow-sm">
                ← Back
            </a>
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
            </div>
        </header>
    );
}

const allQuestions = [
    { sentence: "저___ 학생입니다.", blank: "는", options: ["는", "가", "를"] },
    { sentence: "사과___ 맛있어요.", blank: "가", options: ["는", "가", "를"] },
    { sentence: "책___ 읽어요.", blank: "을", options: ["은", "이", "을"] },
    { sentence: "고양이___ 귀여워요.", blank: "가", options: ["는", "가", "를"] },
    { sentence: "오늘 날씨___ 좋아요.", blank: "가", options: ["는", "가", "를"] },
    { sentence: "한국 드라마___ 자주 봐요.", blank: "를", options: ["는", "가", "를"] },
    { sentence: "이것___ 뭐예요?", blank: "은", options: ["은", "이", "을"] },
    { sentence: "바람___ 불어요.", blank: "이", options: ["은", "이", "을"] },
    { sentence: "제 이름___ 제니입니다.", blank: "은", options: ["은", "이", "을"] },
    { sentence: "커피___ 마셨어요.", blank: "를", options: ["는", "가", "를"] },
    { sentence: "이름___ 뭐예요?", blank: "이", options: ["은", "이", "을"] },
    { sentence: "저___ 김치___ 좋아해요.", blank: "는/를", options: ["는/를", "가/을", "는/이"] },
    { sentence: "친구___ 영화___ 봐요.", blank: "가/를", options: ["는/를", "가/를", "가/은"] },
    { sentence: "학생___ 공부___ 해요.", blank: "은/를", options: ["은/를", "이/를", "은/이"] },
    { sentence: "음악___ 들어요.", blank: "을", options: ["은", "이", "을"] },
    { sentence: "비___ 와요.", blank: "가", options: ["는", "가", "를"] },
    { sentence: "꽃___ 예뻐요.", blank: "이", options: ["은", "이", "을"] },
    { sentence: "오늘___ 날씨___ 좋아요.", blank: "은/가", options: ["은/가", "이/가", "은/는"] },
    { sentence: "아이___ 울어요.", blank: "가", options: ["는", "가", "를"] },
    { sentence: "선생님___ 학생들___ 가르쳐요.", blank: "은/을", options: ["은/을", "이/을", "은/이"] },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function ParticleQuizPage() {
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
            <>
                <Head>
                    <title>Korean Particle Quiz | 조사 퀴즈</title>
                    <meta name="description" content="Practice Korean particles with our interactive quiz. Master 은/는, 이/가, and 을/를 particles through engaging exercises. Improve your Korean grammar skills." />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Layout>
                     <div className="w-full p-4 flex flex-col items-center">
                    <QuizHeader title="한국어 조사 퀴즈" subtitle="Korean Particle Quiz" />
                    <div className="w-full max-w-3xl p-6 sm:p-8 bg-white rounded-2xl shadow-lg border text-center">
                        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                        <p className="text-4xl font-bold text-blue-600 mb-2">{score} / {questions.length}</p>
                        <button onClick={startQuiz} className="w-full mt-6 bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                            Restart Quiz
                        </button>
                    </div>
                </div>
            </Layout>
            </>
        );
    }

    if (questions.length === 0) return <Layout><p>Loading...</p></Layout>;

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <>
            <Head>
                <title>Korean Particle Quiz | 조사 퀴즈</title>
                <meta name="description" content="Practice Korean particles with our interactive quiz. Master 은/는, 이/가, and 을/를 particles through engaging exercises. Improve your Korean grammar skills." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Layout>
                <div className="w-full p-4 flex flex-col items-center">
                <QuizHeader title="한국어 조사 퀴즈" subtitle="Korean Particle Quiz" />
                <div className="w-full max-w-3xl p-6 sm:p-8 bg-white rounded-2xl shadow-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-semibold text-blue-600">Score: {score}</div>
                        <div className="text-sm text-gray-500">Question {currentIndex + 1} / {questions.length}</div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden mb-6">
                        <div className="bg-blue-600 h-2.5 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="text-2xl text-gray-800 mb-8 text-center leading-relaxed">
                        {renderSentence(currentQuestion.sentence)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                        {currentQuestion.options.map((option) => {
                            const isCorrect = option === currentQuestion.blank;
                            const isSelected = selectedAnswer === option;
                            let btnClass = 'border-gray-300 bg-white hover:bg-gray-100';
                            if (selectedAnswer) {
                                if (isCorrect) btnClass = 'border-green-500 bg-green-100 text-green-700';
                                else if (isSelected) btnClass = 'border-red-500 bg-red-100 text-red-700';
                                else btnClass = 'border-gray-300 bg-white opacity-60';
                            }
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={!!selectedAnswer}
                                    className={`option-btn w-full text-lg font-bold py-3 px-4 rounded-lg border-2 disabled:cursor-not-allowed ${btnClass}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    {selectedAnswer && (
                        <button onClick={handleNext} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    )}
                </div>
            </div>
             <style jsx global>{`
                .option-btn {
                    transition: all 0.2s ease-in-out;
                }
                .option-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
            `}</style>
        </Layout>
        </>
    );
}