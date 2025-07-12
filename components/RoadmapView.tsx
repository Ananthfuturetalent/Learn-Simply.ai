import React from 'react';
import { Roadmap, RoadmapItem } from '../types';

interface RoadmapViewProps {
  topic: string;
  roadmap: Roadmap;
  onSelectConcept: (title: string, index: number) => void;
  onReset: () => void;
}

const RoadmapItemCard: React.FC<{ 
  item: RoadmapItem; 
  onSelect: () => void;
  index: number;
}> = ({ item, onSelect, index }) => {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-lg transition-all duration-300 hover:border-sky-500 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-slate-900 bg-sky-400">
            {index + 1}
          </span>
          <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

const RoadmapView: React.FC<RoadmapViewProps> = ({ topic, roadmap, onSelectConcept, onReset }) => {
  return (
    <div className="animate-fade-in w-full">
      <div className="mb-8 p-4 bg-slate-800/50 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Roadmap: <span className="text-sky-400">{topic}</span>
          </h2>
          <button onClick={onReset} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">Start Over</button>
        </div>
        <p className="text-slate-400 mt-2">Here is your customized learning plan. Click on a topic to dive deeper.</p>
      </div>

      <div className="space-y-4">
        {roadmap.map((item, index) => (
          <RoadmapItemCard
            key={item.title}
            item={item}
            index={index}
            onSelect={() => onSelectConcept(item.title, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapView;
