import React, { useState, useEffect } from 'react';
import { User, VocabularyWord } from '../types';
import * as authService from '../services/authService';

interface VocabularyViewProps {
  user: User;
  onBack: () => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ user, onBack }) => {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);

  useEffect(() => {
    setVocabulary(authService.getVocabulary(user.email));
  }, [user.email]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">My Vocabulary</h2>
        <button onClick={onBack} className="text-sm text-sky-400 hover:underline">
          &larr; Back to Main
        </button>
      </div>
      
      {vocabulary.length > 0 ? (
        <div className="space-y-4 bg-slate-800/50 p-4 rounded-lg">
          {vocabulary.map((word) => (
            <div key={word.word} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-sky-400">{word.word}</h3>
                  <span className="text-slate-400 italic">{word.pronunciation}</span>
                </div>
                <button onClick={() => speak(word.word)} className="text-slate-400 hover:text-sky-400">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.75a.75.75 0 00-1.5 0v1.5H10V3.75zM10 6.5a.5.5 0 01-.5-.5V3.75a.5.5 0 011 0V6a.5.5 0 01-.5.5z" /><path d="M7 6a2 2 0 114 0 2 2 0 01-4 0zM5.121 8.121a1 1 0 111.414 1.414A3.001 3.001 0 0010 11c1.22 0 2.32-.726 2.76-1.782a1 1 0 111.732 1C13.593 12.428 11.913 14 10 14c-1.913 0-3.593-1.572-4.482-3.665a1 1 0 111.603-1.214z" /><path d="M10 15a4 4 0 003.464-6.012A1 1 0 1112.05 7.82a2 2 0 01-4.1 0 1 1 0 11-1.414-1.414A4 4 0 0010 15z" /></svg>
                </button>
              </div>
              <p className="text-slate-300 mb-3">{word.meaning}</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                {word.examples.map((ex, i) => <li key={i}>{ex}</li>)}
              </ul>
              <p className="text-xs text-slate-500 mt-3 text-right">
                  Added on {new Date(word.dateAdded).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-slate-800 rounded-lg">
            <p className="text-slate-300">Your vocabulary list is empty.</p>
            <p className="text-slate-400 mt-2">Right-click on a word while learning to look it up and add it here!</p>
        </div>
      )}
    </div>
  );
};

export default VocabularyView;
