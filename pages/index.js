import Head from 'next/head';
import Layout from '../components/Layout';
import LessonCard from '../components/LessonCard';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Korean Learning Resources | 한국어 학습 자료</title>
        <meta name="description" content="Interactive Korean language learning resources including number quizzes, particle practice, and grammar lessons. Learn Sino-Korean and Native Korean numbers, practice 은/는, 이/가, and 을/를 particles, plus grammar quizzes covering possessive particles, connectors, and formal titles." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout showFooter={true}>
        <div className="w-full max-w-4xl mx-auto px-8 py-16 text-center flex-grow">
          <header>
            <h1 className="text-5xl font-bold mb-2 text-black-800">
              Korean Learning Resources <span className="font-emoji">🇰🇷</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12">한국어 학습을 위한 자료 모음집을 제가 만들었습니다</p>
          </header>
          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LessonCard
                icon="📖"
                title="Lesson 1: Particles Quiz"
                description="A simple quiz to practice the correct application of: 은/는, 이/가 and 을/를"
                quizHref="/1-particle-quiz"
                notesHref="/lesson-notes/1"
                lessonNumber={1}
              />
              <LessonCard
                icon="🔢"
                title="Lesson 2: Numbers Quiz"
                description="Test your Sino & Native Korean numbers."
                quizHref="/2-numbers-quiz"
                notesHref="/lesson-notes/2"
                lessonNumber={2}
              />
              <LessonCard
                icon="📚"
                title="Lesson 3: Grammar Quiz"
                description="Interactive quiz covering possessive particles, connectors, and formal titles."
                quizHref="/3-grammar-quiz"
                notesHref="/lesson-notes/3"
                lessonNumber={3}
              />
            </div>
          </main>
        </div>
      </Layout>
    </>
  );
}