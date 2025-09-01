import Head from 'next/head';
import Layout from '../components/Layout';
import QuizHeader from '../components/QuizHeader';
import NumbersQuiz from '../components/NumbersQuiz';

export default function NumbersQuizPage() {
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
          <NumbersQuiz />
        </div>
      </Layout>
    </>
  );
}
