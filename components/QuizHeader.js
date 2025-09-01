import Link from 'next/link';

export default function QuizHeader({ title, subtitle }) {
  return (
    <header className="w-full max-w-3xl flex items-center gap-4 p-4 mb-8 border-b border-gray-200">
      <Link href="/" className="flex-shrink-0 py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors shadow-sm">
        ← Back
      </Link>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
      </div>
    </header>
  );
}
