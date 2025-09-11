import Head from 'next/head';
import Layout from '../components/Layout';
import QuizHeader from '../components/QuizHeader';
import QuestionWordsQuiz from '../components/QuestionWordsQuiz';

export default function QuestionWordsQuizPage() {
  return (
    <>
      <Head>
        <title>Korean Question Words Quiz | 의문사 퀴즈</title>
        <meta name="description" content="Practice Korean question words like 뭐, 누구, 어디, and 얼마 with our interactive quiz." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="w-full p-4 flex flex-col items-center">
          <QuizHeader title="의문사 퀴즈" subtitle="Question Words Quiz" />
          <QuestionWordsQuiz />
        </div>
      </Layout>
    </>
  );
}
