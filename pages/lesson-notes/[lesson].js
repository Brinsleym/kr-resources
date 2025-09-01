import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Layout from '../../components/Layout';
import QuizHeader from '../../components/QuizHeader';
import MarkdownRenderer from '../../components/MarkdownRenderer';

export default function LessonNotesPage({ content, lessonNumber, title, frontmatter }) {
  return (
    <Layout showFooter={true}>
      <div className="w-full p-4 flex flex-col items-center">
        <QuizHeader 
          title={`Lesson ${lessonNumber} Notes`} 
          subtitle={title || "Korean Learning Materials"} 
        />
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-8">
          <MarkdownRenderer 
            content={content} 
            title={title}
          />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const notesDirectory = path.join(process.cwd(), 'pages/lesson-notes');
  
  try {
    const filenames = await fs.readdir(notesDirectory);
    const mdFiles = filenames.filter(name => name.endsWith('.md'));
    
    const paths = mdFiles.map(filename => {
      const lessonNumber = filename.replace('.md', '').replace('lesson', '');
      return {
        params: { lesson: lessonNumber }
      };
    });

    return {
      paths,
      fallback: false
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false
    };
  }
}

export async function getStaticProps({ params }) {
  const { lesson } = params;
  const filePath = path.join(process.cwd(), 'pages/lesson-notes', `lesson${lesson}.md`);
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);
    
    // Use title from frontmatter if available, otherwise extract from content or use default
    let title = frontmatter.title || `Lesson ${lesson}`;
    
    // If no frontmatter title, try to extract from first heading
    if (!frontmatter.title) {
      const titleMatch = content.match(/^#\s+(.+)$/m);
      title = titleMatch ? titleMatch[1].replace(/\*/g, '') : `Lesson ${lesson}`;
    }
    
    return {
      props: {
        content,
        lessonNumber: lesson,
        title: title.trim(),
        frontmatter
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}
