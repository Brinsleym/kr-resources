import Head from 'next/head';
import Layout from '../components/Layout';
import QuizHeader from '../components/QuizHeader';
import VocabularyQuiz from '../components/VocabularyQuiz';

export default function VocabularyQuizPage() {
  return (
    <>
      <Head>
        <title>Korean Vocabulary Quiz | 어휘 퀴즈</title>
        <meta name="description" content="Expand your Korean vocabulary with this quiz on places and occupations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="w-full p-4 flex flex-col items-center">
          <QuizHeader title="어휘 퀴즈" subtitle="Vocabulary Quiz" />
          <VocabularyQuiz />
        </div>
      </Layout>
    </>
  );
}
