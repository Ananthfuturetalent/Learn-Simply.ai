import React, { useState, useEffect } from 'react';
import { DailyQuote } from '../types';
import { getMotivationalQuote } from '../services/geminiService';

const QuoteOfTheDay: React.FC = () => {
    const [quote, setQuote] = useState<DailyQuote | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuote = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const today = new Date().toDateString();
                const cachedQuoteData = localStorage.getItem('dailyQuote');
                
                if (cachedQuoteData) {
                    const { quote, date } = JSON.parse(cachedQuoteData);
                    if (date === today) {
                        setQuote(quote);
                        setIsLoading(false);
                        return;
                    }
                }
                
                const newQuote = await getMotivationalQuote();
                setQuote(newQuote);
                localStorage.setItem('dailyQuote', JSON.stringify({ quote: newQuote, date: today }));
            } catch (err) {
                console.error(err);
                setError('Could not fetch a quote today. The journey itself is the reward!');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuote();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                     <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
        if (error) {
            return <p className="text-center text-slate-400">{error}</p>;
        }
        if (quote) {
            return (
                <div className="text-center flex flex-col justify-center h-full">
                    <blockquote className="text-lg italic text-slate-300">
                        "{quote.quote}"
                    </blockquote>
                    <cite className="mt-4 not-italic font-semibold text-sky-400">
                        - {quote.author}
                    </cite>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 h-full flex flex-col animate-fade-in">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">
                Thought for the Day
            </h3>
            <div className="flex-grow">
                {renderContent()}
            </div>
        </div>
    );
};

export default QuoteOfTheDay;
