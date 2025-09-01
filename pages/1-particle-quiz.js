import Head from 'next/head';
import Layout from '../components/Layout';
import QuizHeader from '../components/QuizHeader';
import ParticleQuiz from '../components/ParticleQuiz';

export default function ParticleQuizPage() {
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
          <ParticleQuiz />
        </div>
      </Layout>
    </>
  );
}