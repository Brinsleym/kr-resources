import Footer from './Footer';

export default function Layout({ children, showFooter = false }) {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-grow flex flex-col items-center">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}