import React, { useState, useEffect } from 'react';
import { User, LearningTopic } from '../types';
import * as authService from '../services/authService';
import { marked } from 'marked';

interface MyLearningViewProps {
  user: User;
  onSelectTopic: (topic: string) => void;
  onBack: () => void;
}

const MyLearningView: React.FC<MyLearningViewProps> = ({ user, onSelectTopic, onBack }) => {
  const [history, setHistory] = useState<LearningTopic[]>([]);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  useEffect(() => {
    setHistory(authService.getLearningHistory(user.email));
  }, [user.email]);

  const toggleTopic = (topic: string) => {
    setExpandedTopic(expandedTopic === topic ? null : topic);
  };

  const NotesDisplay: React.FC<{notes: string}> = ({notes}) => {
      const html = marked.parse(notes);
      return <div className="markdown-content text-sm text-slate-400 mt-2 bg-slate-900/50 p-3 rounded" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">My Learning</h2>
        <button onClick={onBack} className="text-sm text-sky-400 hover:underline">
            &larr; Back to Main
        </button>
      </div>
      
      {history.length > 0 ? (
        <div className="space-y-4 bg-slate-800/50 p-4 rounded-lg">
          {history.map((item) => (
            <div key={item.date} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="flex justify-between items-center p-4">
                    <div>
                        <p className="text-lg font-semibold text-slate-100">{item.topic}</p>
                        <p className="text-sm text-slate-400">
                        Last visited: {new Date(item.date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onSelectTopic(item.topic)}
                            className="px-3 py-1.5 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors text-sm"
                        >
                            Revisit
                        </button>
                        <button onClick={() => toggleTopic(item.topic)} className="p-2 rounded-full hover:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expandedTopic === item.topic ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
                {expandedTopic === item.topic && (
                    <div className="p-4 border-t border-slate-700 bg-slate-800/50 animate-fade-in">
                        <h4 className="font-semibold text-slate-300 mb-2">My Notes & Progress</h4>
                        {Object.values(item.concepts).length > 0 ? (
                            <ul className="space-y-3">
                                {Object.values(item.concepts).map(concept => (
                                    <li key={concept.title}>
                                        <p className="font-medium text-slate-200">&#10148; {concept.title}</p>
                                        {concept.notes ? <NotesDisplay notes={concept.notes} /> : <p className="text-xs text-slate-500 italic ml-4 mt-1">No notes taken for this concept.</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-400 italic">You haven't explored any specific concepts for this topic yet.</p>
                        )}
                    </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-slate-800 rounded-lg">
            <p className="text-slate-300">You haven't explored any topics yet.</p>
            <p className="text-slate-400 mt-2">Start a new learning path to build your history!</p>
        </div>
      )}
    </div>
  );
};

export default MyLearningView;
