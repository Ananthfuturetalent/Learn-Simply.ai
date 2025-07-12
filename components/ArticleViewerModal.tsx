import React, { useState, useEffect, useMemo } from 'react';
import { generateArticleForQuery } from '../services/geminiService';
import { marked } from 'marked';
import LoadingSpinner from './LoadingSpinner';

interface ArticleViewerModalProps {
  query: string;
  onClose: () => void;
}

const ArticleViewerModal: React.FC<ArticleViewerModalProps> = ({ query, onClose }) => {
  const [articleContent, setArticleContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const content = await generateArticleForQuery(query);
        setArticleContent(content);
      } catch (err) {
        setError('Failed to generate the article. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [query]);

  const articleHtml = useMemo(() => {
    if (!articleContent) return '';
    return marked.parse(articleContent);
  }, [articleContent]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-50 animate-fade-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full h-full max-w-4xl border border-slate-700 flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-sky-400">AI Generated Article</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-6 flex-grow overflow-y-auto">
          {isLoading && <LoadingSpinner message="The AI is writing your article..." />}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {articleContent && (
            <div
              className="markdown-content text-slate-300"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ArticleViewerModal;
