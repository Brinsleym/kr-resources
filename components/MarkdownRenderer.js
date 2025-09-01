import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Head from 'next/head';
import Image from 'next/image';
import ClickableKoreanText from './ClickableKoreanText';

export default function MarkdownRenderer({ content, title }) {
  return (
    <>
      <Head>
        <title>{`${title} | Korean Learning Notes`}</title>
        <meta name="description" content="Korean language learning lesson notes with grammar explanations, vocabulary, and examples." />
      </Head>
      
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => (
              <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </h1>
            ),
            h2: ({children}) => (
              <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-8">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </h2>
            ),
            h3: ({children}) => (
              <h3 className="text-2xl font-semibold text-gray-700 mb-3 mt-6">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </h3>
            ),
            h4: ({children}) => (
              <h4 className="text-xl font-semibold text-gray-700 mb-2 mt-4">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </h4>
            ),
            p: ({children}) => (
              <p className="text-gray-700 mb-4 leading-relaxed">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </p>
            ),
            ul: ({children}) => (
              <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                {children}
              </ul>
            ),
            ol: ({children}) => (
              <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">
                {children}
              </ol>
            ),
            li: ({children}) => (
              <li className="mb-1">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </li>
            ),
            table: ({children}) => (
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({children}) => (
              <thead className="bg-blue-50">
                {children}
              </thead>
            ),
            tbody: ({children}) => (
              <tbody className="bg-white divide-y divide-gray-200">
                {children}
              </tbody>
            ),
            tr: ({children}) => (
              <tr className="hover:bg-gray-50">
                {children}
              </tr>
            ),
            th: ({children}) => (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </th>
            ),
            td: ({children}) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 last:border-r-0">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </td>
            ),
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-600 mb-4">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </blockquote>
            ),
            code: ({children, className}) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">
                    <ClickableKoreanText>{children}</ClickableKoreanText>
                  </code>
                );
              }
              return (
                <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4">
                  <ClickableKoreanText>{children}</ClickableKoreanText>
                </code>
              );
            },
            strong: ({children}) => (
              <strong className="font-bold text-gray-900">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </strong>
            ),
            em: ({children}) => (
              <em className="italic text-gray-700">
                <ClickableKoreanText>{children}</ClickableKoreanText>
              </em>
            ),
            img: ({src, alt, title}) => {
              // Parse size from alt text if specified (e.g., "Description |300" or "Description |300x200")
              let displayAlt = alt;
              let width = 400; // Default width for Next.js Image
              let height = 300; // Default height for Next.js Image
              let className = 'my-4 rounded-lg shadow-md';
              let sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
              
              if (alt && alt.includes('|')) {
                const [description, sizeStr] = alt.split('|');
                displayAlt = description.trim();
                
                if (sizeStr) {
                  const size = sizeStr.trim();
                  if (size.includes('x')) {
                    // Format: "300x200"
                    const [w, h] = size.split('x');
                    width = w ? parseInt(w) : 400;
                    height = h ? parseInt(h) : 300;
                  } else if (size === 'full') {
                    // Format: "full" - full width
                    width = 800;
                    height = 600;
                    sizes = '100vw';
                  } else if (size === 'small') {
                    // Format: "small" - 200px max width
                    width = 200;
                    height = 150;
                  } else if (size === 'medium') {
                    // Format: "medium" - 400px max width
                    width = 400;
                    height = 300;
                  } else if (size === 'large') {
                    // Format: "large" - 600px max width
                    width = 600;
                    height = 450;
                  } else {
                    // Format: "300" - just width
                    width = parseInt(size) || 400;
                    height = Math.round(width * 0.75); // Maintain 4:3 aspect ratio
                  }
                }
              }
              
              return (
                <div className="my-4">
                  <Image
                    src={src}
                    alt={displayAlt || ''}
                    title={title}
                    width={width}
                    height={height}
                    className={className}
                    sizes={sizes}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                </div>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
}
