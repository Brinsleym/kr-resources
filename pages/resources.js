import Head from 'next/head';
import Layout from '../components/Layout';
import ResourceCard from '../components/ResourceCard';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Korean Learning Resources | 한국어 학습 자료</title>
        <meta name="description" content="Interactive Korean language learning resources including number quizzes and particle practice. Learn Sino-Korean and Native Korean numbers, practice 은/는, 이/가, and 을/를 particles." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout showFooter={true}>
        <div className="w-full max-w-4xl mx-auto px-8 py-16 text-center flex-grow">
          <header>
            <h1 className="text-5xl font-bold mb-2 text-black-800">Korean Learning Resources 🇰🇷</h1>
            <p className="text-xl text-gray-600 mb-12">한국어 학습을 위한 자료 모음집을 제가 만들었습니다</p>
          </header>
          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceCard
                icon="🔢"
                title="Numbers Quiz"
                description="Test your Sino & Native Korean numbers."
                href="/numbers-quiz"
              />
              <ResourceCard
                icon="📖"
                title="Basic Particle Quiz"
                description="A simple quiz to practice the correct application of: 은/는, 이/가 and 을/를"
                href="/particle-quiz"
              />
            </div>
          </main>
        </div>
      </Layout>
    </>
  );
}