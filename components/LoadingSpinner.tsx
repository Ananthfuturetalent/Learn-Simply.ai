
import React, { useState, useEffect } from 'react';

const quotes = [
  "The beautiful thing about learning is that no one can take it away from you.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "The mind is not a vessel to be filled, but a fire to be kindled.",
  "An investment in knowledge pays the best interest.",
  "The only person who is educated is the one who has learned how to learn and change.",
  "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
  "The expert in anything was once a beginner.",
  "The journey of a thousand miles begins with a single step.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts, repeated day in and day out.",
];

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="w-16 h-16 border-4 border-sky-400 border-dashed rounded-full animate-spin"></div>
      {message && <p className="text-slate-300 text-lg font-medium">{message}</p>}
      <p className="text-slate-400">The AI is working its magic. This might take a moment.</p>

      {quote && (
        <div className="mt-8 pt-6 border-t border-slate-700 w-full max-w-lg animate-fade-in">
          <p className="text-slate-400 italic">"{quote}"</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
