
import React, { useState } from 'react';

interface TopicInputProps {
  onStartLearning: (topic: string) => void;
}

const TopicInput: React.FC<TopicInputProps> = ({ onStartLearning }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartLearning(topic);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
        <label htmlFor="topic-input" className="block text-lg font-medium text-slate-300 mb-2">
          What do you want to learn today?
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Quantum Computing' or 'The History of Rome'"
            className="flex-grow px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
            required
            autoFocus
          />
          <button
            type="submit"
            className="px-8 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={!topic.trim()}
          >
            Start Learning
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopicInput;
