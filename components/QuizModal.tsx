
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Quiz, QuizQuestion } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface QuizModalProps {
  topic: string;
  conceptTitle: string;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ topic, conceptTitle, onClose }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const quizData = await generateQuiz(conceptTitle, topic);
        if(quizData.length === 0) {
            setError("Could not generate a quiz for this topic. Please try another one.");
        } else {
            setQuiz(quizData);
        }
      } catch (err) {
        setError('Failed to generate the quiz. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [topic, conceptTitle]);
  
  const handleAnswerSelect = (answer: string) => {
      if (showFeedback) return;
      setSelectedAnswer(answer);
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !quiz) return;
    
    const isCorrect = selectedAnswer === quiz[currentQuestionIndex].correctAnswer;
    if(isCorrect) {
        setScore(prev => prev + 1);
    }
    setShowFeedback(true);
  };
  
  const handleNextQuestion = () => {
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (currentQuestionIndex < quiz!.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
      } else {
          setIsFinished(true);
      }
  };

  const renderLoading = () => <LoadingSpinner message="Generating your quiz..." />;
  const renderError = () => <p className="text-red-400 text-center">{error}</p>;

  const renderFinished = () => (
      <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full">
          <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
          <p className="text-slate-300 mt-2 text-lg">Your score:</p>
          <p className="text-5xl font-bold text-sky-400 my-4">{score} / {quiz!.length}</p>
          <p className="text-slate-400">You did great! Keep up the learning.</p>
          <button
              onClick={onClose}
              className="mt-8 px-8 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors"
          >
              Close
          </button>
      </div>
  );

  const renderQuestion = () => {
    if (!quiz) return null;
    const question = quiz[currentQuestionIndex];
    return (
        <div className="animate-fade-in flex flex-col h-full">
            <div className="mb-4">
                <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {quiz.length}</p>
                <h3 className="text-xl font-semibold text-slate-100 mt-1">{question.questionText}</h3>
            </div>
            <div className="space-y-3 flex-grow">
                {question.options.map(option => {
                    const isCorrect = option === question.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    
                    let buttonClass = "w-full text-left p-4 bg-slate-700 rounded-lg border-2 border-transparent transition-all duration-200 hover:border-sky-500 disabled:cursor-not-allowed";

                    if (showFeedback) {
                        if (isCorrect) {
                           buttonClass += " bg-green-500/20 border-green-500";
                        } else if (isSelected) {
                            buttonClass += " bg-red-500/20 border-red-500";
                        }
                    } else if (isSelected) {
                        buttonClass += " border-sky-400 bg-slate-600";
                    }
                    
                    return (
                        <button key={option} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={showFeedback}>
                            {option}
                        </button>
                    )
                })}
            </div>
            <div className="mt-6 text-center">
                {showFeedback ? (
                     <button onClick={handleNextQuestion} className="px-8 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors">
                        {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                ) : (
                    <button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="px-8 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                        Submit Answer
                    </button>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-50 animate-fade-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl h-full max-h-[600px] border border-slate-700 flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-sky-400">Quiz: {conceptTitle}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-6 flex-grow overflow-y-auto">
          {isLoading && renderLoading()}
          {error && renderError()}
          {!isLoading && !error && (isFinished ? renderFinished() : renderQuestion())}
        </main>
      </div>
    </div>
  );
};

export default QuizModal;
