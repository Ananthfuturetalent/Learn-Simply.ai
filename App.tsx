
import React, { useState, useCallback, useEffect } from 'react';
import { Roadmap, DetailedConcept, User, LearningTopic } from './types';
import { generateRoadmap, generateDetailedConcept } from './services/geminiService';
import * as authService from './services/authService';

import Navbar from './components/Navbar';
import TopicInput from './components/TopicInput';
import LoadingSpinner from './components/LoadingSpinner';
import RoadmapView from './components/RoadmapView';
import ConceptDetailModal from './components/ConceptDetailModal';
import AuthModal from './components/AuthModal';
import MyLearningView from './components/MyLearningView';
import AdminConsole from './components/AdminConsole';
import VocabularyView from './components/VocabularyView';
import VideoPlayerModal from './components/VideoPlayerModal';
import { SubjectRibbon } from './components/SubjectRibbon';
import QuizModal from './components/QuizModal';
import StudyRoomView from './components/StudyRoomView';
import SubjectBrowser from './components/SubjectBrowser';
import PomodoroTimer from './components/PomodoroTimer';
import ArticleViewerModal from './components/ArticleViewerModal';

type View = 'main' | 'my-learning' | 'admin' | 'vocabulary' | 'study-room';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedConcept, setSelectedConcept] = useState<{ title: string; index: number; details: DetailedConcept } | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<View>('main');

  const [videoInfo, setVideoInfo] = useState<{ id: string; title: string; } | null>(null);
  const [quizInfo, setQuizInfo] = useState<{ topic: string, conceptTitle: string } | null>(null);
  const [isPomodoroVisible, setIsPomodoroVisible] = useState<boolean>(false);
  const [articleQuery, setArticleQuery] = useState<string | null>(null);


  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleStartLearning = useCallback(async (newTopic: string) => {
    if (!newTopic.trim()) return;
    handleReset();
    setCurrentView('main');
    setTopic(newTopic);
    setIsLoading(true);
    setError(null);

    try {
      if (currentUser) {
        authService.startOrUpdateTopicHistory(currentUser.email, newTopic);
      }
      const path = await generateRoadmap(newTopic);
      setRoadmap(path);
    } catch (err) {
      console.error(err);
      setError('Failed to generate learning roadmap. Please check your API key or try a different topic.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleSelectConcept = useCallback(async (conceptTitle: string, index: number) => {
    if (!topic) return;
    setIsDetailLoading(conceptTitle);
    setError(null);
    try {
        const details = await generateDetailedConcept(conceptTitle, topic);
        setSelectedConcept({ title: conceptTitle, index, details });
        if(currentUser) {
            authService.addConceptToHistory(currentUser.email, topic, conceptTitle);
        }
    } catch (err) {
        console.error(`Error generating details for ${conceptTitle}:`, err);
        setError(`Failed to load details for "${conceptTitle}". Please try again.`);
    } finally {
        setIsDetailLoading(null);
    }
  }, [topic, currentUser]);
  
  const handleNavigateConcept = useCallback((nextIndex: number) => {
      if(roadmap && nextIndex >= 0 && nextIndex < roadmap.length) {
          const nextConcept = roadmap[nextIndex];
          handleSelectConcept(nextConcept.title, nextIndex);
      }
  }, [roadmap, handleSelectConcept]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('main');
    handleReset();
  };

  const handleReset = () => {
    setTopic('');
    setRoadmap(null);
    setError(null);
    setSelectedConcept(null);
    setIsDetailLoading(null);
  };

  const handleTakeQuiz = (conceptTitle: string) => {
    setQuizInfo({ topic, conceptTitle });
  };
  
  const navigate = (view: View) => {
    setCurrentView(view);
    if(view === 'main' && currentView !== 'main') {
        handleReset();
    }
  }

  const renderMainContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Generating your learning roadmap..." />;
    }
    if (isDetailLoading) {
        return <LoadingSpinner message={`Loading details for "${isDetailLoading}"...`} />;
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl">
          <p className="text-red-400 font-semibold">{error}</p>
          <button
            onClick={() => {
              setError(null);
              handleReset();
            }}
            className="mt-4 px-6 py-2 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (roadmap) {
      return (
        <RoadmapView
          topic={topic}
          roadmap={roadmap}
          onSelectConcept={handleSelectConcept}
          onReset={handleReset}
        />
      );
    }
    return (
        <div className="flex flex-col items-center">
            <TopicInput onStartLearning={handleStartLearning} />
            <SubjectBrowser onSelectTopic={handleStartLearning} />
        </div>
    );
  };
  
  const renderView = () => {
    switch (currentView) {
      case 'my-learning':
        return <MyLearningView user={currentUser!} onSelectTopic={handleStartLearning} onBack={() => setCurrentView('main')} />;
      case 'vocabulary':
        return <VocabularyView user={currentUser!} onBack={() => setCurrentView('main')} />;
      case 'admin':
        return <AdminConsole onBack={() => setCurrentView('main')} />;
      case 'study-room':
          return <StudyRoomView user={currentUser!} onBack={() => navigate('main')} />;
      case 'main':
      default:
        return (
            <>
                <SubjectRibbon onSelectTopic={handleStartLearning} />
                {renderMainContent()}
            </>
        )
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <Navbar 
        user={currentUser} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onNavigate={navigate}
        onPomodoroClick={() => setIsPomodoroVisible(!isPomodoroVisible)}
      />
      
      <main className="w-full max-w-7xl mx-auto flex-grow p-4 sm:p-6 lg:p-8">
        {currentView !== 'study-room' && (
            <header className="text-center my-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 cursor-pointer" onClick={() => navigate('main')}>
                    Learn Simply AI
                </h1>
                <p className="text-slate-400 mt-2 text-lg">Your guide to learning any topic, simply.</p>
            </header>
        )}
        {renderView()}
      </main>

      {selectedConcept && (
        <ConceptDetailModal
          user={currentUser}
          topic={topic}
          concept={selectedConcept}
          roadmapLength={roadmap!.length}
          onClose={() => setSelectedConcept(null)}
          onNavigate={handleNavigateConcept}
          onPlayVideo={(videoId, title) => setVideoInfo({ id: videoId, title })}
          onTakeQuiz={handleTakeQuiz}
          onViewArticle={setArticleQuery}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
       {videoInfo && (
        <VideoPlayerModal 
          videoId={videoInfo.id}
          title={videoInfo.title}
          onClose={() => setVideoInfo(null)} 
        />
      )}
      {quizInfo && (
        <QuizModal
            topic={quizInfo.topic}
            conceptTitle={quizInfo.conceptTitle}
            onClose={() => setQuizInfo(null)}
        />
      )}
      {articleQuery && (
        <ArticleViewerModal
            query={articleQuery}
            onClose={() => setArticleQuery(null)}
        />
      )}
      
      <PomodoroTimer
        isVisible={isPomodoroVisible}
        onClose={() => setIsPomodoroVisible(false)}
      />
    </div>
  );
};

export default App;
