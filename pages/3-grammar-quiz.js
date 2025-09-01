import Head from 'next/head';
import Layout from '../components/Layout';
import QuizHeader from '../components/QuizHeader';
import GrammarQuiz from '../components/GrammarQuiz';

export default function GrammarQuizPage() {
  return (
    <>
      <Head>
        <title>Korean Grammar Quiz | 문법 퀴즈</title>
        <meta name="description" content="Interactive Korean grammar quiz covering possessive particles, connectors, and formal titles. Practice Korean grammar with instant feedback." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout showFooter={true}>
        <div className="w-full px-4 py-8 flex-grow flex flex-col items-center bg-slate-100">
          <QuizHeader title="문법 퀴즈" subtitle="Grammar Quiz" />
          <GrammarQuiz />
        </div>
      </Layout>
    </>
  );
}
