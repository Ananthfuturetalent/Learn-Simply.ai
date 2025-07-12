
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DetailedConcept, User } from '../types';
import * as authService from '../services/authService';
import DictionaryPopup from './DictionaryPopup';
import LoadingSpinner from './LoadingSpinner';

interface ConceptDetailModalProps {
  user: User | null;
  topic: string;
  concept: { title: string; index: number; details: DetailedConcept };
  roadmapLength: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
  onPlayVideo: (videoId: string, title: string) => void;
  onTakeQuiz: (conceptTitle: string) => void;
  onViewArticle: (query: string) => void;
}

const ResourceButton: React.FC<{ query: string; onClick: () => void }> = ({ query, onClick }) => {
    const Icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
    );

    return (
        <button onClick={onClick} className="w-full flex items-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left">
            {Icon}
            <span className="text-slate-300 flex-grow">{query}</span>
        </button>
    )
}

const ConceptDetailModal: React.FC<ConceptDetailModalProps> = ({ user, topic, concept, roadmapLength, onClose, onNavigate, onPlayVideo, onTakeQuiz, onViewArticle }) => {
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const exportContentRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] = useState('');
  const [selectedText, setSelectedText] = useState<{text: string; x: number; y: number} | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (user) {
      const history = authService.getLearningHistory(user.email);
      const topicHistory = history.find(h => h.topic === topic);
      const conceptNotes = topicHistory?.concepts[concept.title]?.notes || '';
      setNotes(conceptNotes);
    }
  }, [user, topic, concept.title]);
  
  // When a new concept is loaded from the parent, turn off the loading indicator.
  useEffect(() => {
    setIsNavigating(false);
  }, [concept.title]);

  const handleNavigate = (index: number) => {
    if (isNavigating) return;
    setIsNavigating(true);
    onNavigate(index);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    if (user) {
      authService.updateNotesForConcept(user.email, topic, concept.title, e.target.value);
    }
  };

  const handleMouseUpForDictionary = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.dictionary-popup')) return;
    const selection = window.getSelection();
    const text = selection?.toString().trim() || '';
    if (text.length > 1 && text.length < 50 && !text.includes(' ')) {
        const rect = selection!.getRangeAt(0).getBoundingClientRect();
        setSelectedText({ text, x: e.clientX, y: e.clientY });
    } else {
        setSelectedText(null);
    }
  };

  useEffect(() => {
    const mainContentArea = exportContentRef.current;
    if (mainContentArea) {
      mainContentArea.addEventListener('mouseup', handleMouseUpForDictionary);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
          if (selectedText) setSelectedText(null);
          else onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        if (mainContentArea) {
            mainContentArea.removeEventListener('mouseup', handleMouseUpForDictionary);
        }
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, selectedText]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && mainRef.current) {
      const rect = mainRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      let newPercentage = (newX / rect.width) * 100;
      if (newPercentage < 15) newPercentage = 15;
      if (newPercentage > 85) newPercentage = 85;
      setDividerPosition(newPercentage);
    }
  }, [isDragging]);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  const handleExport = async () => {
      if (!exportContentRef.current || isExporting) return;
      setIsExporting(true);
      try {
          const canvas = await html2canvas(exportContentRef.current, { scale: 2, backgroundColor: '#0f172a', useCORS: true });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${concept.title.replace(/ /g, '_')}_Learn_Simply.pdf`);
      } catch (err) {
          console.error("Failed to export PDF:", err);
      } finally {
        setIsExporting(false);
      }
  };

  const explanationHtml = useMemo(() => marked.parse(concept.details.explanation || ''), [concept.details.explanation]);
  const synopsisHtml = useMemo(() => marked.parse(concept.details.synopsis || ''), [concept.details.synopsis]);

  const isLastConcept = concept.index >= roadmapLength - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-50 animate-fade-in">
        {selectedText && (
            <DictionaryPopup 
                user={user}
                word={selectedText.text}
                position={{ x: selectedText.x, y: selectedText.y }}
                onClose={() => setSelectedText(null)}
            />
        )}
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full h-full border border-slate-700 flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => handleNavigate(concept.index - 1)} className="p-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-400" disabled={concept.index === 0}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </button>
            <h2 className="text-xl font-bold text-sky-400">{concept.title}</h2>
             <button onClick={() => handleNavigate(concept.index + 1)} disabled={isLastConcept} className="p-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-wait">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                {isExporting ? 'Exporting...' : 'Export to PDF'}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </header>

        <main ref={exportContentRef} id="pdf-export-content" className="p-6 flex-grow overflow-hidden flex bg-slate-800">
            {isNavigating ? (
                 <div className="w-full flex items-center justify-center">
                    <LoadingSpinner message="Loading concept..." />
                </div>
            ) : (
                <div ref={mainRef} className="flex-grow overflow-hidden flex w-full">
                    <div className="flex flex-col min-w-0 h-full transition-all duration-300" style={{ width: isRightPanelVisible ? `calc(${dividerPosition}% - 6px)` : '100%' }}>
                        <div className="overflow-y-auto pr-2 space-y-6 animate-fade-in h-full">
                            <h3 className="text-lg font-semibold text-white mb-3 flex-shrink-0">Conceptual Overview</h3>
                            <section>
                                <h4 className="text-md font-semibold text-white mb-2">Explanation</h4>
                                <div className="markdown-content bg-slate-900 rounded-lg p-4 text-slate-300" dangerouslySetInnerHTML={{ __html: explanationHtml }} />
                            </section>
                            <section>
                                <h4 className="text-md font-semibold text-white mb-2">Synopsis for Memorization</h4>
                                <div className="markdown-content bg-slate-900 rounded-lg p-4 text-slate-300" dangerouslySetInnerHTML={{ __html: synopsisHtml }} />
                            </section>
                            {user && (
                                <section>
                                    <h4 className="text-md font-semibold text-white mb-2">My Notes</h4>
                                    <textarea value={notes} onChange={handleNotesChange} placeholder="Jot down your thoughts here..." className="w-full h-48 p-3 bg-slate-900 text-slate-300 rounded-lg border border-slate-700 focus:ring-sky-500 focus:border-sky-500 transition-colors"></textarea>
                                </section>
                            )}
                        </div>
                        <div className="flex-shrink-0 pt-4 mt-4 border-t border-slate-700 flex items-center justify-end gap-4">
                            <button
                                onClick={() => onTakeQuiz(concept.title)}
                                className="px-6 py-2 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-500 transition-colors text-sm"
                            >
                                Test My Knowledge
                            </button>
                            <button
                                onClick={() => handleNavigate(concept.index + 1)}
                                disabled={isLastConcept}
                                className="px-6 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                            >
                                {isLastConcept ? "Final Concept" : "Next Concept"}
                                {!isLastConcept && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                            </button>
                        </div>
                    </div>

                    {isRightPanelVisible && <div className="w-3 cursor-col-resize flex items-center justify-center group" onMouseDown={handleMouseDown}><div className="w-0.5 h-full bg-slate-600 group-hover:bg-sky-400 transition-colors duration-200"></div></div>}
                    
                    {isRightPanelVisible && (
                    <div className="flex flex-col min-w-0 h-full transition-all duration-300" style={{ width: `calc(${100 - dividerPosition}% - 6px)` }}>
                    <div className="flex justify-between items-center mb-3 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-white">Recommended Resources</h3>
                        <button onClick={() => setIsRightPanelVisible(false)} className="px-3 py-1 text-xs font-semibold text-sky-300 bg-sky-900/50 rounded-full hover:bg-sky-800/50">Minimize</button>
                    </div>
                    <div className="overflow-y-auto pr-2 space-y-6 animate-fade-in h-full">
                        <div>
                            <h4 className="font-semibold text-slate-300 mb-2">Video Tutorials</h4>
                            <div className="space-y-2">
                                {concept.details.youtubeVideos.map((video, i) => <ResourceButton key={`yt-${i}`} query={video.title} onClick={() => onPlayVideo(video.videoId, video.title)} />)}
                            </div>
                        </div>
                            <div>
                                <h4 className="font-semibold text-slate-300 mb-2">Articles & Docs</h4>
                                <div className="space-y-2">
                                    {concept.details.resourceSearchQueries.map((q, i) => 
                                        <button
                                            key={`g-${i}`}
                                            onClick={() => onViewArticle(q)}
                                            className="w-full flex items-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H7zm-1 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-slate-300 flex-grow">{q}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                    </div>
                    </div>
                    )}
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default ConceptDetailModal;