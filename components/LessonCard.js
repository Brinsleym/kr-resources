import Link from 'next/link';

export default function LessonCard({ 
  icon, 
  title, 
  description, 
  quizHref, 
  notesHref, 
  lessonNumber,
  quizHref1,
  quizHref2,
  quizHref3,
  quizHref4,
  quizHref5,
  quizBtnDesc1,
  quizBtnDesc2,
  quizBtnDesc3,
  quizBtnDesc4,
  quizBtnDesc5
}) {
  // Create array of quiz buttons with their hrefs and descriptions
  const quizButtons = [];
  
  // Add legacy support for single quizHref
  if (quizHref) {
    quizButtons.push({
      href: quizHref,
      description: "Start Quiz"
    });
  }
  
  // Add multiple quiz buttons
  const quizData = [
    { href: quizHref1, desc: quizBtnDesc1 },
    { href: quizHref2, desc: quizBtnDesc2 },
    { href: quizHref3, desc: quizBtnDesc3 },
    { href: quizHref4, desc: quizBtnDesc4 },
    { href: quizHref5, desc: quizBtnDesc5 }
  ];
  
  quizData.forEach(({ href, desc }) => {
    if (href && desc) {
      quizButtons.push({
        href: href,
        description: desc
      });
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex flex-col gap-4">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
        
        <div className="flex flex-col gap-2 mt-4">
          {quizButtons.map((quiz, index) => (
            <Link 
              key={index}
              href={quiz.href}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-center"
            >
              {quiz.description}
            </Link>
          ))}
          
          {notesHref && (
            <Link 
              href={notesHref}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-center border border-gray-300"
            >
              View Lesson Notes
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
