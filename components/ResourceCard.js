export default function ResourceCard({ icon, title, description, href }) {
  return (
    <a href={href} className="card block text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
      <div className="flex flex-col gap-3">
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
        <span className="font-semibold text-blue-600 flex items-center">
          Open <span className="arrow ml-2 transition-transform duration-300">&rarr;</span>
        </span>
      </div>
      <style jsx>{`
        .card:hover .arrow {
          transform: translateX(5px);
        }
      `}</style>
    </a>
  );
}