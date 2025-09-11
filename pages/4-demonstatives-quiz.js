import Head from 'next/head';
import Layout from '../components/Layout';
import QuizHeader from '../components/QuizHeader';
import DemonstrativesQuiz from '../components/DemonstrativesQuiz';

export default function DemonstrativesQuizPage() {
  return (
    <>
      <Head>
        <title>Korean Demonstratives Quiz | 지시대명사 퀴즈</title>
        <meta name="description" content="Test your knowledge of Korean demonstratives 이거, 그거, 저거 with this interactive quiz." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="w-full p-4 flex flex-col items-center">
          <QuizHeader title="지시대명사 퀴즈" subtitle="Demonstratives Quiz" />
          <DemonstrativesQuiz />
        </div>
      </Layout>
    </>
  );
}
