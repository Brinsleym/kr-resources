import Link from 'next/link';

export default function LessonCard({ icon, title, description, quizHref, notesHref, lessonNumber }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex flex-col gap-4">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
        
        <div className="flex flex-col gap-2 mt-4">
          <Link 
            href={quizHref}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-center"
          >
            Start Quiz
          </Link>
          
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
