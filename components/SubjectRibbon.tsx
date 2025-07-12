
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface SubjectRibbonProps {
    onSelectTopic: (topic: string) => void;
}

const subjects = [
    { name: 'Quantum Mechanics', emoji: '🔬' },
    { name: 'Machine Learning', emoji: '🤖' },
    { name: 'The History of Rome', emoji: '🏛️' },
    { name: 'Blockchain', emoji: '⛓️' },
    { name: 'Personal Finance', emoji: '💰' },
    { name: 'Neuroscience', emoji: '🧠' },
    { name: 'Creative Writing', emoji: '✍️' },
    { name: 'Classical Music', emoji: '🎵' },
    { name: 'Stoic Philosophy', emoji: '🤔' },
    { name: 'Digital Marketing', emoji: '📢' },
    { name: 'World Cuisines', emoji: '🍜' },
    { name: 'Sustainable Architecture', emoji: '🌿' },
    { name: 'Game Theory', emoji: '🎲' },
    { name: 'Film History', emoji: '🎬' },
    { name: 'Organic Chemistry', emoji: '🧪' },
    { name: 'Ethical Hacking', emoji: '🛡️' },
];

export const SubjectRibbon: React.FC<SubjectRibbonProps> = ({ onSelectTopic }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollability = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const isScrollable = el.scrollWidth > el.clientWidth;
            setCanScrollLeft(el.scrollLeft > 0);
            // A small buffer (1) is added to handle potential float precision issues
            setCanScrollRight(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
        }
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            checkScrollability();
            window.addEventListener('resize', checkScrollability);
            // Also check after a short delay to account for font loading, etc.
            const timer = setTimeout(checkScrollability, 100);
            
            return () => {
                window.removeEventListener('resize', checkScrollability);
                clearTimeout(timer);
            };
        }
    }, [checkScrollability]);

    const handleScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * 0.8; // Scroll by 80% of visible width
            el.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="w-full py-2 mb-6 border-y border-slate-800 relative group">
            <div
                ref={scrollContainerRef}
                onScroll={checkScrollability}
                className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2 scroll-smooth"
            >
                <span className="text-sm font-semibold text-slate-400 pl-4 pr-2 whitespace-nowrap">Explore Topics:</span>
                {subjects.map((subject) => (
                    <button
                        key={subject.name}
                        onClick={() => onSelectTopic(subject.name)}
                        className="flex-shrink-0 flex items-center px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white hover:border-sky-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <span className="mr-2 text-lg">{subject.emoji}</span>
                        <span className="text-sm font-medium whitespace-nowrap">{subject.name}</span>
                    </button>
                ))}
                 <div className="w-4 flex-shrink-0"></div>
            </div>

            <div className={`absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}></div>
            <button
                onClick={() => handleScroll('left')}
                className={`absolute top-1/2 left-2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default`}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <div className={`absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}></div>
            <button
                onClick={() => handleScroll('right')}
                className={`absolute top-1/2 right-2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default`}
                disabled={!canScrollRight}
                aria-label="Scroll right"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
};
