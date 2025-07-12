import React, { useState, useEffect, useRef } from 'react';
import { getWordDefinition } from '../services/geminiService';
import * as authService from '../services/authService';
import { WordDefinition, User, VocabularyWord } from '../types';

interface DictionaryPopupProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
  user: User | null;
}

const DictionaryPopup: React.FC<DictionaryPopupProps> = ({ word, position, onClose, user }) => {
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        setIsLoading(true);
        const result = await getWordDefinition(word);
        setDefinition(result);
        if(user) {
            const vocabWord: VocabularyWord = {
                ...result,
                dateAdded: new Date().toISOString()
            };
            authService.addVocabularyWord(user.email, vocabWord);
        }
      } catch (e) {
        setError('Could not fetch definition.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDefinition();
  }, [word, user]);
  
  const speak = (text: string) => {
    speechSynthesis.cancel(); // Cancel any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // Adjust popup position to stay within viewport
  const getPopupStyle = (): React.CSSProperties => {
    const { innerWidth, innerHeight } = window;
    const popupWidth = 320; // Corresponds to w-80
    const popupHeight = popupRef.current?.offsetHeight || 250;
    let top = position.y + 10;
    let left = position.x + 10;

    if (left + popupWidth > innerWidth) {
      left = position.x - popupWidth - 10;
    }
    if (top + popupHeight > innerHeight) {
      top = position.y - popupHeight - 10;
    }
    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <div
      ref={popupRef}
      style={getPopupStyle()}
      className="fixed dictionary-popup w-80 bg-slate-900 border border-sky-500 rounded-lg shadow-2xl z-50 p-4 text-white animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-white">&times;</button>
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {definition && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-sky-400">{definition.word}</h3>
              <p className="text-sm text-slate-400">{definition.pronunciation}</p>
            </div>
             <button onClick={() => speak(definition.word)} className="text-slate-400 hover:text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.75a.75.75 0 00-1.5 0v1.5H10V3.75zM10 6.5a.5.5 0 01-.5-.5V3.75a.5.5 0 011 0V6a.5.5 0 01-.5.5z" /><path d="M7 6a2 2 0 114 0 2 2 0 01-4 0zM5.121 8.121a1 1 0 111.414 1.414A3.001 3.001 0 0010 11c1.22 0 2.32-.726 2.76-1.782a1 1 0 111.732 1C13.593 12.428 11.913 14 10 14c-1.913 0-3.593-1.572-4.482-3.665a1 1 0 111.603-1.214z" /><path d="M10 15a4 4 0 003.464-6.012A1 1 0 1112.05 7.82a2 2 0 01-4.1 0 1 1 0 11-1.414-1.414A4 4 0 0010 15z" /></svg>
            </button>
          </div>
          <p className="text-slate-300 mb-3">{definition.meaning}</p>
          <div className="border-t border-slate-700 pt-2">
            <h4 className="text-sm font-semibold text-slate-400 mb-1">Examples:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                {definition.examples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DictionaryPopup;
